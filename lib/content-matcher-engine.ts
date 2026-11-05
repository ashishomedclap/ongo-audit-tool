export interface IntentBreakdown {
  informational: number; // Percentage 0 - 100
  commercial: number;    // Percentage 0 - 100
  transactional: number; // Percentage 0 - 100
  trust: number;         // Percentage 0 - 100
  primaryIntent: 'Informational' | 'Commercial' | 'Transactional' | 'Trust & E-E-A-T';
  analysisSummary: string;
  recommendation: string;
}

export interface ContentChecklistItem {
  id: string;
  category: 'keywords' | 'structure' | 'meta' | 'links' | 'eeat';
  title: string;
  status: 'pass' | 'warning' | 'fail';
  value: string;
  recommendation: string;
  importance: 'Critical' | 'High' | 'Medium';
}

export interface CompetitorBenchmarkPage {
  id: string;
  competitorName: string;
  topic: string;
  url: string;
  title: string;
  wordCount: number;
  bulletCount: number;
  headingsCount: number;
  internalLinksCount: number;
  primaryKeywords: string[];
  keyTopicsCovered: string[];
  intent: 'Informational' | 'Commercial' | 'Transactional' | 'Trust & E-E-A-T';
  pros: string;
  missingInOngo: string;
}

export interface HeadToHeadComparison {
  ongoMetrics: {
    wordCount: number;
    bulletCount: number;
    headingsCount: number;
    internalLinksCount: number;
    readingEase: string;
    keywordCoveragePct: number;
  };
  competitorMetrics: {
    name: string;
    url: string;
    wordCount: number;
    bulletCount: number;
    headingsCount: number;
    internalLinksCount: number;
    readingEase: string;
    keywordCoveragePct: number;
  };
  topicsGap: {
    competitorHas: string[];
    ongoHas: string[];
    missingInOngo: string[];
  };
  executiveVerdict: string;
}

