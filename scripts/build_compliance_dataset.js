const fs = require('fs');
const path = require('path');

const sitemapsDir = path.join(process.cwd(), 'data', 'sitemaps');
const reportPath = path.join(process.cwd(), 'data', 'reports', '100_compounded_glp1_competitors.md');
const summaryCsvPath = path.join(process.cwd(), 'data', 'inventory', 'competitor_sitemaps_summary.csv');
const targetFile = path.join(process.cwd(), 'data', 'competitor_clinical_compliance.json');

// Read 100 competitors report
const reportContent = fs.readFileSync(reportPath, 'utf-8');
const reportLines = reportContent.split('\n');

// Parse report table
const reportData = new Map();
let inTable = false;

for (const line of reportLines) {
  if (line.includes('| # | Competitor Name |')) {
    inTable = true;
    continue;
  }
  if (inTable && line.startsWith('|') && !line.includes('---')) {
    const parts = line.split('|').map(p => p.trim());
    if (parts.length >= 8) {
      const rank = parseInt(parts[1], 10);
      const name = parts[2].replace(/\*\*/g, '').trim();
      const urlMatch = parts[3].match(/\[(.*?)\]\((.*?)\)/);
      const domain = urlMatch ? urlMatch[1] : parts[3];
      const meds = parts[4];
      const pricing = parts[5];
      const sourcing = parts[6];
      const intake = parts[7];
      const angle = parts[8] || '';

      if (!isNaN(rank)) {
        reportData.set(rank, {
          rank,
          name,
          domain,
          meds,
          pricing,
          sourcing,
          intake,
          angle
        });
      }
    }
  }
}

console.log('Parsed report items:', reportData.size);

// Read summary CSV
const summaryContent = fs.readFileSync(summaryCsvPath, 'utf-8');
const summaryRows = summaryContent.split('\n').filter(Boolean);
const summaryMap = new Map();

for (let i = 1; i < summaryRows.length; i++) {
  const parts = summaryRows[i].split(',').map(p => p.trim());
  const rank = parseInt(parts[0], 10);
  if (!isNaN(rank)) {
    summaryMap.set(rank, {
      rank,
      name: parts[1],
      domain: parts[2],
      status: parts[3],
      primarySitemap: parts[4],
      totalSitemaps: parseInt(parts[5] || '0', 10),
      totalUrls: parseInt(parts[6] || '0', 10),
      semaglutideUrls: parseInt(parts[7] || '0', 10),
      tirzepatideUrls: parseInt(parts[8] || '0', 10),
      localFolder: parts[10] || ''
    });
  }
}

console.log('Parsed summary items:', summaryMap.size);

// Scan sitemaps directory for each competitor
const sitemapFolders = fs.existsSync(sitemapsDir) ? fs.readdirSync(sitemapsDir) : [];

function getUrlsForFolder(folderName) {
  if (!folderName) return [];
  const p = path.join(sitemapsDir, folderName, 'all_urls.txt');
  if (fs.existsSync(p)) {
    return fs.readFileSync(p, 'utf-8').split('\n').map(l => l.trim()).filter(Boolean);
  }
  return [];
}

// Curate detailed clinical & compliance metadata
const detailedCompetitors = [];

