# Master Competitor URL Inventory & Site Architecture Blueprint

> **Total URL Inventory:** 217 Canonical URLs  
> **Business Model:** Telehealth Consultations & Direct Home Delivery of Compounded Semaglutide & Tirzepatide  
> **Source Data:** Synthesized from the top 100 competitors (*Ro, Mochi Health, OrderlyMeds, IVÍM Health, TryEden, Lavender Sky Health, JoinFridays*).  

---

## Architectural Strategy: How Top Telehealth Brands Dominate

To compete effectively with 8-figure and 9-figure telehealth brands, your website must serve **three distinct engines**:

1. **The Conversion Engine (P0):** A low-friction asynchronous funnel (`/quiz` -> `/checkout`) paired with transparent flat-rate pricing (`/pricing`) that eliminates hesitation and converts traffic.
2. **The Trust & E-E-A-T Engine (P0/P1):** Pages proving pharmacy licensure (`/pharmacy-partners`), individual doctor profiles (`/providers/[name]`), Certificates of Analysis (`/quality-reports-and-testing`), and injection guides (`/guides/how-to-inject`) to satisfy both cautious patients and Google's strict medical search raters.
3. **The Organic Search & Growth Engine (P1/P2):** High-intent comparison pages (`/compare/semaglutide-vs-tirzepatide`), insurance denial queries (`/insurance/does-insurance-cover-compounded-semaglutide`), and **50 programmatic state landing pages** (`/states/california-telehealth-weight-loss`) to capture local search volume without paid ads.

---

## 1. Core Conversion Funnel & Account Infrastructure (12 URLs)

| # | URL Path | Page Title | Strategic Objective / Target Intent | Priority |
|---|---|---|---|---|
| 1 | `/` | **Homepage** | Main brand positioning, value prop, flat pricing hook, trust seals | `P0` |
| 2 | `/quiz` | **Asynchronous Qualification Quiz** | 90-sec intake quiz, BMI calculator, contraindication check, lead capture | `P0` |
| 3 | `/get-started` | **Direct Onboarding Hub** | Direct checkout and onboarding funnel for qualified patients | `P0` |
| 4 | `/eligibility` | **Medical Eligibility Pre-Screener** | Rule out thyroid cancer, pancreatitis, pregnancy, gallbladder issues | `P0` |
| 5 | `/checkout` | **Order Checkout & ID Verification** | Payment gateway, government ID upload, full-body photo upload | `P0` |
| 6 | `/portal/login` | **Patient Portal Login** | Patient dashboard for tracking orders, refills, messaging providers | `P0` |
| 7 | `/portal/refill-request` | **Refill & Titration Request** | Patient monthly check-in to request next dose titration or maintenance refill | `P0` |
| 8 | `/portal/messages` | **Provider Messaging Portal** | HIPAA-compliant asynchronous chat with physician and nurse team | `P0` |
| 9 | `/how-it-works` | **How It Works Process** | 3-step visual explanation: Quiz -> Doctor Approval -> Cold-Chain Home Delivery | `P0` |
| 10 | `/pricing` | **Transparent Pricing Table** | Side-by-side flat-rate pricing table (Semaglutide vs Tirzepatide, all doses) | `P0` |
| 11 | `/terms-of-service` | **Terms of Service & Telehealth Consent** | Informed consent for telehealth, compounded peptide disclosures, subscription rules | `P0` |
| 12 | `/privacy-policy` | **Privacy Policy & HIPAA Notice** | HIPAA-compliant health data handling, 256-bit SSL encryption disclosure | `P0` |

---

## 2. Treatment & Medication Product Landing Pages (16 URLs)

| # | URL Path | Page Title | Strategic Objective / Target Intent | Priority |
|---|---|---|---|---|
| 13 | `/treatments/compounded-semaglutide` | **Compounded Semaglutide Subcutaneous Injections** | Main Semaglutide sales page, dosing timeline, clinical efficacy, $199/mo rate | `P0` |
| 14 | `/treatments/compounded-tirzepatide` | **Compounded Tirzepatide Subcutaneous Injections** | Main Tirzepatide sales page, dual GIP/GLP-1 science, clinical efficacy, $349/mo rate | `P0` |
| 15 | `/treatments/oral-semaglutide-drops` | **Sublingual Oral Semaglutide Drops** | Needle-free daily oral drops absorbed under the tongue, needle-phobic target | `P1` |
| 16 | `/treatments/oral-tirzepatide-lozenges` | **Sublingual Oral Tirzepatide Lozenges** | Needle-free dissolvable oral troches/lozenges for tirzepatide | `P1` |
| 17 | `/treatments/semaglutide-b12` | **Compounded Semaglutide + Vitamin B12** | Formulation blended with Cyanocobalamin/Methylcobalamin for energy and nausea support | `P1` |
| 18 | `/treatments/tirzepatide-glycine` | **Compounded Tirzepatide + Glycine / B3** | Formulation blended with Glycine or Niacinamide for metabolic tolerance | `P1` |
| 19 | `/treatments/semaglutide-l-carnitine` | **Compounded Semaglutide + L-Carnitine** | Peptide blend designed for metabolic fat transport and energy preservation | `P2` |
| 20 | `/treatments/sermorelin-peptide-therapy` | **Sermorelin Growth Hormone Peptide Therapy** | Adjunct peptide therapy to preserve lean muscle tissue and accelerate fat loss | `P2` |
| 21 | `/treatments/b12-mic-lipotropic-injections` | **Lipotropic B12 + MIC Fat Burning Injections** | Methionine, Inositol, Choline + B12 booster injections for metabolic energy | `P2` |
| 22 | `/treatments/oral-anti-nausea-zofran` | **Ondansetron (Zofran) Nausea Protocol** | Prescription anti-nausea medication bundled to eliminate early GI distress | `P0` |
| 23 | `/plans/3-month-semaglutide-jumpstart` | **3-Month Semaglutide Jumpstart Package** | Prepaid 12-week titration starter bundle with 15% upfront discount | `P1` |
| 24 | `/plans/3-month-tirzepatide-jumpstart` | **3-Month Tirzepatide Jumpstart Package** | Prepaid 12-week dual-action starter bundle with 15% upfront discount | `P1` |
| 25 | `/plans/6-month-transformation-bundle` | **6-Month Complete Transformation Package** | Extended 24-week package for patients with >40 lbs of weight loss goals | `P2` |
| 26 | `/plans/maintenance-microdosing-program` | **Long-Term GLP-1 Maintenance Protocol** | Lower-cost bi-weekly micro-dosing plan to prevent post-goal weight regain | `P1` |
| 27 | `/treatments/switching-from-semaglutide-to-tirzepatide` | **Switching from Semaglutide to Tirzepatide Guide** | Conversion guidelines and equivalent dose matrix for plateaued patients | `P1` |
| 28 | `/treatments/glp-1-for-men` | **Men's Health & GLP-1 Weight Management** | Targeted male metabolic health, testosterone preservation, visceral fat reduction | `P1` |

