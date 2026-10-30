import os
import json
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(SCRIPT_DIR, "..", "data", "inventory", "ongo_live_pages.json")

def get_human_query_title(url, current_title):
    u = url.lower()
    
    # 1. Homepage
    if u in ["https://ongoweightloss.com/", "https://ongoweightloss.com"]:
        title = "Doctor prescribed compounded semaglutide and tirzepatide online"
        desc = "Get doctor prescribed compounded semaglutide and tirzepatide delivered directly to your home with transparent monthly pricing and no insurance needed"
        kw = "compounded semaglutide and tirzepatide online"
        intent_gap = "Natural search query matching patients searching how to get prescribed compounded GLP-1 medications online without brand fluff or symbols"
        hook = "Doctor consultation included with home delivery and no insurance needed"
        return title, desc, kw, intent_gap, hook

    # 2. Compounded Semaglutide
    if "/services/glp-1/compounded-semaglutide" in u:
        title = "How to get compounded semaglutide online prescribed by doctors"
        desc = "Find out how to get compounded semaglutide prescribed online by licensed physicians and delivered refrigerated to your door with all injection supplies"
        kw = "how to get compounded semaglutide online"
        intent_gap = "Matches conversational transactional search intent for affordable doctor prescribed semaglutide without rigid corporate brand tags"
        hook = "Doctor consultation with cold chain delivery and injection supplies included"
        return title, desc, kw, intent_gap, hook

    # 3. Compounded Tirzepatide
    if "/services/glp-1/compounded-tirzepatide" in u:
        title = "How to get compounded tirzepatide prescribed online for weight loss"
        desc = "Learn how to get dual GIP and GLP-1 compounded tirzepatide prescribed online by licensed doctors with fast home delivery and ongoing medical support"
        kw = "compounded tirzepatide prescribed online for weight loss"
        intent_gap = "Direct human query for patients seeking compounded tirzepatide for superior weight reduction results"
        hook = "Dual action GIP and GLP-1 therapy with ongoing medical support"
        return title, desc, kw, intent_gap, hook

    # 4. Pricing
    if "/pricing" in u:
        title = "How much does compounded semaglutide and tirzepatide cost per month"
        desc = "See transparent monthly costs for compounded semaglutide and tirzepatide including doctor consults medication supplies and free shipping with no hidden fees"
        kw = "how much does compounded semaglutide cost per month"
        intent_gap = "Exact query typed by patients researching out-of-pocket costs and comparing telehealth clinics"
        hook = "Transparent monthly cost with no hidden fees and supplies included"
        return title, desc, kw, intent_gap, hook

    # 5. How It Works
    if "/how-it-works" in u:
        title = "How online weight loss consultations and medication delivery works"
        desc = "See how virtual medical weight loss works in three simple steps from an online health intake to doctor review and home delivery of your medication"
        kw = "how online medical weight loss works"
        intent_gap = "Answers the searcher question of what to expect during virtual weight loss telehealth"
        hook = "Fast online medical intake with licensed doctor review and doorstep delivery"
        return title, desc, kw, intent_gap, hook

    # 6. Eligibility / BMI
    if "/eligibility" in u:
        title = "Find out if you qualify for glp 1 medical weight loss online"
        desc = "Check the BMI criteria and medical qualifications required to receive doctor prescribed compounded semaglutide or tirzepatide online"
        kw = "qualify for glp 1 medical weight loss online"
        intent_gap = "Matches diagnostic queries from prospective patients asking if their BMI qualifies"
        hook = "Instant qualification criteria based on BMI and health history"
        return title, desc, kw, intent_gap, hook

    # 7. Medical Team Hub
    if "/medical-team" in u and u.strip("/").endswith("medical-team"):
        title = "Meet our team of board certified doctors specializing in weight loss"
        desc = "Learn about our US licensed physicians and clinical specialists who provide medical evaluations ongoing dosage adjustments and virtual weight loss care"
        kw = "board certified doctors specializing in weight loss"
        intent_gap = "Builds authentic medical trust and E-E-A-T without stiff corporate titling"
        hook = "US licensed medical doctors with ongoing clinical oversight"
        return title, desc, kw, intent_gap, hook

    # 8. Individual Doctor Bios
    if "/medical-team/dr-benjamin-krasne" in u:
        title = "Meet Dr Benjamin Krasne board certified physician for weight loss"
        desc = "Learn about Dr Benjamin Krasne and his clinical background providing virtual consultations and personalized GLP-1 medical weight loss care"
        kw = "Dr Benjamin Krasne physician"
        intent_gap = "Patient query looking to verify doctor credentials and bedside experience"
        hook = "Board certified medical doctor with extensive clinical experience"
        return title, desc, kw, intent_gap, hook

    if "/medical-team/dr-david-okonkwo" in u:
        title = "Meet Dr David Okonkwo board certified physician for weight loss"
        desc = "Learn about Dr David Okonkwo and his clinical background providing patient centered telehealth evaluations and medical weight management"
        kw = "Dr David Okonkwo physician"
        intent_gap = "Patient verification query for Dr Okonkwo credentials and medical guidance"
        hook = "Over 15 years of medical clinical care and physician leadership"
        return title, desc, kw, intent_gap, hook

    if "/medical-team/dr-gaurav-patel" in u:
        title = "Meet Dr Gaurav Patel board certified physician for weight loss"
        desc = "Learn about Dr Gaurav Patel and his experience in telehealth clinical evaluations and physician guided GLP-1 weight loss therapy"
        kw = "Dr Gaurav Patel physician"
        intent_gap = "Doctor verification search matching patient inquiries"
        hook = "Board certified clinician with focus on obesity medicine"
        return title, desc, kw, intent_gap, hook

    if "/medical-team/dr-jonathan-miller" in u:
        title = "Meet Dr Jonathan Miller board certified physician for weight loss"
        desc = "Learn about Dr Jonathan Miller and his extensive experience providing virtual telehealth medical evaluations and weight loss consultations"
        kw = "Dr Jonathan Miller physician"
        intent_gap = "Verifies licensed telemedicine credentials for patient safety"
        hook = "Licensed across multiple states with extensive telehealth experience"
        return title, desc, kw, intent_gap, hook

    if "/medical-team/dr-zachary-kramer" in u:
        title = "Meet Dr Zachary Kramer board certified physician for weight loss"
        desc = "Learn about Dr Zachary Kramer and his clinical experience helping patients make informed decisions about prescription medical weight loss"
        kw = "Dr Zachary Kramer physician"
        intent_gap = "Doctor background query verifying clinical expertise"
        hook = "Over 15 years of medical emergency and telehealth experience"
        return title, desc, kw, intent_gap, hook

    # 9. Semaglutide Dosing Guide
    if "semaglutide-dosing-guide" in u:
        title = "Semaglutide dosage chart and weekly titration schedule guide"
        desc = "Review the complete compounded semaglutide dosing chart from starting dose of 0.25mg up to maintenance with weekly titration instructions and tips"
        kw = "semaglutide dosage chart and weekly titration schedule"
        intent_gap = "Matches clinical search queries looking for the exact weekly titration schedule"
        hook = "Step by step titration schedule from 0.25mg to maintenance doses"
        return title, desc, kw, intent_gap, hook

    # 10. Tirzepatide Dosing Guide
    if "tirzepatide-dosing-guide" in u:
        title = "Tirzepatide weekly dosage chart and titration schedule guide"
        desc = "Review the recommended tirzepatide titration schedule from 2.5mg up to 15mg with weekly guidelines on how and when to increase your dosage safely"
        kw = "tirzepatide weekly dosage chart and titration schedule"
        intent_gap = "Direct search query from patients looking for tirzepatide dosage ramp up"
        hook = "Safe titration protocols from starting dose to maintenance"
        return title, desc, kw, intent_gap, hook

    # 11. Tirzepatide Liposomal Chewable Tablets
    if "tirzepatide-liposomal-chewable" in u:
        title = "How to take tirzepatide chewable tablets for needle free weight loss"
        desc = "Learn how compounded tirzepatide liposomal chewable tablets work as a needle free alternative with sublingual absorption and daily dosing guidelines"
        kw = "tirzepatide chewable tablets for needle free weight loss"
        intent_gap = "Captures searchers actively looking for needle free oral GLP-1 alternatives"
        hook = "100 percent needle free option with liposomal absorption"
        return title, desc, kw, intent_gap, hook

    # 12. How GLP-1 Works
    if "how-glp-1-works" in u:
        title = "How glp 1 medications work in the body for medical weight loss"
        desc = "Understand how GLP-1 receptor agonists reduce hunger slow gastric emptying and help quiet food noise to support sustainable long term weight loss"
        kw = "how glp 1 medications work in the body for weight loss"
        intent_gap = "Explains physiological mechanism in accessible conversational language"
        hook = "Reduces appetite and silences food noise backed by clinical data"
        return title, desc, kw, intent_gap, hook

    # 13. Houston Location
    if "/locations/texas/houston" in u:
        title = "Get compounded semaglutide and tirzepatide delivered in Houston Texas"
        desc = "Order doctor prescribed compounded semaglutide and tirzepatide online with cold chain home delivery to patients throughout the Houston metro area"
        kw = "compounded semaglutide and tirzepatide in Houston Texas"
        intent_gap = "Geotargeted human query matching Houston residents seeking local delivery"
        hook = "Licensed Texas medical providers with refrigerated home delivery"
        return title, desc, kw, intent_gap, hook

    # 14. 50 States Location Hub
    if "/locations" in u:
        title = "States where doctor prescribed compounded glp 1 can be shipped"
        desc = "Check the list of US states where licensed physicians provide virtual medical consultations and ship compounded semaglutide and tirzepatide to your home"
        kw = "states where compounded glp 1 can be shipped"
        intent_gap = "Answers the searcher question of whether telehealth delivery is legal in their state"
        hook = "Nationwide coverage with licensed US physicians and verified shipping"
        return title, desc, kw, intent_gap, hook

    # 15. FAQ
    if "/faq" in u:
        title = "Common questions about compounded semaglutide and tirzepatide"
        desc = "Find clear answers to frequently asked questions about compounded GLP-1 prescriptions injection instructions side effect relief and shipping timelines"
        kw = "questions about compounded semaglutide and tirzepatide"
        intent_gap = "Direct Q&A intent matching user queries about safety and logistics"
        hook = "Answers to common patient questions on dosage safety and delivery"
        return title, desc, kw, intent_gap, hook

    # 16. About
    if "/about" in u:
        title = "Learn about doctor supervised virtual medical weight loss care"
        desc = "Discover how virtual medical weight loss provides accessible doctor supervised treatment with compounded medications delivered directly to patients"
        kw = "doctor supervised virtual medical weight loss care"
        intent_gap = "Human informational query about virtual clinic standards and patient care"
        hook = "Physician supervised care without retail pharmacy markups"
        return title, desc, kw, intent_gap, hook

    # 17. Contact
    if "/contact" in u:
        title = "Contact our clinical medical team for prescription questions"
        desc = "Get in touch with our patient support and clinical medical team for questions about your GLP-1 weight loss consultation prescription or shipment"
        kw = "contact clinical medical team for prescription questions"
        intent_gap = "Direct contact intent for patients seeking help or pre-intake clarity"
        hook = "Direct patient support and clinical guidance"
        return title, desc, kw, intent_gap, hook

    # 18. Services Hub
    if "/services" in u and u.strip("/").endswith("services"):
        title = "Doctor guided medical weight loss and compounded glp 1 programs"
        desc = "Explore physician guided medical weight loss programs featuring compounded semaglutide and tirzepatide in injectable vials and chewable tablet options"
        kw = "doctor guided medical weight loss programs"
        intent_gap = "Overview of all telehealth treatment options in natural human language"
        hook = "Injectable and chewable treatment options with physician guidance"
        return title, desc, kw, intent_gap, hook

    # 19. Blog Hub
    if "/blog" in u and (u.strip("/").endswith("blog") or u.strip("/").endswith("blog/")):
        title = "Medical weight loss guides and glp 1 clinical articles"
        desc = "Browse physician reviewed articles and patient guides on GLP-1 weight loss medications nutrition recommendations and dosage management tips"
        kw = "medical weight loss guides and glp 1 clinical articles"
        intent_gap = "Educational resource query for medical weight management advice"
        hook = "Physician reviewed guides on dosage nutrition and side effects"
        return title, desc, kw, intent_gap, hook

    # 20. Legal Policies
    if "/policies/refund-policy" in u:
        title = "Refund and cancellation policy if not approved by a doctor"
        desc = "Review our transparent refund policy including full refunds if your consultation is not clinically approved and cancel anytime subscription options"
        kw = "refund and cancellation policy weight loss telehealth"
        intent_gap = "Addresses financial hesitation with clear human wording on refunds"
        hook = "Full refund if not medically approved with cancel anytime options"
        return title, desc, kw, intent_gap, hook

    if "/policies/shipping-policy" in u:
        title = "How refrigerated medications are shipped safely to your home"
        desc = "Learn how temperature sensitive compounded medications are packaged in insulated cold boxes with temperature monitoring and fast delivery to your door"
        kw = "how refrigerated medications are shipped to your home"
        intent_gap = "Reassures patients on cold-chain integrity in conversational phrasing"
        hook = "Insulated cold box packaging with fast refrigerated delivery"
        return title, desc, kw, intent_gap, hook

    if "/policies/telehealth-consent" in u:
        title = "Informed consent agreement for virtual medical consultations"
        desc = "Review the patient informed consent terms for virtual telehealth medical consultations clinical health evaluations and prescription weight loss care"
        kw = "informed consent agreement for virtual medical consultations"
        intent_gap = "Transparent clinical compliance without corporate jargon"
        hook = "Clear patient informed consent terms and telehealth safety"
        return title, desc, kw, intent_gap, hook

    if "/policies/terms-of-service" in u:
        title = "Terms of service and patient user agreement for telehealth care"
        desc = "Read our terms of service and patient user agreement outlining how virtual consultations medical services and subscription accounts are managed"
        kw = "terms of service telehealth medical care"
        intent_gap = "Clear service terms for patient protection"
        hook = "Transparent terms of service and patient rights"
        return title, desc, kw, intent_gap, hook

    if "/policies/privacy-policy" in u:
        title = "How we protect your personal health information and online privacy"
        desc = "Learn how your personal health data medical history and consultation records are kept private secure and protected under strict confidentiality guidelines"
        kw = "how personal health information is protected online"
        intent_gap = "Addresses privacy concerns regarding health history and online prescribing"
        hook = "Strict health data confidentiality and secure patient records"
        return title, desc, kw, intent_gap, hook

    if "/policies/california-privacy-statement" in u:
        title = "California resident privacy rights and consumer health data notice"
        desc = "Information for California residents regarding personal data rights health information privacy disclosures and consumer protections"
        kw = "california resident privacy rights consumer health data"
        intent_gap = "State regulatory transparency in plain human language"
        hook = "California consumer privacy protections and data rights"
        return title, desc, kw, intent_gap, hook

    if "/policies/consumer-health-data-privacy" in u:
        title = "How your consumer health data and medical records are kept private"
        desc = "Review our consumer health data privacy standards detailing how medical consultation details and clinical records are handled with confidentiality"
        kw = "consumer health data privacy standards"
        intent_gap = "Assures patients of clinical data protection"
        hook = "Confidential medical record handling and patient data privacy"
        return title, desc, kw, intent_gap, hook

    if "/policies/disclaimer" in u:
        title = "Medical disclaimer and clinical treatment terms for virtual care"
        desc = "Important medical disclaimer regarding online healthcare consultations clinical evaluation limitations and prescription weight loss eligibility"
        kw = "medical disclaimer for virtual healthcare"
        intent_gap = "Clear legal disclaimer in plain English"
        hook = "Medical consultation guidelines and clinical eligibility notice"
        return title, desc, kw, intent_gap, hook

    if "/policies/editorial-policy" in u:
        title = "Medical review process and editorial guidelines for health articles"
        desc = "Learn how our clinical guides articles and patient resources are researched written and reviewed by licensed physicians for medical accuracy"
        kw = "medical review process for health articles"
        intent_gap = "Validates content accuracy and physician review standards"
        hook = "Physician reviewed health articles with clinical accuracy standards"
        return title, desc, kw, intent_gap, hook

    if "/policies/notice-of-privacy-practices" in u:
        title = "Notice of medical privacy practices and patient record protections"
        desc = "Official notice outlining medical privacy practices how patient clinical records are handled and how protected health information is maintained"
        kw = "notice of medical privacy practices"
        intent_gap = "Healthcare regulatory notice explained clearly"
        hook = "Compliant medical privacy practices and health record protection"
        return title, desc, kw, intent_gap, hook

    if "/policies/patient-bill-of-rights" in u:
        title = "Your rights and protections as a virtual medical weight loss patient"
        desc = "Review your patient rights including respectful healthcare clear treatment information provider qualifications and confidential medical decision making"
        kw = "patient rights for virtual medical weight loss"
        intent_gap = "Empowers patients with clarity on their rights"
        hook = "Patient rights to respectful care and confidential decision making"
        return title, desc, kw, intent_gap, hook

    # Fallback: Natural Human Query without symbols or brand
    slug = u.strip("/").split("/")[-1].replace("-", " ")
    cleaned_slug = re.sub(r"[^a-zA-Z0-9\s]", "", slug).strip()
    title = f"Information and clinical guidance on {cleaned_slug}"
    desc = f"Helpful information and clinical guidance regarding {cleaned_slug} for virtual medical weight loss patients"
    kw = cleaned_slug
    intent_gap = "Natural human informational query"
    hook = "Doctor reviewed guidance and transparent clinical care"
    return title, desc, kw, intent_gap, hook

