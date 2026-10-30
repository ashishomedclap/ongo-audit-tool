import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface OngoLivePageItem {
  id: number;
  url: string;
  path: string;
  status_code: number;
  title: string;
  title_length: number;
  title_status: 'optimal' | 'too_short' | 'too_long' | 'missing';
  description: string;
  description_length: number;
  description_status: 'optimal' | 'too_short' | 'too_long' | 'missing';
  h1: string;
  canonical: string;
  category: string;
  intent: string;
  priority: string;
  recommended_title: string;
  recommended_description: string;
  primary_keyword: string;
  intent_gap: string;
  ctr_hook: string;
}

export interface OngoLivePagesResponse {
  last_updated: string;
  total_pages: number;
  source: string;
  pages: OngoLivePageItem[];
}

const DATA_FILE = path.join(process.cwd(), 'data', 'inventory', 'ongo_live_pages.json');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (Ongo-Sitemap-Auditor/1.0)',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
};

function cleanHtmlEntities(text: string): string {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function categorizeUrl(url: string): { category: string; intent: string; priority: string } {
  const u = url.toLowerCase();
  if (u === 'https://ongoweightloss.com/' || u === 'https://ongoweightloss.com') {
    return { category: 'Homepage / Core', intent: 'Commercial / Brand Authority', priority: 'P0' };
  }
  if (u.includes('/services/glp-1/compounded-semaglutide')) {
    return { category: 'Core Treatment', intent: 'High-Intent Commercial (Semaglutide)', priority: 'P0' };
  }
  if (u.includes('/services/glp-1/compounded-tirzepatide')) {
    return { category: 'Core Treatment', intent: 'High-Intent Commercial (Tirzepatide)', priority: 'P0' };
  }
  if (u.includes('/pricing')) {
    return { category: 'Pricing & Plans', intent: 'High-Intent Commercial (Cost / Pricing)', priority: 'P0' };
  }
  if (u.includes('/how-it-works')) {
    return { category: 'Funnel Explainer', intent: 'Decision Support / Conversion', priority: 'P0' };
  }
  if (u.includes('/eligibility')) {
    return { category: 'Intake Screener', intent: 'High-Intent Diagnostic / Qualification', priority: 'P0' };
  }
  if (u.includes('/medical-team') && u.trim().replace(/\/$/, '').endsWith('medical-team')) {
    return { category: 'Medical Team Hub', intent: 'Trust & E-E-A-T Medical Authority', priority: 'P0' };
  }
  if (u.includes('/medical-team/')) {
    return { category: 'Doctor Bio / Credential', intent: 'Trust & E-E-A-T Clinician Verification', priority: 'P1' };
  }
  if (u.includes('/blog/semaglutide/') || u.includes('/blog/tirzepatide/') || u.includes('dosing-guide')) {
    return { category: 'Dosing & Clinical Guide', intent: 'Clinical Decision Support / Dosage Intent', priority: 'P1' };
  }
  if (u.includes('/blog/')) {
    return { category: 'Blog / Educational', intent: 'Informational Research / Awareness', priority: 'P1' };
  }
  if (u.includes('/locations')) {
    return { category: 'Local Telehealth', intent: 'Geotargeted Telehealth Intent', priority: 'P1' };
  }
  if (u.includes('/policies/')) {
    return { category: 'Compliance & Legal', intent: 'Legal / Regulatory Transparency', priority: 'P2' };
  }
  if (u.includes('/contact') || u.includes('/about') || u.includes('/faq') || u.includes('/services')) {
    return { category: 'Company & Support', intent: 'Trust & Customer Assistance', priority: 'P1' };
  }
  return { category: 'General Page', intent: 'Informational', priority: 'P2' };
}

function sanitizeHumanTitle(title: string): string {
  let t = title;
  t = t.replace(/[|—–:;•]/g, ' ');
  t = t.replace(/&/g, 'and');
  t = t.replace(/\bOngo\s+Weight\s+Loss\b/gi, '');
  t = t.replace(/\bOngo\s+Health\b/gi, '');
  t = t.replace(/\bOngo\b/gi, '');
  return t.replace(/\s+/g, ' ').trim();
}

function generateCtrOptimization(url: string) {
  const u = url.toLowerCase();

  // 1. Homepage
  if (u === 'https://ongoweightloss.com/' || u === 'https://ongoweightloss.com') {
    return {
      recommended_title: sanitizeHumanTitle('Doctor prescribed compounded semaglutide and tirzepatide online'),
      recommended_description: 'Get doctor prescribed compounded semaglutide and tirzepatide delivered directly to your home with transparent monthly pricing and no insurance needed',
      primary_keyword: 'compounded semaglutide and tirzepatide online',
      intent_gap: 'Natural search query matching patients searching how to get prescribed compounded GLP-1 medications online without brand fluff or symbols',
      ctr_hook: 'Doctor consultation included with home delivery and no insurance needed'
    };
  }

  // 2. Compounded Semaglutide
  if (u.includes('/services/glp-1/compounded-semaglutide')) {
    return {
      recommended_title: sanitizeHumanTitle('How to get compounded semaglutide online prescribed by doctors'),
      recommended_description: 'Find out how to get compounded semaglutide prescribed online by licensed physicians and delivered refrigerated to your door with all injection supplies',
      primary_keyword: 'how to get compounded semaglutide online',
      intent_gap: 'Matches conversational transactional search intent for affordable doctor prescribed semaglutide without rigid corporate brand tags',
      ctr_hook: 'Doctor consultation with cold chain delivery and injection supplies included'
    };
  }

  // 3. Compounded Tirzepatide
  if (u.includes('/services/glp-1/compounded-tirzepatide')) {
    return {
      recommended_title: sanitizeHumanTitle('How to get compounded tirzepatide prescribed online for weight loss'),
      recommended_description: 'Learn how to get dual GIP and GLP-1 compounded tirzepatide prescribed online by licensed doctors with fast home delivery and ongoing medical support',
      primary_keyword: 'compounded tirzepatide prescribed online for weight loss',
      intent_gap: 'Direct human query for patients seeking compounded tirzepatide for superior weight reduction results',
      ctr_hook: 'Dual action GIP and GLP-1 therapy with ongoing medical support'
    };
  }

  // 4. Pricing
  if (u.includes('/pricing')) {
    return {
      recommended_title: sanitizeHumanTitle('How much does compounded semaglutide and tirzepatide cost per month'),
      recommended_description: 'See transparent monthly costs for compounded semaglutide and tirzepatide including doctor consults medication supplies and free shipping with no hidden fees',
      primary_keyword: 'how much does compounded semaglutide cost per month',
      intent_gap: 'Exact query typed by patients researching out-of-pocket costs and comparing telehealth clinics',
      ctr_hook: 'Transparent monthly cost with no hidden fees and supplies included'
    };
  }

  // 5. How It Works
  if (u.includes('/how-it-works')) {
    return {
      recommended_title: sanitizeHumanTitle('How online weight loss consultations and medication delivery works'),
      recommended_description: 'See how virtual medical weight loss works in three simple steps from an online health intake to doctor review and home delivery of your medication',
      primary_keyword: 'how online medical weight loss works',
      intent_gap: 'Answers the searcher question of what to expect during virtual weight loss telehealth',
      ctr_hook: 'Fast online medical intake with licensed doctor review and doorstep delivery'
    };
  }

  // 6. Eligibility
  if (u.includes('/eligibility')) {
    return {
      recommended_title: sanitizeHumanTitle('Find out if you qualify for glp 1 medical weight loss online'),
      recommended_description: 'Check the BMI criteria and medical qualifications required to receive doctor prescribed compounded semaglutide or tirzepatide online',
      primary_keyword: 'qualify for glp 1 medical weight loss online',
      intent_gap: 'Matches diagnostic queries from prospective patients asking if their BMI qualifies',
      ctr_hook: 'Instant qualification criteria based on BMI and health history'
    };
  }

  // 7. Medical Team Hub
  if (u.includes('/medical-team') && u.trim().replace(/\/$/, '').endsWith('medical-team')) {
    return {
      recommended_title: sanitizeHumanTitle('Meet our team of board certified doctors specializing in weight loss'),
      recommended_description: 'Learn about our US licensed physicians and clinical specialists who provide medical evaluations ongoing dosage adjustments and virtual weight loss care',
      primary_keyword: 'board certified doctors specializing in weight loss',
      intent_gap: 'Builds authentic medical trust and E-E-A-T without stiff corporate titling',
      ctr_hook: 'US licensed medical doctors with ongoing clinical oversight'
    };
  }

  // 8. Individual Doctor Bios
  if (u.includes('/medical-team/dr-benjamin-krasne')) {
    return {
      recommended_title: sanitizeHumanTitle('Meet Dr Benjamin Krasne board certified physician for weight loss'),
      recommended_description: 'Learn about Dr Benjamin Krasne and his clinical background providing virtual consultations and personalized GLP-1 medical weight loss care',
      primary_keyword: 'Dr Benjamin Krasne physician',
      intent_gap: 'Patient query looking to verify doctor credentials and bedside experience',
      ctr_hook: 'Board certified medical doctor with extensive clinical experience'
    };
  }

  if (u.includes('/medical-team/dr-david-okonkwo')) {
    return {
      recommended_title: sanitizeHumanTitle('Meet Dr David Okonkwo board certified physician for weight loss'),
      recommended_description: 'Learn about Dr David Okonkwo and his clinical background providing patient centered telehealth evaluations and medical weight management',
      primary_keyword: 'Dr David Okonkwo physician',
      intent_gap: 'Patient verification query for Dr Okonkwo credentials and medical guidance',
      ctr_hook: 'Over 15 years of medical clinical care and physician leadership'
    };
  }

  if (u.includes('/medical-team/dr-gaurav-patel')) {
    return {
      recommended_title: sanitizeHumanTitle('Meet Dr Gaurav Patel board certified physician for weight loss'),
      recommended_description: 'Learn about Dr Gaurav Patel and his experience in telehealth clinical evaluations and physician guided GLP-1 weight loss therapy',
      primary_keyword: 'Dr Gaurav Patel physician',
      intent_gap: 'Doctor verification search matching patient inquiries',
      ctr_hook: 'Board certified clinician with focus on obesity medicine'
    };
  }

  if (u.includes('/medical-team/dr-jonathan-miller')) {
    return {
      recommended_title: sanitizeHumanTitle('Meet Dr Jonathan Miller board certified physician for weight loss'),
      recommended_description: 'Learn about Dr Jonathan Miller and his extensive experience providing virtual telehealth medical evaluations and weight loss consultations',
      primary_keyword: 'Dr Jonathan Miller physician',
      intent_gap: 'Verifies licensed telemedicine credentials for patient safety',
      ctr_hook: 'Licensed across multiple states with extensive telehealth experience'
    };
  }

  if (u.includes('/medical-team/dr-zachary-kramer')) {
    return {
      recommended_title: sanitizeHumanTitle('Meet Dr Zachary Kramer board certified physician for weight loss'),
      recommended_description: 'Learn about Dr Zachary Kramer and his clinical experience helping patients make informed decisions about prescription medical weight loss',
      primary_keyword: 'Dr Zachary Kramer physician',
      intent_gap: 'Doctor background query verifying clinical expertise',
      ctr_hook: 'Over 15 years of medical emergency and telehealth experience'
    };
  }

  // 9. Semaglutide Dosing Guide
  if (u.includes('semaglutide-dosing-guide')) {
    return {
      recommended_title: sanitizeHumanTitle('Semaglutide dosage chart and weekly titration schedule guide'),
      recommended_description: 'Review the complete compounded semaglutide dosing chart from starting dose of 0.25mg up to maintenance with weekly titration instructions and tips',
      primary_keyword: 'semaglutide dosage chart and weekly titration schedule',
      intent_gap: 'Matches clinical search queries looking for the exact weekly titration schedule',
      ctr_hook: 'Step by step titration schedule from 0.25mg to maintenance doses'
    };
  }

  // 10. Tirzepatide Dosing Guide
  if (u.includes('tirzepatide-dosing-guide')) {
    return {
      recommended_title: sanitizeHumanTitle('Tirzepatide weekly dosage chart and titration schedule guide'),
      recommended_description: 'Review the recommended tirzepatide titration schedule from 2.5mg up to 15mg with weekly guidelines on how and when to increase your dosage safely',
      primary_keyword: 'tirzepatide weekly dosage chart and titration schedule',
      intent_gap: 'Direct search query from patients looking for tirzepatide dosage ramp up',
      ctr_hook: 'Safe titration protocols from starting dose to maintenance'
    };
  }

  // 11. Tirzepatide Liposomal Chewable
  if (u.includes('tirzepatide-liposomal-chewable')) {
    return {
      recommended_title: sanitizeHumanTitle('How to take tirzepatide chewable tablets for needle free weight loss'),
      recommended_description: 'Learn how compounded tirzepatide liposomal chewable tablets work as a needle free alternative with sublingual absorption and daily dosing guidelines',
      primary_keyword: 'tirzepatide chewable tablets for needle free weight loss',
      intent_gap: 'Captures searchers actively looking for needle free oral GLP-1 alternatives',
      ctr_hook: '100 percent needle free option with liposomal absorption'
    };
  }

  // 12. How GLP-1 Works
  if (u.includes('how-glp-1-works')) {
    return {
      recommended_title: sanitizeHumanTitle('How glp 1 medications work in the body for medical weight loss'),
      recommended_description: 'Understand how GLP-1 receptor agonists reduce hunger slow gastric emptying and help quiet food noise to support sustainable long term weight loss',
      primary_keyword: 'how glp 1 medications work in the body for weight loss',
      intent_gap: 'Explains physiological mechanism in accessible conversational language',
      ctr_hook: 'Reduces appetite and silences food noise backed by clinical data'
    };
  }

  // 13. Houston Location
  if (u.includes('/locations/texas/houston')) {
    return {
      recommended_title: sanitizeHumanTitle('Get compounded semaglutide and tirzepatide delivered in Houston Texas'),
      recommended_description: 'Order doctor prescribed compounded semaglutide and tirzepatide online with cold chain home delivery to patients throughout the Houston metro area',
      primary_keyword: 'compounded semaglutide and tirzepatide in Houston Texas',
      intent_gap: 'Geotargeted human query matching Houston residents seeking local delivery',
      ctr_hook: 'Licensed Texas medical providers with refrigerated home delivery'
    };
  }

  // 14. 50 States Location Hub
  if (u.includes('/locations')) {
    return {
      recommended_title: sanitizeHumanTitle('States where doctor prescribed compounded glp 1 can be shipped'),
      recommended_description: 'Check the list of US states where licensed physicians provide virtual medical consultations and ship compounded semaglutide and tirzepatide to your home',
      primary_keyword: 'states where compounded glp 1 can be shipped',
      intent_gap: 'Answers the searcher question of whether telehealth delivery is legal in their state',
      ctr_hook: 'Nationwide coverage with licensed US physicians and verified shipping'
    };
  }

  // 15. FAQ
  if (u.includes('/faq')) {
    return {
      recommended_title: sanitizeHumanTitle('Common questions about compounded semaglutide and tirzepatide'),
      recommended_description: 'Find clear answers to frequently asked questions about compounded GLP-1 prescriptions injection instructions side effect relief and shipping timelines',
      primary_keyword: 'questions about compounded semaglutide and tirzepatide',
      intent_gap: 'Direct Q&A intent matching user queries about safety and logistics',
      ctr_hook: 'Answers to common patient questions on dosage safety and delivery'
    };
  }

  // 16. About
  if (u.includes('/about')) {
    return {
      recommended_title: sanitizeHumanTitle('Learn about doctor supervised virtual medical weight loss care'),
      recommended_description: 'Discover how virtual medical weight loss provides accessible doctor supervised treatment with compounded medications delivered directly to patients',
      primary_keyword: 'doctor supervised virtual medical weight loss care',
      intent_gap: 'Human informational query about virtual clinic standards and patient care',
      ctr_hook: 'Physician supervised care without retail pharmacy markups'
    };
  }

  // 17. Contact
  if (u.includes('/contact')) {
    return {
      recommended_title: sanitizeHumanTitle('Contact our clinical medical team for prescription questions'),
      recommended_description: 'Get in touch with our patient support and clinical medical team for questions about your GLP-1 weight loss consultation prescription or shipment',
      primary_keyword: 'contact clinical medical team for prescription questions',
      intent_gap: 'Direct contact intent for patients seeking help or pre-intake clarity',
      ctr_hook: 'Direct patient support and clinical guidance'
    };
  }

  // 18. Services Hub
  if (u.includes('/services') && u.trim().replace(/\/$/, '').endsWith('services')) {
    return {
      recommended_title: sanitizeHumanTitle('Doctor guided medical weight loss and compounded glp 1 programs'),
      recommended_description: 'Explore physician guided medical weight loss programs featuring compounded semaglutide and tirzepatide in injectable vials and chewable tablet options',
      primary_keyword: 'doctor guided medical weight loss programs',
      intent_gap: 'Overview of all telehealth treatment options in natural human language',
      ctr_hook: 'Injectable and chewable treatment options with physician guidance'
    };
  }

  // 19. Blog Hub
  if (u.includes('/blog') && (u.trim().replace(/\/$/, '').endsWith('blog'))) {
    return {
      recommended_title: sanitizeHumanTitle('Medical weight loss guides and glp 1 clinical articles'),
      recommended_description: 'Browse physician reviewed articles and patient guides on GLP-1 weight loss medications nutrition recommendations and dosage management tips',
      primary_keyword: 'medical weight loss guides and glp 1 clinical articles',
      intent_gap: 'Educational resource query for medical weight management advice',
      ctr_hook: 'Physician reviewed guides on dosage nutrition and side effects'
    };
  }

  // 20. Legal Policies
  if (u.includes('/policies/refund-policy')) {
    return {
      recommended_title: sanitizeHumanTitle('Refund and cancellation policy if not approved by a doctor'),
      recommended_description: 'Review our transparent refund policy including full refunds if your consultation is not clinically approved and cancel anytime subscription options',
      primary_keyword: 'refund and cancellation policy weight loss telehealth',
      intent_gap: 'Addresses financial hesitation with clear human wording on refunds',
      ctr_hook: 'Full refund if not medically approved with cancel anytime options'
    };
  }

  if (u.includes('/policies/shipping-policy')) {
    return {
      recommended_title: sanitizeHumanTitle('How refrigerated medications are shipped safely to your home'),
      recommended_description: 'Learn how temperature sensitive compounded medications are packaged in insulated cold boxes with temperature monitoring and fast delivery to your door',
      primary_keyword: 'how refrigerated medications are shipped to your home',
      intent_gap: 'Reassures patients on cold-chain integrity in conversational phrasing',
      ctr_hook: 'Insulated cold box packaging with fast refrigerated delivery'
    };
  }

  if (u.includes('/policies/telehealth-consent')) {
    return {
      recommended_title: sanitizeHumanTitle('Informed consent agreement for virtual medical consultations'),
      recommended_description: 'Review the patient informed consent terms for virtual telehealth medical consultations clinical health evaluations and prescription weight loss care',
      primary_keyword: 'informed consent agreement for virtual medical consultations',
      intent_gap: 'Transparent clinical compliance without corporate jargon',
      ctr_hook: 'Clear patient informed consent terms and telehealth safety'
    };
  }

  if (u.includes('/policies/terms-of-service')) {
    return {
      recommended_title: sanitizeHumanTitle('Terms of service and patient user agreement for telehealth care'),
      recommended_description: 'Read our terms of service and patient user agreement outlining how virtual consultations medical services and subscription accounts are managed',
      primary_keyword: 'terms of service telehealth medical care',
      intent_gap: 'Clear service terms for patient protection',
      ctr_hook: 'Transparent terms of service and patient rights'
    };
  }

  if (u.includes('/policies/privacy-policy')) {
    return {
      recommended_title: sanitizeHumanTitle('How we protect your personal health information and online privacy'),
      recommended_description: 'Learn how your personal health data medical history and consultation records are kept private secure and protected under strict confidentiality guidelines',
      primary_keyword: 'how personal health information is protected online',
      intent_gap: 'Addresses privacy concerns regarding health history and online prescribing',
      ctr_hook: 'Strict health data confidentiality and secure patient records'
    };
  }

  if (u.includes('/policies/california-privacy-statement')) {
    return {
      recommended_title: sanitizeHumanTitle('California resident privacy rights and consumer health data notice'),
      recommended_description: 'Information for California residents regarding personal data rights health information privacy disclosures and consumer protections',
      primary_keyword: 'california resident privacy rights consumer health data',
      intent_gap: 'State regulatory transparency in plain human language',
      ctr_hook: 'California consumer privacy protections and data rights'
    };
  }

  if (u.includes('/policies/consumer-health-data-privacy')) {
    return {
      recommended_title: sanitizeHumanTitle('How your consumer health data and medical records are kept private'),
      recommended_description: 'Review our consumer health data privacy standards detailing how medical consultation details and clinical records are handled with confidentiality',
      primary_keyword: 'consumer health data privacy standards',
      intent_gap: 'Assures patients of clinical data protection',
      ctr_hook: 'Confidential medical record handling and patient data privacy'
    };
  }

  if (u.includes('/policies/disclaimer')) {
    return {
      recommended_title: sanitizeHumanTitle('Medical disclaimer and clinical treatment terms for virtual care'),
      recommended_description: 'Important medical disclaimer regarding online healthcare consultations clinical evaluation limitations and prescription weight loss eligibility',
      primary_keyword: 'medical disclaimer for virtual healthcare',
      intent_gap: 'Clear legal disclaimer in plain English',
      ctr_hook: 'Medical consultation guidelines and clinical eligibility notice'
    };
  }

  if (u.includes('/policies/editorial-policy')) {
    return {
      recommended_title: sanitizeHumanTitle('Medical review process and editorial guidelines for health articles'),
      recommended_description: 'Learn how our clinical guides articles and patient resources are researched written and reviewed by licensed physicians for medical accuracy',
      primary_keyword: 'medical review process for health articles',
      intent_gap: 'Validates content accuracy and physician review standards',
      ctr_hook: 'Physician reviewed health articles with clinical accuracy standards'
    };
  }

  if (u.includes('/policies/notice-of-privacy-practices')) {
    return {
      recommended_title: sanitizeHumanTitle('Notice of medical privacy practices and patient record protections'),
      recommended_description: 'Official notice outlining medical privacy practices how patient clinical records are handled and how protected health information is maintained',
      primary_keyword: 'notice of medical privacy practices',
      intent_gap: 'Healthcare regulatory notice explained clearly',
      ctr_hook: 'Compliant medical privacy practices and health record protection'
    };
  }

  if (u.includes('/policies/patient-bill-of-rights')) {
    return {
      recommended_title: sanitizeHumanTitle('Your rights and protections as a virtual medical weight loss patient'),
      recommended_description: 'Review your patient rights including respectful healthcare clear treatment information provider qualifications and confidential medical decision making',
      primary_keyword: 'patient rights for virtual medical weight loss',
      intent_gap: 'Empowers patients with clarity on their rights',
      ctr_hook: 'Patient rights to respectful care and confidential decision making'
    };
  }

  // Fallback: Natural Human Query without symbols or brand
  const slug = u.trim().replace(/\/$/, '').split('/').pop()?.replace(/-/g, ' ') || 'page';
  const cleanSlug = slug.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  return {
    recommended_title: sanitizeHumanTitle(`Information and clinical guidance on ${cleanSlug}`),
    recommended_description: `Helpful information and clinical guidance regarding ${cleanSlug} for virtual medical weight loss patients`,
    primary_keyword: cleanSlug,
    intent_gap: 'Natural human informational query',
    ctr_hook: 'Doctor reviewed guidance and transparent clinical care'
  };
}

export async function GET() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf8');
      const data = JSON.parse(content);
      return NextResponse.json({ success: true, ...data });
    }
    return NextResponse.json({ success: false, error: 'No cached pages found. Please trigger a refresh.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const sitemapUrl = 'https://ongoweightloss.com/sitemap.xml';

    // Fetch live sitemap
    const sitemapRes = await fetch(sitemapUrl, {
      headers: HEADERS,
      signal: AbortSignal.timeout(12000)
    });

    if (!sitemapRes.ok) {
      throw new Error(`Failed to fetch sitemap: HTTP ${sitemapRes.status}`);
    }

    const xml = await sitemapRes.text();
    const locMatches = xml.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g);
    const urls: string[] = [];
    for (const match of locMatches) {
      if (match[1] && !urls.includes(match[1])) {
        urls.push(match[1].trim());
      }
    }

    if (urls.length === 0) {
      throw new Error('No URLs found in live sitemap');
    }

    // Crawl pages in batches with concurrency limit
    const pagesData: OngoLivePageItem[] = [];

    for (let i = 0; i < urls.length; i++) {
      const u = urls[i];
      const parsedPath = new URL(u).pathname || '/';
      const { category, intent, priority } = categorizeUrl(u);
      const opt = generateCtrOptimization(u);

      const pageEntry: OngoLivePageItem = {
        id: i + 1,
        url: u,
        path: parsedPath,
        status_code: 200,
        title: '',
        title_length: 0,
        title_status: 'missing' as const,
        description: '',
        description_length: 0,
        description_status: 'missing' as const,
        h1: '',
        canonical: u,
        category,
        intent,
        priority,
        recommended_title: opt.recommended_title,
        recommended_description: opt.recommended_description,
        primary_keyword: opt.primary_keyword,
        intent_gap: opt.intent_gap,
        ctr_hook: opt.ctr_hook
      };

      try {
        const pageRes = await fetch(u, {
          headers: HEADERS,
          signal: AbortSignal.timeout(8000)
        });

        pageEntry.status_code = pageRes.status;
        const html = await pageRes.text();

        // Title
        const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const rawTitle = titleMatch ? cleanHtmlEntities(titleMatch[1]) : '';
        pageEntry.title = rawTitle;
        pageEntry.title_length = rawTitle.length;
        if (rawTitle.length >= 48 && rawTitle.length <= 62) {
          pageEntry.title_status = 'optimal';
        } else if (rawTitle.length > 62) {
          pageEntry.title_status = 'too_long';
        } else if (rawTitle.length > 0) {
          pageEntry.title_status = 'too_short';
        } else {
          pageEntry.title_status = 'missing';
        }

        // Description
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
                          html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
        const rawDesc = descMatch ? cleanHtmlEntities(descMatch[1]) : '';
        pageEntry.description = rawDesc;
        pageEntry.description_length = rawDesc.length;
        if (rawDesc.length >= 140 && rawDesc.length <= 165) {
          pageEntry.description_status = 'optimal';
        } else if (rawDesc.length > 165) {
          pageEntry.description_status = 'too_long';
        } else if (rawDesc.length > 0) {
          pageEntry.description_status = 'too_short';
        } else {
          pageEntry.description_status = 'missing';
        }

        // H1
        const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        pageEntry.h1 = h1Match ? cleanHtmlEntities(h1Match[1].replace(/<[^>]+>/g, '')) : '';

        // Canonical
        const canMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i);
        pageEntry.canonical = canMatch ? canMatch[1] : u;
      } catch {
        pageEntry.status_code = 500;
        pageEntry.title = 'Error fetching page';
        pageEntry.description = 'Could not load metadata from live server';
      }

      pagesData.push(pageEntry);
    }

    const payload: OngoLivePagesResponse = {
      last_updated: new Date().toISOString(),
      total_pages: pagesData.length,
      source: sitemapUrl,
      pages: pagesData
    };

    // Save to disk
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf8');
    } catch (saveErr) {
      console.error('Failed to save ongo_live_pages.json:', saveErr);
    }

    return NextResponse.json({
      success: true,
      ...payload
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