---

## 3. Trust, Safety, Compliance & Pharmacy Sourcing Hubs (14 URLs)

| # | URL Path | Page Title | Strategic Objective / Target Intent | Priority |
|---|---|---|---|---|
| 29 | `/trust-and-safety` | **Clinical Safety & Standards Overview** | Cold-chain delivery, sterile processing, clinician credentials, safety protocols | `P0` |
| 30 | `/pharmacy-partners` | **Licensed 503A & 503B Compounding Pharmacies** | Full transparency on state-licensed partner pharmacies (Hallandale, Red Rock, etc.) | `P0` |
| 31 | `/quality-reports-and-testing` | **Certificates of Analysis (CoA) & Potency Testing** | HPLC purity testing, sterility assurance, endotoxin batch testing transparency | `P1` |
| 32 | `/fda-compounding-notice` | **FDA Compounding & Drug Shortage Notice** | Legal explanation of Section 503A FD&C Act, drug shortage compounding permissions | `P0` |
| 33 | `/legitscript-certification` | **LegitScript Telehealth Certification** | Verification seal proving legality of online prescription fulfillment | `P1` |
| 34 | `/reviews` | **Verified Patient Reviews & Trustpilot Hub** | Real patient video reviews, Trustpilot feed, verified Google ratings | `P0` |
| 35 | `/reviews/semaglutide` | **Compounded Semaglutide Patient Reviews** | Specific review silo for patients taking compounded semaglutide | `P1` |
| 36 | `/reviews/tirzepatide` | **Compounded Tirzepatide Patient Reviews** | Specific review silo for patients taking compounded tirzepatide | `P1` |
| 37 | `/reviews/before-and-after-transformations` | **Patient Transformations & Case Studies** | Verified before/after photos with weight lost, starting BMI, and timeline | `P1` |
| 38 | `/satisfaction-guarantee` | **100% Medical Approval Guarantee** | Guaranteed full refund if our medical doctor determines you are not eligible | `P1` |
| 39 | `/cold-chain-shipping-guarantee` | **Refrigerated Cold-Chain Shipping Policy** | Medical-grade insulated packaging, ice pack monitoring, overnight shipping guarantee | `P1` |
| 40 | `/hsa-fsa-accepted` | **HSA & FSA Payment & Reimbursement Guide** | How to use pre-tax HSA/FSA debit cards and obtain itemized Superbills / LMN | `P1` |
| 41 | `/bbb-accreditation-and-trust` | **Better Business Bureau (BBB) Accountability** | Our dispute resolution and patient advocacy standards (Mochi Health model) | `P2` |
| 42 | `/medical-malpractice-and-physician-coverage` | **Physician Oversight & Telehealth Coverage** | Telehealth medical malpractice coverage and board certification standards | `P2` |

---

## 4. Medical Leadership, Provider Network & E-E-A-T Architecture (14 URLs)

| # | URL Path | Page Title | Strategic Objective / Target Intent | Priority |
|---|---|---|---|---|
| 43 | `/medical-team` | **Our Physicians & Clinical Leadership** | Overview of board-certified obesity medicine doctors and clinical director | `P0` |
| 44 | `/medical-team/medical-director` | **Chief Medical Officer Profile** | Board-certified internal medicine and obesity specialist credentials and bio | `P0` |
| 45 | `/medical-team/clinical-advisory-board` | **Clinical Advisory Board** | Endocrinologists, bariatric specialists, and pharmacists guiding protocols | `P1` |
| 46 | `/medical-team/registered-dietitians` | **Registered Dietitians & Nutrition Coaches** | Profiles of licensed dietitians available for patient dietary consultations | `P1` |
| 47 | `/state-coverage` | **50-State Telehealth Physician Coverage Map** | Interactive map verifying legal physician licensing across all 50 states | `P1` |
| 48 | `/providers/dr-sarah-jenkins-md` | **Dr. Sarah Jenkins, MD - Obesity Medicine** | Sample physician bio with NPI, state licenses held, residency credentials | `P1` |
| 49 | `/providers/dr-marcus-vance-do` | **Dr. Marcus Vance, DO - Internal Medicine** | Sample physician bio with NPI, state licenses held, residency credentials | `P1` |
| 50 | `/providers/dr-elena-rostova-pharmd` | **Dr. Elena Rostova, PharmD - Clinical Pharmacist** | Sample compounding clinical pharmacist bio, medication safety expert | `P1` |
| 51 | `/providers/jessica-miller-msn-fnp-c` | **Jessica Miller, MSN, FNP-C - Nurse Practitioner** | Sample family nurse practitioner bio with clinical suffixes in URL | `P1` |
| 52 | `/blog-authors` | **Editorial Team & Medical Authors Hub** | Directory of all health writers and clinical contributors (Mochi/Eden model) | `P1` |
| 53 | `/blog-authors/medical-reviewer-network` | **Our Medical Review Board** | Explains the two-tier editorial process: written by writer, reviewed by MD | `P1` |
| 54 | `/editorial-policy` | **Editorial Guidelines & Fact-Checking Policy** | YMYL compliance standards, PubMed citations, clinical literature review guidelines | `P1` |
| 55 | `/careers` | **Join Our Telehealth Physician Network** | Recruitment page for licensed US MDs, DOs, and Nurse Practitioners | `P2` |
| 56 | `/press-and-media` | **Press Mentions & Media Kit** | News coverage, clinical announcements, founder interviews | `P2` |

---

## 5. High-Intent Commercial Drug & Brand Comparisons (20 URLs)

