import os
import re
import json
from collections import defaultdict
from urllib.parse import urlparse

BASE_DIR = r"d:\research work\ongo-weightloss-competitors sitemaps"

categories = {
    "Trust & Compliance": [
        "trust", "review", "reviews", "testimonial", "testimonials", "safety", "pharmacy", 
        "pharmacies", "503a", "503b", "fda", "compliance", "guarantee", "satisfaction",
        "accreditation", "quality", "privacy", "terms", "hipaa", "disclaimer", "legitscript"
    ],
    "Doctors & Clinical Team": [
        "doctor", "doctors", "provider", "providers", "physician", "physicians", "medical-team", 
        "clinical-team", "advisory-board", "clinicians", "dietitian", "dietitians", "medical-experts",
        "our-team", "team", "meet-the-team", "clinical-advisors", "medical-director"
    ],
    "Authors & E-E-A-T": [
        "author", "authors", "contributor", "contributors", "medical-reviewer", "medically-reviewed",
        "editorial-guidelines", "editorial-standards", "editorial-policy", "medical-advisory", "expert"
    ],
    "Core Treatment & Product Pages": [
        "semaglutide", "tirzepatide", "wegovy", "ozempic", "mounjaro", "zepbound", "glp", "compounded",
        "weight-loss-medication", "injections", "sublingual", "oral-semaglutide", "oral-tirzepatide"
    ],
    "Pricing & Plans": [
        "pricing", "price", "plans", "cost", "membership", "how-much", "affordability", "financing",
        "refund-policy", "subscription", "insurance", "fsa-hsa", "hsa-fsa"
    ],
    "Conversion Funnels & Intake": [
        "quiz", "intake", "start", "get-started", "assessment", "eligibility", "questionnaire",
        "consultation", "book", "schedule", "onboarding", "portal", "login", "app"
    ],
    "Patient Education & Guides": [
        "injection-guide", "how-to-inject", "subcutaneous", "side-effects", "dosage", "titration",
        "faq", "faqs", "help", "support", "knowledge-base", "what-to-expect", "maintenance"
    ],
    "Blog & Content Hubs": [
        "blog", "article", "articles", "learn", "resources", "guide", "guides", "news", 
        "health-guide", "education", "insights", "research"
    ]
}

def analyze():
    competitor_data = {}
    master_category_counts = defaultdict(int)
    master_examples = defaultdict(list)
    hierarchy_trees = {}

    for folder_name in os.listdir(BASE_DIR):
        folder_path = os.path.join(BASE_DIR, folder_name)
        if not os.path.isdir(folder_path):
            continue
        
        urls_file = os.path.join(folder_path, "all_urls.txt")
        if not os.path.exists(urls_file):
            continue

        with open(urls_file, "r", encoding="utf-8") as f:
            urls = [line.strip() for line in f if line.strip()]

        if not urls:
            continue

        comp_cat_counts = defaultdict(int)
        comp_cat_examples = defaultdict(list)
        path_segments_count = defaultdict(int)
        
        for url in urls:
            parsed = urlparse(url)
            path = parsed.path.lower().strip("/")
            segments = [s for s in path.split("/") if s]
            
            if segments:
                first_seg = segments[0]
                path_segments_count[first_seg] += 1

            classified = False
            for cat, keywords in categories.items():
                if any(kw in path for kw in keywords):
                    comp_cat_counts[cat] += 1
                    master_category_counts[cat] += 1
                    if len(comp_cat_examples[cat]) < 10:
                        comp_cat_examples[cat].append(url)
                    if len(master_examples[cat]) < 30:
                        master_examples[cat].append((folder_name, url))
                    classified = True
            
            if not classified:
                comp_cat_counts["Other / Standard Pages"] += 1
                master_category_counts["Other / Standard Pages"] += 1

        # Determine dominant top-level silos
        top_silos = sorted(path_segments_count.items(), key=lambda x: x[1], reverse=True)[:8]

        competitor_data[folder_name] = {
            "total_urls": len(urls),
            "category_breakdown": dict(comp_cat_counts),
            "sample_examples": dict(comp_cat_examples),
            "top_silos": top_silos
        }

    # Save output json
    out_json = os.path.join(BASE_DIR, "architecture_analysis.json")
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump({
            "master_category_counts": dict(master_category_counts),
            "master_examples": {k: [list(item) for item in v] for k, v in master_examples.items()},
            "competitors": competitor_data
        }, f, indent=2)

    print("Architecture analysis completed successfully.")
    print("Master Category Breakdown:")
    for cat, count in sorted(master_category_counts.items(), key=lambda x: x[1], reverse=True):
        print(f" - {cat}: {count:,} URLs")

if __name__ == "__main__":
    analyze()
