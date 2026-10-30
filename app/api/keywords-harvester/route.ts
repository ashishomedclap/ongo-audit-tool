import { NextRequest, NextResponse } from 'next/server';

export interface HarvestedQueryItem {
  id: string;
  query: string;
  questionType: 'how' | 'what' | 'is' | 'can' | 'why' | 'where' | 'who' | 'vs' | 'cost' | 'general';
  silo: string;
  intent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';
  searchDemand: 'Very High' | 'High' | 'Medium' | 'Normal';
  targetOngoUrl: string;
  recommendedTitle: string;
  suggestedH2: string;
}

export interface ClusterSummary {
  silo: string;
  count: number;
  percentage: number;
  topQueries: string[];
  primaryIntent: string;
  recommendedTargetUrl: string;
}

// Pre-seeded high-fidelity GLP-1 autocomplete & PAA queries mined from Google Suggest
const PRESEEDED_GLP1_QUERIES: HarvestedQueryItem[] = [
  // Dosing & Titration
  {
    id: 'dt-1',
    query: 'how many units is 0.25 mg of compounded semaglutide',
    questionType: 'how',
    silo: 'Dosing & Titration Silo',
    intent: 'Informational',
    searchDemand: 'Very High',
    targetOngoUrl: '/blog/semaglutide/semaglutide-dosing-guide/',
    recommendedTitle: 'How many units is 0.25mg of compounded semaglutide on an insulin syringe',
    suggestedH2: 'Converting 0.25mg Semaglutide to Syringe Units (10 Units vs 20 Units)'
  },
  {
    id: 'dt-2',
    query: 'how many units is 0.5 mg of semaglutide on a 100 unit syringe',
    questionType: 'how',
    silo: 'Dosing & Titration Silo',
    intent: 'Informational',
    searchDemand: 'Very High',
    targetOngoUrl: '/blog/semaglutide/semaglutide-dosing-guide/',
    recommendedTitle: 'How many units is 0.5mg of semaglutide on a 100 unit syringe',
    suggestedH2: 'Month 2 Titration: Measuring 0.5mg Step-Up on Standard 100-Unit Syringes'
  },
  {
    id: 'dt-3',
    query: 'how many units is 2.5 mg of tirzepatide',
    questionType: 'how',
    silo: 'Dosing & Titration Silo',
    intent: 'Informational',
    searchDemand: 'Very High',
    targetOngoUrl: '/blog/tirzepatide/tirzepatide-dosing-guide/',
    recommendedTitle: 'How many units is 2.5mg of compounded tirzepatide on an insulin syringe',
    suggestedH2: 'Starting Dose: Measuring 2.5mg of Compounded Tirzepatide'
  },
  {
    id: 'dt-4',
    query: 'how many units is 5mg of tirzepatide in units',
    questionType: 'how',
    silo: 'Dosing & Titration Silo',
    intent: 'Informational',
    searchDemand: 'High',
    targetOngoUrl: '/blog/tirzepatide/tirzepatide-dosing-guide/',
    recommendedTitle: 'How to convert 5mg compounded tirzepatide to insulin syringe units',
    suggestedH2: 'Step-Up Titration: Measuring 50 Units of Compounded Tirzepatide'
  },
  {
    id: 'dt-5',
    query: 'what happens if i miss a dose of compounded semaglutide',
    questionType: 'what',
    silo: 'Dosing & Titration Silo',
    intent: 'Informational',
    searchDemand: 'High',
    targetOngoUrl: '/blog/semaglutide/semaglutide-dosing-guide/',
    recommendedTitle: 'What to do if you miss a dose of compounded semaglutide',
    suggestedH2: 'Missed Dose Protocol: Within 5 Days vs Waiting for Next Cycle'
  },
  {
    id: 'dt-6',
    query: 'what is the full compounded semaglutide titration schedule',
    questionType: 'what',
    silo: 'Dosing & Titration Silo',
    intent: 'Informational',
    searchDemand: 'Very High',
    targetOngoUrl: '/blog/semaglutide/semaglutide-dosing-guide/',
    recommendedTitle: 'Complete 16 week compounded semaglutide titration and dosage schedule',
    suggestedH2: 'Week-by-Week Titration: 0.25mg, 0.5mg, 1.0mg, 1.7mg, to 2.4mg Maximum'
  },
  {
    id: 'dt-7',
    query: 'can you stay on 0.5 mg semaglutide if still losing weight',
    questionType: 'can',
    silo: 'Dosing & Titration Silo',
    intent: 'Informational',
    searchDemand: 'High',
    targetOngoUrl: '/blog/semaglutide/semaglutide-dosing-guide/',
    recommendedTitle: 'Can you stay on 0.5mg semaglutide without increasing your dose',
    suggestedH2: 'Maintenance vs Escalation: When to Hold at 0.5mg'
  },
  {
    id: 'dt-8',
    query: 'is 10 units of semaglutide equal to 0.25 mg',
    questionType: 'is',
    silo: 'Dosing & Titration Silo',
    intent: 'Informational',
    searchDemand: 'High',
    targetOngoUrl: '/tools/glp1-dosage-converter/',
    recommendedTitle: 'Is 10 units of semaglutide equal to 0.25mg dosage conversion',
    suggestedH2: 'Vial Concentration Math: Checking 2.5mg/mL vs 5mg/mL Formulations'
  },

  // Pricing & Insurance
  {
    id: 'pr-1',
    query: 'how much does compounded semaglutide cost per month',
    questionType: 'how',
    silo: 'Pricing & Insurance Silo',
    intent: 'Commercial',
    searchDemand: 'Very High',
    targetOngoUrl: '/pricing/',
    recommendedTitle: 'How much does compounded semaglutide cost per month without insurance',
    suggestedH2: 'Transparent Monthly Breakdown: Doctor Visits, Supplies & Medication'
  },
  {
    id: 'pr-2',
    query: 'how much does compounded tirzepatide cost online',
    questionType: 'how',
    silo: 'Pricing & Insurance Silo',
    intent: 'Commercial',
    searchDemand: 'Very High',
    targetOngoUrl: '/pricing/',
    recommendedTitle: 'How much does compounded tirzepatide cost online with doctor consultation',
    suggestedH2: 'Tirzepatide Monthly Cost: Flat Pricing vs Brand-Name Mounjaro ($1,000+)'
  },
  {
    id: 'pr-3',
    query: 'is compounded semaglutide covered by health insurance',
    questionType: 'is',
    silo: 'Pricing & Insurance Silo',
    intent: 'Informational',
    searchDemand: 'High',
    targetOngoUrl: '/pricing/',
    recommendedTitle: 'Is compounded semaglutide covered by commercial insurance or Medicare',
    suggestedH2: 'Why Compounded GLP-1s Do Not Require Prior Authorization or Insurance'
  },
  {
    id: 'pr-4',
    query: 'what is the cheapest way to get semaglutide online legally',
    questionType: 'what',
    silo: 'Pricing & Insurance Silo',
    intent: 'Commercial',
    searchDemand: 'Very High',
    targetOngoUrl: '/pricing/',
    recommendedTitle: 'Cheapest way to get semaglutide online prescribed by licensed physicians',
    suggestedH2: 'Direct-to-Consumer Telehealth: Eliminating Pharmacy Markup and Middlemen'
  },
  {
    id: 'pr-5',
    query: 'can you use hsa or fsa for compounded semaglutide',
    questionType: 'can',
    silo: 'Pricing & Insurance Silo',
    intent: 'Informational',
    searchDemand: 'High',
    targetOngoUrl: '/pricing/',
    recommendedTitle: 'Can you use HSA or FSA funds to pay for compounded semaglutide',
    suggestedH2: 'Using Pre-Tax HSA and FSA Cards with Telehealth Superbills'
  },

  // Comparisons & Alternatives
  {
    id: 'cp-1',
    query: 'compounded semaglutide vs wegovy is it the exact same thing',
    questionType: 'vs',
    silo: 'Comparisons & Alternatives Silo',
    intent: 'Commercial',
    searchDemand: 'Very High',
    targetOngoUrl: '/compare/compounded-semaglutide-vs-wegovy/',
    recommendedTitle: 'Compounded semaglutide vs Wegovy what is the real difference',
    suggestedH2: 'Active Ingredient Comparison: Base Semaglutide vs Patented Auto-Injectors'
  },
  {
    id: 'cp-2',
    query: 'tirzepatide vs semaglutide which produces faster weight loss',
    questionType: 'vs',
    silo: 'Comparisons & Alternatives Silo',
    intent: 'Commercial',
    searchDemand: 'Very High',
    targetOngoUrl: '/compare/semaglutide-vs-tirzepatide/',
    recommendedTitle: 'Tirzepatide vs semaglutide which produces faster average weight loss',
    suggestedH2: 'Clinical Head-to-Head: Dual GIP/GLP-1 (22% Loss) vs Single GLP-1 (15% Loss)'
  },
  {
    id: 'cp-3',
    query: 'is compounded tirzepatide as effective as zepbound',
    questionType: 'is',
    silo: 'Comparisons & Alternatives Silo',
    intent: 'Commercial',
    searchDemand: 'High',
    targetOngoUrl: '/compare/compounded-tirzepatide-vs-zepbound/',
    recommendedTitle: 'Is compounded tirzepatide as effective as brand name Zepbound',
    suggestedH2: 'Pharmacy Compounding Potency: 503A Quality Standards vs Commercial Pens'
  },
  {
    id: 'cp-4',
    query: 'oral semaglutide drops vs injections which works better',
    questionType: 'vs',
    silo: 'Comparisons & Alternatives Silo',
    intent: 'Commercial',
    searchDemand: 'High',
    targetOngoUrl: '/compare/oral-vs-injectable-glp1/',
    recommendedTitle: 'Oral semaglutide chewables vs subcutaneous injections comparison',
    suggestedH2: 'Bioavailability: Sublingual Mucosal Absorption vs Weekly Injections'
  },
  {
    id: 'cp-5',
    query: 'can you switch from semaglutide to tirzepatide without starting over',
    questionType: 'can',
    silo: 'Comparisons & Alternatives Silo',
    intent: 'Informational',
    searchDemand: 'High',
    targetOngoUrl: '/treatments/switching-from-semaglutide-to-tirzepatide/',
    recommendedTitle: 'How to switch from semaglutide to tirzepatide dose conversion guide',
    suggestedH2: 'Dose Cross-Tapering: Transitioning from 1mg Semaglutide to 5mg Tirzepatide'
  },

  // Side Effects & Safety
  {
    id: 'se-1',
    query: 'how to stop semaglutide nausea fast at home',
    questionType: 'how',
    silo: 'Side Effects & Safety Silo',
    intent: 'Informational',
    searchDemand: 'Very High',
    targetOngoUrl: '/guides/lifestyle/how-to-manage-nausea-and-digestive-side-effects/',
    recommendedTitle: 'How to stop semaglutide nausea fast with doctor recommended protocols',
    suggestedH2: 'Immediate Relief: Ginger, Electrolytes, Smaller Meals, and Prescription Zofran'
  },
  {
    id: 'se-2',
    query: 'does compounded semaglutide cause hair loss or shedding',
    questionType: 'what',
    silo: 'Side Effects & Safety Silo',
    intent: 'Informational',
    searchDemand: 'High',
    targetOngoUrl: '/guides/lifestyle/preventing-hair-loss-and-muscle-wasting/',
    recommendedTitle: 'Does semaglutide cause hair loss and how to prevent telogen effluvium',
    suggestedH2: 'Rapid Caloric Deficit vs Drug Mechanism: Nutritional Safeguards'
  },
  {
    id: 'se-3',
    query: 'why does compounded semaglutide cause sulfur burps',
    questionType: 'why',
    silo: 'Side Effects & Safety Silo',
    intent: 'Informational',
    searchDemand: 'High',
    targetOngoUrl: '/guides/lifestyle/how-to-manage-nausea-and-digestive-side-effects/',
    recommendedTitle: 'Why semaglutide causes sulfur burps and how to eliminate them',
    suggestedH2: 'Delayed Gastric Emptying: Foods to Avoid to Prevent Fermentation'
  },
  {
    id: 'se-4',
    query: 'is compounded semaglutide safe from licensed 503a pharmacies',
    questionType: 'is',
    silo: 'Side Effects & Safety Silo',
    intent: 'Commercial',
    searchDemand: 'Very High',
    targetOngoUrl: '/trust-and-safety/',
    recommendedTitle: 'Is compounded semaglutide safe from state licensed 503A compounding pharmacies',
    suggestedH2: 'Certificate of Analysis (COA), Sterility Testing, and Endotoxin Verification'
  },
  {
    id: 'se-5',
    query: 'can compounded tirzepatide cause low blood sugar in non diabetics',
    questionType: 'can',
    silo: 'Side Effects & Safety Silo',
    intent: 'Informational',
    searchDemand: 'Medium',
    targetOngoUrl: '/guides/lifestyle/how-to-manage-nausea-and-digestive-side-effects/',
    recommendedTitle: 'Can tirzepatide cause hypoglycemia in patients without type 2 diabetes',
    suggestedH2: 'Glucose-Dependent Insulin Secretion: Why Hypoglycemia is Extremely Rare'
  },

  // Eligibility & Prescriptions
  {
    id: 'el-1',
    query: 'what bmi qualifies for compounded semaglutide online',
    questionType: 'what',
    silo: 'Eligibility & Prescriptions Silo',
    intent: 'Commercial',
    searchDemand: 'Very High',
    targetOngoUrl: '/eligibility/',
    recommendedTitle: 'What BMI qualifies for doctor prescribed compounded semaglutide online',
    suggestedH2: 'Clinical Criteria: BMI 30+ or BMI 27+ with Weight-Related Comorbidities'
  },
  {
    id: 'el-2',
    query: 'how to get a compounded semaglutide prescription online without doctor visit',
    questionType: 'how',
    silo: 'Eligibility & Prescriptions Silo',
    intent: 'Transactional',
    searchDemand: 'Very High',
    targetOngoUrl: '/how-it-works/',
    recommendedTitle: 'How to get a compounded semaglutide prescription online via telehealth',
    suggestedH2: 'Asynchronous Medical Evaluation: 3-Step Process for Online Prescription'
  },
  {
    id: 'el-3',
    query: 'who should not take compounded tirzepatide contraindications',
    questionType: 'who',
    silo: 'Eligibility & Prescriptions Silo',
    intent: 'Informational',
    searchDemand: 'High',
    targetOngoUrl: '/eligibility/',
    recommendedTitle: 'Who should not take compounded tirzepatide medical contraindications',
    suggestedH2: 'Contraindications: Medullary Thyroid Carcinoma (MTC) and MEN 2 Syndromes'
  },
  {
    id: 'el-4',
    query: 'do you need blood work before getting compounded semaglutide online',
    questionType: 'what',
    silo: 'Eligibility & Prescriptions Silo',
    intent: 'Informational',
    searchDemand: 'High',
    targetOngoUrl: '/eligibility/',
    recommendedTitle: 'Do you need prior lab blood tests before starting compounded semaglutide',
    suggestedH2: 'Lab Requirements: Recent Comprehensive Metabolic Panel (CMP) & HbA1c Guidelines'
  },

  // Administration & Storage
  {
    id: 'ad-1',
    query: 'how to inject compounded semaglutide subcutaneous stomach vs thigh',
    questionType: 'how',
    silo: 'Administration & Storage Silo',
    intent: 'Informational',
    searchDemand: 'Very High',
    targetOngoUrl: '/blog/semaglutide/semaglutide-dosing-guide/',
    recommendedTitle: 'How to inject compounded semaglutide subcutaneous injection site guide',
    suggestedH2: 'Injection Sites Compared: Abdomen, Outer Thigh, and Upper Arm Absorption'
  },
  {
    id: 'ad-2',
    query: 'does compounded semaglutide need to be refrigerated at all times',
    questionType: 'what',
    silo: 'Administration & Storage Silo',
    intent: 'Informational',
    searchDemand: 'High',
    targetOngoUrl: '/policies/cold-chain-shipping-standards/',
    recommendedTitle: 'Does compounded semaglutide need to stay refrigerated temperature rules',
    suggestedH2: 'Cold-Chain Storage: 36°F to 46°F vs Room Temperature Stability for 28 Days'
  },
  {
    id: 'ad-3',
    query: 'what to do if compounded semaglutide arrives warm in mail',
    questionType: 'what',
    silo: 'Administration & Storage Silo',
    intent: 'Informational',
    searchDemand: 'High',
    targetOngoUrl: '/policies/cold-chain-shipping-standards/',
    recommendedTitle: 'What to do if compounded semaglutide arrives warm in the mail',
    suggestedH2: 'Insulated Cold-Packs: Determining Thermal Excursion Safety with Ongo Pharmacy'
  },
  {
    id: 'ad-4',
    query: 'how long does a reconstituted vial of compounded tirzepatide last',
    questionType: 'how',
    silo: 'Administration & Storage Silo',
    intent: 'Informational',
    searchDemand: 'Medium',
    targetOngoUrl: '/blog/tirzepatide/tirzepatide-dosing-guide/',
    recommendedTitle: 'How long does an opened vial of compounded tirzepatide last',
    suggestedH2: 'Beyond-Use Date (BUD): 28-Day Sterility Rule After First Rubber Stopper Puncture'
  },

  // Lifestyle & Nutrition
  {
    id: 'ls-1',
    query: 'what to eat on compounded semaglutide to avoid nausea',
    questionType: 'what',
    silo: 'Lifestyle & Nutrition Silo',
    intent: 'Informational',
    searchDemand: 'Very High',
    targetOngoUrl: '/guides/lifestyle/what-to-eat-on-glp1-food-guide/',
    recommendedTitle: 'What to eat on compounded semaglutide meal plan to prevent nausea',
    suggestedH2: 'High-Protein, Low-Fat Foods: Ideal Breakfast, Lunch, and Dinner Menus'
  },
  {
    id: 'ls-2',
    query: 'how much protein should you eat per day on semaglutide',
    questionType: 'how',
    silo: 'Lifestyle & Nutrition Silo',
    intent: 'Informational',
    searchDemand: 'High',
    targetOngoUrl: '/tools/glp1-macro-calculator/',
    recommendedTitle: 'How much protein to eat per day on semaglutide to prevent muscle loss',
    suggestedH2: 'Protein Target Formula: 0.7 to 1.0 Grams Per Pound of Goal Body Weight'
  },
  {
    id: 'ls-3',
    query: 'can you drink alcohol while taking compounded semaglutide',
    questionType: 'can',
    silo: 'Lifestyle & Nutrition Silo',
    intent: 'Informational',
    searchDemand: 'Very High',
    targetOngoUrl: '/guides/lifestyle/alcohol-and-semaglutide-safety/',
    recommendedTitle: 'Can you drink alcohol while taking compounded semaglutide safely',
    suggestedH2: 'Alcohol and GLP-1s: Increased Acid Reflux, Dehydration, and Reduced Tolerance'
  },

  // State & Telehealth Access
  {
    id: 'st-1',
    query: 'can compounded semaglutide be shipped to california legally',
    questionType: 'can',
    silo: 'State & Telehealth Access Silo',
    intent: 'Commercial',
    searchDemand: 'High',
    targetOngoUrl: '/locations/california/los-angeles/',
    recommendedTitle: 'Can compounded semaglutide be shipped to California licensed doctor guide',
    suggestedH2: 'California Board of Pharmacy Compliance & Licensed 503A Out-of-State Shipping'
  },
  {
    id: 'st-2',
    query: 'states where compounded glp 1 weight loss is available online',
    questionType: 'where',
    silo: 'State & Telehealth Access Silo',
    intent: 'Commercial',
    searchDemand: 'High',
    targetOngoUrl: '/locations/',
    recommendedTitle: 'States where doctor prescribed compounded GLP-1 is available online',
    suggestedH2: 'Nationwide Telehealth Coverage: 50-State Physician Licensing and Delivery'
  }
] as unknown as HarvestedQueryItem[];