| # | URL Path | Page Title | Strategic Objective / Target Intent | Priority |
|---|---|---|---|---|
| 57 | `/compare/semaglutide-vs-tirzepatide` | **Compounded Semaglutide vs Compounded Tirzepatide** | The #1 comparison query: mechanism, weight loss percentage (15% vs 22%), pricing | `P0` |
| 58 | `/compare/compounded-semaglutide-vs-wegovy` | **Compounded Semaglutide vs Brand Wegovy** | Active ingredients, cash price comparison ($1,349 vs $199), shortage status | `P0` |
| 59 | `/compare/compounded-semaglutide-vs-ozempic` | **Compounded Semaglutide vs Brand Ozempic** | Type 2 diabetes indication vs chronic weight management, off-label vs compound | `P0` |
| 60 | `/compare/compounded-tirzepatide-vs-zepbound` | **Compounded Tirzepatide vs Brand Zepbound** | Dual GIP/GLP-1 active molecule, cash cost savings ($1,050 vs $349), availability | `P0` |
| 61 | `/compare/compounded-tirzepatide-vs-mounjaro` | **Compounded Tirzepatide vs Brand Mounjaro** | Mounjaro off-label weight loss vs affordable compounded tirzepatide | `P1` |
| 62 | `/compare/oral-semaglutide-vs-injectable-semaglutide` | **Oral Sublingual Semaglutide vs Injections** | Bioavailability, absorption under the tongue vs weekly subcutaneous injections | `P1` |
| 63 | `/compare/semaglutide-vs-liraglutide-saxenda` | **Semaglutide vs Saxenda (Liraglutide)** | Once-weekly injection vs daily injection, 15% weight loss vs 8% weight loss | `P2` |
| 64 | `/compare/tirzepatide-vs-retatrutide` | **Tirzepatide vs Retatrutide (Triple Agonist)** | Dual GIP/GLP-1 vs experimental triple GGG agonist: clinical pipeline breakdown | `P2` |
| 65 | `/compare/glp1-injections-vs-bariatric-surgery` | **GLP-1 Medications vs Bariatric Surgery** | Gastric bypass/sleeve vs non-surgical weekly peptide injections | `P2` |
| 66 | `/compare/semaglutide-vs-phentermine` | **Semaglutide vs Phentermine** | Hormonal appetite regulation vs central nervous system stimulant comparison | `P1` |
| 67 | `/compare/semaglutide-vs-contrave` | **Semaglutide vs Contrave (Bupropion/Naltrexone)** | GLP-1 peptide mechanism vs craving/reward center neurotransmitter modulation | `P2` |
| 68 | `/compare/ro-vs-mochi-vs-ourbrand` | **Ro Body vs Mochi Health vs Our Platform** | Comprehensive telehealth competitor comparison table: pricing, doctor access, meds | `P1` |
| 69 | `/compare/henry-meds-vs-ourbrand` | **Henry Meds vs Our Platform** | Breakdown of monthly price jumps vs our transparent flat-rate model | `P1` |
| 70 | `/compare/orderlymeds-vs-ourbrand` | **OrderlyMeds vs Our Platform** | Asynchronous intake, support response speed, and compounding pharmacy sources | `P1` |
| 71 | `/compare/lavender-sky-health-vs-ourbrand` | **Lavender Sky Health vs Our Platform** | A la carte ordering vs automated monthly refill peace of mind | `P2` |
| 72 | `/compare/hims-hers-vs-ourbrand` | **Hims & Hers Weight Loss vs Our Platform** | Generic kits and multi-month lock-in vs pure compounded peptide delivery | `P2` |
| 73 | `/compare/sequence-weightwatchers-vs-ourbrand` | **WW Clinic (Sequence) vs Our Platform** | Subscription fees + insurance navigation vs guaranteed cash-pay medication | `P2` |
| 74 | `/compare/noom-med-vs-ourbrand` | **Noom Med vs Our Platform** | Behavioral psychology app fees vs direct physician care and compounded peptides | `P2` |
| 75 | `/compare/lifemd-vs-ourbrand` | **LifeMD Weight Loss vs Our Platform** | Primary care subscription overhead vs dedicated GLP-1 weight optimization | `P2` |
| 76 | `/compare/zealthy-vs-ourbrand` | **Zealthy vs Our Platform** | Cancellation policy, hidden membership fees vs zero-commitment flat rates | `P2` |

---

## 6. Insurance, Pricing, Costs & Reimbursement Guides (20 URLs)

| # | URL Path | Page Title | Strategic Objective / Target Intent | Priority |
|---|---|---|---|---|
| 77 | `/insurance/does-insurance-cover-compounded-semaglutide` | **Does Health Insurance Cover Compounded Semaglutide?** | Why insurance excludes compounded peptides and why cash-pay is 80% cheaper | `P0` |
| 78 | `/insurance/does-medicare-cover-ozempic-for-weight-loss` | **Does Medicare Cover Ozempic or Wegovy for Weight Loss?** | Medicare Part D exclusions for anti-obesity medications and affordable alternatives | `P1` |
| 79 | `/insurance/does-medicaid-cover-wegovy-and-zepbound` | **Does Medicaid Cover Wegovy or Zepbound?** | State-by-state Medicaid coverage rules and cash-pay compounded options | `P1` |
| 80 | `/insurance/does-blue-cross-blue-shield-cover-wegovy` | **Does Blue Cross Blue Shield (BCBS) Cover Wegovy?** | BCBS formulary guidelines, prior authorization denial rates, cash alternatives | `P1` |
| 81 | `/insurance/does-unitedhealthcare-cover-zepbound` | **Does UnitedHealthcare (UHC) Cover Zepbound?** | UHC prior authorization criteria and step therapy requirements | `P1` |
| 82 | `/insurance/does-aetna-cover-ozempic-for-weight-loss` | **Does Aetna Cover Ozempic or Wegovy?** | Aetna clinical policy bulletins on GLP-1 receptor agonists | `P1` |
| 83 | `/insurance/does-cigna-cover-mounjaro-for-weight-loss` | **Does Cigna Cover Mounjaro or Zepbound?** | Cigna coverage guidelines and appeals navigation | `P1` |
| 84 | `/insurance/does-kaiser-permanente-cover-glp1-medications` | **Does Kaiser Permanente Cover GLP-1 Weight Loss Drugs?** | Kaiser's strict in-network tiering and cash-pay virtual alternatives | `P2` |
| 85 | `/insurance/does-tricare-cover-wegovy-and-zepbound` | **Does TRICARE Cover Wegovy or Zepbound for Military Families?** | TRICARE military healthcare coverage criteria and cash-pay compounding | `P1` |
| 86 | `/insurance/how-to-get-prior-authorization-for-wegovy` | **How to Get Prior Authorization for Wegovy** | Step-by-step guide to insurance appeals, Letter of Medical Necessity templates | `P1` |
| 87 | `/cost/how-much-does-compounded-semaglutide-cost-without-insurance` | **Compounded Semaglutide Cost Without Insurance** | Full breakdown of monthly out-of-pocket costs ($199–$249/mo) vs retail ($1,350) | `P0` |
| 88 | `/cost/how-much-does-compounded-tirzepatide-cost-without-insurance` | **Compounded Tirzepatide Cost Without Insurance** | Full breakdown of monthly costs ($349–$399/mo) vs retail Zepbound ($1,050) | `P0` |
| 89 | `/cost/ozempic-cost-per-month` | **Ozempic Cost Per Month With and Without Insurance** | Retail pharmacy price breakdown across CVS, Walgreens, Walmart, GoodRx | `P1` |
| 90 | `/cost/mounjaro-cost-per-month` | **Mounjaro Cost Per Month With and Without Insurance** | Retail pricing comparison and generic peptide alternatives | `P1` |
| 91 | `/cost/wegovy-savings-card-explained` | **Wegovy Manufacturer Savings Card & Copay Card Explained** | Novo Nordisk coupon restrictions, commercial insurance requirements, limitations | `P2` |
| 92 | `/cost/zepbound-savings-card-explained` | **Zepbound Manufacturer Savings Card Explained** | Eli Lilly savings coupon rules, what happens when insurance denies coverage | `P2` |
| 93 | `/cost/how-to-use-fsa-hsa-for-compounded-glp1` | **How to Use FSA/HSA for Compounded GLP-1 Medications** | Eligible medical expenses under IRS Section 213(d) for obesity treatment | `P1` |
| 94 | `/cost/hidden-costs-of-telehealth-weight-loss-clinics` | **The Hidden Costs of Telehealth Clinics to Avoid** | Exposing membership fees, doctor visit charges, and titration price escalation | `P1` |
| 95 | `/cost/affordable-glp1-options-for-low-income` | **Affordable GLP-1 Options for Budget-Conscious Patients** | How to access safe, physician-monitored peptide therapy on a budget | `P2` |
| 96 | `/cost/financing-and-payment-plans` | **Weight Loss Financing & Split-Pay Options** | Klarna, Afterpay, or multi-month split payments for compounded medications | `P2` |