// 12 Curated Head-to-Head Competitor Benchmarks
export const COMPETITOR_BENCHMARK_PAGES: CompetitorBenchmarkPage[] = [
  {
    id: 'mochi-semaglutide',
    competitorName: 'Mochi Health',
    topic: 'Compounded Semaglutide Medication Guide',
    url: 'https://joinmochi.com/semaglutide',
    title: 'Compounded Semaglutide Online Prescriptions | Mochi Health',
    wordCount: 1840,
    bulletCount: 14,
    headingsCount: 12,
    internalLinksCount: 18,
    primaryKeywords: ['compounded semaglutide', 'glp-1 injection', 'monthly cost', 'physician consultation', 'dosage schedule'],
    keyTopicsCovered: [
      'Titration dosage chart (0.25mg to 2.4mg)',
      'Nausea management with Vitamin B6',
      'Dietitian 1-on-1 coaching',
      'Flat rate subscription pricing ($79 + $99)'
    ],
    intent: 'Commercial',
    pros: 'Clear 4-week titration ladder and transparent monthly pricing',
    missingInOngo: 'Dietitian integration and B6 nausea co-prescription details'
  },
  {
    id: 'ro-semaglutide',
    competitorName: 'Ro Body',
    topic: 'Semaglutide Weight Loss Program & Insurance Concierge',
    url: 'https://ro.co/weight-loss/semaglutide/',
    title: 'Semaglutide for Weight Loss | Ro Body Program',
    wordCount: 2450,
    bulletCount: 22,
    headingsCount: 16,
    internalLinksCount: 24,
    primaryKeywords: ['semaglutide prescription', 'insurance coverage', 'glp 1 clinic', 'weight health', 'metabolic test'],
    keyTopicsCovered: [
      'Insurance concierge pre-authorization',
      'At-home metabolic diagnostic blood test',
      'Monthly provider check-ins',
      'Brand Wegovy vs Compounded alternative'
    ],
    intent: 'Commercial',
    pros: 'High-converting interactive insurance eligibility checker',
    missingInOngo: 'Lab diagnostic requisition guidance and insurance denial support'
  },
  {
    id: 'henry-tirzepatide',
    competitorName: 'Henry Meds',
    topic: 'Compounded Tirzepatide Injections & Oral Drops',
    url: 'https://henrymeds.com/glp-1/tirzepatide/',
    title: 'Compounded Tirzepatide Online | Henry Meds',
    wordCount: 1620,
    bulletCount: 16,
    headingsCount: 10,
    internalLinksCount: 14,
    primaryKeywords: ['compounded tirzepatide', 'gip glp-1', 'sublingual drops', 'no hidden fees', 'dual agonist'],
    keyTopicsCovered: [
      'Dual GIP/GLP-1 receptor mechanism',
      'Injectable vs Sublingual oral drops options',
      'Telehealth physician synchronous video review',
      '30-day money-back guarantee'
    ],
    intent: 'Commercial',
    pros: 'Offers alternative oral sublingual formulation for needle-hesitant patients',
    missingInOngo: 'Oral sublingual alternative comparison and money-back guarantee terms'
  },
  {
    id: 'orderly-pricing',
    competitorName: 'OrderlyMeds',
    topic: 'All-Inclusive Flat-Rate Pricing',
    url: 'https://orderlymeds.com/pricing/',
    title: 'Transparent Weight Loss Pricing — Semaglutide & Tirzepatide | OrderlyMeds',
    wordCount: 1290,
    bulletCount: 18,
    headingsCount: 8,
    internalLinksCount: 12,
    primaryKeywords: ['flat rate pricing', 'no monthly membership', 'all doses one price', 'free shipping', 'semaglutide $249'],
    keyTopicsCovered: [
      'All doses same price guarantee ($249 Sema, $399 Tirz)',
      'Zero monthly membership subscription fees',
      'Free overnight cold-chain shipping',
      'Medical provider consultation included'
    ],
    intent: 'Transactional',
    pros: 'Direct, clear pricing matrix with no hidden add-on costs',
    missingInOngo: 'Side-by-side table comparing hidden competitor membership fees'
  },
  {
    id: 'hims-glp1',
    competitorName: 'Hims',
    topic: 'Compounded GLP-1 Online Care & Lifestyle Routine',
    url: 'https://forhims.com/weight-loss',
    title: 'Weight Loss Treatment & Compounded GLP-1 Injections | Hims',
    wordCount: 2180,
    bulletCount: 15,
    headingsCount: 14,
    internalLinksCount: 20,
    primaryKeywords: ['glp-1 weight loss', 'personalized treatment', 'compounded medication', 'online doctor prescription'],
    keyTopicsCovered: [
      'Personalized oral medications vs injections',
      'App-based progress and habit tracking',
      'Continuous clinical messaging support',
      'Nutritional protein intake guidelines'
    ],
    intent: 'Transactional',
    pros: 'Ultra-minimalist lifestyle-oriented UI with 2-minute online intake quiz',
    missingInOngo: 'Mobile habit tracker app preview and personalized protein calculator'
  },
  {
    id: 'ivim-dosing',
    competitorName: 'Ivím Health',
    topic: 'Clinical Dosing Guides & Jumpstart Program',
    url: 'https://ivimhealth.com/dosing-guide',
    title: 'GLP-1 Medication Dosing Schedules & Titration | Ivím Health',
    wordCount: 1950,
    bulletCount: 20,
    headingsCount: 11,
    internalLinksCount: 16,
    primaryKeywords: ['titration schedule', 'units to mg conversion', 'insulin syringe measurement', 'injection site rotation'],
    keyTopicsCovered: [
      'Exact syringe units to milligram conversion table',
      'Abdomen, thigh, and upper arm injection site diagrams',
      'What to do if you miss a dose protocol',
      'Compounding pharmacy certificate of analysis'
    ],
    intent: 'Informational',
    pros: 'Solves the #1 patient search question: "how many units on my syringe?"',
    missingInOngo: 'Syringe unit visual diagram and missed dose clinical protocol'
  }
];

