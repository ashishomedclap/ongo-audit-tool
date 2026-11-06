# Ongo Automation & Intelligence Scripts

This folder contains Python and Node.js operational scripts used to crawl, benchmark, harvest keywords, and inspect the Ongo Weight Loss architecture.

---

## 🛠 Script Directory & Usage

| Script File | Language | Primary Function | Command |
| :--- | :---: | :--- | :--- |
| `scrape_clean_offline.js` | Node.js | Strips bloated React bundles, inlines computed CSS, and injects clean Vanilla JS accordions. | `node scripts/scrape_clean_offline.js` |
| `full_live_site_audit.js` | Node.js | Audits all 56 live URLs on `ongoweightloss.com` for title lengths, meta descriptions, and CTR optimization. | `node scripts/full_live_site_audit.js` |
| `rescan_sitemap.js` | Node.js | Crawls `ongoweightloss.com/sitemap.xml` and synchronizes the local pages cache. | `node scripts/rescan_sitemap.js` |
| `build_compliance_dataset.js` | Node.js | Compiles 503A compounding, sterile lab, and cold-pack shipping data for 100 competitors. | `node scripts/build_compliance_dataset.js` |
| `build_keywords_dataset.js` | Node.js | Compiles the 54,000+ competitive keyword matrix with search volumes and difficulty scores. | `node scripts/build_keywords_dataset.js` |
| `crawl_all_ongo_pages.py` | Python | Deep crawler inspecting live HTML tags, canonical URLs, and response codes. | `python scripts/crawl_all_ongo_pages.py` |
| `fetch_sitemaps.py` | Python | Concurrent XML sitemap downloader mapping 74 competitor domains. | `python scripts/fetch_sitemaps.py` |
| `generate_url_inventory.py` | Python | Cross-references 33,108 competitor URLs against Ongo's live footprint. | `python scripts/generate_url_inventory.py` |
| `analyze_architecture.py` | Python | Analyzes silo category distribution, parent-child URL hierarchies, and orphan pages. | `python scripts/analyze_architecture.py` |
| `fetch_ongo_meta.py` | Python | Fast HTTP inspector pulling `<title>` and `<meta name="description">` tags. | `python scripts/fetch_ongo_meta.py` |
| `build_full_inventory_md.py` | Python | Exports comprehensive Markdown catalogs for executive team review. | `python scripts/build_full_inventory_md.py` |
| `update_human_query_titles.py` | Python | Algorithmic rewriter transforming robotic SERP titles into high-CTR search query hooks. | `python scripts/update_human_query_titles.py` |

---

## 📦 Requirements & Environment
- **Node.js**: v18+ (uses native `fetch` and ES modules).
- **Python**: v3.9+ (`requests`, `beautifulsoup4`, `lxml`).

