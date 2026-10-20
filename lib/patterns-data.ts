export interface CommonPagePattern {
  id: string;
  pattern: string;
  name: string;
  silo: string;
  presenceRate: number; // percentage (e.g. 94)
  estimatedCount: number; // estimated competitor count
  purpose: string;
  strategicRole: string;
  ongoStatus: 'implemented' | 'planned' | 'missing';
  ongoPath?: string;
  keyElements: string[];
}

export interface UniquePagePattern {
  id: string;
  name: string;
  urlPattern: string;
  primaryBrands: string[];
  silo: string;
  rarity: string; // e.g. "< 5% of brands"
  whyCovered: {
    strategicRationale: string;
    customerObjection: string;
    seoAdvantage: string;
    conversionImpact: string;
  };
  ongoRecommendation: {
    priority: 'P0' | 'P1' | 'P2';
    recommendation: string;
    suggestedSlug: string;
  };
  sampleUrls: string[];
}

export const COMMON_PAGE_PATTERNS: CommonPagePattern[] = [
  {
    id: 'common-semaglutide',
    pattern: '/treatment/compounded-semaglutide or /semaglutide',
    name: 'Compounded Semaglutide Medication Page',
    silo: 'Core Treatment / Clinical',
    presenceRate: 96,
    estimatedCount: 96,
    purpose: 'Explains semaglutide mechanism of action, GLP-1 receptor agonist activity, weekly dosing, and titration schedules.',
    strategicRole: 'Primary conversion gateway for ~60% of all medical weight loss search traffic.',
    ongoStatus: 'implemented',
    ongoPath: '/services/glp-1/compounded-semaglutide/',
    keyElements: [
      'Mechanism of action (appetite suppression, gastric emptying delay)',
      'Titration ramp (0.25mg to 2.4mg)',
      'Compounding disclosure & 503A compliance',
      'Doctor consultation CTA'
    ]
  },
  {
    id: 'common-tirzepatide',
    pattern: '/treatment/compounded-tirzepatide or /tirzepatide',
    name: 'Compounded Tirzepatide (Dual GIP/GLP-1) Page',
    silo: 'Core Treatment / Clinical',
    presenceRate: 88,
    estimatedCount: 88,
    purpose: 'Details dual GIP/GLP-1 receptor agonist efficacy, comparison with semaglutide, and higher weight loss percentages.',
    strategicRole: 'Highest-converting premium medication page, capturing patients seeking maximum efficacy.',
    ongoStatus: 'implemented',
    ongoPath: '/services/glp-1/compounded-tirzepatide/',
    keyElements: [
      'Dual GIP & GLP-1 receptor synergy',
      'Clinical trial comparison (SURMOUNT vs STEP)',
      'Weekly injection and reconstitution guidelines',
      'Transparent vial pricing'
    ]
  },
  {
    id: 'common-pricing',
    pattern: '/pricing or /plans',
    name: 'Transparent Pricing & Plans Breakdown',
    silo: 'Commercial / Funnel',
    presenceRate: 78,
    estimatedCount: 78,
    purpose: 'Displays all-inclusive monthly fees, doctor consultations, lab work, shipping, and medication costs.',
    strategicRole: 'The #1 pre-purchase objection resolver. Brands with hidden pricing suffer significantly higher drop-offs.',
    ongoStatus: 'implemented',
    ongoPath: '/pricing/',
    keyElements: [
      'Flat monthly fee display',
      'Doctor visit and shipping inclusions',
      'Zero hidden pharmacy dispensing fees disclaimer',
      'HSA/FSA payment eligibility'
    ]
  },
  {
    id: 'common-how-it-works',
    pattern: '/how-it-works or /process',
    name: 'How It Works / 3-Step Telehealth Process',
    silo: 'Onboarding / UX',
    presenceRate: 84,
    estimatedCount: 84,
    purpose: 'Demystifies the online medical consultation, doctor review, prescription approval, and home shipping timeline.',
    strategicRole: 'Builds immediate cognitive ease for patients unfamiliar with telemedicine prescribing.',
    ongoStatus: 'implemented',
    ongoPath: '/how-it-works/',
    keyElements: [
      'Step 1: 5-minute online health questionnaire',
      'Step 2: US-licensed clinician telehealth consultation',
      'Step 3: Direct discreet refrigerated pharmacy delivery'
    ]
  },
  {
    id: 'common-eligibility',
    pattern: '/eligibility or /who-qualifies',
    name: 'Clinical Eligibility & BMI Requirements',
    silo: 'Clinical Qualification',
    presenceRate: 72,
    estimatedCount: 72,
    purpose: 'Outlines BMI criteria (BMI ≥ 30 or BMI ≥ 27 with weight-related comorbidity) and medical exclusions.',
    strategicRole: 'Self-qualifies patients prior to intake, reducing non-viable clinician review costs.',
    ongoStatus: 'implemented',
    ongoPath: '/eligibility/',
    keyElements: [
      'BMI threshold calculator',
      'Contraindications (e.g. Medullary Thyroid Carcinoma, MEN2)',
      'Age and pregnancy exclusions'
    ]
  },
  {
    id: 'common-faq',
    pattern: '/faq or /frequently-asked-questions',
    name: 'Frequently Asked Questions & Schema Hub',
    silo: 'Support / Rich Snippets',
    presenceRate: 86,
    estimatedCount: 86,
    purpose: 'Addresses top patient anxieties: shipping times, side effects, missed doses, needle safety, and refills.',
    strategicRole: 'Critical for capturing Google FAQ rich snippets directly in Search Engine Results Pages (SERPs).',
    ongoStatus: 'implemented',
    ongoPath: '/faq/',
    keyElements: [
      'Structured FAQPage JSON-LD schema',
      'Questions on refrigeration & vial shelf life',
      'Subscription cancellation policies'
    ]
  },
  {
    id: 'common-about-team',
    pattern: '/medical-team or /about-us or /our-doctors',
    name: 'Licensed Medical Team & Clinical E-E-A-T',
    silo: 'Trust & E-E-A-T',
    presenceRate: 68,
    estimatedCount: 68,
    purpose: 'Profiles board-certified obesity medicine doctors, nurse practitioners, and clinical advisors.',
    strategicRole: 'Mandatory trust anchor for Google Healthcare E-E-A-T algorithm updates.',
    ongoStatus: 'implemented',
    ongoPath: '/medical-team/',
    keyElements: [
      'Provider headshots, names, and medical credentials (MD, DO, FNP)',
      'State medical license coverage',
      'Affiliations with Obesity Medicine Association (OMA)'
    ]
  },
  {
    id: 'common-intake',
    pattern: '/get-started or /quiz or /intake',
    name: 'Online Medical Intake Funnel',
    silo: 'Conversion Engine',
    presenceRate: 98,
    estimatedCount: 98,
    purpose: 'Step-by-step patient clinical intake form gathering medical history, height, weight, and shipping address.',
    strategicRole: 'The core conversion engine converting organic visitors into paying subscribers.',
    ongoStatus: 'implemented',
    ongoPath: '/get-started/',
    keyElements: [
      'Dynamic conditional medical logic',
      'HIPAA-compliant data encryption',
      'Credit card checkout integration'
    ]
  },
  {
    id: 'common-semaglutide-vs-tirzepatide',
    pattern: '/blog/semaglutide-vs-tirzepatide',
    name: 'Semaglutide vs Tirzepatide Comparison Guide',
    silo: 'Blog / Commercial Intent',
    presenceRate: 76,
    estimatedCount: 76,
    purpose: 'Head-to-head comparison of efficacy, mechanism (GLP-1 vs GIP/GLP-1), side effects, and monthly cost.',
    strategicRole: 'Highest commercial intent informational query in the entire GLP-1 weight loss niche.',
    ongoStatus: 'planned',
    keyElements: [
      'Weight loss percentage comparison chart (15% vs 20.9%)',
      'Side effect profile differences',
      'Price comparison matrix',
      'Provider recommendation checklist'
    ]
  },
  {
    id: 'common-locations',
    pattern: '/locations or /states-we-serve',
    name: '50-State Telehealth Availability Hub',
    silo: 'Local SEO / Compliance',
    presenceRate: 58,
    estimatedCount: 58,
    purpose: 'Validates multi-state clinician coverage and pharmacy delivery capability across US territories.',
    strategicRole: 'Rank for geo-targeted queries like "semaglutide telehealth florida" or "compounded tirzepatide texas".',
    ongoStatus: 'implemented',
    ongoPath: '/locations/',
    keyElements: [
      'US state availability grid',
      'State-specific telehealth telemedicine licensing rules',
      'Pharmacy shipping delivery estimates'
    ]
  }
];

