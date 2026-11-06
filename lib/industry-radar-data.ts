export interface IndustryResource {
  id: string;
  name: string;
  url: string;
  domain: string;
  cadence: 'Daily Priority' | 'Weekly Strategy' | 'Monthly / Deep Dive';
  category: 'FDA & Compounding Law' | 'State Medical Boards' | 'FTC & Ad Compliance' | 'Clinical Research & NEJM' | 'Competitor Portals' | 'Biotech News';
  priorityLevel: 'P0 Critical' | 'P1 High' | 'P2 Routine';
  summary: string;
  whyCheck: string;
  actionTrigger: string;
  keyMetrics: string;
  badgeColor: string;
  badgeBg: string;
}

export const INDUSTRY_RADAR_RESOURCES: IndustryResource[] = [
  // ==========================================
  // FDA & COMPOUNDING LEGALITY (DAILY / WEEKLY)
  // ==========================================
  {
    id: 'fda-shortage-db',
    name: 'FDA Drug Shortages Database (GLP-1 APIs)',
    url: 'https://www.accessdata.fda.gov/scripts/drugshortages/default.cfm',
    domain: 'accessdata.fda.gov',
    cadence: 'Daily Priority',
    category: 'FDA & Compounding Law',
    priorityLevel: 'P0 Critical',
    summary: 'The United States FDA official public database tracking the active commercial shortage status of Semaglutide injection, Tirzepatide, and Dulaglutide.',
    whyCheck: 'Under FD&C Act Section 503A and 503B, compounding pharmacies are legally permitted to compound copies of commercially available drugs ONLY while on this official shortage list.',
    actionTrigger: 'If Semaglutide or Tirzepatide switches from "Currently in Shortage" to "Resolved", immediately alert medical leadership: pharmacies have a strict 60-day buffer to cease standard compounding and pivot to personalized clinical dosage modifications (e.g. B6/B12 peptide blends).',
    keyMetrics: 'Shortage Status • 60-Day Buffer Clock',
    badgeColor: '#dc2626',
    badgeBg: '#fee2e2'
  },
  {
    id: 'federal-register-fda',
    name: 'Federal Register: FDA Compounding Policy & GFI Updates',
    url: 'https://www.federalregister.gov/agencies/food-and-drug-administration',
    domain: 'federalregister.gov',
    cadence: 'Weekly Strategy',
    category: 'FDA & Compounding Law',
    priorityLevel: 'P0 Critical',
    summary: 'Official daily journal of the US Federal Government publishing FDA Guidance for Industry (GFI), draft rules on bulk drug substances, and 503A pharmacy inspections.',
    whyCheck: 'Surfaces federal policy shifts, warning letters against compounding salt forms (Semaglutide Sodium vs Base), and legal definitions of "essentially a copy".',
    actionTrigger: 'Review newly published warning letters and guidance; update Ongo clinical copy to explicitly guarantee pure Semaglutide base (never salt forms) from accredited 503A cleanrooms.',
    keyMetrics: 'Federal Notices • GFI Guidance Drafts',
    badgeColor: '#c2410c',
    badgeBg: '#ffedd5'
  },
  {
    id: 'apc-compounding-advocacy',
    name: 'Alliance for Pharmacy Compounding (APC) Briefings',
    url: 'https://a4pc.org/advocacy/',
    domain: 'a4pc.org',
    cadence: 'Weekly Strategy',
    category: 'FDA & Compounding Law',
    priorityLevel: 'P1 High',
    summary: 'The primary national advocacy organization representing 503A compounding pharmacists, tracking active federal lawsuits and legislative lobbying for compounded peptides.',
    whyCheck: 'Provides immediate legal breakdowns of compounding lawsuits (e.g., APC legal action against FDA shortage list removals and state pharmacy board inspections).',
    actionTrigger: 'Incorporate APC legal insights into Ongo\'s patient FAQ on compounding legitimacy, ensuring patient confidence remains rock-solid amid mainstream media scare stories.',
    keyMetrics: 'Court Injunctions • State Board Lobbying',
    badgeColor: '#b45309',
    badgeBg: '#fef3c7'
  },
  {
    id: 'usp-797-standards',
    name: 'USP <797> & <795> Sterile Compounding Compendium',
    url: 'https://www.usp.org/compounding/general-chapter-797',
    domain: 'usp.org',
    cadence: 'Monthly / Deep Dive',
    category: 'FDA & Compounding Law',
    priorityLevel: 'P1 High',
    summary: 'United States Pharmacopeia standards governing cleanroom air quality (ISO Class 5/7/8), beyond-use dating (BUD), and sterility testing for injectable vials.',
    whyCheck: 'Verifies that Ongo\'s partner 503A pharmacies follow the updated Nov 2023 USP <797> sterile compounding standards, including Category 2/3 multi-dose vial sterility rules.',
    actionTrigger: 'Audit partner 503A pharmacy certificates of analysis (CoA) against USP <797> beyond-use dates (45 days refrigerated) to feature transparent sterility guarantees on Ongo\'s medication pages.',
    keyMetrics: 'ISO Class 5 Air • 45-Day BUD Verification',
    badgeColor: '#15803d',
    badgeBg: '#dcfce7'
  },

  // ==========================================
  // STATE MEDICAL BOARDS & VIDEO RULES (WEEKLY)
  // ==========================================
  {
    id: 'fsmb-telehealth-regs',
    name: 'FSMB Telehealth Policies & Licensure Portals',
    url: 'https://www.fsmb.org/advocacy/telehealth/',
    domain: 'fsmb.org',
    cadence: 'Weekly Strategy',
    category: 'State Medical Boards',
    priorityLevel: 'P0 Critical',
    summary: 'Federation of State Medical Boards (FSMB) comprehensive tracker monitoring physician cross-state licensure compacts and state-by-state telehealth executive orders.',
    whyCheck: 'Tracks state law changes regarding synchronous video mandates versus asynchronous online medical questionnaires.',
    actionTrigger: 'If a targeted state modifies its telehealth rule to require real-time synchronous video (e.g., California or Mississippi), automatically route patients from that ZIP code to Ongo\'s video scheduling queue.',
    keyMetrics: '50-State Tracker • Video vs Async Mandates',
    badgeColor: '#2563eb',
    badgeBg: '#dbeafe'
  },
  {
    id: 'california-medical-board',
    name: 'Medical Board of California Telehealth Enforcement',
    url: 'https://www.mbc.ca.gov/Licensing/Physicians-and-Surgeons/Telehealth.aspx',
    domain: 'mbc.ca.gov',
    cadence: 'Weekly Strategy',
    category: 'State Medical Boards',
    priorityLevel: 'P0 Critical',
    summary: 'California regulations for physician-patient relationships established via telehealth for controlled and non-controlled prescription therapies.',
    whyCheck: 'California represents 12%+ of all US GLP-1 telehealth demand but enforces aggressive scrutiny on asynchronous prescribing and physician supervision.',
    actionTrigger: 'Verify Ongo\'s California medical director licensure and patient consent flow complies with MBC rules to capitalize on competitors who exclude California.',
    keyMetrics: 'California Telehealth Code • MD Oversight',
    badgeColor: '#1d4ed8',
    badgeBg: '#eff6ff'
  },
  {
    id: 'texas-medical-board',
    name: 'Texas Medical Board (TMB) Telemedicine Portal',
    url: 'https://www.tmb.state.tx.us/page/telemedicine-information',
    domain: 'tmb.state.tx.us',
    cadence: 'Monthly / Deep Dive',
    category: 'State Medical Boards',
    priorityLevel: 'P1 High',
    summary: 'Texas administrative rules for telehealth prescribing, physician delegation to nurse practitioners (NPs), and sterile medication shipping into Texas.',
    whyCheck: 'Texas requires explicit physician supervision protocols (Chapter 174) and annual prescription monitoring reporting.',
    actionTrigger: 'Verify Ongo\'s Texas-licensed physician protocols and display Texas licensing credentials on `/locations/texas/` to rank in Texas search results.',
    keyMetrics: 'TMB Chapter 174 • NP Delegation Protocols',
    badgeColor: '#4338ca',
    badgeBg: '#e0e7ff'
  },

  // ==========================================
  // FTC & ADVERTISING COMPLIANCE (WEEKLY)
  // ==========================================
  {
    id: 'ftc-telehealth-enforcement',
    name: 'FTC Health & Telehealth Enforcement Actions',
    url: 'https://www.ftc.gov/news-events/topics/health-care',
    domain: 'ftc.gov',
    cadence: 'Weekly Strategy',
    category: 'FTC & Ad Compliance',
    priorityLevel: 'P0 Critical',
    summary: 'Federal Trade Commission enforcement releases targeting subscription auto-renew dark patterns, surprise consultation fees, and deceptive weight loss claims.',
    whyCheck: 'The FTC recently fined major telehealth platforms millions for hiding mandatory monthly membership fees and making it difficult for patients to cancel.',
    actionTrigger: 'Enforce Ongo\'s transparent $179 flat-rate pricing guarantee: No hidden doctor fees, 1-click easy pause/cancel, and prominent refund terms on all pricing and landing pages.',
    keyMetrics: 'ROSCA Compliance • Subscription Transparency',
    badgeColor: '#b91c1c',
    badgeBg: '#fee2e2'
  },
  {
    id: 'legitscript-certification',
    name: 'LegitScript Telehealth & Pharmacy Certification',
    url: 'https://www.legitscript.com/certification/healthcare-merchants/',
    domain: 'legitscript.com',
    cadence: 'Monthly / Deep Dive',
    category: 'FTC & Ad Compliance',
    priorityLevel: 'P1 High',
    summary: 'The sole compliance certification recognized by Google, Meta, and major credit card networks for advertising prescription telehealth services.',
    whyCheck: 'Maintains Ongo\'s eligibility to run paid acquisition campaigns on Google Search and Instagram while guaranteeing merchant payment processing stability.',
    actionTrigger: 'Review partner pharmacy certification status and display LegitScript compliance badges prominently in Ongo\'s website footer.',
    keyMetrics: 'Google Ads Eligibility • Merchant Stability',
    badgeColor: '#059669',
    badgeBg: '#dcfce7'
  },
  {
    id: 'google-health-ad-policy',
    name: 'Google Ads Healthcare & Medicines Policy Updates',
    url: 'https://support.google.com/adspolicy/answer/176036',
    domain: 'support.google.com',
    cadence: 'Monthly / Deep Dive',
    category: 'FTC & Ad Compliance',
    priorityLevel: 'P2 Routine',
    summary: 'Google Ads restricted drug terms, prescription drug manufacturer and online pharmacy advertiser certification guidelines.',
    whyCheck: 'Surfaces keyword terms (e.g. "Ozempic", "Wegovy", "Mounjaro") that trigger immediate ad disapproval or trademark policy restrictions.',
    actionTrigger: 'Align organic and paid landing pages to focus on generic clinical terms ("compounded semaglutide", "GLP-1 medical program") to safeguard advertising accounts.',
    keyMetrics: 'Prescription Ad Certification • Trademark Rules',
    badgeColor: '#475569',
    badgeBg: '#f1f5f9'
  },

  // ==========================================
  // CLINICAL RESEARCH & NEJM (WEEKLY / MONTHLY)
  // ==========================================
  {
    id: 'nejm-step-trials',
    name: 'The New England Journal of Medicine (NEJM) GLP-1 Research',
    url: 'https://www.nejm.org/search?q=semaglutide+weight+loss',
    domain: 'nejm.org',
    cadence: 'Weekly Strategy',
    category: 'Clinical Research & NEJM',
    priorityLevel: 'P0 Critical',
    summary: 'The premier peer-reviewed medical journal publishing landmark Phase III GLP-1 trials: STEP 1-8 (Semaglutide), SURMOUNT 1-4 (Tirzepatide), and the SELECT Cardiovascular Trial.',
    whyCheck: 'Supplies the verified clinical statistics (e.g., 14.9% mean weight loss at 68 weeks with Semaglutide, 20.9% with Tirzepatide, 20% reduction in MACE events).',
    actionTrigger: 'Cite exact NEJM DOIs in Ongo\'s clinical articles (`/resources/glp-1/clinical-studies/`), linking from blog posts to build unbeatable Google Medical E-E-A-T authority.',
    keyMetrics: 'Phase III Trial Data • PubMed & DOI Citations',
    badgeColor: '#047857',
    badgeBg: '#d1fae5'
  },
  {
    id: 'clinical-trials-glp1-pipeline',
    name: 'ClinicalTrials.gov: Next-Gen Incretin & Obesity Pipelines',
    url: 'https://clinicaltrials.gov/search?cond=Obesity&intr=GLP-1',
    domain: 'clinicaltrials.gov',
    cadence: 'Weekly Strategy',
    category: 'Clinical Research & NEJM',
    priorityLevel: 'P1 High',
    summary: 'The US National Institutes of Health (NIH) global registry of active clinical studies tracking next-gen dual/triple agonists (Retatrutide, CagriSema, Oral Amycretin).',
    whyCheck: 'Allows Ongo to predict the next wave of patient search demand 6-12 months before commercial FDA approval.',
    actionTrigger: 'Use Tool #3 (Competitor Gap) to publish early informational explainers on upcoming therapies (e.g., "Retatrutide vs Tirzepatide") to capture #1 organic rankings before competitors.',
    keyMetrics: 'Active NIH Protocols • Triple Agonist Pipeline',
    badgeColor: '#0891b2',
    badgeBg: '#cffafe'
  },
  {
    id: 'jama-diabetes-glp1',
    name: 'JAMA Internal Medicine & Network Open: GLP-1 Clinical Safety',
    url: 'https://jamanetwork.com/searchresults?q=GLP-1+receptor+agonists',
    domain: 'jamanetwork.com',
    cadence: 'Monthly / Deep Dive',
    category: 'Clinical Research & NEJM',
    priorityLevel: 'P1 High',
    summary: 'Peer-reviewed studies focusing on long-term safety, lean muscle mass retention, micro-dosing protocols, and gastrointestinal side-effect management.',
    whyCheck: 'Provides the clinical evidence needed to write comprehensive side-effect mitigation guides (protein intake, electrolyte hydration, dosage titration curves).',
    actionTrigger: 'Incorporate JAMA clinical hydration and protein recommendations directly into Ongo\'s patient onboarding books and nutrition guides.',
    keyMetrics: 'Muscle Preservation Studies • Titration Evidence',
    badgeColor: '#6366f1',
    badgeBg: '#e0e7ff'
  },

  // ==========================================
  // TOP COMPETITOR LIVE PORTALS (DAILY / WEEKLY)
  // ==========================================
  {
    id: 'mochi-health-portal',
    name: 'Mochi Health (`mochihealth.com`) Live Portal',
    url: 'https://www.joinmochi.com/',
    domain: 'joinmochi.com',
    cadence: 'Daily Priority',
    category: 'Competitor Portals',
    priorityLevel: 'P0 Critical',
    summary: 'Primary volume competitor offering flat-rate compounded Semaglutide and Tirzepatide with an active Reddit/TikTok patient community.',
    whyCheck: 'Monitors Mochi\'s pricing adjustments ($79/mo subscription + medication), pharmacy fulfillment partners (Aequita), and website conversion funnels.',
    actionTrigger: 'Highlight Ongo\'s transparent flat-rate model ($179 flat, NO separate doctor subscription fee) to win price-sensitive patients comparing Ongo against Mochi.',
    keyMetrics: 'Flat-Rate Pricing • Aequita Pharmacy Fulfilment',
    badgeColor: '#0284c7',
    badgeBg: '#e0f2fe'
  },
  {
    id: 'ro-body-portal',
    name: 'Ro Body Program (`ro.co/weight-loss/`)',
    url: 'https://ro.co/weight-loss/',
    domain: 'ro.co',
    cadence: 'Weekly Strategy',
    category: 'Competitor Portals',
    priorityLevel: 'P0 Critical',
    summary: 'The largest venture-backed digital health brand in obesity, offering both branded GLP-1 insurance concierge and compounded Semaglutide options.',
    whyCheck: 'Inspect Ro\'s insurance prior authorization concierge flow, lab testing integrations, and high-converting marketing copywriting.',
    actionTrigger: 'Benchmark Ongo\'s onboarding quiz against Ro Body\'s intake UI to streamline Ongo\'s patient consultation form.',
    keyMetrics: 'Insurance Concierge • Prior Auth Funnel',
    badgeColor: '#7c3aed',
    badgeBg: '#ede9fe'
  },
  {
    id: 'henry-meds-portal',
    name: 'Henry Meds (`henrymeds.com`)',
    url: 'https://henrymeds.com/',
    domain: 'henrymeds.com',
    cadence: 'Daily Priority',
    category: 'Competitor Portals',
    priorityLevel: 'P0 Critical',
    summary: 'Leading compounded GLP-1 telehealth brand famous for transparent all-inclusive $297/mo pricing and oral sublingual tablets.',
    whyCheck: 'Tracks Henry Meds\' oral GLP-1 positioning and their 50-state synchronous video scheduling system.',
    actionTrigger: 'Compare Ongo\'s $179 Semaglutide price directly against Henry Meds\' $297 price in marketing comparisons to win organic comparison searches.',
    keyMetrics: '$297 Baseline Price • Oral Sublingual Positioning',
    badgeColor: '#059669',
    badgeBg: '#dcfce7'
  },
  {
    id: 'orderly-meds-portal',
    name: 'OrderlyMeds (`orderlymeds.com`)',
    url: 'https://orderlymeds.com/',
    domain: 'orderlymeds.com',
    cadence: 'Weekly Strategy',
    category: 'Competitor Portals',
    priorityLevel: 'P1 High',
    summary: 'Competitor with flat-rate pricing regardless of dosage increase ($249 Semaglutide / $399 Tirzepatide) using asynchronous text-based intake.',
    whyCheck: 'Monitors how Orderly handles high-dose titrations without price hikes, a major patient conversion friction point.',
    actionTrigger: 'Replicate transparent no-dose-hike messaging across Ongo\'s pricing tier tables.',
    keyMetrics: 'Flat Max-Dose Pricing • Text Consult Model',
    badgeColor: '#d97706',
    badgeBg: '#fef3c7'
  },
  {
    id: 'hims-weightloss-portal',
    name: 'Hims & Hers Weight Loss (`forhims.com/weight-loss`)',
    url: 'https://www.forhims.com/weight-loss',
    domain: 'forhims.com',
    cadence: 'Weekly Strategy',
    category: 'Competitor Portals',
    priorityLevel: 'P1 High',
    summary: 'Public telehealth titan (NYSE: HIMS) scaling compounded Semaglutide at massive commercial volume with personalized oral kits.',
    whyCheck: 'Inspect Hims\' public quarterly financial metrics, customer acquisition costs (CAC), and pharmacy supply chain announcements.',
    actionTrigger: 'Study Hims\' lifestyle-first branding and physician-led credibility cues to incorporate into Ongo\'s social and editorial content.',
    keyMetrics: 'Public SEC Filings • Lifestyle Brand Power',
    badgeColor: '#475569',
    badgeBg: '#f1f5f9'
  },
  {
    id: 'ivim-health-portal',
    name: 'Ivím Health (`ivimhealth.com`)',
    url: 'https://www.ivimhealth.com/',
    domain: 'ivimhealth.com',
    cadence: 'Weekly Strategy',
    category: 'Competitor Portals',
    priorityLevel: 'P1 High',
    summary: 'Telehealth clinic known for 3-month Jumpstart Kits and bundled peptide add-ons (Lipolean, B12, Glutathione).',
    whyCheck: 'Tracks multi-month upfront discount pricing models and adjunct wellness injection cross-sells.',
    actionTrigger: 'Evaluate introducing 3-month commitment packages on Ongo to increase 90-day Customer Lifetime Value (LTV).',
    keyMetrics: '3-Month Jumpstart Kits • Peptide Cross-Sells',
    badgeColor: '#9333ea',
    badgeBg: '#f3e8ff'
  },

  // ==========================================
  // BIOTECH NEWS & TELEHEALTH INTEL (DAILY)
  // ==========================================
  {
    id: 'endpoints-glp1-feed',
    name: 'Endpoints News: Obesity & GLP-1 Biopharma Feed',
    url: 'https://endpts.com/tag/obesity/',
    domain: 'endpts.com',
    cadence: 'Daily Priority',
    category: 'Biotech News',
    priorityLevel: 'P0 Critical',
    summary: 'Top pharmaceutical trade journal breaking daily insider scoops on Novo Nordisk, Eli Lilly, FDA manufacturing plant inspections, and patent lawsuits.',
    whyCheck: 'Gives 24-48 hour early warning on pharmaceutical supply chain disruptions, FDA inspection results, and biopharma earnings commentary.',
    actionTrigger: 'When Endpoints reports factory inspection delays or supply bottlenecks for branded Ozempic/Wegovy, immediately launch targeted content highlighting compounding availability.',
    keyMetrics: 'Supply Chain Breaking News • Patent Litigation',
    badgeColor: '#e11d48',
    badgeBg: '#ffe4e6'
  },
  {
    id: 'fierce-healthcare-telehealth',
    name: 'Fierce Healthcare: Digital Health & Telehealth Policy',
    url: 'https://www.fiercehealthcare.com/telehealth',
    domain: 'fiercehealthcare.com',
    cadence: 'Daily Priority',
    category: 'Biotech News',
    priorityLevel: 'P0 Critical',
    summary: 'Leading healthcare business daily covering federal telehealth reimbursement, DEA telemedicine flexibilities, and health system partnership trends.',
    whyCheck: 'Keeps Ongo ahead of federal legislative deadlines (e.g. Congressional telehealth flexibilities and Ryan Haight Act telemedicine waivers).',
    actionTrigger: 'Ensure Ongo\'s clinical operations align with federal telehealth flexibilities well ahead of annual congressional extension votes.',
    keyMetrics: 'DEA Telemedicine Rules • Federal Reimbursement',
    badgeColor: '#0284c7',
    badgeBg: '#e0f2fe'
  },
  {
    id: 'stat-news-pharmalot',
    name: 'STAT News: Pharmalot (Ed Silverman) Pharmaceutical Radar',
    url: 'https://www.statnews.com/pharmalot/',
    domain: 'statnews.com',
    cadence: 'Weekly Strategy',
    category: 'Biotech News',
    priorityLevel: 'P1 High',
    summary: 'Award-winning investigative biopharma reporting covering drug pricing controversies, compounding litigation, and FDA regulatory politics.',
    whyCheck: 'Unfiltered, deeply sourced analysis of pharmaceutical lobbying and state pharmacy board regulatory fights.',
    actionTrigger: 'Use investigative insights to craft thought leadership articles published by Ongo\'s medical directors.',
    keyMetrics: 'Investigative Reporting • Drug Pricing Analysis',
    badgeColor: '#ea580c',
    badgeBg: '#ffedd5'
  },
  {
    id: 'rock-health-market-intel',
    name: 'Rock Health: Digital Health Consumer & Market Insights',
    url: 'https://rockhealth.com/insights/',
    domain: 'rockhealth.com',
    cadence: 'Monthly / Deep Dive',
    category: 'Biotech News',
    priorityLevel: 'P2 Routine',
    summary: 'Venture and market research consultancy publishing quarterly benchmarks on consumer digital health adoption, retention, and telehealth spending.',
    whyCheck: 'Provides consumer demographic benchmarks: average patient age, willingness to pay out-of-pocket, and telehealth retention rates.',
    actionTrigger: 'Compare Ongo\'s patient retention metrics (churn, renewal rates) against national benchmarks to tune customer support and automated check-in sequences.',
    keyMetrics: 'Consumer Adoption Trends • Out-of-Pocket Willingness',
    badgeColor: '#475569',
    badgeBg: '#f1f5f9'
  }
];

export function getResourcesByCadence(cadence: string) {
  if (cadence === 'all') return INDUSTRY_RADAR_RESOURCES;
  return INDUSTRY_RADAR_RESOURCES.filter(r => r.cadence === cadence);
}

export function getResourcesByCategory(category: string) {
  if (category === 'all') return INDUSTRY_RADAR_RESOURCES;
  return INDUSTRY_RADAR_RESOURCES.filter(r => r.category === category);
}