---

## 7. Clinical Dosage, Titration & Administration Guides (20 URLs)

| # | URL Path | Page Title | Strategic Objective / Target Intent | Priority |
|---|---|---|---|---|
| 97 | `/guides/how-to-inject-subcutaneous-glp1` | **How to Inject Compounded Semaglutide & Tirzepatide (Step-by-Step)** | Comprehensive video and visual guide to painless subcutaneous injections | `P0` |
| 98 | `/guides/dosage-chart-semaglutide` | **Compounded Semaglutide Dosage & Titration Chart** | 0.25mg, 0.5mg, 1.0mg, 1.7mg, 2.4mg conversion to insulin syringe units | `P0` |
| 99 | `/guides/dosage-chart-tirzepatide` | **Compounded Tirzepatide Dosage & Titration Chart** | 2.5mg, 5.0mg, 7.5mg, 10mg, 12.5mg, 15mg conversion to insulin units | `P0` |
| 100 | `/guides/how-to-convert-milligrams-to-insulin-units` | **How to Convert Milligrams (mg) to Insulin Syringe Units** | Prevents dosing errors: calculating concentration (mg/mL) to syringe marks | `P0` |
| 101 | `/guides/how-to-read-compounding-pharmacy-vials` | **How to Read & Verify Compounding Pharmacy Vials** | Explaining BUD dates, lot numbers, vial strength, and sterility seals | `P0` |
| 102 | `/guides/best-injection-sites-for-glp1` | **Best Injection Sites for GLP-1 Injections (Stomach, Thigh, Arm)** | Rotating injection sites, reducing bruising, minimizing nausea through thigh injection | `P1` |
| 103 | `/guides/what-to-do-if-you-miss-a-dose-of-semaglutide` | **What to Do If You Miss a Dose of Semaglutide or Tirzepatide** | Clinical guidance on 5-day windows, when to skip, when to take missed shots | `P1` |
| 104 | `/guides/how-to-store-compounded-peptides` | **How to Store Compounded Peptides: Refrigeration Guidelines** | Temperature ranges (36°F to 46°F), what to do if ice packs melt during shipping | `P1` |
| 105 | `/guides/can-compounded-semaglutide-be-unrefrigerated` | **Can Compounded Semaglutide Be Left Unrefrigerated?** | Room temperature stability limits (up to 21-28 days depending on pharmacy) | `P1` |
| 106 | `/guides/traveling-with-glp1-injections` | **Traveling with GLP-1 Injections & Airport TSA Guidelines** | TSA rules for needles, prescription labels, insulated travel cooling cases | `P2` |
| 107 | `/guides/when-to-increase-your-glp1-dose` | **When to Increase Your GLP-1 Dose: Titration Timing** | Why staying at lowest effective dose preserves sensitivity and prevents nausea | `P1` |
| 108 | `/guides/glp1-weight-loss-plateau-solutions` | **How to Break a Weight Loss Plateau on Semaglutide or Tirzepatide** | Overcoming metabolic adaptation, water retention, and dosage adjustments | `P1` |
| 109 | `/guides/how-long-does-it-take-for-semaglutide-to-start-working` | **How Long Does It Take for Semaglutide to Start Working?** | First 24-48 hour appetite suppression timeline vs first month results | `P1` |
| 110 | `/guides/how-long-does-it-take-for-tirzepatide-to-work` | **How Long Does It Take for Tirzepatide to Work?** | Dual receptor onset of action, glucose stabilization, and early fat loss | `P1` |
| 111 | `/guides/how-to-safely-stop-taking-glp1-medications` | **How to Safely Stop Taking GLP-1 Medications Without Rebound** | Tapering protocols, psychological hunger management, maintenance micro-dosing | `P1` |
| 112 | `/guides/microdosing-semaglutide-and-tirzepatide` | **Microdosing GLP-1 Medications: Benefits and Protocols** | Splitting weekly doses into bi-weekly micro-doses to reduce side effect peaks | `P1` |
| 113 | `/guides/mixing-and-reconstituting-peptides-explained` | **Pre-Mixed Liquid Vials vs Reconstitution Explained** | Clarifying why our pharmacies ship pre-mixed sterile liquid ready to inject | `P1` |
| 114 | `/guides/disposing-of-used-syringes-and-sharps` | **Safe Disposal of Used Syringes: State Sharps Guidelines** | FDA-cleared sharps containers, heavy-duty plastic disposal, local drop-offs | `P2` |
| 115 | `/guides/blood-work-and-lab-testing-requirements` | **Do You Need Blood Work Before Starting Compounded GLP-1s?** | When baseline metabolic panels (CMP, lipid, HbA1c, TSH) are required | `P1` |
| 116 | `/guides/what-needle-size-is-used-for-semaglutide` | **What Needle Size is Used for Subcutaneous Semaglutide?** | 31-gauge 5/16 inch ultra-fine insulin syringes explained (virtually painless) | `P2` |

---

## 8. Side Effects & Patient Safety Management Guides (20 URLs)

