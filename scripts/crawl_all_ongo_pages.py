import os
import urllib.request
import re
import json
import time
from urllib.parse import urlparse

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_FILE = os.path.join(SCRIPT_DIR, "..", "data", "inventory", "ongo_live_pages.json")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (Ongo-Sitemap-Auditor/1.0)",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
}

def clean_html_entities(text):
    if not text:
        return ""
    text = text.replace("&amp;", "&").replace("&#x27;", "'").replace("&quot;", '"').replace("&lt;", "<").replace("&gt;", ">").replace("&nbsp;", " ")
    text = re.sub(r"\s+", " ", text).strip()
    return text

def categorize_url(url):
    u = url.lower()
    if u == "https://ongoweightloss.com/":
        return "Homepage / Core", "Commercial / Brand Authority", "P0"
    if "/services/glp-1/compounded-semaglutide" in u:
        return "Core Treatment", "High-Intent Commercial (Semaglutide)", "P0"
    if "/services/glp-1/compounded-tirzepatide" in u:
        return "Core Treatment", "High-Intent Commercial (Tirzepatide)", "P0"
    if "/pricing" in u:
        return "Pricing & Plans", "High-Intent Commercial (Cost / Pricing)", "P0"
    if "/how-it-works" in u:
        return "Funnel Explainer", "Decision Support / Conversion", "P0"
    if "/eligibility" in u:
        return "Intake Screener", "High-Intent Diagnostic / Qualification", "P0"
    if "/medical-team" in u and u.strip("/").endswith("medical-team"):
        return "Medical Team Hub", "Trust & E-E-A-T Medical Authority", "P0"
    if "/medical-team/" in u:
        return "Doctor Bio / Credential", "Trust & E-E-A-T Clinician Verification", "P1"
    if "/blog/semaglutide/" in u or "/blog/tirzepatide/" in u or "dosing-guide" in u:
        return "Dosing & Clinical Guide", "Clinical Decision Support / Dosage Intent", "P1"
    if "/blog/" in u:
        return "Blog / Educational", "Informational Research / Awareness", "P1"
    if "/locations" in u:
        return "Local Telehealth", "Geotargeted Telehealth Intent", "P1"
    if "/policies/" in u:
        return "Compliance & Legal", "Legal / Regulatory Transparency", "P2"
    if "/contact" in u or "/about" in u or "/faq" in u or "/services" in u:
        return "Company & Support", "Trust & Customer Assistance", "P1"
    return "General Page", "Informational", "P2"

try:
    from update_human_query_titles import get_human_query_title, sanitize_title
except ImportError:
    from .update_human_query_titles import get_human_query_title, sanitize_title

def generate_ctr_optimization(url, current_title, current_desc, category, intent):
    title, desc, kw, gap, hook = get_human_query_title(url, current_title)
    clean_title = sanitize_title(title)
    return {
        "recommended_title": clean_title,
        "recommended_description": desc,
        "primary_keyword": kw,
        "intent_gap": gap,
        "ctr_hook": hook
    }

def main():
    sitemap_url = "https://ongoweightloss.com/sitemap.xml"
    print("Fetching sitemap:", sitemap_url)
    req = urllib.request.Request(sitemap_url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=12) as r:
        xml = r.read().decode("utf-8", errors="ignore")
    
    urls = re.findall(r"<loc>(https?://[^<]+)</loc>", xml)
    print(f"Discovered {len(urls)} live URLs in sitemap.")

    pages_data = []

    for idx, u in enumerate(urls, 1):
        print(f"[{idx}/{len(urls)}] Crawling: {u}")
        page_entry = {
            "id": idx,
            "url": u,
            "path": urlparse(u).path or "/",
            "status_code": 200,
            "title": "",
            "title_length": 0,
            "title_status": "warning",
            "description": "",
            "description_length": 0,
            "description_status": "warning",
            "h1": "",
            "canonical": "",
            "category": "",
            "intent": "",
            "priority": "P1",
            "recommended_title": "",
            "recommended_description": "",
            "primary_keyword": "",
            "intent_gap": "",
            "ctr_hook": ""
        }

        try:
            p_req = urllib.request.Request(u, headers=HEADERS)
            with urllib.request.urlopen(p_req, timeout=10) as p_resp:
                html = p_resp.read().decode("utf-8", errors="ignore")
                page_entry["status_code"] = p_resp.status

                # Title
                t_match = re.search(r"<title[^>]*>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
                raw_t = clean_html_entities(t_match.group(1)) if t_match else ""
                page_entry["title"] = raw_t
                page_entry["title_length"] = len(raw_t)
                if 48 <= len(raw_t) <= 62:
                    page_entry["title_status"] = "optimal"
                elif len(raw_t) > 62:
                    page_entry["title_status"] = "too_long"
                else:
                    page_entry["title_status"] = "too_short"

                # Description
                d_match = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\'](.*?)["\']', html, re.IGNORECASE | re.DOTALL)
                if not d_match:
                    d_match = re.search(r'<meta[^>]*content=["\'](.*?)["\'][^>]*name=["\']description["\']', html, re.IGNORECASE | re.DOTALL)
                raw_d = clean_html_entities(d_match.group(1)) if d_match else ""
                page_entry["description"] = raw_d
                page_entry["description_length"] = len(raw_d)
                if 140 <= len(raw_d) <= 165:
                    page_entry["description_status"] = "optimal"
                elif len(raw_d) > 165:
                    page_entry["description_status"] = "too_long"
                else:
                    page_entry["description_status"] = "too_short"

                # H1
                h1_m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.IGNORECASE | re.DOTALL)
                page_entry["h1"] = clean_html_entities(re.sub(r"<[^>]+>", "", h1_m.group(1))) if h1_m else ""

                # Canonical
                can_m = re.search(r'<link[^>]*rel=["\']canonical["\'][^>]*href=["\'](.*?)["\']', html, re.IGNORECASE)
                page_entry["canonical"] = can_m.group(1) if can_m else u

        except Exception as e:
            print(f"Error fetching {u}: {e}")
            page_entry["status_code"] = 500
            page_entry["title"] = "Error fetching live page"
            page_entry["description"] = "Failed to load metadata"

        cat, intent, prio = categorize_url(u)
        page_entry["category"] = cat
        page_entry["intent"] = intent
        page_entry["priority"] = prio

        opt = generate_ctr_optimization(u, page_entry["title"], page_entry["description"], cat, intent)
        page_entry["recommended_title"] = opt["recommended_title"]
        page_entry["recommended_description"] = opt["recommended_description"]
        page_entry["primary_keyword"] = opt["primary_keyword"]
        page_entry["intent_gap"] = opt["intent_gap"]
        page_entry["ctr_hook"] = opt["ctr_hook"]

        pages_data.append(page_entry)
        time.sleep(0.1)

    result_payload = {
        "last_updated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "total_pages": len(pages_data),
        "source": "https://ongoweightloss.com/sitemap.xml",
        "pages": pages_data
    }

    os.makedirs(os.path.dirname(OUT_FILE), exist_ok=True)
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(result_payload, f, indent=2)

    print(f"\nSaved {len(pages_data)} audited pages to {OUT_FILE}")

if __name__ == "__main__":
    main()