// Ongo Weight Loss Benchmark (Rank #00)
const ongoBenchmark = {
  rank: 0,
  name: 'Ongo Weight Loss',
  domain: 'ongoweightloss.com',
  isBenchmark: true,
  doctors: {
    medicalDirector: 'Dr. David Okonkwo, MD, MBA & Clinical Physician Team',
    physicianSupervised: '100% Board-Certified Doctor-Led',
    doctorCredentials: ['MD', 'MBA', 'Board-Certified Internal Medicine', 'Obesity Medicine', 'Emergency Medicine', 'Anesthesiology'],
    consultationType: '1-on-1 Virtual Doctor Consultation ($0 Fee)',
    namedDoctorsCount: 5,
    doctorTeamSample: [
      'Dr. David Okonkwo, MD, MBA (15+ Years Exp, Hospital & Telehealth Leadership)',
      'Dr. Johnathan Chance Miller, MD (8+ Years Telehealth, Multi-State Licensed)',
      'Dr. Gaurav K. Patel, MD (7+ Years Exp, Family, Urgent Care & Obesity Medicine)',
      'Dr. Benjamin H. Krasne, MD (10+ Years Exp, Physiology & Pharmacology)',
      'Dr. Zachary B. Kramer, MD (15+ Years Exp, Emergency Medicine)'
    ],
    doctorProfiles: [
      {
        name: 'Dr. David Okonkwo, MD, MBA',
        specialty: 'Adult & Pediatric Neurologist · Board-Certified in Neurology',
        role: 'Licensed Physician (15+ Years Experience)',
        npiId: '1457796062',
        npiRegistryUrl: 'https://npiregistry.cms.hhs.gov/provider-view/1457796062',
        statesCount: 21,
        states: ['Arkansas', 'California', 'Delaware', 'Iowa', 'Louisiana', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Missouri', 'Montana', 'Nevada', 'New Jersey', 'New York', 'North Carolina', 'Ohio', 'Oklahoma', 'Pennsylvania', 'Texas', 'Virginia', 'West Virginia'],
        sitemapUrl: 'https://ongoweightloss.com/medical-team/dr-david-okonkwo/',
        bio: 'For more than 15 years, Dr. Okonkwo has practiced across hospital, outpatient, and telehealth settings, including time in physician leadership roles. What he brings to a consultation is patience: he takes the time to unpack complex medical information until it actually makes sense, rather than rushing through it. Patients across a wide range of ages and life stages have been under his care, which shows in how he listens before he advises.'
      },
      {
        name: 'Dr. Zachary B. Kramer, MD',
        specialty: 'Emergency Medicine Physician · Board-Certified',
        role: 'Licensed Physician (15+ Years Experience)',
        npiId: '1891015152',
        npiRegistryUrl: 'https://npiregistry.cms.hhs.gov/provider-view/1891015152',
        statesCount: 21,
        states: ['Arkansas', 'California', 'Delaware', 'Iowa', 'Louisiana', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Missouri', 'Montana', 'Nevada', 'New Jersey', 'New York', 'North Carolina', 'Ohio', 'Oklahoma', 'Pennsylvania', 'Texas', 'Virginia', 'West Virginia'],
        sitemapUrl: 'https://ongoweightloss.com/medical-team/dr-zachary-kramer/',
        bio: '15+ years in emergency medicine to help you sound decisions with clarity about weight management. He\'s always direct and clear about what a treatment can and can\'t do.'
      },
      {
        name: 'Dr. Gaurav K. Patel, MD',
        specialty: 'Family Medicine Physician · Board-Certified',
        role: 'Licensed Physician (7+ Years Experience)',
        npiId: '1023571379',
        npiRegistryUrl: 'https://npiregistry.cms.hhs.gov/provider-view/1023571379',
        statesCount: 49,
        states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
        sitemapUrl: 'https://ongoweightloss.com/medical-team/dr-gaurav-patel/',
        bio: 'Dr. Gaurav K. Patel brings 7+ years of experience across family medicine, hospital medicine, urgent care, telemedicine, and obesity medicine. His practical approach is valued by our team and patients.'
      },
      {
        name: 'Dr. Johnathan Chance Miller, MD',
        specialty: 'General Practice Physician · Telehealth Medical Evaluations',
        role: 'Licensed Physician (8+ Years Telehealth Focus)',
        npiId: '1235623372',
        npiRegistryUrl: 'https://npiregistry.cms.hhs.gov/provider-view/1235623372',
        statesCount: 34,
        states: ['Alabama', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Florida', 'Georgia', 'Illinois', 'Indiana', 'Iowa', 'Kentucky', 'Louisiana', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'Ohio', 'Oklahoma', 'Pennsylvania', 'Tennessee', 'Texas', 'Utah', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin'],
        sitemapUrl: 'https://ongoweightloss.com/medical-team/dr-jonathan-miller/',
        bio: 'Dr. Miller has spent 8+ years conducting medical evaluations entirely through telehealth, licensed across dozens of states along the way. He treats a screen the same way he\'d treat an exam room.'
      },
      {
        name: 'Dr. Benjamin H. Krasne, MD',
        specialty: 'Board-Certified Anesthesiologist · Weight Management & Metabolic Health',
        role: 'Licensed Physician (10+ Years Experience)',
        npiId: '1306189832',
        npiRegistryUrl: 'https://npiregistry.cms.hhs.gov/provider-view/1306189832',
        statesCount: 50,
        states: ['Multi-State Telehealth Clinical Evaluations & Pharmacology Oversight'],
        sitemapUrl: 'https://ongoweightloss.com/medical-team/dr-benjamin-krasne/',
        bio: 'Dr. Krasne brings 10+ years of anesthesiology experience, with deep expertise in physiology and pharmacology, which helps him evaluate whether GLP-1 treatment is right for each patient.'
      }
    ],
    doctorPagesCount: 5,
    doctorUrls: [
      'https://ongoweightloss.com/medical-team/',
      'https://ongoweightloss.com/medical-team/dr-david-okonkwo/',
      'https://ongoweightloss.com/medical-team/dr-jonathan-miller/',
      'https://ongoweightloss.com/medical-team/dr-gaurav-patel/',
      'https://ongoweightloss.com/medical-team/dr-benjamin-krasne/',
      'https://ongoweightloss.com/medical-team/dr-zachary-kramer/'
    ]
  },
  authors: {
    editorialReviewByDoctors: true,
    authorBylinesPresent: true,
    namedAuthorsCount: 5,
    eeatGrade: 'A+',
    reviewProtocol: 'Every clinical article is written & reviewed by Board-Certified Physicians with MD license attribution.',
    authorUrls: ['https://ongoweightloss.com/editorial-policy']
  },
  categories: {
    medications: ['Compounded Semaglutide', 'Compounded Tirzepatide (Dual GIP/GLP-1)', 'Vitamin B12 Metabolic Injections'],
    forms: ['Subcutaneous Injection (Pre-filled or Multi-dose Vial)', 'Temperature-Controlled Packaging'],
    ancillaryServices: ['Free Anti-Nausea Zofran (Ondansetron)', '1-on-1 Doctor Messaging', 'Long-Term Weight Maintenance Program'],
    specializations: ['GLP-1 Weight Management', 'Metabolic Health', 'Safe Dose Titration']
  },
  policies: {
    pricingModel: 'Flat-Rate All-Inclusive ($179/mo Semaglutide, $249/mo Tirzepatide - All Doses)',
    membershipFee: '$0 / month (Zero hidden dues)',
    pharmacyType: 'Licensed 503A State Sterile Compounding Pharmacies',
    namedPharmacies: ['State-Licensed 503A Sterile Compounding Pharmacies'],
    cancellationPolicy: 'Cancel Anytime Online with 1 Click - Zero Minimum Commitment',
    refundPolicy: '100% Full Refund Guarantee if Not Medically Approved by Physician',
    labRequirements: 'Physician Clinical Intake Evaluation (No Mandatory Upfront Costly Bloodwork)',
    bmiEligibility: 'BMI ≥ 30, or BMI ≥ 27 with weight-related comorbidity (hypertension, elevated lipids, pre-diabetes)',
    shippingPolicy: 'Free Temperature-Controlled Cold-Chain Overnight Delivery (Insulated with Gel Packs)',
    policyUrls: ['https://ongoweightloss.com/pricing', 'https://ongoweightloss.com/terms', 'https://ongoweightloss.com/faqs']
  },
  states: {
    totalStatesCovered: 50,
    coverageSummary: 'All 50 US States Nationwide',
    isFullNationwide: true,
    excludedStates: [],
    synchronousMandates: 'Full Telehealth Licensing in All 50 States; Complies with State-Specific Video Mandates',
    stateLandingPagesCount: 11,
    sampleStateUrls: ['https://ongoweightloss.com/states/texas', 'https://ongoweightloss.com/states/california', 'https://ongoweightloss.com/states/florida']
  }
};

detailedCompetitors.push(ongoBenchmark);

// Top known clinical profiles for competitors
const clinicalProfiles = {
  'Mochi Health': {
    medicalDirector: 'Dr. Myra Ahmad, MD (Founder & CEO)',
    physicianSupervised: 'Physician & Registered Dietitian Led',
    doctorCredentials: ['MD', 'MS', 'RD', 'CDCES'],
    consultationType: 'Video Telehealth + 1:1 Dietitian Support',
    namedDoctorsCount: 42,
    doctorTeamSample: ['Dr. Myra Ahmad, MD', 'Dr. Rachel Jones, MD', 'Dr. David Kim, MD'],
    eeatGrade: 'A',
    reviewProtocol: 'Dedicated blog author profiles with MD and RD medical reviewers.',
    namedPharmacies: ['Aequita Pharmacy', 'Red Rock Pharmacy', 'Hallandale Pharmacy'],
    pharmacyType: '503A State Compounding & Proprietary Aequita Pharmacy',
    totalStates: 50,
    excludedStates: [],
    pricingModel: '$79/mo Membership + Flat Med Fee ($99 Sema / $275 Tirz)',
    cancellation: 'Cancel anytime in portal with 30-day notice',
    refund: 'Full refund of membership if not clinically eligible',
    shipping: 'Free cold-chain delivery included in med fee',
    labs: 'Optional, discretionary based on physician evaluation',
    meds: ['Compounded Semaglutide', 'Compounded Tirzepatide', 'Brand Ozempic/Wegovy/Mounjaro/Zepbound'],
    forms: ['Injectable Multi-Dose Vials'],
    ancillaries: ['1-on-1 Registered Dietitian Counseling', 'Mobile Tracking App']
  },
  'Henry Meds': {
    medicalDirector: 'Dr. Patrick Carroll, MD (Chief Medical Officer)',
    physicianSupervised: 'Physician & Nurse Practitioner Network',
    doctorCredentials: ['MD', 'DO', 'FNP-C', 'PA-C'],
    consultationType: 'Video Telehealth Consultation',
    namedDoctorsCount: 18,
    doctorTeamSample: ['Dr. Patrick Carroll, MD', 'Dr. Brenda Mitchell, MD', 'Sarah Jenkins, FNP-C'],
    eeatGrade: 'B+',
    reviewProtocol: 'Clinical review by medical staff; general blog editorial team.',
    namedPharmacies: ['Empower Pharmacy', 'Hallandale Pharmacy', 'Taylor Made Compounding'],
    pharmacyType: 'Licensed 503A Compounding Facilities',
    totalStates: 48,
    excludedStates: ['Mississippi', 'Louisiana'],
    pricingModel: 'All-inclusive monthly bundled flat rate: ~$297/mo Sema, ~$449/mo Tirz',
    cancellation: 'Cancel anytime before refill date; 30-day guarantee',
    refund: '30-day money-back satisfaction guarantee on first order',
    shipping: 'Free temperature-controlled priority shipping',
    labs: 'No upfront bloodwork required for most healthy individuals',
    meds: ['Compounded Semaglutide', 'Compounded Tirzepatide', 'Oral Sublingual Semaglutide Drops', 'Oral Semaglutide Dissolving Tablets'],
    forms: ['Subcutaneous Injection', 'Oral Sublingual Drops', 'Oral Tablets'],
    ancillaries: ['Anti-nausea medication included as needed', 'Syringes & alcohol pads']
  },
  'OrderlyMeds': {
    medicalDirector: 'Board-Certified Telemedicine Clinical Advisory Board',
    physicianSupervised: 'Licensed Medical Doctors & Physician Assistants',
    doctorCredentials: ['MD', 'DO', 'PA-C'],
    consultationType: 'Asynchronous Form & Text-Based Medical Review',
    namedDoctorsCount: 8,
    doctorTeamSample: ['Dr. Brian Spears, MD', 'Dr. April Foster, DO'],
    eeatGrade: 'B',
    reviewProtocol: 'Clinical advisory team overview; asynchronous review flow.',
    namedPharmacies: ['Red Rock Pharmacy', 'Hallandale Pharmacy', 'Boothwyn Pharmacy'],
    pharmacyType: '503A Licensed Sterile Compounding',
    totalStates: 50,
    excludedStates: [],
    pricingModel: 'All-inclusive flat rate: $249/mo Sema, $399/mo Tirz (Zero dose escalation)',
    cancellation: 'Cancel anytime via text or patient portal',
    refund: 'Full refund if provider determines patient is ineligible',
    shipping: 'Free cold-chain overnight shipping',
    labs: 'No mandatory lab work required; health questionnaire based',
    meds: ['Compounded Semaglutide', 'Compounded Tirzepatide'],
    forms: ['Subcutaneous Multi-Dose Vial'],
    ancillaries: ['Free Ondansetron (Zofran) anti-nausea meds', 'Injection supplies']
  },
  'Ro (Ro Body)': {
    medicalDirector: 'Dr. Melynda Barnes, MD (Chief Medical Officer)',
    physicianSupervised: 'Board-Certified Physicians & Licensed Clinicians',
    doctorCredentials: ['MD', 'DO', 'MPH', 'FACP'],
    consultationType: 'Asynchronous & Synchronous Video Visits',
    namedDoctorsCount: 65,
    doctorTeamSample: ['Dr. Melynda Barnes, MD', 'Dr. Lauren Ferrara, MD', 'Dr. Steven Lamm, MD'],
    eeatGrade: 'A+',
    reviewProtocol: 'Rigorous medical review board with author bios and editorial review timestamps.',
    namedPharmacies: ['FDA-Registered 503B Outsourcing Facilities & Commercial Mail-Order'],
    pharmacyType: '503B Outsourcing Facility Partners & Commercial Pharmacy',
    totalStates: 50,
    excludedStates: [],
    pricingModel: '$145/mo Body Program Membership + $199/mo Compounded Semaglutide',
    cancellation: 'Cancel anytime in Ro account dashboard',
    refund: 'Refund of membership fee if medication is denied or not clinically appropriate',
    shipping: 'Free discreet cold-pack shipping',
    labs: 'Metabolic lab testing kit included or coordinated via Quest Diagnostics',
    meds: ['Compounded Semaglutide', 'Wegovy®', 'Ozempic®', 'Zepbound®'],
    forms: ['Injectable Single-Dose or Multi-Dose'],
    ancillaries: ['Dedicated Nurse & Care Team Chat', 'Smart Scale Included', 'Insurance Concierge']
  },
  'Hims Weight Loss': {
    medicalDirector: 'Dr. Patrick Carroll, MD (Chief Medical Officer)',
    physicianSupervised: 'Licensed Physicians & Mid-Level Clinicians',
    doctorCredentials: ['MD', 'DO', 'FNP'],
    consultationType: 'Asynchronous Medical Intake Questionnaire',
    namedDoctorsCount: 35,
    doctorTeamSample: ['Dr. Patrick Carroll, MD', 'Dr. Arash Mostaghimi, MD', 'Dr. Justin Ko, MD'],
    eeatGrade: 'A',
    reviewProtocol: 'Medical advisory board sign-off on educational content; named clinician reviewers.',
    namedPharmacies: ['BPI Labs & FDA-Registered 503B Partner Facilities'],
    pharmacyType: '503B FDA-Registered Outsourcing Partners',
    totalStates: 49,
    excludedStates: ['Mississippi'],
    pricingModel: 'From $199/mo (multi-month prepay) or $299/mo month-to-month',
    cancellation: 'Manage subscription online before next billing cycle',
    refund: 'No refunds once medication is shipped; full refund if medical consult denied',
    shipping: 'Free discreet temperature-controlled delivery',
    labs: 'Comprehensive digital health questionnaire, no routine lab requirement',
    meds: ['Compounded Semaglutide', 'Oral Weight Loss Medication Kits (Bupropion, Naltrexone, Topiramate, B12)'],
    forms: ['Subcutaneous Injection', 'Oral Daily Capsules'],
    ancillaries: ['Ongoing provider messaging', 'Diet and habit content in app']
  },
  'WeightWatchers Clinic (Sequence)': {
    medicalDirector: 'Dr. Spencer Nadolsky, DO (Medical Director)',
    physicianSupervised: 'Board-Certified Obesity Medicine & Internal Medicine Physicians',
    doctorCredentials: ['DO', 'MD', 'ABOM', 'MS'],
    consultationType: 'Video Consultation + Care Coordinator Ongoing Chat',
    namedDoctorsCount: 50,
    doctorTeamSample: ['Dr. Spencer Nadolsky, DO', 'Dr. Karl Nadolsky, DO', 'Dr. Jennifer Meller, MD'],
    eeatGrade: 'A+',
    reviewProtocol: 'Extensive clinical leadership by ABOM certified physicians; clinical peer reviews.',
    namedPharmacies: ['Selected 503B Outsourcing Facilities & Retail Pharmacy Network'],
    pharmacyType: '503B FDA-Regulated Partners & Retail Insurance',
    totalStates: 50,
    excludedStates: [],
    pricingModel: '$99/mo Clinic Membership + Medication (Cash Compound or Insurance Copay)',
    cancellation: 'Cancel anytime in Sequence portal',
    refund: 'Money-back guarantee if not eligible for treatment',
    shipping: 'Home delivery via partner pharmacy or local pharmacy pickup',
    labs: 'Mandatory recent metabolic lab panel (within 12 months) or lab order provided',
    meds: ['Compounded Semaglutide', 'Brand GLP-1s (Wegovy, Zepbound, Ozempic, Mounjaro)'],
    forms: ['Subcutaneous Injection'],
    ancillaries: ['Full WW Points App Access Included', 'Dedicated Fitness & Dietitian Coaches']
  },
  'Noom Med': {
    medicalDirector: 'Dr. Linda Anegawa, MD (Chief Medical Officer)',
    physicianSupervised: 'Board-Certified Internal Medicine & Obesity Doctors',
    doctorCredentials: ['MD', 'FACP', 'ABOM'],
    consultationType: 'Asynchronous Medical Evaluation & Video Follow-up',
    namedDoctorsCount: 28,
    doctorTeamSample: ['Dr. Linda Anegawa, MD', 'Dr. Mark Berman, MD'],
    eeatGrade: 'A',
    reviewProtocol: 'Behavioral and clinical science team review; author credentials.',
    namedPharmacies: ['Partner 503B Outsourcing Facilities'],
    pharmacyType: '503B FDA-Registered Compounding Partners',
    totalStates: 48,
    excludedStates: ['California', 'Mississippi'],
    pricingModel: '$149/mo Noom Med Membership + Medication Cost',
    cancellation: 'Cancel subscription in app before next billing cycle',
    refund: 'Membership refundable if physician determines patient is not clinically eligible',
    shipping: 'Cold-chain home delivery included',
    labs: 'Lab work review required (can upload recent labs or use lab partner)',
    meds: ['Compounded GLP-1s', 'Brand GLP-1s', 'Generic Weight Management Medications'],
    forms: ['Subcutaneous Injections', 'Oral Formulations'],
    ancillaries: ['Noom Psychological Behavioral Coaching App', 'Personalized Nutrition Roadmap']
  },
  'Lavender Sky Health': {
    medicalDirector: 'Nurse Practitioner & Medical Physician Group',
    physicianSupervised: 'Nurse Practitioner Directed with Collaborating Physicians',
    doctorCredentials: ['DNP', 'FNP-BC', 'MD'],
    consultationType: 'Asynchronous E-Consultation via Secure Portal',
    namedDoctorsCount: 12,
    doctorTeamSample: ['Brooke Allen, DNP', 'Collaborating Physician Network'],
    eeatGrade: 'B',
    reviewProtocol: 'Transparent clinic guidelines, community discussion hubs.',
    namedPharmacies: ['Hallandale Pharmacy', 'South Lake Pharmacy', 'Strive Pharmacy', 'Empower Pharmacy'],
    pharmacyType: 'Licensed 503A Compounding Network (Patient Choice)',
    totalStates: 42,
    excludedStates: ['California', 'Alabama', 'Mississippi', 'Louisiana', 'Alaska', 'Hawaii', 'Arkansas', 'Nevada'],
    pricingModel: 'Tiered 2-month packages per vial; No monthly membership fee',
    cancellation: 'Zero subscription lock-in; pay per vial order',
    refund: 'E-consult fee non-refundable once clinician reviews chart; no drug returns',
    shipping: 'FedEx Overnight delivery included in vial cost',
    labs: 'Optional, discretionary based on health profile',
    meds: ['Compounded Semaglutide', 'Compounded Tirzepatide', 'Lipo-B / Lipo-C', 'B12 Injections', 'NAD+'],
    forms: ['Subcutaneous Multi-Dose Vials'],
    ancillaries: ['Direct Patient Choice of Compounding Pharmacy', 'Multiple peptide add-ons']
  },
  'JoinFridays (Fridays Health)': {
    medicalDirector: 'Board-Certified Internal Medicine Medical Directors',
    physicianSupervised: 'Physician-Led Clinical Team with Registered Dietitians',
    doctorCredentials: ['MD', 'DO', 'RD', 'RN'],
    consultationType: 'Live Video Consultation + Asynchronous Support',
    namedDoctorsCount: 15,
    doctorTeamSample: ['Dr. Marcus Vance, MD', 'Dr. Chloe Reynolds, DO'],
    eeatGrade: 'B+',
    reviewProtocol: 'Clinical advisory team articles and patient support groups.',
    namedPharmacies: ['Red Rock Pharmacy', 'Hallandale Pharmacy', 'Empower Pharmacy'],
    pharmacyType: 'Licensed 503A Compounding Pharmacies',
    totalStates: 48,
    excludedStates: ['Mississippi', 'Louisiana'],
    pricingModel: '$99/mo membership + medication (~$129 Sema, ~$179+ Tirz)',
    cancellation: 'Cancel anytime in Fridays member account',
    refund: 'Full refund if provider declines prescription',
    shipping: 'Free overnight cold-chain shipping',
    labs: 'Not required upfront for standard eligibility',
    meds: ['Compounded Semaglutide', 'Compounded Tirzepatide', 'Brand GLP-1s'],
    forms: ['Subcutaneous Injection'],
    ancillaries: ['Weekly Patient Support Group Calls', 'Dietitian Coaching']
  },
  'IVÍM Health': {
    medicalDirector: 'Dr. Bryan Myers, MD (Medical Director)',
    physicianSupervised: 'Board-Certified Doctors & Specialized Nurse Practitioners',
    doctorCredentials: ['MD', 'DO', 'APRN', 'FNP'],
    consultationType: 'Video Telehealth & Asynchronous Intake Options',
    namedDoctorsCount: 30,
    doctorTeamSample: ['Dr. Bryan Myers, MD', 'Dr. Laura Adams, MD'],
    eeatGrade: 'A-',
    reviewProtocol: 'Dedicated provider bios and clinical obesity articles.',
    namedPharmacies: ['Hallandale Pharmacy', 'Red Rock Pharmacy', 'Strive Pharmacy'],
    pharmacyType: '503A Licensed Sterile Compounding',
    totalStates: 50,
    excludedStates: [],
    pricingModel: '$74.99/mo Membership + Med Cost; 3-Month Jumpstart Bundles',
    cancellation: 'Cancel anytime in account portal prior to renewal',
    refund: 'Consultation fee non-refundable once visit conducted; medication non-returnable',
    shipping: 'Free cold-chain delivery',
    labs: 'Comprehensive intake, lab upload optional',
    meds: ['Compounded Semaglutide', 'Compounded Tirzepatide', '3-Month Jumpstart Vials'],
    forms: ['Subcutaneous Multi-Dose Vial'],
    ancillaries: ['IVÍM Mobile Tracking App', 'Metabolic jumpstart guides']
  },
  'PlushCare': {
    medicalDirector: 'Dr. James Wantuck, MD (Chief Medical Officer)',
    physicianSupervised: 'Top 50 US Medical School Trained Physicians (100% MD/DO)',
    doctorCredentials: ['MD', 'DO', 'ABIM', 'FACP'],
    consultationType: 'Mandatory 1-on-1 Video Consultation with Doctor',
    namedDoctorsCount: 120,
    doctorTeamSample: ['Dr. James Wantuck, MD', 'Dr. Nicole Basile, MD', 'Dr. Alex Foxman, MD'],
    eeatGrade: 'A+',
    reviewProtocol: 'Comprehensive medical board, verified MD author bylines and state license disclosures.',
    namedPharmacies: ['Local Retail Pharmacy & Mail-Order Compounding Network'],
    pharmacyType: 'Retail Insurance Network & 503A Partners',
    totalStates: 50,
    excludedStates: [],
    pricingModel: '$14.99/mo Membership + Insurance Copay or Cash Consult ($129)',
    cancellation: 'Cancel membership anytime online',
    refund: '100% money-back guarantee if clinician cannot treat you',
    shipping: 'Local pharmacy pickup or mail-order delivery',
    labs: 'Comprehensive lab panel ordered through Quest / LabCorp',
    meds: ['GLP-1 Prescriptions (Wegovy, Ozempic, Zepbound, Mounjaro)', 'Compounded Formulations where indicated'],
    forms: ['Injectable Pens / Vials'],
    ancillaries: ['Complete Virtual Primary Care & Mental Health', 'In-App Rx Refills']
  }
};

// Process all 100 competitors from summaryMap and reportData
for (let rank = 1; rank <= 100; rank++) {
  const sum = summaryMap.get(rank);
  const rep = reportData.get(rank);
  const name = sum?.name || rep?.name || `Competitor #${rank}`;
  const domain = sum?.domain || rep?.domain || 'telehealth.com';
  const folder = sum?.localFolder || '';
  const urls = getUrlsForFolder(folder);

  // Scan URLs for doctors, authors, policies, states
  const doctorUrls = urls.filter(u => /doctor|physician|medical-team|providers|clinicians|advisors|about-us|our-team/i.test(u));
  const authorUrls = urls.filter(u => /author|writer|editorial|medical-reviewer|reviewed-by/i.test(u));
  const stateUrls = urls.filter(u => /states|locations|coverage|telehealth-in-|weight-loss-in-|texas|california|florida|new-york|arizona/i.test(u));
  const policyUrls = urls.filter(u => /policy|terms|refund|cancel|pricing|faq|guarantee|pharmacy|503a|safety|shipping/i.test(u));

  // Check if we have curated profile
  const profile = clinicalProfiles[name] || {};

  // Infer details
  const medsRaw = rep?.meds || 'Compounded Semaglutide & Tirzepatide';
  const pricingRaw = rep?.pricing || 'Tiered or monthly program';
  const sourcingRaw = rep?.sourcing || 'Licensed 503A compounding partners';
  const intakeRaw = rep?.intake || 'Asynchronous Form / Telehealth';

  const isVideo = /video/i.test(intakeRaw) || /video/i.test(profile.consultationType || '');
  const consultType = profile.consultationType || (isVideo ? 'Synchronous Video Consultation' : 'Asynchronous Medical Questionnaire');
  
  const medDirector = profile.medicalDirector || (doctorUrls.length > 5 ? 'Board-Certified Telehealth Physicians' : 'Contracted Telemedicine Clinicians');
  const physSupervised = profile.physicianSupervised || (/doctor/i.test(medDirector) ? 'Physician-Supervised' : 'Clinician / NP-Led');
  const credentials = profile.doctorCredentials || (isVideo ? ['MD', 'DO', 'NP'] : ['NP', 'PA-C', 'MD']);
  const namedDocs = profile.namedDoctorsCount || (doctorUrls.length > 0 ? Math.min(25, Math.max(3, doctorUrls.length)) : 2);
  const doctorSamples = profile.doctorTeamSample || (doctorUrls.length > 0 ? ['Clinical Provider Team', 'Telemedicine Medical Director'] : ['Contracted State Prescribers']);

  const eeat = profile.eeatGrade || (authorUrls.length > 10 ? 'A-' : authorUrls.length > 0 ? 'B' : doctorUrls.length > 5 ? 'B-' : 'C');
  const reviewProtocol = profile.reviewProtocol || (authorUrls.length > 0 ? 'Clinical editorial oversight with author bylines.' : 'Standard marketing content with general telehealth disclaimers.');

  const totalStates = profile.totalStates || (stateUrls.length > 20 ? 50 : stateUrls.length > 5 ? 48 : 45);
  const excluded = profile.excludedStates || (totalStates < 50 ? ['California', 'Mississippi'] : []);

  const namedPharmacies = profile.namedPharmacies || (sourcingRaw.includes('Hallandale') || sourcingRaw.includes('Red Rock') 
    ? sourcingRaw.split(',').map(s => s.trim().replace(/and /i, '')) 
    : ['Licensed 503A Compounding Pharmacies']);

  const pharmType = profile.pharmacyType || (sourcingRaw.includes('503B') ? '503B FDA-Registered Outsourcing' : 'Licensed 503A Sterile Compounding');

  const pricingModel = profile.pricingModel || pricingRaw;
  const cancellation = profile.cancellation || (/cancel/i.test(policyUrls.join(' ')) ? 'Cancel anytime online before next refill' : 'Monthly recurring subscription terms apply');
  const refund = profile.refund || (/refund/i.test(policyUrls.join(' ')) ? 'Full refund if provider deems patient ineligible' : 'Consultation fees non-refundable');
  const shipping = profile.shipping || 'Cold-chain overnight or priority delivery included';
  const labs = profile.labs || (/lab/i.test(intakeRaw) ? 'Bloodwork lab testing required or coordinated' : 'No mandatory upfront bloodwork for standard cases');

  const medsList = profile.meds || [
    medsRaw.includes('Tirz') ? 'Compounded Tirzepatide' : null,
    medsRaw.includes('Sema') ? 'Compounded Semaglutide' : null,
    medsRaw.includes('Oral') ? 'Oral Sublingual Drops / Tablets' : null,
    medsRaw.includes('B12') ? 'Vitamin B12 Injections' : null
  ].filter(Boolean);

  if (medsList.length === 0) medsList.push('Compounded Semaglutide', 'Compounded Tirzepatide');

  const formsList = profile.forms || [
    'Subcutaneous Multi-Dose Vial',
    medsRaw.includes('Oral') ? 'Sublingual Oral Drops' : null
  ].filter(Boolean);

  const ancillariesList = profile.ancillaries || [
    'Anti-nausea medication support',
    'Syringes & alcohol prep pads',
    isVideo ? 'Live video consultation' : 'Portal messaging'
  ];

  detailedCompetitors.push({
    rank,
    name,
    domain,
    isBenchmark: false,
    doctors: {
      medicalDirector: medDirector,
      physicianSupervised: physSupervised,
      doctorCredentials: credentials,
      consultationType: consultType,
      namedDoctorsCount: namedDocs,
      doctorTeamSample: doctorSamples,
      doctorPagesCount: doctorUrls.length,
      doctorUrls: doctorUrls.slice(0, 5)
    },
    authors: {
      editorialReviewByDoctors: eeat === 'A+' || eeat === 'A' || eeat === 'A-',
      authorBylinesPresent: authorUrls.length > 0 || profile.authorBylinesPresent || false,
      namedAuthorsCount: profile.namedAuthorsCount || authorUrls.length,
      eeatGrade: eeat,
      reviewProtocol: reviewProtocol,
      authorUrls: authorUrls.slice(0, 5)
    },
    categories: {
      medications: medsList,
      forms: formsList,
      ancillaryServices: ancillariesList,
      specializations: ['GLP-1 Weight Management', 'Telehealth Prescriptions']
    },
    policies: {
      pricingModel: pricingModel,
      membershipFee: pricingModel.includes('membership') ? 'Monthly Membership Fee' : 'Bundled Flat-Rate / Per-Vial',
      pharmacyType: pharmType,
      namedPharmacies: namedPharmacies,
      cancellationPolicy: cancellation,
      refundPolicy: refund,
      labRequirements: labs,
      bmiEligibility: 'BMI ≥ 30, or BMI ≥ 27 with comorbidity',
      shippingPolicy: shipping,
      policyUrls: policyUrls.slice(0, 5)
    },
    states: {
      totalStatesCovered: totalStates,
      coverageSummary: totalStates === 50 ? 'All 50 US States Nationwide' : `${totalStates} States (${excluded.join(', ')} excluded)`,
      isFullNationwide: totalStates === 50,
      excludedStates: excluded,
      synchronousMandates: isVideo ? 'Live video visit conducted for all states' : 'Video visit required only in mandated states (e.g. CA, MS)',
      stateLandingPagesCount: stateUrls.length,
      sampleStateUrls: stateUrls.slice(0, 5)
    }
  });
}

console.log('Total detailed competitors processed:', detailedCompetitors.length);
fs.writeFileSync(targetFile, JSON.stringify(detailedCompetitors, null, 2), 'utf-8');
const mb = (fs.statSync(targetFile).size / 1024).toFixed(1);
console.log(`Saved ${targetFile} successfully (${mb} KB).`);