def sanitize_title(title):
    # Strictly remove pipes, emdash, endash, colons, brand names
    t = title
    t = t.replace("|", " ")
    t = t.replace("—", " ")
    t = t.replace("–", " ")
    t = t.replace(":", " ")
    t = t.replace("&", "and")
    t = re.sub(r"\bOngo\s+Weight\s+Loss\b", "", t, flags=re.IGNORECASE)
    t = re.sub(r"\bOngo\s+Health\b", "", t, flags=re.IGNORECASE)
    t = re.sub(r"\bOngo\b", "", t, flags=re.IGNORECASE)
    t = re.sub(r"\s+", " ", t).strip()
    return t

def main():
    if not os.path.exists(DATA_FILE):
        print(f"File not found: {DATA_FILE}")
        return

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    for p in data["pages"]:
        url = p["url"]
        curr_title = p.get("title", "")
        title, desc, kw, gap, hook = get_human_query_title(url, curr_title)
        title = sanitize_title(title)
        
        # Verify no symbols or brand name remain
        assert "|" not in title, f"Pipe in title: {title}"
        assert "—" not in title, f"Emdash in title: {title}"
        assert "–" not in title, f"Endash in title: {title}"
        assert ":" not in title, f"Colon in title: {title}"
        assert "ongo" not in title.lower(), f"Brand in title: {title}"

        p["recommended_title"] = title
        p["recommended_description"] = desc
        p["primary_keyword"] = kw
        p["intent_gap"] = gap
        p["ctr_hook"] = hook

    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    print(f"Successfully updated all {len(data['pages'])} pages with human query titles!")
    for p in data["pages"][:10]:
        print(f"[{len(p['recommended_title'])} chars] {p['recommended_title']}")

if __name__ == "__main__":
    main()