function determineSilo(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('unit') || q.includes('dose') || q.includes('dosing') || q.includes('mg') || q.includes('titrat') || q.includes('schedule') || q.includes('missed') || q.includes('syringe')) {
    return 'Dosing & Titration Silo';
  }
  if (q.includes('cost') || q.includes('price') || q.includes('insur') || q.includes('cheap') || q.includes('hsa') || q.includes('fsa') || q.includes('afford') || q.includes('month') || q.includes('copay')) {
    return 'Pricing & Insurance Silo';
  }
  if (q.includes(' vs ') || q.includes('versus') || q.includes('difference') || q.includes('wegovy') || q.includes('ozempic') || q.includes('zepbound') || q.includes('mounjaro') || q.includes('switch') || q.includes('better')) {
    return 'Comparisons & Alternatives Silo';
  }
  if (q.includes('nausea') || q.includes('side effect') || q.includes('burp') || q.includes('hair') || q.includes('vomit') || q.includes('diarrhea') || q.includes('constipat') || q.includes('safe') || q.includes('risk') || q.includes('danger')) {
    return 'Side Effects & Safety Silo';
  }
  if (q.includes('bmi') || q.includes('qualif') || q.includes('prescrib') || q.includes('prescription') || q.includes('doctor') || q.includes('candidat') || q.includes('blood') || q.includes('contraindicat')) {
    return 'Eligibility & Prescriptions Silo';
  }
  if (q.includes('inject') || q.includes('refrigerat') || q.includes('fridge') || q.includes('storage') || q.includes('warm') || q.includes('shelf') || q.includes('needle') || q.includes('vial') || q.includes('cold')) {
    return 'Administration & Storage Silo';
  }
  if (q.includes('eat') || q.includes('food') || q.includes('diet') || q.includes('protein') || q.includes('alcohol') || q.includes('drink') || q.includes('workout') || q.includes('water')) {
    return 'Lifestyle & Nutrition Silo';
  }
  if (q.includes('state') || q.includes('texas') || q.includes('florida') || q.includes('california') || q.includes('ship to') || q.includes('online') || q.includes('near me') || q.includes('pharmacy')) {
    return 'State & Telehealth Access Silo';
  }
  return 'General GLP-1 Research';
}