| # | URL Path | Page Title | Strategic Objective / Target Intent | Priority |
|---|---|---|---|---|
| 117 | `/side-effects/how-to-manage-nausea-on-semaglutide` | **How to Manage Nausea on Semaglutide: Complete Relief Guide** | Hydration, ginger, eating smaller meals, cold foods, and prescription Zofran | `P0` |
| 118 | `/side-effects/sulfur-burps-causes-and-cures` | **Sulfur Burps on GLP-1s: Causes and Fast Cures** | Why delayed gastric emptying causes fermentation, Pepto-Bismol, digestive enzymes | `P1` |
| 119 | `/side-effects/preventing-constipation-on-glp1` | **Preventing and Treating Constipation on Semaglutide & Tirzepatide** | Magnesium citrate, Miralax, fiber supplements, daily hydration targets | `P0` |
| 120 | `/side-effects/glp1-diarrhea-causes-and-treatments` | **Diarrhea on GLP-1 Medications: Triggers and Fast Relief** | Bland BRAT diet, avoiding high-fat meals, electrolyte replenishment | `P1` |
| 121 | `/side-effects/preventing-muscle-loss-on-glp1` | **How to Prevent Muscle Loss While Taking Semaglutide** | High-protein targets (1g/lb lean mass), progressive resistance training protocols | `P0` |
| 122 | `/side-effects/ozempic-face-causes-and-prevention` | **What is 'Ozempic Face' and How Can You Prevent It?** | Rapid facial fat depletion, collagen supplements, slow steady titration strategy | `P1` |
| 123 | `/side-effects/fatigue-and-low-energy-on-semaglutide` | **Why Does Semaglutide Cause Fatigue? Energy Restoration Tips** | Caloric deficit lethargy, Vitamin B12 co-prescriptions, electrolyte timing | `P1` |
| 124 | `/side-effects/headaches-and-dizziness-on-glp1` | **Headaches and Dizziness on GLP-1s: Causes and Prevention** | Dehydration, rapid blood sugar drops, sodium balance in early weeks | `P1` |
| 125 | `/side-effects/hair-thinning-and-telogen-effluvium` | **Hair Thinning and Weight Loss: Is Semaglutide to Blame?** | Telogen effluvium from rapid calorie deficit vs medication, biotin/protein support | `P1` |
| 126 | `/side-effects/heartburn-and-acid-reflux-relief` | **Acid Reflux and Heartburn on Tirzepatide & Semaglutide** | Omeprazole/Famotidine use, sleeping with elevated head, avoiding late dinners | `P1` |
| 127 | `/side-effects/injection-site-reactions-and-bruising` | **Injection Site Redness, Itching, or Bruising: When to Worry** | Normal histamine reaction vs allergy, warming the vial before injecting | `P2` |
| 128 | `/side-effects/gastroparesis-and-stomach-paralysis-facts` | **Gastroparesis and Stomach Paralysis: Separating Facts from Fiction** | Clinical review of delayed gastric emptying vs severe clinical gastroparesis | `P1` |
| 129 | `/side-effects/gallbladder-issues-and-gallstones` | **Gallbladder Disease and Gallstones During Rapid Weight Loss** | Symptoms of cholecystitis, who is at risk, when to seek immediate medical care | `P1` |
| 130 | `/side-effects/pancreatitis-warning-signs` | **Pancreatitis Warning Signs on GLP-1 Receptor Agonists** | Severe upper abdominal pain radiating to the back, clinical protocol for stopping | `P0` |
| 131 | `/side-effects/thyroid-cancer-black-box-warning-explained` | **Thyroid C-Cell Tumor Black Box Warning Explained** | Rodent study findings vs human clinical data, MTC and MEN 2 contraindications | `P0` |
| 132 | `/side-effects/glp1-anxiety-and-depression-mood-changes` | **Can GLP-1 Medications Cause Anxiety or Mood Changes?** | Dopamine and reward pathway modulation, brain-gut axis clinical review | `P2` |
| 133 | `/side-effects/insomnia-and-sleep-disturbances` | **Insomnia and Sleep Issues on Semaglutide: Causes and Solutions** | Blood sugar drops overnight, cortisol shifts, magnesium glycinate support | `P2` |
| 134 | `/side-effects/hypoglycemia-low-blood-sugar-risk` | **Low Blood Sugar (Hypoglycemia) on GLP-1s: Who is at Risk?** | Why non-diabetic weight-loss patients rarely experience severe hypoglycemia | `P2` |
| 135 | `/side-effects/kidney-health-and-hydration` | **Kidney Function and GLP-1 Medications: The Critical Role of Water** | Dehydration-induced acute kidney strain and how drinking 3L water protects kidneys | `P1` |
| 136 | `/side-effects/glp1-and-pregnancy-safety-guidelines` | **GLP-1 Medications and Pregnancy: Safety, Washout Periods, and Risks** | 2-month pre-conception medication washout period, breastfeeding safety | `P0` |

---

## 9. Nutrition, Diet & Lifestyle Support Silos (15 URLs)

