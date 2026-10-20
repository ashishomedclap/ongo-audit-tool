import os
import re
import gzip
import json
import csv
import time
from urllib.parse import urlparse, urljoin
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

BASE_DIR = r"d:\research work\ongo-weightloss-competitors sitemaps"

def extract_competitors_from_md(md_path):
    competitors = []
    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Match rows like | 1 | **Mochi Health** | [joinmochi.com](https://joinmochi.com) | ...
    pattern = r"\|\s*(\d+)\s*\|\s*\*\*([^*]+)\*\*\s*\|\s*\[([^\]]+)\]\((https?://[^)]+)\)\s*\|"
    matches = re.findall(pattern, content)
    for rank, name, domain, url in matches:
        clean_name = name.strip()
        clean_domain = domain.strip().replace("www.", "")
        clean_url = url.strip()
        slug = re.sub(r"[^a-z0-9]+", "_", clean_name.lower()).strip("_")
        competitors.append({
            "rank": int(rank),
            "name": clean_name,
            "domain": clean_domain,
            "url": clean_url,
            "slug": f"{int(rank):03d}_{slug}"
        })
    return competitors

def get_session():
    s = requests.Session()
    s.headers.update(HEADERS)
    return s

def fetch_content(session, url, timeout=12):
    try:
        resp = session.get(url, timeout=timeout, allow_redirects=True)
        if resp.status_code == 200:
            content = resp.content
            if url.endswith(".gz") or content[:2] == b"\x1f\x8b":
                try:
                    content = gzip.decompress(content)
                except Exception:
                    pass
            return content, resp.url
    except Exception:
        pass
    return None, None

def check_robots_for_sitemaps(session, base_url):
    sitemaps = []
    robots_url = urljoin(base_url, "/robots.txt")
    content, _ = fetch_content(session, robots_url, timeout=8)
    if content:
        try:
            text = content.decode("utf-8", errors="ignore")
            for line in text.splitlines():
                if line.strip().lower().startswith("sitemap:"):
                    sm_url = line.split(":", 1)[1].strip()
                    if sm_url.startswith("http"):
                        sitemaps.append(sm_url)
        except Exception:
            pass
    return sitemaps

def parse_xml_for_urls_and_sitemaps(xml_bytes):
    urls = []
    sub_sitemaps = []
    try:
        # Strip XML namespaces for easier traversal
        xml_str = xml_bytes.decode("utf-8", errors="ignore")
        xml_str = re.sub(r'\sxmlns(:\w+)?="[^"]+"', '', xml_str, count=0)
        root = ET.fromstring(xml_str.encode("utf-8"))
        
        # Check if sitemapindex
        if root.tag.endswith("sitemapindex"):
            for sm in root.findall("sitemap"):
                loc = sm.find("loc")
                if loc is not None and loc.text:
                    sub_sitemaps.append(loc.text.strip())
        # Check if urlset
        elif root.tag.endswith("urlset"):
            for u in root.findall("url"):
                loc = u.find("loc")
                if loc is not None and loc.text:
                    urls.append(loc.text.strip())
    except Exception:
        # Fallback regex if malformed XML
        xml_text = xml_bytes.decode("utf-8", errors="ignore")
        if "<sitemapindex" in xml_text or "<sitemap>" in xml_text:
            sub_sitemaps.extend(re.findall(r"<loc>(https?://[^<]+)</loc>", xml_text))
        elif "<urlset" in xml_text or "<url>" in xml_text:
            urls.extend(re.findall(r"<loc>(https?://[^<]+)</loc>", xml_text))
    return urls, sub_sitemaps

def categorize_url(url):
    u = url.lower()
    categories = []
    if any(k in u for k in ["semaglutide", "ozempic", "wegovy", "sema"]):
        categories.append("Semaglutide")
    if any(k in u for k in ["tirzepatide", "mounjaro", "zepbound", "tirz"]):
        categories.append("Tirzepatide")
    if any(k in u for k in ["price", "pricing", "cost", "plan", "membership", "tier"]):
        categories.append("Pricing")
    if any(k in u for k in ["weight", "glp", "compound", "telehealth", "intake", "quiz", "start"]):
        categories.append("GLP-1 / Intake")
    return categories

def process_competitor(comp):
    session = get_session()
    comp_dir = os.path.join(BASE_DIR, comp["slug"])
    os.makedirs(comp_dir, exist_ok=True)

    base_url = comp["url"]
    parsed_base = urlparse(base_url)
    domain_schemes = [
        f"https://{parsed_base.netloc}",
        f"https://www.{comp['domain']}",
        f"https://{comp['domain']}"
    ]
    # Remove duplicates preserving order
    clean_schemes = []
    for d in domain_schemes:
        if d not in clean_schemes:
            clean_schemes.append(d)

    candidate_sitemaps = []
    # 1. Check robots.txt
    for s_url in clean_schemes:
        found_in_robots = check_robots_for_sitemaps(session, s_url)
        if found_in_robots:
            candidate_sitemaps.extend(found_in_robots)
            break

    # 2. Add common fallback sitemap locations
    standard_paths = [
        "/sitemap.xml",
        "/sitemap_index.xml",
        "/wp-sitemap.xml",
        "/sitemap-pages.xml",
        "/sitemap/sitemap.xml"
    ]
    for s_url in clean_schemes:
        for path in standard_paths:
            candidate_sitemaps.append(urljoin(s_url, path))

    # Remove duplicates preserving order
    seen_candidates = set()
    unique_candidates = []
    for c in candidate_sitemaps:
        if c not in seen_candidates:
            seen_candidates.add(c)
            unique_candidates.append(c)

    all_urls = set()
    valid_sitemaps = []
    visited_sitemaps = set()
    sitemaps_to_crawl = unique_candidates[:8]  # test initial candidates

    while sitemaps_to_crawl and len(visited_sitemaps) < 15:
        sm_url = sitemaps_to_crawl.pop(0)
        if sm_url in visited_sitemaps:
            continue
        visited_sitemaps.add(sm_url)

        content, final_url = fetch_content(session, sm_url)
        if not content:
            continue

        # Check if actual XML
        if b"<" not in content[:200] and b"<?xml" not in content[:200]:
            continue

        # Save sitemap file
        sm_filename = re.sub(r"[^a-zA-Z0-9_\.]", "_", urlparse(sm_url).path.strip("/")) or "sitemap.xml"
        if not sm_filename.endswith(".xml"):
            sm_filename += ".xml"
        
        file_save_path = os.path.join(comp_dir, sm_filename)
        try:
            with open(file_save_path, "wb") as f_out:
                f_out.write(content)
        except Exception:
            pass

        valid_sitemaps.append(sm_url)

        urls, sub_sitemaps = parse_xml_for_urls_and_sitemaps(content)
        for u in urls:
            all_urls.add(u)

        # Prioritize relevant sub-sitemaps (e.g. pages, posts, products)
        for sub in sub_sitemaps:
            sub_lower = sub.lower()
            if any(term in sub_lower for term in ["page", "post", "product", "treatments", "service", "program", "weight", "glp"]):
                sitemaps_to_crawl.insert(0, sub)
            else:
                sitemaps_to_crawl.append(sub)

    # Filter and categorize
    classified_pages = []
    semaglutide_pages = []
    tirzepatide_pages = []
    pricing_pages = []

    for u in sorted(all_urls):
        cats = categorize_url(u)
        if cats:
            classified_pages.append({"url": u, "categories": cats})
            if "Semaglutide" in cats:
                semaglutide_pages.append(u)
            if "Tirzepatide" in cats:
                tirzepatide_pages.append(u)
            if "Pricing" in cats:
                pricing_pages.append(u)

    # Save URLs list
    urls_txt_path = os.path.join(comp_dir, "all_urls.txt")
    with open(urls_txt_path, "w", encoding="utf-8") as f:
        for u in sorted(all_urls):
            f.write(u + "\n")

    # Save key pages JSON
    key_json_path = os.path.join(comp_dir, "key_glp1_pages.json")
    with open(key_json_path, "w", encoding="utf-8") as f:
        json.dump({
            "name": comp["name"],
            "domain": comp["domain"],
            "total_urls": len(all_urls),
            "semaglutide_pages": semaglutide_pages,
            "tirzepatide_pages": tirzepatide_pages,
            "pricing_pages": pricing_pages,
            "all_categorized": classified_pages
        }, f, indent=2)

    status = "SUCCESS" if all_urls else ("SITEMAP_FOUND_NO_URLS" if valid_sitemaps else "NO_SITEMAP")
    
    return {
        "rank": comp["rank"],
        "name": comp["name"],
        "domain": comp["domain"],
        "status": status,
        "primary_sitemap": valid_sitemaps[0] if valid_sitemaps else "None",
        "total_sitemaps_found": len(valid_sitemaps),
        "total_urls": len(all_urls),
        "sema_count": len(semaglutide_pages),
        "tirz_count": len(tirzepatide_pages),
        "pricing_count": len(pricing_pages),
        "top_sema": semaglutide_pages[:3],
        "top_tirz": tirzepatide_pages[:3],
        "top_pricing": pricing_pages[:3],
        "local_folder": comp["slug"]
    }

if __name__ == "__main__":
    md_file = r"d:\research work\ongo-weightloss-competitors sitemaps\100_competitors_list.md"
    competitors = extract_competitors_from_md(md_file)
    print(f"Loaded {len(competitors)} competitors from markdown.")
    
    results = []
    # Use ThreadPoolExecutor for fast concurrent discovery
    start_time = time.time()
    with ThreadPoolExecutor(max_workers=12) as executor:
        future_to_comp = {executor.submit(process_competitor, c): c for c in competitors}
        for future in as_completed(future_to_comp):
            c = future_to_comp[future]
            try:
                res = future.result()
                results.append(res)
                print(f"[{res['rank']:03d}/100] {res['name']} -> {res['status']} ({res['total_urls']} URLs, {res['sema_count']} Sema, {res['tirz_count']} Tirz)")
            except Exception as e:
                print(f"[{c['rank']:03d}/100] {c['name']} -> ERROR: {e}")
                results.append({
                    "rank": c["rank"],
                    "name": c["name"],
                    "domain": c["domain"],
                    "status": "ERROR",
                    "primary_sitemap": "None",
                    "total_sitemaps_found": 0,
                    "total_urls": 0,
                    "sema_count": 0,
                    "tirz_count": 0,
                    "pricing_count": 0,
                    "top_sema": [],
                    "top_tirz": [],
                    "top_pricing": [],
                    "local_folder": c["slug"]
                })

    results.sort(key=lambda x: x["rank"])
    elapsed = time.time() - start_time
    print(f"\nFinished crawling in {elapsed:.1f} seconds.")

    # Save summary CSV
    csv_path = os.path.join(BASE_DIR, "competitor_sitemaps_summary.csv")
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Rank", "Competitor Name", "Domain", "Status", "Primary Sitemap", "Total Sitemaps", "Total URLs", "Semaglutide URLs", "Tirzepatide URLs", "Pricing URLs", "Local Folder"])
        for r in results:
            writer.writerow([r["rank"], r["name"], r["domain"], r["status"], r["primary_sitemap"], r["total_sitemaps_found"], r["total_urls"], r["sema_count"], r["tirz_count"], r["pricing_count"], r["local_folder"]])

    # Generate master Markdown summary
    md_summary_path = os.path.join(BASE_DIR, "SITEMAP_INTELLIGENCE_REPORT.md")
    with open(md_summary_path, "w", encoding="utf-8") as f:
        f.write("# Competitor Sitemap Intelligence & URL Harvest Report\n\n")
        f.write(f"> **Analysis of 100 Compounded GLP-1 & Telehealth Competitors**  \n")
        f.write(f"> **Total Domains Processed:** {len(results)}  \n")
        f.write(f"> **Execution Time:** {elapsed:.1f} seconds  \n\n")

        successful = [r for r in results if r["status"] == "SUCCESS"]
        total_urls_all = sum(r["total_urls"] for r in results)
        total_sema_all = sum(r["sema_count"] for r in results)
        total_tirz_all = sum(r["tirz_count"] for r in results)

        f.write("## Overview Metrics\n\n")
        f.write(f"- **Sitemaps Successfully Located & Parsed:** {len(successful)} / {len(results)}\n")
        f.write(f"- **Total Discovered Webpages Across Competitors:** {total_urls_all:,}\n")
        f.write(f"- **Total Compounded Semaglutide Landing Pages & Articles:** {total_sema_all:,}\n")
        f.write(f"- **Total Compounded Tirzepatide Landing Pages & Articles:** {total_tirz_all:,}\n\n")

        f.write("## Competitor Sitemap Status Table\n\n")
        f.write("| # | Competitor | Domain | Status | Primary Sitemap | Total URLs | Sema Pages | Tirz Pages | Pricing Pages | Folder |\n")
        f.write("|---|------------|--------|--------|-----------------|------------|------------|------------|---------------|--------|\n")
        for r in results:
            sm_display = f"[{r['primary_sitemap'][:35]}...]({r['primary_sitemap']})" if r['primary_sitemap'] != 'None' else "Not Found"
            f.write(f"| {r['rank']} | **{r['name']}** | `{r['domain']}` | `{r['status']}` | {sm_display} | {r['total_urls']} | {r['sema_count']} | {r['tirz_count']} | {r['pricing_count']} | [`{r['local_folder']}`](file:///d:/research%20work/ongo-weightloss-competitors%20sitemaps/{r['local_folder']}) |\n")

        f.write("\n\n## Top High-Value GLP-1 Landing Pages by Competitor\n\n")
        for r in results:
            if r["sema_count"] > 0 or r["tirz_count"] > 0 or r["pricing_count"] > 0:
                f.write(f"### {r['rank']}. {r['name']} (`{r['domain']}`)\n\n")
                if r["top_sema"]:
                    f.write("**Semaglutide URLs:**\n")
                    for u in r["top_sema"]:
                        f.write(f"- <{u}>\n")
                if r["top_tirz"]:
                    f.write("**Tirzepatide URLs:**\n")
                    for u in r["top_tirz"]:
                        f.write(f"- <{u}>\n")
                if r["top_pricing"]:
                    f.write("**Pricing & Program URLs:**\n")
                    for u in r["top_pricing"]:
                        f.write(f"- <{u}>\n")
                f.write("\n")

    print(f"Master intelligence report generated at: {md_summary_path}")
    print(f"CSV summary generated at: {csv_path}")