export const UNIQUE_PAGE_PATTERNS: UniquePagePattern[] = [
  {
    id: 'unique-oral-sublingual',
    name: 'Oral Sublingual Dissolving GLP-1 Tablets / Lozenges',
    urlPattern: '/treatments/oral-semaglutide or /sublingual-tablets',
    primaryBrands: ['Henry Meds', 'Strut Health', 'Contour Lounge', 'Defy Medical'],
    silo: 'Needle-Free Form Factors',
    rarity: '< 6% of competitors',
    whyCovered: {
      strategicRationale: 'Trypanophobia (fear of needles) is the #1 single psychological barrier preventing overweight adults from starting injectable GLP-1 therapy.',
      customerObjection: '"I want to lose weight with GLP-1, but I refuse to inject myself with a needle every week."',
      seoAdvantage: 'Captures high-converting queries like "oral semaglutide online", "sublingual compounded semaglutide cost", and "needle free weight loss medication".',
      conversionImpact: 'Expands the total addressable market by converting ~25% of potential drop-offs who would bounce from subcutaneous injection vial pages.'
    },
    ongoRecommendation: {
      priority: 'P1',
      recommendation: 'Evaluate offering oral sublingual semaglutide lozenges or drops via accredited 503A compounding partners with a dedicated landing page.',
      suggestedSlug: '/services/glp-1/oral-semaglutide-sublingual/'
    },
    sampleUrls: [
      'https://henrymeds.com/oral-semaglutide',
      'https://struthealth.com/oral-weight-loss',
      'https://contourlounge.com/oral-glp1-tablets'
    ]
  },
  {
    id: 'unique-503a-certificates',
    name: 'Compounding Pharmacy Sterility & 503A / 503B Certificates',
    urlPattern: '/compounding-safety or /pharmacy-standards or /coa-testing',
    primaryBrands: ['Eden (TryEden)', 'Olympia Compounding', 'Pure Pharmacy', 'Brello Health'],
    silo: 'Safety & Regulatory Trust',
    rarity: '< 8% of competitors',
    whyCovered: {
      strategicRationale: 'Neutralizes negative mainstream media press questioning compounded GLP-1 safety by proactively displaying third-party Certificates of Analysis (COA) and sterility verification.',
      customerObjection: '"Is compounded semaglutide safe and pure, or is it fake and unregulated?"',
      seoAdvantage: 'Ranks for trust-verification queries: "is compounded semaglutide safe", "503a compounding pharmacy weight loss", "legit compounded glp1".',
      conversionImpact: 'Eliminates trust friction for skeptical patients, dramatically improving conversion rates during the final checkout stage.'
    },
    ongoRecommendation: {
      priority: 'P0',
      recommendation: 'Build a dedicated Pharmacy Standards & Safety page detailing your partner 503A/503B state pharmacy licenses, batch sterility testing, and active pharmaceutical ingredient (API) sourcing.',
      suggestedSlug: '/safety/compounding-pharmacy-standards/'
    },
    sampleUrls: [
      'https://www.tryeden.com/quality-standards',
      'https://olympiapharmacy.com/quality-testing'
    ]
  },
  {
    id: 'unique-flat-rate-guarantee',
    name: 'Flat-Rate Pricing Guarantee (No Dose Escalation Surges)',
    urlPattern: '/flat-rate-pricing or /transparent-guarantee',
    primaryBrands: ['OrderlyMeds', 'Emerge Weight Loss', 'SlimDown Rx', 'JoinAmble'],
    silo: 'Pricing Transparency & Fairness',
    rarity: '< 10% of competitors',
    whyCovered: {
      strategicRationale: 'Exposes competitor "bait-and-switch" pricing where initial 0.25mg doses cost $199/month, but escalating to maintenance 2.4mg doses surges to $499+/month.',
      customerObjection: '"Will my price double after the first month when my doctor increases my dose?"',
      seoAdvantage: 'Intercepts frustrated patients searching "semaglutide flat rate pricing", "affordable tirzepatide high dose", and "no hidden fee weight loss".',
      conversionImpact: 'Massive long-term customer lifetime value (LTV) and churn reduction because patients know their monthly expense remains predictable.'
    },
    ongoRecommendation: {
      priority: 'P0',
      recommendation: 'Create a dedicated "Flat-Rate Price Guarantee" callout highlighting that Ongo does not penalize patients as their clinical dosage titrates upward.',
      suggestedSlug: '/pricing/flat-rate-guarantee/'
    },
    sampleUrls: [
      'https://orderlymeds.com/flat-rate',
      'https://www.emergeweight.com/pricing'
    ]
  },
  {
    id: 'unique-dose-calculator',
    name: 'Interactive GLP-1 Dosing & Conversion Calculator Tool',
    urlPattern: '/tools/glp1-dosage-calculator or /units-to-mg-calculator',
    primaryBrands: ['Mochi Health', 'TelefitMD', 'Good Life Meds'],
    silo: 'Interactive Tool & Backlink Magnet',
    rarity: '< 4% of competitors',
    whyCovered: {
      strategicRationale: 'Multidose insulin syringes measure in "Units" (e.g. 10 units, 25 units), while prescription doses are in "mg" (e.g. 0.25mg, 0.5mg). Patients are notoriously confused and afraid of dosing errors.',
      customerObjection: '"How many units on my syringe is 0.5mg of semaglutide?"',
      seoAdvantage: 'High viral potential and organic backlink magnet. Earns thousands of backlinks from medical forums, Reddit, and patient blogs.',
      conversionImpact: 'Attracts active compounded medication users from other clinics who can then be retargeted and converted to Ongo subscribers.'
    },
    ongoRecommendation: {
      priority: 'P1',
      recommendation: 'Develop an interactive JavaScript calculator allowing users to select vial concentration (mg/mL) and calculate exact syringe unit tick marks.',
      suggestedSlug: '/tools/glp1-dosage-converter/'
    },
    sampleUrls: [
      'https://joinmochi.com/tools/dose-calculator'
    ]
  },
  {
    id: 'unique-maintenance-tapering',
    name: 'GLP-1 Tapering, Microdosing & Weight Maintenance Hub',
    urlPattern: '/maintenance-program or /how-to-taper-glp1 or /microdosing',
    primaryBrands: ['Brello Health', 'Reset Wellness', 'Core Age Rx'],
    silo: 'Retention & Post-Goal Care',
    rarity: '< 5% of competitors',
    whyCovered: {
      strategicRationale: 'Addresses the single most prevalent existential fear among GLP-1 patients: "Will I regain all 40 lbs immediately once I stop taking injections?"',
      customerObjection: '"I am worried I will have to be on this expensive drug for the rest of my life."',
      seoAdvantage: 'Captures high-intent retention keywords: "tapering off semaglutide", "glp1 maintenance dose cost", "how to stop ozempic without gaining weight".',
      conversionImpact: 'Increases retention by 6–12 months by offering a structured, lower-cost maintenance microdosing subscription rather than abrupt cancellation.'
    },
    ongoRecommendation: {
      priority: 'P1',
      recommendation: 'Introduce an "Ongo Maintenance & Tapering Protocol" page detailing gradual titration reduction and metabolic support.',
      suggestedSlug: '/services/glp-1/maintenance-and-tapering/'
    },
    sampleUrls: [
      'https://www.brellohealth.com/maintenance'
    ]
  },
  {
    id: 'unique-travel-refrigeration',
    name: 'Traveling with GLP-1: Airport TSA, Flying & Cold Storage Guide',
    urlPattern: '/guides/traveling-with-semaglutide or /tsa-refrigeration',
    primaryBrands: ['Emerge Weight Loss', 'ReflexMD', 'Pomegranate Health'],
    silo: 'Lifestyle & Real-World Compliance',
    rarity: '< 7% of competitors',
    whyCovered: {
      strategicRationale: 'Compounded GLP-1 vials require 36°F–46°F refrigeration. Patients panic when packing for vacations, flights, or business trips.',
      customerObjection: '"Can I take my compounded vial through TSA security? How do I keep it cold for 8 hours on a flight?"',
      seoAdvantage: 'Ranks for niche, zero-competition lifestyle queries with zero paid ads competing for the search term.',
      conversionImpact: 'Establishes Ongo as a helpful, practical medical ally rather than just a faceless prescription dispenser.'
    },
    ongoRecommendation: {
      priority: 'P2',
      recommendation: 'Publish a comprehensive guide covering TSA liquid exemptions for medication, ice pack rules, and hotel mini-fridge troubleshooting.',
      suggestedSlug: '/guides/traveling-with-compounded-glp-1/'
    },
    sampleUrls: [
      'https://www.emergeweight.com/blog/travel-with-glp1'
    ]
  },
  {
    id: 'unique-insurance-prior-auth',
    name: 'Prior Authorization Support & Commercial Insurance Concierge',
    urlPattern: '/insurance-coverage or /prior-authorization-assistance',
    primaryBrands: ['Zealthy', 'Sequence (WW Clinic)', 'Calibrate', 'LifeMD'],
    silo: 'Insurance Optimization & Bridge Therapy',
    rarity: '< 12% of competitors',
    whyCovered: {
      strategicRationale: 'Millions of patients with employer health insurance want brand Wegovy/Zepbound for a $25 copay. When prior authorization is denied, they immediately need compounded therapy.',
      customerObjection: '"Does my insurance cover this? Can you help submit paperwork to BlueCross/UnitedHealth?"',
      seoAdvantage: 'High search volume: "does insurance cover semaglutide", "zepbound prior authorization criteria", "weight loss clinic that accepts insurance".',
      conversionImpact: 'Funnel capture: submit PA for name-brand drugs; when denied, smoothly pivot 100% of applicants to affordable compounded vials without losing the lead.'
    },
    ongoRecommendation: {
      priority: 'P1',
      recommendation: 'Position compounded GLP-1 as the fast, guaranteed "no-insurance-delay bridge" while providing an insurance qualification checker.',
      suggestedSlug: '/insurance/prior-authorization-guide/'
    },
    sampleUrls: [
      'https://getzealthy.com/insurance'
    ]
  },
  {
    id: 'unique-side-effect-antidotes',
    name: 'GLP-1 Side Effect Management: Nausea, Antiemetics & Zofran Rx',
    urlPattern: '/side-effects/nausea-management or /glp1-zofran-prescription',
    primaryBrands: ['Mochi Health', 'Henry Meds', 'Eden (TryEden)'],
    silo: 'Symptom Relief & Medical Support',
    rarity: '< 15% of competitors',
    whyCovered: {
      strategicRationale: 'Nausea and constipation are the top reasons patients discontinue GLP-1 therapy within 90 days. Top brands offer bundled ondansetron (Zofran) antiemetic prescriptions.',
      customerObjection: '"I am terrified of vomiting or feeling nauseous every day on Ozempic."',
      seoAdvantage: 'Captures acute symptom queries: "how to stop semaglutide nausea", "can you take zofran with tirzepatide", "glp1 stomach upset remedies".',
      conversionImpact: 'Assures new patients that their clinician will proactively manage gastrointestinal comfort, reducing cancellation rates by up to 35%.'
    },
    ongoRecommendation: {
      priority: 'P1',
      recommendation: 'Create a dedicated Side Effect & Comfort Guide showing that Ongo doctors can prescribe supportive medications like Zofran if clinically indicated.',
      suggestedSlug: '/guides/glp-1-side-effects-and-nausea-relief/'
    },
    sampleUrls: [
      'https://joinmochi.com/blog/is-zofran-safe-with-semaglutide-what-you-need-to-know'
    ]
  },
  {
    id: 'unique-pause-policy',
    name: 'Pause Anytime Guarantee: Flexible Subscription Policy',
    urlPattern: '/policies/pause-subscription or /no-contract-guarantee',
    primaryBrands: ['Emerge Weight Loss', 'Lavender Sky Health', 'OrderlyMeds'],
    silo: 'Contract Flexibility & Friction Removal',
    rarity: '< 9% of competitors',
    whyCovered: {
      strategicRationale: 'Patients dread recurring auto-renew subscriptions where canceling requires phone calls, customer service friction, or cancellation penalties.',
      customerObjection: '"Am I locked into a 6-month contract? Can I skip a month if I go on vacation or reach my goal?"',
      seoAdvantage: 'Targets comparison and trust queries: "telehealth weight loss no contract", "easy cancel semaglutide", "pause emerge weight loss".',
      conversionImpact: 'Removing cancellation fear removes the final psychological hurdle right before entering payment details.'
    },
    ongoRecommendation: {
      priority: 'P0',
      recommendation: 'Publish an explicit "No Commitment, Pause Anytime" policy page with a 1-click self-serve dashboard explanation.',
      suggestedSlug: '/policies/pause-and-cancellation-guarantee/'
    },
    sampleUrls: [
      'https://www.emergeweight.com/faq'
    ]
  },
  {
    id: 'unique-hsa-fsa',
    name: 'HSA / FSA Card Acceptance & Letter of Medical Necessity (LMN)',
    urlPattern: '/hsa-fsa-eligibility or /letter-of-medical-necessity',
    primaryBrands: ['Henry Meds', 'Zealthy', 'Remedy Meds', 'Found'],
    silo: 'Tax-Advantaged Payment Optimization',
    rarity: '< 14% of competitors',
    whyCovered: {
      strategicRationale: 'Using pre-tax Health Savings Accounts (HSA) or Flexible Spending Accounts (FSA) effectively reduces patient out-of-pocket costs by 20%–35% based on their tax bracket.',
      customerObjection: '"Can I use my employer HSA/FSA debit card to pay for compounded semaglutide?"',
      seoAdvantage: 'High commercial intent: "is semaglutide hsa eligible", "fsa approved telehealth weight loss", "letter of medical necessity weight loss".',
      conversionImpact: 'Transforms a perceived $249/mo expense into an attractive pre-tax medical expense, unlocking millions in employer health benefit funds.'
    },
    ongoRecommendation: {
      priority: 'P0',
      recommendation: 'Highlight HSA/FSA card acceptance on all pricing pages and build a dedicated page explaining how Ongo clinicians issue Letters of Medical Necessity.',
      suggestedSlug: '/pricing/hsa-fsa-eligibility-guide/'
    },
    sampleUrls: [
      'https://henrymeds.com/hsa-fsa'
    ]
  },
  {
    id: 'unique-bulk-supply',
    name: '3-Month Bulk Supply Vials: Volume Discount Pricing',
    urlPattern: '/3-month-supply or /bulk-pricing or /extended-vials',
    primaryBrands: ['SlimDown Rx', 'Balanced Hormone Health', 'Regenics'],
    silo: 'Bulk Volume & Unit Economics',
    rarity: '< 5% of competitors',
    whyCovered: {
      strategicRationale: 'Dispensing 3 vials at once saves on physician consultation overhead, cold-chain shipping costs, and packaging, allowing clinics to offer aggressive wholesale-like discounts.',
      customerObjection: '"Can I buy 3 months of tirzepatide upfront to save money and avoid monthly delivery delays?"',
      seoAdvantage: 'Dominates price-sensitive queries: "cheapest tirzepatide 3 month supply", "bulk compounded semaglutide vials", "save on glp-1 upfront".',
      conversionImpact: 'Dramatically accelerates cash flow and locks in customer retention for 90 days minimum.'
    },
    ongoRecommendation: {
      priority: 'P1',
      recommendation: 'Offer an optional 3-Month Commitment Plan alongside monthly billing for patients who want maximum cost savings.',
      suggestedSlug: '/pricing/3-month-bulk-supply/'
    },
    sampleUrls: [
      'https://slimdownrx.com/pricing'
    ]
  },
  {
    id: 'unique-bloodwork-integration',
    name: 'At-Home Biomarker & Metabolic Lab Panel Integration',
    urlPattern: '/lab-testing or /metabolic-panel or /quest-diagnostics',
    primaryBrands: ['LifeMD', 'Everlywell', 'Ro', 'PlushCare'],
    silo: 'Comprehensive Clinical Diagnostics',
    rarity: '< 16% of competitors',
    whyCovered: {
      strategicRationale: 'Validates HbA1c, fasting glucose, comprehensive metabolic panel (CMP), lipid panel, and thyroid function (TSH) before prescribing.',
      customerObjection: '"How does the doctor know my liver and kidneys are healthy enough for GLP-1 without bloodwork?"',
      seoAdvantage: 'Attracts health-conscious patients searching "bloodwork required for semaglutide", "comprehensive telehealth weight loss labs", "hba1c testing weight loss".',
      conversionImpact: 'Positions the brand as a legitimate doctor-led clinic rather than an aggressive pill mill, appealing to discerning patients.'
    },
    ongoRecommendation: {
      priority: 'P2',
      recommendation: 'Offer optional Quest Diagnostics / Labcorp partner bloodwork or allow patients to upload their recent annual physical labs.',
      suggestedSlug: '/medical/bloodwork-and-lab-testing/'
    },
    sampleUrls: [
      'https://lifemd.com/weight-loss/bloodwork'
    ]
  }
];