| # | URL Path | Page Title | Strategic Objective / Target Intent | Priority |
|---|---|---|---|---|
| 137 | `/nutrition/what-to-eat-on-semaglutide-meal-plan` | **What to Eat on Semaglutide: Complete 7-Day Meal Plan** | High-protein, high-fiber, gentle-on-stomach meal templates for maximum fat loss | `P0` |
| 138 | `/nutrition/what-foods-to-avoid-on-glp1-medications` | **Foods to Avoid on Semaglutide and Tirzepatide** | Greasy, ultra-processed, fried, and carbonated foods that trigger severe nausea | `P0` |
| 139 | `/nutrition/drinking-alcohol-on-semaglutide-and-tirzepatide` | **Drinking Alcohol on Semaglutide: Can You Drink Safely?** | Why GLP-1s eliminate alcohol cravings, rapid hangover onset, pancreatitis risk | `P0` |
| 140 | `/nutrition/how-much-protein-to-eat-on-glp1` | **How Much Protein Do You Really Need on GLP-1 Medications?** | Calculating 0.8g–1.2g per lb of goal weight, best protein shakes and snacks | `P1` |
| 141 | `/nutrition/best-supplements-to-take-with-glp1` | **Best Supplements to Take While on Semaglutide & Tirzepatide** | Multivitamins, digestive enzymes, magnesium, collagen, and creatine monohydrate | `P1` |
| 142 | `/nutrition/intermittent-fasting-and-semaglutide` | **Intermittent Fasting on GLP-1 Medications: Safe or Unnecessary?** | Combining 16:8 fasting with natural delayed gastric emptying and satiety | `P2` |
| 143 | `/nutrition/coffee-and-caffeine-on-semaglutide` | **Coffee, Energy Drinks, and Caffeine on Semaglutide** | Acid reflux management, staying hydrated while consuming morning coffee | `P2` |
| 144 | `/nutrition/vegetarian-and-vegan-glp1-meal-guide` | **Vegetarian & Vegan GLP-1 Nutrition Guide** | Plant-based protein sources (tofu, tempeh, pea protein, lentils) without bloating | `P2` |
| 145 | `/nutrition/fiber-intake-and-managing-digestion` | **Fiber Intake on GLP-1s: Soluble vs Insoluble Fiber** | How soluble fiber prevents diarrhea while insoluble fiber aids motility | `P2` |
| 146 | `/nutrition/best-protein-powders-for-sensitive-stomachs` | **Best Protein Powders for Sensitive Stomachs on GLP-1s** | Whey isolate vs egg white vs collagen vs plant protein for nausea-prone patients | `P2` |
| 147 | `/nutrition/why-do-glp1s-kill-food-noise` | **What is 'Food Noise' and How Do GLP-1s Silence It?** | Neuroscience of hypothalamic appetite signaling, binge eating cessation | `P1` |
| 148 | `/lifestyle/resistance-training-and-workout-routine` | **The Essential GLP-1 Workout Routine: Preserving Muscle and Bone** | 3-day per week dumbbell strength routines to ensure 90%+ of loss is body fat | `P1` |
| 149 | `/lifestyle/cardio-vs-weights-on-semaglutide` | **Cardio vs Weight Lifting on Semaglutide: Which is Better?** | Why excessive cardio burns muscle and why heavy resistance training speeds results | `P2` |
| 150 | `/lifestyle/managing-social-events-and-dining-out` | **Dining Out and Social Gatherings on Semaglutide** | How to order at restaurants when you only eat 3 bites without drawing attention | `P2` |
| 151 | `/lifestyle/body-composition-scans-and-dexa` | **DEXA Scans and Body Composition Tracking for GLP-1 Patients** | Tracking visceral fat reduction and lean muscle preservation over pure scale weight | `P2` |

---

## 10. Programmatic 50-State Telehealth Local Landing Pages (50 URLs)