// Content Analysis Engine
export function analyzeContentAndChecklist(
  text: string,
  targetPage?: { title?: string; description?: string; url?: string }
): {
  intent: IntentBreakdown;
  checklist: ContentChecklistItem[];
  stats: {
    wordCount: number;
    charCount: number;
    bulletCount: number;
    headingsCount: number;
    internalLinksCount: number;
    paragraphCount: number;
    readingTimeMinutes: number;
  };
} {
  const content = text || '';
  const words = content.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = content.length;

  // Bullets & lists detection (markdown - or *, HTML <li>, unicode bullets •)
  const bulletMatches = content.match(/^[\s]*[-*•]\s+/gm) || content.match(/<li[^>]*>/gi) || [];
  const bulletCount = bulletMatches.length;

  // Headings count (markdown # or HTML <h1>, <h2>, <h3>)
  const headingMatches = content.match(/^#{1,4}\s+/gm) || content.match(/<h[1-4][^>]*>/gi) || [];
  const headingsCount = headingMatches.length;

  // Internal links detection
  const linkMatches = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || content.match(/<a[^>]+href=["'][^"']+["']/gi) || [];
  const internalLinksCount = linkMatches.length;

  // Paragraphs
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const paragraphCount = Math.max(1, paragraphs.length);
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));

  // --- INTENT CLASSIFICATION ---
  const lower = content.toLowerCase();

  const informationalTerms = [
    'how', 'what', 'why', 'study', 'studies', 'research', 'clinical', 'mechanism',
    'side effect', 'side effects', 'nausea', 'dosage', 'dose', 'titration', 'units',
    'symptom', 'diet', 'nutrition', 'protein', 'bmi', 'weight loss', 'evidence'
  ];

  const commercialTerms = [
    'cost', 'pricing', 'price', 'per month', 'insurance', 'affordable', 'plan',
    'compare', 'comparison', 'vs', 'versus', 'membership', 'flat rate', 'review',
    'best', 'worth it', 'benefits', 'save', 'discount'
  ];

  const transactionalTerms = [
    'get started', 'sign up', 'consult', 'consultation', 'eligible', 'eligibility',
    'prescription', 'prescribed', 'order', 'shipping', 'delivered', 'checkout',
    'buy', 'quiz', 'apply', 'intake'
  ];

  const trustTerms = [
    'doctor', 'physician', 'board certified', 'md', 'telehealth', 'licensed',
    'hipaa', '503a', 'compounding pharmacy', 'sterile', 'medical director',
    'fda', 'safety', 'disclaimer', 'legitscript'
  ];

  const countMatches = (terms: string[]) => {
    let count = 0;
    terms.forEach(t => {
      const regex = new RegExp(`\\b${t}\\b`, 'gi');
      const m = lower.match(regex);
      if (m) count += m.length;
    });
    return count;
  };

  const infoScore = countMatches(informationalTerms) * 1.2;
  const commScore = countMatches(commercialTerms) * 1.5;
  const transScore = countMatches(transactionalTerms) * 1.4;
  const trustScore = countMatches(trustTerms) * 1.6;

  const totalScore = Math.max(1, infoScore + commScore + transScore + trustScore);

  let informational = Math.round((infoScore / totalScore) * 100);
  let commercial = Math.round((commScore / totalScore) * 100);
  let transactional = Math.round((transScore / totalScore) * 100);
  let trust = Math.max(0, 100 - informational - commercial - transactional);

  // Normalize to 100%
  const sum = informational + commercial + transactional + trust;
  if (sum !== 100) {
    informational += (100 - sum);
  }

  let primaryIntent: 'Informational' | 'Commercial' | 'Transactional' | 'Trust & E-E-A-T' = 'Informational';
  const maxScore = Math.max(informational, commercial, transactional, trust);
  if (maxScore === commercial) primaryIntent = 'Commercial';
  else if (maxScore === transactional) primaryIntent = 'Transactional';
  else if (maxScore === trust) primaryIntent = 'Trust & E-E-A-T';

  let analysisSummary = '';
  let recommendation = '';

  if (primaryIntent === 'Informational') {
    analysisSummary = `Strong informational patient education intent (${informational}%). Rich in clinical terminology and guidance.`;
    recommendation = `Ensure you have at least 1 clear commercial CTA and link to /pricing/ or /eligibility/ to convert research traffic into patients.`;
  } else if (primaryIntent === 'Commercial') {
    analysisSummary = `High commercial comparison intent (${commercial}%). Patients are evaluating costs, plans, and medication trade-offs.`;
    recommendation = `Optimal intent for conversion! Make sure you display exact flat-rate pricing ($179 Sema / $249 Tirz) and highlight $0 consult fees.`;
  } else if (primaryIntent === 'Transactional') {
    analysisSummary = `Direct transactional onboarding intent (${transactional}%). Focused on consultation intake and getting started.`;
    recommendation = `Keep friction minimal: ensure consultation timeframes (same-day review) and home shipping guarantees are prominent.`;
  } else {
    analysisSummary = `High clinical trust and E-E-A-T governance intent (${trust}%). Physician credentials and pharmacy sterility emphasized.`;
    recommendation = `Great trust builder! Pair this medical oversight with a direct link to book a doctor consultation.`;
  }

  // --- CONTENT CHECKLIST GENERATION ---
  const checklist: ContentChecklistItem[] = [];

  // Check 1: Primary Keywords (Semaglutide / Tirzepatide)
  const hasSemaglutide = /semaglutide/i.test(content);
  const hasTirzepatide = /tirzepatide/i.test(content);
  const hasGlp1 = /glp-?1/i.test(content);
  const kwPass = hasSemaglutide || hasTirzepatide || hasGlp1;
  checklist.push({
    id: 'kw-presence',
    category: 'keywords',
    title: 'Core Medication Keywords (Semaglutide / Tirzepatide / GLP-1)',
    status: kwPass ? 'pass' : 'fail',
    value: kwPass ? `${hasSemaglutide ? 'Semaglutide ' : ''}${hasTirzepatide ? 'Tirzepatide ' : ''}${hasGlp1 ? 'GLP-1' : ''}`.trim() : 'Missing core GLP-1 terms',
    recommendation: kwPass ? 'Target medications clearly identified.' : 'Crucial: Include explicit mentions of Semaglutide, Tirzepatide, or GLP-1 to rank on search.',
    importance: 'Critical'
  });

  // Check 2: Word Count / Content Length
  let lengthStatus: 'pass' | 'warning' | 'fail' = 'pass';
  let lengthRec = 'Optimal content length for search engine indexation.';
  if (wordCount < 400) {
    lengthStatus = 'fail';
    lengthRec = 'Content is too thin (<400 words). Google typically ranks comprehensive healthcare guides with 1,000+ words higher.';
  } else if (wordCount < 800) {
    lengthStatus = 'warning';
    lengthRec = 'Moderate length (400-800 words). Consider expanding titration schedule or FAQ to reach 1,200 words.';
  }
  checklist.push({
    id: 'content-length',
    category: 'structure',
    title: 'Word Count & Content Depth',
    status: lengthStatus,
    value: `${wordCount} words (~${readingTimeMinutes} min read)`,
    recommendation: lengthRec,
    importance: 'High'
  });

  // Check 3: Bullets & Lists Presence
  const hasBullets = bulletCount >= 3;
  checklist.push({
    id: 'bullet-points',
    category: 'structure',
    title: 'Bullet Points & Skimmable Lists',
    status: hasBullets ? 'pass' : bulletCount > 0 ? 'warning' : 'fail',
    value: `${bulletCount} list items detected`,
    recommendation: hasBullets 
      ? 'Great scannability! Bullet points increase mobile user retention and featured snippet capture.'
      : 'Add a bulleted list for side effects, dosing steps, or pricing inclusions to improve skimmability.',
    importance: 'High'
  });

  // Check 4: Headings Hierarchy (H2 / H3)
  const hasHeadings = headingsCount >= 3;
  checklist.push({
    id: 'heading-hierarchy',
    category: 'structure',
    title: 'Headings Hierarchy (H2 / H3 Topics)',
    status: hasHeadings ? 'pass' : headingsCount > 0 ? 'warning' : 'fail',
    value: `${headingsCount} headings found`,
    recommendation: hasHeadings
      ? 'Well-structured topical sections.'
      : 'Break long paragraphs into clear H2 sub-sections (e.g. How It Works, Dosing Schedule, Pricing, Who Is Eligible).',
    importance: 'Medium'
  });

  // Check 5: Internal / Outbound Links
  const hasLinks = internalLinksCount >= 2;
  checklist.push({
    id: 'internal-links',
    category: 'links',
    title: 'Internal Links & Conversion CTAs',
    status: hasLinks ? 'pass' : internalLinksCount === 1 ? 'warning' : 'fail',
    value: `${internalLinksCount} links found`,
    recommendation: hasLinks
      ? 'Good link equity flow to internal money and consultation pages.'
      : 'Add internal links to /pricing/, /medical-team/, and /eligibility/ to pass PageRank equity.',
    importance: 'Critical'
  });

  // Check 6: Meta Tags (Title & Description)
  const metaTitle = targetPage?.title || '';
  const metaDesc = targetPage?.description || '';
  const titleOptimal = metaTitle.length >= 45 && metaTitle.length <= 65;
  const descOptimal = metaDesc.length >= 120 && metaDesc.length <= 165;

  checklist.push({
    id: 'meta-presence',
    category: 'meta',
    title: 'Meta Title & Description Tags',
    status: (metaTitle && metaDesc) ? (titleOptimal && descOptimal ? 'pass' : 'warning') : 'fail',
    value: metaTitle ? `Title: ${metaTitle.length}ch | Desc: ${metaDesc.length}ch` : 'Meta tags missing from draft',
    recommendation: metaTitle
      ? (titleOptimal && descOptimal ? 'Meta tags are within optimal character boundaries for Google SERPs.' : 'Tune title to 50-60 chars and description to 130-160 chars.')
      : 'Provide a primary meta title (55 chars) and meta description (150 chars) with CTA hook.',
    importance: 'High'
  });

  // Check 7: Physician E-E-A-T & Medical Review Attribution
  const hasDoctorMention = /doctor|physician|board[\s-]certified|medical director|md\b/i.test(content);
  checklist.push({
    id: 'doctor-eeat',
    category: 'eeat',
    title: 'Doctor E-E-A-T & Physician Review Mention',
    status: hasDoctorMention ? 'pass' : 'warning',
    value: hasDoctorMention ? 'Physician supervision noted' : 'No physician mention',
    recommendation: hasDoctorMention
      ? 'Strengthens medical authority and protects against Google healthcare YMYL penalties.'
      : 'Add a "Medically Reviewed by Board-Certified Physician" byline to boost Google E-E-A-T.',
    importance: 'High'
  });

  // Check 8: Compounding & Sterility Transparency
  const hasCompoundingMention = /compounding|503a|sterile|licensed pharmacy|usp/i.test(content);
  checklist.push({
    id: 'compounding-sterility',
    category: 'eeat',
    title: '503A Compounding Pharmacy Disclosure',
    status: hasCompoundingMention ? 'pass' : 'warning',
    value: hasCompoundingMention ? 'Pharmacy sourcing referenced' : 'No compounding disclaimer',
    recommendation: hasCompoundingMention
      ? 'Reassures patients on legitimate sterile compounding standards.'
      : 'Mention that medications are dispensed by state-licensed 503A sterile compounding pharmacies.',
    importance: 'Medium'
  });

  return {
    intent: {
      informational,
      commercial,
      transactional,
      trust,
      primaryIntent,
      analysisSummary,
      recommendation
    },
    checklist,
    stats: {
      wordCount,
      charCount,
      bulletCount,
      headingsCount,
      internalLinksCount,
      paragraphCount,
      readingTimeMinutes
    }
  };
}

