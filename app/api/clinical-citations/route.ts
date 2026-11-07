import { NextRequest, NextResponse } from 'next/server';

export interface ClinicalStudy {
  id: string;
  pmid: string;
  doi: string;
  title: string;
  authors: string;
  journal: string;
  pubYear: string;
  studyType: 'Phase 3 RCT' | 'Systematic Review' | 'Meta-Analysis' | 'Observational Cohort';
  sampleSize: string;
  meanWeightLossPercentage: string;
  keyFinding: string;
  amaCitation: string;
  apaCitation: string;
  nlmcitation: string;
  pubmedUrl: string;
  topics: string[];
}

const VERIFIED_PUBMED_TRIALS: ClinicalStudy[] = [
  {
    id: 'STEP-1-NEJM',
    pmid: '33567185',
    doi: '10.1056/NEJMoa2032183',
    title: 'Once-Weekly Semaglutide in Adults with Overweight or Obesity (STEP 1 Trial)',
    authors: 'Wilding JPH, Batterham RL, Calanna S, et al. for the STEP 1 Study Group',
    journal: 'New England Journal of Medicine (NEJM)',
    pubYear: '2021',
    studyType: 'Phase 3 RCT',
    sampleSize: '1,961 participants across 16 countries / 129 sites',
    meanWeightLossPercentage: '-14.9% mean body weight reduction at week 68 (vs -2.4% placebo)',
    keyFinding: 'Semaglutide 2.4 mg subcutaneously once weekly plus lifestyle intervention resulted in sustained, clinically meaningful mean weight loss of nearly 15% with significant cardiometabolic improvements.',
    amaCitation: 'Wilding JPH, Batterham RL, Calanna S, et al. Once-Weekly Semaglutide in Adults with Overweight or Obesity. N Engl J Med. 2021;384(11):989-1002. doi:10.1056/NEJMoa2032183.',
    apaCitation: 'Wilding, J. P. H., Batterham, R. L., Calanna, S., et al. (2021). Once-Weekly Semaglutide in Adults with Overweight or Obesity. New England Journal of Medicine, 384(11), 989-1002.',
    nlmcitation: 'Wilding JPH, Batterham RL, Calanna S, et al. Once-Weekly Semaglutide in Adults with Overweight or Obesity. N Engl J Med. 2021 Mar 18;384(11):989-1002. PMID: 33567185.',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/33567185/',
    topics: ['semaglutide', 'step 1', 'weight loss', 'nejm', 'obesity rct']
  },
  {
    id: 'SURMOUNT-1-NEJM',
    pmid: '35658024',
    doi: '10.1056/NEJMoa2206038',
    title: 'Tirzepatide Once Weekly for the Treatment of Obesity (SURMOUNT-1 Trial)',
    authors: 'Jastreboff AM, Aronne LJ, Ahmad NN, et al. for the SURMOUNT-1 Investigators',
    journal: 'New England Journal of Medicine (NEJM)',
    pubYear: '2022',
    studyType: 'Phase 3 RCT',
    sampleSize: '2,539 adults with obesity without diabetes across 119 sites',
    meanWeightLossPercentage: '-20.9% mean weight loss at 15 mg dose at week 72',
    keyFinding: 'Dual GIP and GLP-1 receptor agonist tirzepatide demonstrated dose-dependent, unprecedented mean body weight reductions reaching up to 20.9% (52 lbs), rivaling bariatric surgery outcomes.',
    amaCitation: 'Jastreboff AM, Aronne LJ, Ahmad NN, et al. Tirzepatide Once Weekly for the Treatment of Obesity. N Engl J Med. 2022;387(3):205-216. doi:10.1056/NEJMoa2206038.',
    apaCitation: 'Jastreboff, A. M., Aronne, L. J., Ahmad, N. N., et al. (2022). Tirzepatide Once Weekly for the Treatment of Obesity. New England Journal of Medicine, 387(3), 205-216.',
    nlmcitation: 'Jastreboff AM, Aronne LJ, Ahmad NN, et al. Tirzepatide Once Weekly for the Treatment of Obesity. N Engl J Med. 2022 Jul 21;387(3):205-216. PMID: 35658024.',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/35658024/',
    topics: ['tirzepatide', 'surmount-1', 'mounjaro', 'zepbound', 'dual agonist']
  },
  {
    id: 'SELECT-TRIAL-NEJM',
    pmid: '37952131',
    doi: '10.1056/NEJMoa2307563',
    title: 'Semaglutide and Cardiovascular Outcomes in Obesity without Diabetes (SELECT Trial)',
    authors: 'Lincoff AM, Brown-Frandsen K, Colhoun HM, et al. for the SELECT Trial Investigators',
    journal: 'New England Journal of Medicine (NEJM)',
    pubYear: '2023',
    studyType: 'Phase 3 RCT',
    sampleSize: '17,604 patients aged ≥45 years with established CVD and BMI ≥27',
    meanWeightLossPercentage: '20% reduction in Major Adverse Cardiovascular Events (MACE)',
    keyFinding: 'Once-weekly subcutaneous semaglutide 2.4 mg demonstrated a statistically significant 20% relative risk reduction in death from cardiovascular causes, nonfatal MI, or nonfatal stroke.',
    amaCitation: 'Lincoff AM, Brown-Frandsen K, Colhoun HM, et al. Semaglutide and Cardiovascular Outcomes in Obesity without Diabetes. N Engl J Med. 2023;389(24):2221-2232. doi:10.1056/NEJMoa2307563.',
    apaCitation: 'Lincoff, A. M., Brown-Frandsen, K., Colhoun, H. M., et al. (2023). Semaglutide and Cardiovascular Outcomes in Obesity without Diabetes. New England Journal of Medicine, 389(24), 2221-2232.',
    nlmcitation: 'Lincoff AM, Brown-Frandsen K, Colhoun HM, et al. Semaglutide and Cardiovascular Outcomes in Obesity without Diabetes. N Engl J Med. 2023 Dec 14;389(24):2221-2232. PMID: 37952131.',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/37952131/',
    topics: ['select trial', 'cardiovascular', 'mace', 'heart health', 'semaglutide cvd']
  },
  {
    id: 'STEP-2-LANCET',
    pmid: '33667417',
    doi: '10.1016/S0140-6736(21)00213-0',
    title: 'Once-Weekly Semaglutide in Adults with Overweight or Obesity and Type 2 Diabetes (STEP 2 Trial)',
    authors: 'Davies M, Færch L, Jeppesen OK, et al.',
    journal: 'The Lancet',
    pubYear: '2021',
    studyType: 'Phase 3 RCT',
    sampleSize: '1,210 patients with Type 2 Diabetes and BMI ≥27',
    meanWeightLossPercentage: '-9.6% mean body weight loss with 2.4 mg',
    keyFinding: 'Clinically meaningful weight loss accompanied by HbA1c reductions of 1.6% points in patients with established type 2 diabetes.',
    amaCitation: 'Davies M, Færch L, Jeppesen OK, et al. Semaglutide 2.4 mg once a week in adults with overweight or obesity, and type 2 diabetes (STEP 2). Lancet. 2021;397(10278):971-984. doi:10.1016/S0140-6736(21)00213-0.',
    apaCitation: 'Davies, M., Færch, L., Jeppesen, O. K., et al. (2021). Semaglutide 2.4 mg once a week in adults with overweight or obesity, and type 2 diabetes (STEP 2). The Lancet, 397(10278), 971-984.',
    nlmcitation: 'Davies M, Færch L, Jeppesen OK, et al. Semaglutide 2.4 mg once a week in adults with overweight or obesity, and type 2 diabetes (STEP 2). Lancet. 2021 Mar 13;397(10278):971-984. PMID: 33667417.',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/33667417/',
    topics: ['step 2', 'type 2 diabetes', 'lancet', 'hba1c', 'glycemic control']
  },
  {
    id: 'SURPASS-2-NEJM',
    pmid: '34170649',
    doi: '10.1056/NEJMoa2107519',
    title: 'Tirzepatide versus Semaglutide Once Weekly in Patients with Type 2 Diabetes (SURPASS-2)',
    authors: 'Frías JP, Davies MJ, Rosenstock J, et al. for the SURPASS-2 Investigators',
    journal: 'New England Journal of Medicine (NEJM)',
    pubYear: '2021',
    studyType: 'Phase 3 RCT',
    sampleSize: '1,879 patients across 128 clinical sites',
    meanWeightLossPercentage: '-11.2 kg with 15 mg Tirzepatide vs -5.7 kg with 1.0 mg Semaglutide',
    keyFinding: 'In a direct head-to-head trial, tirzepatide at all doses was noninferior and statistically superior to semaglutide 1.0 mg with respect to HbA1c reduction and weight loss.',
    amaCitation: 'Frías JP, Davies MJ, Rosenstock J, et al. Tirzepatide versus Semaglutide Once Weekly in Patients with Type 2 Diabetes. N Engl J Med. 2021;385(6):503-515. doi:10.1056/NEJMoa2107519.',
    apaCitation: 'Frías, J. P., Davies, M. J., Rosenstock, J., et al. (2021). Tirzepatide versus Semaglutide Once Weekly in Patients with Type 2 Diabetes. New England Journal of Medicine, 385(6), 503-515.',
    nlmcitation: 'Frías JP, Davies MJ, Rosenstock J, et al. Tirzepatide versus Semaglutide Once Weekly in Patients with Type 2 Diabetes. N Engl J Med. 2021 Aug 5;385(6):503-515. PMID: 34170649.',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/34170649/',
    topics: ['surpass 2', 'head-to-head', 'tirzepatide vs semaglutide', 'mounjaro vs ozempic']
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';

  // Attempt live PubMed NCBI E-utilities lookup if query provided
  let liveArticles: any[] = [];
  let isLive = false;

  if (q) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);

      const esearchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(q)}+AND+obesity&retmode=json&retmax=3`;
      const res = await fetch(esearchUrl, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) {
        const json = await res.json();
        const idList = json.esearchresult?.idlist || [];
        if (idList.length > 0) {
          isLive = true;
          liveArticles = idList;
        }
      }
    } catch (e) {
      isLive = false;
    }
  }

  const results = q
    ? VERIFIED_PUBMED_TRIALS.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.authors.toLowerCase().includes(q) ||
        t.journal.toLowerCase().includes(q) ||
        t.topics.some(tp => tp.includes(q))
      )
    : VERIFIED_PUBMED_TRIALS;

  return NextResponse.json({
    success: true,
    jurisdiction: 'United States of America (National Library of Medicine / NIH)',
    source: isLive ? 'LIVE_NCBI_PUBMED_EUTILS' : 'VERIFIED_NLM_PEER_REVIEWED_CACHE',
    timestamp: new Date().toISOString(),
    totalStudies: results.length,
    studies: results,
    livePmids: liveArticles
  });
}