| # | URL Path | Page Title | Strategic Objective / Target Intent | Priority |
|---|---|---|---|---|
| 152 | `/states/california-telehealth-weight-loss` | **California Telehealth Compounded Semaglutide & Tirzepatide** | Licensed CA physician consultations, delivery to Los Angeles, San Francisco, San Diego | `P1` |
| 153 | `/states/texas-telehealth-weight-loss` | **Texas Telehealth Compounded Semaglutide & Tirzepatide** | Licensed TX doctor consultations, overnight delivery to Houston, Dallas, Austin, San Antonio | `P1` |
| 154 | `/states/florida-telehealth-weight-loss` | **Florida Telehealth Compounded Semaglutide & Tirzepatide** | Licensed FL medical consultations, home delivery to Miami, Orlando, Tampa, Jacksonville | `P1` |
| 155 | `/states/new-york-telehealth-weight-loss` | **New York Telehealth Compounded Semaglutide & Tirzepatide** | Licensed NY physician review, delivery to NYC, Brooklyn, Queens, Buffalo, Rochester | `P1` |
| 156 | `/states/pennsylvania-telehealth-weight-loss` | **Pennsylvania Telehealth Compounded Semaglutide & Tirzepatide** | Licensed PA doctors, delivery to Philadelphia, Pittsburgh, Allentown, Erie | `P1` |
| 157 | `/states/illinois-telehealth-weight-loss` | **Illinois Telehealth Compounded Semaglutide & Tirzepatide** | Licensed IL doctor review, delivery to Chicago, Naperville, Rockford, Peoria | `P1` |
| 158 | `/states/ohio-telehealth-weight-loss` | **Ohio Telehealth Compounded Semaglutide & Tirzepatide** | Licensed OH physicians, delivery to Columbus, Cleveland, Cincinnati, Toledo | `P1` |
| 159 | `/states/georgia-telehealth-weight-loss` | **Georgia Telehealth Compounded Semaglutide & Tirzepatide** | Licensed GA doctors, delivery to Atlanta, Savannah, Augusta, Athens | `P1` |
| 160 | `/states/north-carolina-telehealth-weight-loss` | **North Carolina Telehealth Compounded Semaglutide & Tirzepatide** | Licensed NC doctor review, delivery to Charlotte, Raleigh, Durham, Greensboro | `P1` |
| 161 | `/states/michigan-telehealth-weight-loss` | **Michigan Telehealth Compounded Semaglutide & Tirzepatide** | Licensed MI physicians, delivery to Detroit, Grand Rapids, Ann Arbor, Lansing | `P1` |
| 162 | `/states/new-jersey-telehealth-weight-loss` | **New Jersey Telehealth Compounded Semaglutide & Tirzepatide** | Licensed NJ doctors, delivery to Newark, Jersey City, Paterson, Princeton | `P1` |
| 163 | `/states/virginia-telehealth-weight-loss` | **Virginia Telehealth Compounded Semaglutide & Tirzepatide** | Licensed VA physicians, delivery to Richmond, Virginia Beach, Norfolk, Arlington | `P1` |
| 164 | `/states/washington-telehealth-weight-loss` | **Washington Telehealth Compounded Semaglutide & Tirzepatide** | Licensed WA doctor review, delivery to Seattle, Spokane, Tacoma, Vancouver | `P1` |
| 165 | `/states/arizona-telehealth-weight-loss` | **Arizona Telehealth Compounded Semaglutide & Tirzepatide** | Licensed AZ doctors, delivery to Phoenix, Tucson, Mesa, Scottsdale | `P1` |
| 166 | `/states/tennessee-telehealth-weight-loss` | **Tennessee Telehealth Compounded Semaglutide & Tirzepatide** | Licensed TN physicians, delivery to Nashville, Memphis, Knoxville, Chattanooga | `P1` |
| 167 | `/states/massachusetts-telehealth-weight-loss` | **Massachusetts Telehealth Compounded Semaglutide & Tirzepatide** | Licensed MA doctors, delivery to Boston, Worcester, Cambridge, Springfield | `P1` |
| 168 | `/states/indiana-telehealth-weight-loss` | **Indiana Telehealth Compounded Semaglutide & Tirzepatide** | Licensed IN physicians, delivery to Indianapolis, Fort Wayne, Bloomington | `P1` |
| 169 | `/states/missouri-telehealth-weight-loss` | **Missouri Telehealth Compounded Semaglutide & Tirzepatide** | Licensed MO doctors, delivery to Kansas City, St. Louis, Springfield, Columbia | `P1` |
| 170 | `/states/maryland-telehealth-weight-loss` | **Maryland Telehealth Compounded Semaglutide & Tirzepatide** | Licensed MD physicians, delivery to Baltimore, Bethesda, Silver Spring, Annapolis | `P1` |
| 171 | `/states/wisconsin-telehealth-weight-loss` | **Wisconsin Telehealth Compounded Semaglutide & Tirzepatide** | Licensed WI doctor review, delivery to Milwaukee, Madison, Green Bay, Kenosha | `P1` |
| 172 | `/states/colorado-telehealth-weight-loss` | **Colorado Telehealth Compounded Semaglutide & Tirzepatide** | Licensed CO physicians, delivery to Denver, Colorado Springs, Aurora, Boulder | `P1` |
| 173 | `/states/minnesota-telehealth-weight-loss` | **Minnesota Telehealth Compounded Semaglutide & Tirzepatide** | Licensed MN doctors, delivery to Minneapolis, St. Paul, Rochester, Duluth | `P1` |
| 174 | `/states/south-carolina-telehealth-weight-loss` | **South Carolina Telehealth Compounded Semaglutide & Tirzepatide** | Licensed SC physicians, delivery to Charleston, Columbia, Greenville | `P1` |
| 175 | `/states/alabama-telehealth-weight-loss` | **Alabama Telehealth Compounded Semaglutide & Tirzepatide** | Licensed AL doctor review, delivery to Birmingham, Huntsville, Mobile, Montgomery | `P1` |
| 176 | `/states/louisiana-telehealth-weight-loss` | **Louisiana Telehealth Compounded Semaglutide & Tirzepatide** | Licensed LA physicians, delivery to New Orleans, Baton Rouge, Shreveport | `P1` |
| 177 | `/states/kentucky-telehealth-weight-loss` | **Kentucky Telehealth Compounded Semaglutide & Tirzepatide** | Licensed KY doctors, delivery to Louisville, Lexington, Bowling Green | `P1` |
| 178 | `/states/oregon-telehealth-weight-loss` | **Oregon Telehealth Compounded Semaglutide & Tirzepatide** | Licensed OR physicians, delivery to Portland, Eugene, Salem, Bend | `P1` |
| 179 | `/states/oklahoma-telehealth-weight-loss` | **Oklahoma Telehealth Compounded Semaglutide & Tirzepatide** | Licensed OK doctor review, delivery to Oklahoma City, Tulsa, Norman | `P1` |
| 180 | `/states/connecticut-telehealth-weight-loss` | **Connecticut Telehealth Compounded Semaglutide & Tirzepatide** | Licensed CT physicians, delivery to Hartford, New Haven, Stamford, Bridgeport | `P1` |
| 181 | `/states/utah-telehealth-weight-loss` | **Utah Telehealth Compounded Semaglutide & Tirzepatide** | Licensed UT doctors, delivery to Salt Lake City, Provo, West Valley City, Ogden | `P1` |
| 182 | `/states/iowa-telehealth-weight-loss` | **Iowa Telehealth Compounded Semaglutide & Tirzepatide** | Licensed IA physicians, delivery to Des Moines, Cedar Rapids, Davenport | `P1` |
| 183 | `/states/nevada-telehealth-weight-loss` | **Nevada Telehealth Compounded Semaglutide & Tirzepatide** | Licensed NV doctor review, delivery to Las Vegas, Henderson, Reno | `P1` |
| 184 | `/states/arkansas-telehealth-weight-loss` | **Arkansas Telehealth Compounded Semaglutide & Tirzepatide** | Licensed AR physicians, delivery to Little Rock, Fayetteville, Fort Smith | `P1` |
| 185 | `/states/mississippi-telehealth-weight-loss` | **Mississippi Telehealth Compounded Semaglutide & Tirzepatide** | Licensed MS doctors, delivery to Jackson, Gulfport, Southaven, Biloxi | `P1` |
| 186 | `/states/kansas-telehealth-weight-loss` | **Kansas Telehealth Compounded Semaglutide & Tirzepatide** | Licensed KS physicians, delivery to Wichita, Overland Park, Kansas City, Topeka | `P1` |
| 187 | `/states/new-mexico-telehealth-weight-loss` | **New Mexico Telehealth Compounded Semaglutide & Tirzepatide** | Licensed NM doctors, delivery to Albuquerque, Las Cruces, Santa Fe | `P1` |
| 188 | `/states/nebraska-telehealth-weight-loss` | **Nebraska Telehealth Compounded Semaglutide & Tirzepatide** | Licensed NE physicians, delivery to Omaha, Lincoln, Bellevue, Grand Island | `P1` |
| 189 | `/states/idaho-telehealth-weight-loss` | **Idaho Telehealth Compounded Semaglutide & Tirzepatide** | Licensed ID doctor review, delivery to Boise, Meridian, Nampa, Idaho Falls | `P1` |
| 190 | `/states/west-virginia-telehealth-weight-loss` | **West Virginia Telehealth Compounded Semaglutide & Tirzepatide** | Licensed WV physicians, delivery to Charleston, Huntington, Morgantown | `P1` |
| 191 | `/states/hawaii-telehealth-weight-loss` | **Hawaii Telehealth Compounded Semaglutide & Tirzepatide** | Licensed HI doctors, cold-chain air shipping to Honolulu, Maui, Kauai, Big Island | `P1` |
| 192 | `/states/new-hampshire-telehealth-weight-loss` | **New Hampshire Telehealth Compounded Semaglutide & Tirzepatide** | Licensed NH physicians, delivery to Manchester, Nashua, Concord, Dover | `P1` |
| 193 | `/states/maine-telehealth-weight-loss` | **Maine Telehealth Compounded Semaglutide & Tirzepatide** | Licensed ME doctor review, delivery to Portland, Lewiston, Bangor, South Portland | `P1` |
| 194 | `/states/rhode-island-telehealth-weight-loss` | **Rhode Island Telehealth Compounded Semaglutide & Tirzepatide** | Licensed RI physicians, delivery to Providence, Warwick, Cranston, Pawtucket | `P1` |
| 195 | `/states/montana-telehealth-weight-loss` | **Montana Telehealth Compounded Semaglutide & Tirzepatide** | Licensed MT doctors, delivery to Billings, Missoula, Great Falls, Bozeman | `P1` |
| 196 | `/states/delaware-telehealth-weight-loss` | **Delaware Telehealth Compounded Semaglutide & Tirzepatide** | Licensed DE physicians, delivery to Wilmington, Dover, Newark, Middletown | `P1` |
| 197 | `/states/south-dakota-telehealth-weight-loss` | **South Dakota Telehealth Compounded Semaglutide & Tirzepatide** | Licensed SD doctor review, delivery to Sioux Falls, Rapid City, Aberdeen | `P1` |
| 198 | `/states/north-dakota-telehealth-weight-loss` | **North Dakota Telehealth Compounded Semaglutide & Tirzepatide** | Licensed ND physicians, delivery to Fargo, Bismarck, Grand Forks, Minot | `P1` |
| 199 | `/states/alaska-telehealth-weight-loss` | **Alaska Telehealth Compounded Semaglutide & Tirzepatide** | Licensed AK doctors, cold-chain shipping to Anchorage, Fairbanks, Juneau | `P1` |
| 200 | `/states/vermont-telehealth-weight-loss` | **Vermont Telehealth Compounded Semaglutide & Tirzepatide** | Licensed VT physicians, delivery to Burlington, South Burlington, Rutland | `P1` |
| 201 | `/states/wyoming-telehealth-weight-loss` | **Wyoming Telehealth Compounded Semaglutide & Tirzepatide** | Licensed WY doctors, delivery to Cheyenne, Casper, Laramie, Gillette | `P1` |