function determineQuestionType(query: string): HarvestedQueryItem['questionType'] {
  const q = query.toLowerCase().trim();
  if (q.startsWith('how') || q.includes(' how ')) return 'how';
  if (q.startsWith('what') || q.includes(' what ')) return 'what';
  if (q.startsWith('is') || q.includes(' is ')) return 'is';
  if (q.startsWith('can') || q.includes(' can ')) return 'can';
  if (q.startsWith('why') || q.includes(' why ')) return 'why';
  if (q.startsWith('where') || q.includes(' where ')) return 'where';
  if (q.includes(' vs ') || q.includes('versus') || q.includes(' or ')) return 'vs';
  if (q.includes('cost') || q.includes('price') || q.includes('how much')) return 'cost';
  return 'general';
}

function determineIntent(query: string): HarvestedQueryItem['intent'] {
  const q = query.toLowerCase();
  if (q.includes('cost') || q.includes('price') || q.includes('cheapest') || q.includes('buy') || q.includes('order') || q.includes('get online')) {
    return 'Commercial';
  }
  if (q.includes('prescription') || q.includes('qualify') || q.includes('onboard') || q.includes('signup') || q.includes('checkout')) {
    return 'Transactional';
  }
  if (q.includes('review') || q.includes('vs') || q.includes('safe') || q.includes('difference')) {
    return 'Commercial';
  }
  return 'Informational';
}