// Head-to-Head Comparison Calculator
export function generateHeadToHeadComparison(
  ongoText: string,
  competitor: CompetitorBenchmarkPage
): HeadToHeadComparison {
  const ongoAnalysis = analyzeContentAndChecklist(ongoText);
  const ongoWords = ongoAnalysis.stats.wordCount;
  const ongoBullets = ongoAnalysis.stats.bulletCount;
  const ongoHeadings = ongoAnalysis.stats.headingsCount;
  const ongoLinks = ongoAnalysis.stats.internalLinksCount;

  // Calculate missing topics
  const lower = ongoText.toLowerCase();
  const missingInOngo = competitor.keyTopicsCovered.filter(topic => {
    const keyWord = topic.split(' ')[0].toLowerCase();
    return !lower.includes(keyWord);
  });

  const ongoCoveragePct = Math.max(
    40,
    Math.min(100, Math.round(((competitor.keyTopicsCovered.length - missingInOngo.length) / competitor.keyTopicsCovered.length) * 100))
  );

  let verdict = '';
  if (ongoWords > competitor.wordCount && missingInOngo.length === 0) {
    verdict = `🏆 Ongo wins: More comprehensive depth (${ongoWords} vs ${competitor.wordCount} words) with 100% key topic coverage.`;
  } else if (ongoWords >= competitor.wordCount * 0.8) {
    verdict = `⚖️ Highly competitive: Ongo matches ${competitor.competitorName}'s core structure but can plug ${missingInOngo.length} missing topic(s) to pull ahead.`;
  } else {
    verdict = `⚠️ Competitor has higher depth: ${competitor.competitorName} has ${competitor.wordCount - ongoWords} more words and ${competitor.bulletCount} skimmable bullets.`;
  }

  return {
    ongoMetrics: {
      wordCount: ongoWords,
      bulletCount: ongoBullets,
      headingsCount: ongoHeadings,
      internalLinksCount: ongoLinks,
      readingEase: ongoWords > 1200 ? 'Comprehensive Guide' : ongoWords > 600 ? 'Skimmable Overview' : 'Short Summary',
      keywordCoveragePct: ongoCoveragePct
    },
    competitorMetrics: {
      name: competitor.competitorName,
      url: competitor.url,
      wordCount: competitor.wordCount,
      bulletCount: competitor.bulletCount,
      headingsCount: competitor.headingsCount,
      internalLinksCount: competitor.internalLinksCount,
      readingEase: competitor.wordCount > 1800 ? 'In-Depth Authority' : 'Standard Article',
      keywordCoveragePct: 100
    },
    topicsGap: {
      competitorHas: competitor.keyTopicsCovered,
      ongoHas: competitor.keyTopicsCovered.filter(t => !missingInOngo.includes(t)),
      missingInOngo
    },
    executiveVerdict: verdict
  };
}