---

## 11. Creator, Influencer & Viral Growth Engines (8 URLs)

| # | URL Path | Page Title | Strategic Objective / Target Intent | Priority |
|---|---|---|---|---|
| 202 | `/creator/template` | **Influencer / Creator Co-Branded Landing Page Template** | TryEden & JoinFridays model: creator photo, video embed, testimonial, auto-applied $50 off code | `P1` |
| 203 | `/creators` | **Creator Partnerships & Ambassador Hub** | Recruitment page for TikTok/Instagram health & lifestyle creators to join affiliate program | `P1` |
| 204 | `/referral-program` | **Patient Referral Program (Give $50, Get $50)** | Viral patient referral dashboard: share custom link, give $50 to friend, earn $50 refill credit | `P1` |
| 205 | `/affiliate-program` | **Health & Wellness Affiliate Program** | Commission structure for personal trainers, gym owners, medspas, and fitness influencers | `P2` |
| 206 | `/community` | **Private VIP Patient Community** | Invitation hub for private patient community (weekly Q&As, support groups, recipe shares) | `P1` |
| 207 | `/podcasts-and-interviews` | **Podcasts & Medical Discussions** | Founder and medical director guest appearances on health, longevity, and metabolic podcasts | `P2` |
| 208 | `/military-first-responder-discount` | **Military & First Responder 15% Discount** | ID.me verification page giving 15% recurring discount to veterans, police, nurses, firefighters | `P1` |
| 209 | `/teacher-and-student-discount` | **Educator & Healthcare Worker Discount** | Community goodwill discount landing page driving viral organic sharing | `P2` |

---

## 12. Clinical Trial Evidence & Medical Science Hubs (8 URLs)

| # | URL Path | Page Title | Strategic Objective / Target Intent | Priority |
|---|---|---|---|---|
| 210 | `/clinical-trials/step-1-trial-results-explained` | **The STEP 1 Trial Explained: 68-Week Semaglutide Data** | NEJM landmark study review: 15% average weight reduction breakdown for patients | `P1` |
| 211 | `/clinical-trials/surmount-1-trial-results-explained` | **The SURMOUNT-1 Trial Explained: 72-Week Tirzepatide Data** | NEJM landmark study review: 20.9% average body weight loss with dual GIP/GLP-1 | `P1` |
| 212 | `/clinical-trials/select-cardiovascular-trial-results` | **The SELECT Trial: 20% Reduction in Heart Attack & Stroke** | Cardiovascular risk reduction data for patients with pre-existing heart disease | `P2` |
| 213 | `/clinical-trials/compounded-bioequivalence-and-purity` | **Compounded GLP-1 Bioequivalence & Active Ingredient Purity** | Explaining chemical identity, HPLC chromatograms, and peptide structure matching | `P1` |
| 214 | `/clinical-trials/long-term-safety-of-glp1-receptor-agonists` | **Long-Term Safety Profile of GLP-1 Medications: 15-Year Data** | Review of GLP-1 safety since 2005 (Byetta) through modern weekly peptides | `P2` |
| 215 | `/clinical-trials/rebound-weight-regain-prevention-data` | **Preventing Rebound Weight Gain: Clinical Trial Insights** | STEP 4 & SURMOUNT-4 withdrawal trial analysis and the case for maintenance therapy | `P1` |
| 216 | `/clinical-trials/fat-loss-vs-muscle-loss-percentages` | **DEXA Scan Science: Fat Mass vs Lean Muscle Loss Rates** | Scientific reality: GLP-1s vs traditional caloric restriction on muscle preservation | `P2` |
| 217 | `/glossary` | **Medical Weight Loss & Peptide Glossary** | Search engine glossary defining GLP-1, GIP, Subcutaneous, Titration, BUD, 503A, Satiety | `P1` |

---

## Internal Linking & Conversion Flow Strategy

To maximize both SEO crawl efficiency and patient conversion rates, follow these internal linking rules:

1. **Every Informational & Comparison URL Must Link to `/quiz`:** Every comparison page (e.g. `/compare/compounded-semaglutide-vs-wegovy`), insurance page, or side-effect article should have a persistent mid-content and bottom CTA banner: *'Check Your Eligibility for Compounded Semaglutide in 90 Seconds'*, linking directly to `/quiz`.
2. **The Trust Cross-Link:** On your core sales pages (`/treatments/compounded-semaglutide`), link prominently to `/pharmacy-partners`, `/quality-reports-and-testing`, and `/guides/how-to-inject` right beside the order button to dissolve pre-purchase anxiety.
3. **State Page Geotargeting:** On the `/state-coverage` hub, link out to all 50 state pages (`/states/[state]-telehealth-weight-loss`). Each state page should dynamically highlight: *'Licensed [State] Physicians on Duty · Overnight Delivery to [State Cities]'*.
4. **Author Bio Verification:** Every blog article must include a dual byline: written by a health writer, and *'Medically Reviewed by [Doctor Name]'*, with an active link to their profile under `/providers/[doctor-name]`.

---

## File References
- Master Spreadsheet CSV: [master_url_inventory.csv](file:///d:/research%20work/master_url_inventory.csv)
- Page Architecture Tree Map: [competitor_page_architecture_treemap.md](file:///d:/research%20work/competitor_page_architecture_treemap.md)
- Top 100 Competitor Directory: [100_competitors_list.md](file:///d:/research%20work/ongo-weightloss-competitors%20sitemaps/100_competitors_list.md)