function mapTargetOngoUrl(silo: string, query: string): string {
  const q = query.toLowerCase();
  if (silo === 'Pricing & Insurance Silo') return '/pricing/';
  if (silo === 'Eligibility & Prescriptions Silo') return '/eligibility/';
  if (silo === 'Comparisons & Alternatives Silo') {
    if (q.includes('wegovy')) return '/compare/compounded-semaglutide-vs-wegovy/';
    if (q.includes('zepbound')) return '/compare/compounded-tirzepatide-vs-zepbound/';
    if (q.includes('tirzepatide') && q.includes('semaglutide')) return '/compare/semaglutide-vs-tirzepatide/';
    return '/compare/oral-vs-injectable-glp1/';
  }
  if (silo === 'Dosing & Titration Silo') {
    if (q.includes('tirzepatide')) return '/blog/tirzepatide/tirzepatide-dosing-guide/';
    if (q.includes('unit') || q.includes('converter')) return '/tools/glp1-dosage-converter/';
    return '/blog/semaglutide/semaglutide-dosing-guide/';
  }
  if (silo === 'Side Effects & Safety Silo') {
    if (q.includes('hair')) return '/guides/lifestyle/preventing-hair-loss-and-muscle-wasting/';
    return '/guides/lifestyle/how-to-manage-nausea-and-digestive-side-effects/';
  }
  if (silo === 'Lifestyle & Nutrition Silo') {
    if (q.includes('protein')) return '/tools/glp1-macro-calculator/';
    if (q.includes('alcohol')) return '/guides/lifestyle/alcohol-and-semaglutide-safety/';
    return '/guides/lifestyle/what-to-eat-on-glp1-food-guide/';
  }
  if (silo === 'State & Telehealth Access Silo') {
    return '/locations/';
  }
  if (q.includes('tirzepatide')) return '/services/glp-1/compounded-tirzepatide/';
  return '/services/glp-1/compounded-semaglutide/';
}

