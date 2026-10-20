import csv
import os

csv_path = r"d:\research work\master_url_inventory.csv"
md_path = r"d:\research work\master_competitor_url_inventory.md"

rows = []
with open(csv_path, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for r in reader:
        rows.append(r)

sections = {
    "1. Core Conversion Funnel & Account Infrastructure": (1, 12),
    "2. Treatment & Medication Product Landing Pages": (13, 28),
    "3. Trust, Safety, Compliance & Pharmacy Sourcing Hubs": (29, 42),
    "4. Medical Leadership, Provider Network & E-E-A-T Architecture": (43, 56),
    "5. High-Intent Commercial Drug & Brand Comparisons": (57, 76),
    "6. Insurance, Pricing, Costs & Reimbursement Guides": (77, 96),
    "7. Clinical Dosage, Titration & Administration Guides": (97, 116),
    "8. Side Effects & Patient Safety Management Guides": (117, 136),
    "9. Nutrition, Diet & Lifestyle Support Silos": (137, 151),
    "10. Programmatic 50-State Telehealth Local Landing Pages": (152, 201),
    "11. Creator, Influencer & Viral Growth Engines": (202, 209),
    "12. Clinical Trial Evidence & Medical Science Hubs": (210, 217)
}

with open(md_path, "w", encoding="utf-8") as f:
    f.write("# Master Competitor URL Inventory & Site Architecture Blueprint\n\n")
    f.write("> **Total URL Inventory:** 217 Canonical URLs  \n")
    f.write("> **Business Model:** Telehealth Consultations & Direct Home Delivery of Compounded Semaglutide & Tirzepatide  \n")
    f.write("> **Source Data:** Synthesized from the top 100 competitors (*Ro, Mochi Health, OrderlyMeds, IVÍM Health, TryEden, Lavender Sky Health, JoinFridays*).  \n\n")

    f.write("---\n\n")
    f.write("## Architectural Strategy: How Top Telehealth Brands Dominate\n\n")
    f.write("To compete effectively with 8-figure and 9-figure telehealth brands, your website must serve **three distinct engines**:\n\n")
    f.write("1. **The Conversion Engine (P0):** A low-friction asynchronous funnel (`/quiz` -> `/checkout`) paired with transparent flat-rate pricing (`/pricing`) that eliminates hesitation and converts traffic.\n")
    f.write("2. **The Trust & E-E-A-T Engine (P0/P1):** Pages proving pharmacy licensure (`/pharmacy-partners`), individual doctor profiles (`/providers/[name]`), Certificates of Analysis (`/quality-reports-and-testing`), and injection guides (`/guides/how-to-inject`) to satisfy both cautious patients and Google's strict medical search raters.\n")
    f.write("3. **The Organic Search & Growth Engine (P1/P2):** High-intent comparison pages (`/compare/semaglutide-vs-tirzepatide`), insurance denial queries (`/insurance/does-insurance-cover-compounded-semaglutide`), and **50 programmatic state landing pages** (`/states/california-telehealth-weight-loss`) to capture local search volume without paid ads.\n\n")

    f.write("---\n\n")

    for sec_title, (start_idx, end_idx) in sections.items():
        sec_rows = [r for r in rows if start_idx <= int(r["#"]) <= end_idx]
        f.write(f"## {sec_title} ({len(sec_rows)} URLs)\n\n")
        f.write("| # | URL Path | Page Title | Strategic Objective / Target Intent | Priority |\n")
        f.write("|---|---|---|---|---|\n")
        for r in sec_rows:
            f.write(f"| {r['#']} | `{r['URL Path']}` | **{r['Page Name / Title']}** | {r['Description & Strategic Target']} | `{r['Priority']}` |\n")
        f.write("\n---\n\n")

    f.write("## Internal Linking & Conversion Flow Strategy\n\n")
    f.write("To maximize both SEO crawl efficiency and patient conversion rates, follow these internal linking rules:\n\n")
    f.write("1. **Every Informational & Comparison URL Must Link to `/quiz`:** Every comparison page (e.g. `/compare/compounded-semaglutide-vs-wegovy`), insurance page, or side-effect article should have a persistent mid-content and bottom CTA banner: *'Check Your Eligibility for Compounded Semaglutide in 90 Seconds'*, linking directly to `/quiz`.\n")
    f.write("2. **The Trust Cross-Link:** On your core sales pages (`/treatments/compounded-semaglutide`), link prominently to `/pharmacy-partners`, `/quality-reports-and-testing`, and `/guides/how-to-inject` right beside the order button to dissolve pre-purchase anxiety.\n")
    f.write("3. **State Page Geotargeting:** On the `/state-coverage` hub, link out to all 50 state pages (`/states/[state]-telehealth-weight-loss`). Each state page should dynamically highlight: *'Licensed [State] Physicians on Duty · Overnight Delivery to [State Cities]'*.\n")
    f.write("4. **Author Bio Verification:** Every blog article must include a dual byline: written by a health writer, and *'Medically Reviewed by [Doctor Name]'*, with an active link to their profile under `/providers/[doctor-name]`.\n\n")

    f.write("---\n\n")
    f.write("## File References\n")
    f.write("- Master Spreadsheet CSV: [master_url_inventory.csv](file:///d:/research%20work/master_url_inventory.csv)\n")
    f.write("- Page Architecture Tree Map: [competitor_page_architecture_treemap.md](file:///d:/research%20work/competitor_page_architecture_treemap.md)\n")
    f.write("- Top 100 Competitor Directory: [100_competitors_list.md](file:///d:/research%20work/ongo-weightloss-competitors%20sitemaps/100_competitors_list.md)\n")

print("Generated markdown at:", md_path)
