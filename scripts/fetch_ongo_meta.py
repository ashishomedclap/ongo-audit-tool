import urllib.request
import re
import json

urls = [
    "https://ongoweightloss.com/",
    "https://ongoweightloss.com/services/glp-1/compounded-semaglutide/",
    "https://ongoweightloss.com/services/glp-1/compounded-tirzepatide/",
    "https://ongoweightloss.com/pricing/",
    "https://ongoweightloss.com/how-it-works/",
    "https://ongoweightloss.com/eligibility/",
    "https://ongoweightloss.com/about/",
    "https://ongoweightloss.com/medical-team/",
    "https://ongoweightloss.com/faq/",
    "https://ongoweightloss.com/locations/",
    "https://ongoweightloss.com/blog/how-glp-1-works-for-weight-loss-complete-guide/"
]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
}

results = {}

for u in urls:
    try:
        req = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            title_m = re.search(r"<title>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
            title = title_m.group(1).strip() if title_m else "N/A"
            desc_m = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html, re.IGNORECASE | re.DOTALL)
            if not desc_m:
                desc_m = re.search(r'<meta\s+content=["\'](.*?)["\']\s+name=["\']description["\']', html, re.IGNORECASE | re.DOTALL)
            desc = desc_m.group(1).strip() if desc_m else "N/A"
            results[u] = {"title": title, "description": desc}
    except Exception as e:
        results[u] = {"title": f"Error: {e}", "description": "N/A"}

print(json.dumps(results, indent=2))

with open(r"d:\research work\ongo_current_meta.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)