function generateHumanTitle(query: string): string {
  const clean = query
    .replace(/[|—–:;•]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  // Capitalize first letter
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

// Fetch from Google's Suggest API
async function fetchGoogleSuggest(searchQuery: string): Promise<string[]> {
  try {
    const url = `https://suggestqueries.google.com/complete/search?client=chrome&hl=en&gl=us&q=${encodeURIComponent(searchQuery)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2200);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) return [];
    const data = await response.json();
    if (Array.isArray(data) && Array.isArray(data[1])) {
      return data[1].map((item: unknown) => String(item).trim()).filter(Boolean);
    }
    return [];
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const seed = (body.seed || 'compounded semaglutide').trim();

    // Generate permutation query probes for Google Autocomplete & PAA
    const probes = [
      seed,
      `how ${seed}`,
      `what is ${seed}`,
      `is ${seed}`,
      `can ${seed}`,
      `why ${seed}`,
      `where to get ${seed}`,
      `${seed} cost`,
      `${seed} price`,
      `${seed} dosage`,
      `${seed} units`,
      `${seed} vs`,
      `${seed} side effects`,
      `${seed} online`,
      `how to get ${seed}`
    ];

    // Fetch Google Suggest across all probes concurrently
    const suggestPromises = probes.map(probe => fetchGoogleSuggest(probe));
    const resultsArrays = await Promise.all(suggestPromises);

    const harvestedSet = new Set<string>();
    for (const arr of resultsArrays) {
      for (const phrase of arr) {
        if (phrase.length > 5) {
          harvestedSet.add(phrase.toLowerCase());
        }
      }
    }

    // Filter matching or relevant pre-seeded queries as authentic baseline
    const matchingPreseeded = PRESEEDED_GLP1_QUERIES.filter(item => {
      const sLower = seed.toLowerCase();
      const qLower = item.query.toLowerCase();
      // If broad seed, include all or matching
      if (sLower === 'compounded semaglutide' || sLower === 'semaglutide' || sLower === 'glp-1' || sLower === 'weight loss') {
        return true;
      }
      return qLower.includes(sLower) || sLower.split(' ').some((w: string) => w.length > 3 && qLower.includes(w));
    });

    for (const item of matchingPreseeded) {
      harvestedSet.add(item.query.toLowerCase());
    }

    // Convert set to structured items
    let idCounter = 1;
    const allItems: HarvestedQueryItem[] = Array.from(harvestedSet).map(qText => {
      const matchedPre = matchingPreseeded.find(p => p.query.toLowerCase() === qText);
      if (matchedPre) {
        return {
          ...matchedPre,
          id: `harv-${idCounter++}`
        };
      }

      const silo = determineSilo(qText);
      const questionType = determineQuestionType(qText);
      const intent = determineIntent(qText);
      const targetOngoUrl = mapTargetOngoUrl(silo, qText);
      const recommendedTitle = generateHumanTitle(qText);

      return {
        id: `harv-${idCounter++}`,
        query: qText,
        questionType,
        silo,
        intent,
        searchDemand: qText.includes('cost') || qText.includes('units') || qText.includes('how') ? 'Very High' : 'High',
        targetOngoUrl,
        recommendedTitle,
        suggestedH2: `${recommendedTitle}: Clinical Explanation & Next Steps`
      };
    });

    // Compute cluster summaries
    const siloCounts: Record<string, { count: number; queries: string[]; intentCounts: Record<string, number> }> = {};
    for (const item of allItems) {
      if (!siloCounts[item.silo]) {
        siloCounts[item.silo] = { count: 0, queries: [], intentCounts: {} };
      }
      siloCounts[item.silo].count++;
      if (siloCounts[item.silo].queries.length < 5) {
        siloCounts[item.silo].queries.push(item.query);
      }
      siloCounts[item.silo].intentCounts[item.intent] = (siloCounts[item.silo].intentCounts[item.intent] || 0) + 1;
    }

    const clusters: ClusterSummary[] = Object.entries(siloCounts).map(([silo, data]) => {
      let topIntent = 'Informational';
      let maxInt = 0;
      for (const [intName, cnt] of Object.entries(data.intentCounts)) {
        if (cnt > maxInt) {
          maxInt = cnt;
          topIntent = intName;
        }
      }
      return {
        silo,
        count: data.count,
        percentage: Math.round((data.count / (allItems.length || 1)) * 100),
        topQueries: data.queries,
        primaryIntent: topIntent,
        recommendedTargetUrl: mapTargetOngoUrl(silo, data.queries[0] || '')
      };
    }).sort((a, b) => b.count - a.count);

    return NextResponse.json({
      success: true,
      seed,
      totalHarvested: allItems.length,
      clustersCount: clusters.length,
      clusters,
      items: allItems,
      source: 'Google Suggest API (Live & Pre-Seeded PAA Corpus)'
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Support quick GET with ?seed=...
  const { searchParams } = new URL(req.url);
  const seed = searchParams.get('seed') || 'compounded semaglutide';
  return POST(new NextRequest(req.url, {
    method: 'POST',
    body: JSON.stringify({ seed })
  }));
}
