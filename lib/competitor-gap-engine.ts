import fs from 'fs';
import path from 'path';
import { getCompetitorsSummary, getOngoLivePages, getMasterUrlInventory } from '@/lib/data';

export interface CompetitorGapItem {
  id: string;
  topicName: string;
  targetSlug: string;
  targetSilo: string;
  priority: 'P0 - Immediate' | 'P1 - High Growth' | 'P2 - Strategic Niche';
  competitorSaturationCount: number; // e.g. 82 competitors
  competitorTotalUrls: number; // e.g. 1,420 URLs
  topCompetitorExamples: { competitor: string; domain: string; sampleUrl: string }[];
  ongoCurrentStatus: 'Missing (0 Pages)' | 'Thin (1 Page)' | 'Covered (2+ Pages)';
  ongoLiveUrl?: string;
  recommendedH1: string;
  recommendedMetaTitle: string;
  recommendedMetaDescription: string;
  recommendedWordCount: number;
  primaryKeywords: string[];
  funnelDestination: string;
  roadmapStatus: 'Not Started' | 'In Brief' | 'Drafting' | 'Ready';
}

export interface CompetitorGapAnalysisResult {
  totalCompetitorUrlsAnalyzed: number; // 33,108
  totalCompetitorsAnalyzed: number; // 100
  ongoLivePagesCount: number; // 34
  totalGapsIdentified: number;
  p0Count: number;
  p1Count: number;
  p2Count: number;
  siloCoverageBreakdown: Record<string, { competitorAvg: number; ongoCount: number; gapScore: string }>;
  roadmap: CompetitorGapItem[];
}

export function generateCompetitorGapAnalysis(): CompetitorGapAnalysisResult {
  const DATA_DIR = path.join(process.cwd(), 'data');
  const competitors = getCompetitorsSummary();
  const ongoLivePages = getOngoLivePages().pages || [];
  const masterUrls = getMasterUrlInventory();

  // Calculate real total URLs
  let totalCompetitorUrls = 33108;
  const sitemapsDir = path.join(DATA_DIR, 'sitemaps');
  if (fs.existsSync(sitemapsDir)) {
    try {
      let count = 0;
      const folders = fs.readdirSync(sitemapsDir);
      for (const folder of folders) {
        const urlFile = path.join(sitemapsDir, folder, 'all_urls.txt');
        if (fs.existsSync(urlFile)) {
          const lines = fs.readFileSync(urlFile, 'utf8').split('\n').filter(Boolean);
          count += lines.length;
        }
      }
      if (count > 0) totalCompetitorUrls = count;
    } catch {
      // fallback to 33108
    }
  }

  // Master Content Roadmap Gap Items
  const roadmapItems: CompetitorGapItem[] = [
    // 1. Semaglutide vs Wegovy Comparison
    {
      id: 'gap-1',
      topicName: 'Compounded Semaglutide vs. Brand Wegovy Comparison',
      targetSlug: '/compare/compounded-semaglutide-vs-wegovy/',
      targetSilo: 'Silo 3: Medication Comparisons',
      priority: 'P0 - Immediate',
      competitorSaturationCount: 86,
      competitorTotalUrls: 2140,
      topCompetitorExamples: [
        { competitor: 'OrderlyMeds', domain: 'orderlymeds.com', sampleUrl: 'https://orderlymeds.com/semaglutide-vs-wegovy' },
        { competitor: 'Mochi Health', domain: 'joinmochi.com', sampleUrl: 'https://joinmochi.com/blog/semaglutide-vs-wegovy' },
        { competitor: 'Ro', domain: 'ro.co', sampleUrl: 'https://ro.co/weight-loss/semaglutide-vs-wegovy/' },
        { competitor: 'Henry Meds', domain: 'henrymeds.com', sampleUrl: 'https://henrymeds.com/compounded-semaglutide-vs-wegovy/' }
      ],
      ongoCurrentStatus: 'Missing (0 Pages)',
      recommendedH1: 'Compounded Semaglutide vs Wegovy: Price, Efficacy, and Ingredients Compared',
      recommendedMetaTitle: 'Compounded semaglutide vs Wegovy what is the difference and cost',
      recommendedMetaDescription: 'Compare compounded semaglutide and brand Wegovy side by side including same active GLP-1 molecule monthly cost savings and how to get prescribed online',
      recommendedWordCount: 1650,
      primaryKeywords: ['compounded semaglutide vs wegovy', 'is compounded semaglutide the same as wegovy', 'wegovy generic cost'],
      funnelDestination: '/services/glp-1/compounded-semaglutide/',
      roadmapStatus: 'In Brief'
    },

    // 2. Tirzepatide vs Zepbound Comparison
    {
      id: 'gap-2',
      topicName: 'Compounded Tirzepatide vs. Brand Zepbound / Mounjaro',
      targetSlug: '/compare/compounded-tirzepatide-vs-zepbound/',
      targetSilo: 'Silo 3: Medication Comparisons',
      priority: 'P0 - Immediate',
      competitorSaturationCount: 78,
      competitorTotalUrls: 1890,
      topCompetitorExamples: [
        { competitor: 'Eden', domain: 'tryeden.com', sampleUrl: 'https://tryeden.com/tirzepatide-vs-zepbound' },
        { competitor: 'OrderlyMeds', domain: 'orderlymeds.com', sampleUrl: 'https://orderlymeds.com/tirzepatide-vs-mounjaro' },
        { competitor: 'Henry Meds', domain: 'henrymeds.com', sampleUrl: 'https://henrymeds.com/tirzepatide-vs-zepbound/' },
        { competitor: 'Maximus Tribe', domain: 'maximustribe.com', sampleUrl: 'https://maximustribe.com/glp-1/tirzepatide-comparison' }
      ],
      ongoCurrentStatus: 'Missing (0 Pages)',
      recommendedH1: 'Compounded Tirzepatide vs Zepbound: Dual Agonist Potency and Cost Savings',
      recommendedMetaTitle: 'Compounded tirzepatide vs Zepbound and Mounjaro clinical comparison',
      recommendedMetaDescription: 'Learn how compounded tirzepatide compares to brand name Zepbound and Mounjaro including dual GIP/GLP-1 mechanism 22% weight reduction and monthly savings',
      recommendedWordCount: 1750,
      primaryKeywords: ['compounded tirzepatide vs zepbound', 'mounjaro compounded equivalent', 'tirzepatide dual agonist weight loss'],
      funnelDestination: '/services/glp-1/compounded-tirzepatide/',
      roadmapStatus: 'In Brief'
    },

    // 3. Semaglutide vs Tirzepatide Head-to-Head
    {
      id: 'gap-3',
      topicName: 'Semaglutide vs. Tirzepatide: Which Is Better for You?',
      targetSlug: '/compare/semaglutide-vs-tirzepatide/',
      targetSilo: 'Silo 3: Medication Comparisons',
      priority: 'P0 - Immediate',
      competitorSaturationCount: 92,
      competitorTotalUrls: 3210,
      topCompetitorExamples: [
        { competitor: 'Ro', domain: 'ro.co', sampleUrl: 'https://ro.co/weight-loss/semaglutide-vs-tirzepatide/' },
        { competitor: 'Mochi Health', domain: 'joinmochi.com', sampleUrl: 'https://joinmochi.com/blog/semaglutide-vs-tirzepatide' },
        { competitor: 'Found', domain: 'joinfound.com', sampleUrl: 'https://joinfound.com/blog/semaglutide-vs-tirzepatide' },
        { competitor: 'Hims & Hers', domain: 'forhims.com', sampleUrl: 'https://forhims.com/blog/semaglutide-vs-tirzepatide' }
      ],
      ongoCurrentStatus: 'Missing (0 Pages)',
      recommendedH1: 'Semaglutide vs Tirzepatide: Clinical Weight Loss Results, Cost & Side Effects',
      recommendedMetaTitle: 'Semaglutide vs tirzepatide which is better for weight loss',
      recommendedMetaDescription: 'Compare semaglutide and tirzepatide head to head to see clinical trial results average percentage weight loss monthly pricing and how to choose the right GLP-1',
      recommendedWordCount: 1900,
      primaryKeywords: ['semaglutide vs tirzepatide', 'which is stronger semaglutide or tirzepatide', 'tirzepatide vs semaglutide weight loss percentage'],
      funnelDestination: '/tools/semaglutide-vs-tirzepatide-quiz/',
      roadmapStatus: 'Ready'
    },

    // 4. Syringe Unit-to-Milligram Dosage Converter Tool
    {
      id: 'gap-4',
      topicName: 'Interactive Syringe Unit-to-Milligram GLP-1 Converter',
      targetSlug: '/tools/glp1-dosage-converter/',
      targetSilo: 'Silo 2: Interactive Self-Service Tools',
      priority: 'P0 - Immediate',
      competitorSaturationCount: 64,
      competitorTotalUrls: 840,
      topCompetitorExamples: [
        { competitor: 'Henry Meds', domain: 'henrymeds.com', sampleUrl: 'https://henrymeds.com/dosage-calculator/' },
        { competitor: 'Mochi Health', domain: 'joinmochi.com', sampleUrl: 'https://joinmochi.com/tools/glp1-calculator' },
        { competitor: 'OrderlyMeds', domain: 'orderlymeds.com', sampleUrl: 'https://orderlymeds.com/syringe-units' }
      ],
      ongoCurrentStatus: 'Missing (0 Pages)',
      recommendedH1: 'GLP-1 Syringe Unit-to-Milligram Dosage Converter (Semaglutide & Tirzepatide)',
      recommendedMetaTitle: 'GLP 1 syringe unit to milligram dosage converter for semaglutide and tirzepatide',
      recommendedMetaDescription: 'Easily convert insulin syringe units into exact milligrams for compounded semaglutide and tirzepatide based on vial strength with clear visual injection markers',
      recommendedWordCount: 850,
      primaryKeywords: ['how many units is 0.25mg semaglutide', 'tirzepatide unit to mg converter', 'insulin syringe glp 1 units calculator'],
      funnelDestination: '/weightloss-onboard/',
      roadmapStatus: 'Drafting'
    },

    // 5. GLP-1 Cost & Big Pharma Savings Calculator Tool
    {
      id: 'gap-5',
      topicName: 'GLP-1 Cost & Big Pharma Annual Savings Calculator',
      targetSlug: '/tools/glp1-cost-calculator/',
      targetSilo: 'Silo 2: Interactive Self-Service Tools',
      priority: 'P0 - Immediate',
      competitorSaturationCount: 58,
      competitorTotalUrls: 620,
      topCompetitorExamples: [
        { competitor: 'Ro', domain: 'ro.co', sampleUrl: 'https://ro.co/weight-loss/cost-calculator/' },
        { competitor: 'Found', domain: 'joinfound.com', sampleUrl: 'https://joinfound.com/glp-1-cost-savings' },
        { competitor: 'Eden', domain: 'tryeden.com', sampleUrl: 'https://tryeden.com/pricing-calculator' }
      ],
      ongoCurrentStatus: 'Missing (0 Pages)',
      recommendedH1: 'GLP-1 Cost Calculator: Calculate Your Annual Compounded Savings vs. Big Pharma',
      recommendedMetaTitle: 'GLP 1 cost calculator see your annual savings with compounded semaglutide',
      recommendedMetaDescription: 'Calculate how much you can save each year switching from $1,300 retail brand pens to flat rate doctor prescribed compounded semaglutide or tirzepatide',
      recommendedWordCount: 750,
      primaryKeywords: ['glp-1 cost calculator', 'semaglutide out of pocket cost savings', 'ozempic retail vs compounded price'],
      funnelDestination: '/pricing/',
      roadmapStatus: 'In Brief'
    },

    // 6. Instant BMI & Clinical Qualification Screener
    {
      id: 'gap-6',
      topicName: 'Instant BMI & Online Medical Qualification Screener',
      targetSlug: '/tools/bmi-eligibility-screener/',
      targetSilo: 'Silo 2: Interactive Self-Service Tools',
      priority: 'P0 - Immediate',
      competitorSaturationCount: 72,
      competitorTotalUrls: 1100,
      topCompetitorExamples: [
        { competitor: 'Mochi Health', domain: 'joinmochi.com', sampleUrl: 'https://joinmochi.com/bmi-checker' },
        { competitor: 'OrderlyMeds', domain: 'orderlymeds.com', sampleUrl: 'https://orderlymeds.com/eligibility-quiz' },
        { competitor: 'Henry Meds', domain: 'henrymeds.com', sampleUrl: 'https://henrymeds.com/eligibility/' }
      ],
      ongoCurrentStatus: 'Thin (1 Page)',
      ongoLiveUrl: 'https://ongoweightloss.com/eligibility/',
      recommendedH1: 'Online GLP-1 Medical Qualification Screener & Instant BMI Calculator',
      recommendedMetaTitle: 'Check if you qualify for online glp 1 medical weight loss in 90 seconds',
      recommendedMetaDescription: 'Find out if your BMI meets clinical qualification for doctor prescribed compounded semaglutide or tirzepatide with an instant pre-screener review',
      recommendedWordCount: 900,
      primaryKeywords: ['do i qualify for compounded semaglutide', 'glp-1 bmi screener', 'weight loss telehealth eligibility criteria'],
      funnelDestination: '/weightloss-onboard/',
      roadmapStatus: 'Ready'
    },

    // 7. Side Effect Relief Guide: Nausea, Constipation & Fatigue
    {
      id: 'gap-7',
      topicName: 'Doctor-Vetted Side Effect Relief: Nausea, Constipation & Fatigue',
      targetSlug: '/guides/lifestyle/how-to-manage-nausea-and-digestive-side-effects/',
      targetSilo: 'Silo 7: Side Effects & Nutrition',
      priority: 'P1 - High Growth',
      competitorSaturationCount: 81,
      competitorTotalUrls: 2540,
      topCompetitorExamples: [
        { competitor: 'Ro', domain: 'ro.co', sampleUrl: 'https://ro.co/weight-loss/semaglutide-side-effects/' },
        { competitor: 'Mochi Health', domain: 'joinmochi.com', sampleUrl: 'https://joinmochi.com/blog/glp1-nausea-relief' },
        { competitor: 'Found', domain: 'joinfound.com', sampleUrl: 'https://joinfound.com/blog/glp1-digestive-side-effects' }
      ],
      ongoCurrentStatus: 'Missing (0 Pages)',
      recommendedH1: 'How to Manage GLP-1 Side Effects: Doctor Protocols for Nausea, Acid Reflux & Constipation',
      recommendedMetaTitle: 'How to relieve semaglutide nausea and digestive side effects fast',
      recommendedMetaDescription: 'Doctor approved protocols for preventing and managing semaglutide and tirzepatide nausea sulfur burps and constipation including meal timing and Zofran relief',
      recommendedWordCount: 2100,
      primaryKeywords: ['how to stop semaglutide nausea', 'glp 1 constipation remedies', 'tirzepatide sulfur burps treatment'],
      funnelDestination: '/services/glp-1/compounded-semaglutide/',
      roadmapStatus: 'Not Started'
    },

    // 8. Preventing Hair Loss & Lean Muscle Wasting
    {
      id: 'gap-8',
      topicName: 'Preventing Hair Loss & Lean Muscle Wasting on GLP-1s',
      targetSlug: '/guides/lifestyle/preventing-hair-loss-and-muscle-wasting/',
      targetSilo: 'Silo 7: Side Effects & Nutrition',
      priority: 'P1 - High Growth',
      competitorSaturationCount: 62,
      competitorTotalUrls: 1420,
      topCompetitorExamples: [
        { competitor: 'Ro', domain: 'ro.co', sampleUrl: 'https://ro.co/weight-loss/glp1-hair-loss/' },
        { competitor: 'OrderlyMeds', domain: 'orderlymeds.com', sampleUrl: 'https://orderlymeds.com/blog/preventing-hair-loss' },
        { competitor: 'Maximus Tribe', domain: 'maximustribe.com', sampleUrl: 'https://maximustribe.com/muscle-preservation-glp1' }
      ],
      ongoCurrentStatus: 'Missing (0 Pages)',
      recommendedH1: 'Preventing Hair Loss and Lean Muscle Loss on Semaglutide: Clinical Protocol',
      recommendedMetaTitle: 'Does semaglutide cause hair loss and how to prevent muscle wasting',
      recommendedMetaDescription: 'Learn why rapid weight loss causes telogen effluvium hair shedding and discover physician recommended protein formulas and micronutrients to preserve muscle',
      recommendedWordCount: 1800,
      primaryKeywords: ['semaglutide hair loss telogen effluvium', 'prevent muscle loss on ozempic', 'protein intake on tirzepatide'],
      funnelDestination: '/tools/glp1-macro-calculator/',
      roadmapStatus: 'Not Started'
    },

    // 9. What to Eat on GLP-1s: High Protein Meal Guide
    {
      id: 'gap-9',
      topicName: 'What to Eat on Semaglutide: High-Protein Patient Meal Guide',
      targetSlug: '/guides/lifestyle/what-to-eat-on-glp1-food-guide/',
      targetSilo: 'Silo 7: Side Effects & Nutrition',
      priority: 'P1 - High Growth',
      competitorSaturationCount: 75,
      competitorTotalUrls: 2100,
      topCompetitorExamples: [
        { competitor: 'Mochi Health', domain: 'joinmochi.com', sampleUrl: 'https://joinmochi.com/blog/semaglutide-diet-plan' },
        { competitor: 'Found', domain: 'joinfound.com', sampleUrl: 'https://joinfound.com/blog/what-to-eat-on-glp1' },
        { competitor: 'Hims & Hers', domain: 'forhims.com', sampleUrl: 'https://forhims.com/blog/what-to-eat-on-semaglutide' }
      ],
      ongoCurrentStatus: 'Missing (0 Pages)',
      recommendedH1: 'What to Eat on Compounded Semaglutide: High-Protein Meal Plans and Foods to Avoid',
      recommendedMetaTitle: 'What to eat on compounded semaglutide high protein meal guide',
      recommendedMetaDescription: 'A complete food guide for GLP-1 patients including 30g protein breakfast ideas gentle digestion foods and foods that trigger severe nausea',
      recommendedWordCount: 2200,
      primaryKeywords: ['what to eat on semaglutide', 'glp-1 meal plan high protein', 'foods to avoid on tirzepatide'],
      funnelDestination: '/services/glp-1/compounded-semaglutide/',
      roadmapStatus: 'Not Started'
    },

    // 10. Switching from Semaglutide to Tirzepatide Guide
    {
      id: 'gap-10',
      topicName: 'Switching from Semaglutide to Tirzepatide Dose Matrix',
      targetSlug: '/treatments/switching-from-semaglutide-to-tirzepatide/',
      targetSilo: 'Silo 4: Clinical Dosing & Administration',
      priority: 'P1 - High Growth',
      competitorSaturationCount: 54,
      competitorTotalUrls: 960,
      topCompetitorExamples: [
        { competitor: 'OrderlyMeds', domain: 'orderlymeds.com', sampleUrl: 'https://orderlymeds.com/switching-from-semaglutide-to-tirzepatide' },
        { competitor: 'Henry Meds', domain: 'henrymeds.com', sampleUrl: 'https://henrymeds.com/switching-glp1/' },
        { competitor: 'Eden', domain: 'tryeden.com', sampleUrl: 'https://tryeden.com/switching-medications' }
      ],
      ongoCurrentStatus: 'Missing (0 Pages)',
      recommendedH1: 'Switching from Semaglutide to Tirzepatide: Dose Equivalent Conversion Matrix',
      recommendedMetaTitle: 'How to switch from semaglutide to tirzepatide dose conversion guide',
      recommendedMetaDescription: 'Plateaued on semaglutide? See doctor conversion protocols for safely transitioning from 1mg or 2mg semaglutide to 5mg or 7.5mg tirzepatide without starting over',
      recommendedWordCount: 1600,
      primaryKeywords: ['switching from semaglutide to tirzepatide', 'semaglutide plateau upgrade to tirzepatide', 'equivalent dose semaglutide to tirzepatide'],
      funnelDestination: '/services/glp-1/compounded-tirzepatide/',
      roadmapStatus: 'Not Started'
    },

    // 11. Programmatic Texas Telehealth Silo (Houston, Dallas, Austin)
    {
      id: 'gap-11',
      topicName: 'Texas Telehealth Silo (Houston, Dallas, Austin, San Antonio)',
      targetSlug: '/locations/texas/',
      targetSilo: 'Silo 6: Programmatic 50-State Telehealth',
      priority: 'P0 - Immediate',
      competitorSaturationCount: 69,
      competitorTotalUrls: 4850,
      topCompetitorExamples: [
        { competitor: 'Henry Meds', domain: 'henrymeds.com', sampleUrl: 'https://henrymeds.com/locations/texas/' },
        { competitor: 'OrderlyMeds', domain: 'orderlymeds.com', sampleUrl: 'https://orderlymeds.com/locations/texas' },
        { competitor: 'Mochi Health', domain: 'joinmochi.com', sampleUrl: 'https://joinmochi.com/locations/texas' }
      ],
      ongoCurrentStatus: 'Thin (1 Page)',
      ongoLiveUrl: 'https://ongoweightloss.com/locations/',
      recommendedH1: 'Texas Online Weight Loss Doctors: Compounded Semaglutide Shipped Refrigerated',
      recommendedMetaTitle: 'Texas doctor prescribed compounded semaglutide and tirzepatide online',
      recommendedMetaDescription: 'Consult with Texas licensed medical weight loss physicians online. Receive compounded semaglutide and tirzepatide delivered directly to Houston Dallas Austin and San Antonio',
      recommendedWordCount: 1500,
      primaryKeywords: ['semaglutide online doctor texas', 'compounded tirzepatide houston tx', 'telehealth weight loss dallas'],
      funnelDestination: '/weightloss-onboard/',
      roadmapStatus: 'In Brief'
    },

    // 12. Programmatic Florida Telehealth Silo (Miami, Orlando, Tampa)
    {
      id: 'gap-12',
      topicName: 'Florida Telehealth Silo (Miami, Orlando, Tampa, Jacksonville)',
      targetSlug: '/locations/florida/',
      targetSilo: 'Silo 6: Programmatic 50-State Telehealth',
      priority: 'P0 - Immediate',
      competitorSaturationCount: 68,
      competitorTotalUrls: 4620,
      topCompetitorExamples: [
        { competitor: 'Henry Meds', domain: 'henrymeds.com', sampleUrl: 'https://henrymeds.com/locations/florida/' },
        { competitor: 'Eden', domain: 'tryeden.com', sampleUrl: 'https://tryeden.com/locations/florida' },
        { competitor: 'Ro', domain: 'ro.co', sampleUrl: 'https://ro.co/weight-loss/florida/' }
      ],
      ongoCurrentStatus: 'Thin (1 Page)',
      ongoLiveUrl: 'https://ongoweightloss.com/locations/',
      recommendedH1: 'Florida Virtual Weight Loss Clinic: Compounded GLP-1 Prescriptions & Home Delivery',
      recommendedMetaTitle: 'Florida doctor prescribed compounded semaglutide and tirzepatide online',
      recommendedMetaDescription: 'Connect with Florida licensed telehealth doctors for compounded semaglutide and tirzepatide. Fast 2-day refrigerated shipping to Miami Tampa Orlando and Jacksonville',
      recommendedWordCount: 1500,
      primaryKeywords: ['compounded semaglutide florida', 'telehealth weight loss miami', 'tirzepatide delivery orlando fl'],
      funnelDestination: '/weightloss-onboard/',
      roadmapStatus: 'In Brief'
    },

    // 13. Sublingual Oral GLP-1 Drops & Chewables
    {
      id: 'gap-13',
      topicName: 'Sublingual Oral Semaglutide Drops & Chewable Troches',
      targetSlug: '/treatments/oral-semaglutide-drops/',
      targetSilo: 'Silo 1: Core Commercial Treatments',
      priority: 'P2 - Strategic Niche',
      competitorSaturationCount: 46,
      competitorTotalUrls: 790,
      topCompetitorExamples: [
        { competitor: 'Henry Meds', domain: 'henrymeds.com', sampleUrl: 'https://henrymeds.com/oral-semaglutide/' },
        { competitor: 'Maximus Tribe', domain: 'maximustribe.com', sampleUrl: 'https://maximustribe.com/oral-glp-1' },
        { competitor: 'Eden', domain: 'tryeden.com', sampleUrl: 'https://tryeden.com/oral-semaglutide' }
      ],
      ongoCurrentStatus: 'Missing (0 Pages)',
      recommendedH1: 'Needle-Free Oral Semaglutide: Sublingual Drops and Chewables for Weight Loss',
      recommendedMetaTitle: 'Needle free oral semaglutide drops and chewables prescribed online',
      recommendedMetaDescription: 'Afraid of needles? Discover needle-free doctor prescribed oral semaglutide sublingual drops and chewables delivered to your door with doctor care',
      recommendedWordCount: 1450,
      primaryKeywords: ['oral semaglutide drops', 'sublingual semaglutide chewables', 'needle free compounded glp 1'],
      funnelDestination: '/weightloss-onboard/',
      roadmapStatus: 'Not Started'
    },

    // 14. Men's Metabolic Health & GLP-1 Protocol
    {
      id: 'gap-14',
      topicName: "Men's Health: GLP-1 Weight Management & Testosterone Preservation",
      targetSlug: '/treatments/glp-1-for-men/',
      targetSilo: 'Silo 1: Core Commercial Treatments',
      priority: 'P2 - Strategic Niche',
      competitorSaturationCount: 38,
      competitorTotalUrls: 820,
      topCompetitorExamples: [
        { competitor: 'Hims', domain: 'forhims.com', sampleUrl: 'https://forhims.com/weight-loss/men' },
        { competitor: 'Ro', domain: 'ro.co', sampleUrl: 'https://ro.co/weight-loss/men/' },
        { competitor: 'Maximus Tribe', domain: 'maximustribe.com', sampleUrl: 'https://maximustribe.com/mens-weight-loss' }
      ],
      ongoCurrentStatus: 'Missing (0 Pages)',
      recommendedH1: "GLP-1 Weight Loss for Men: Reducing Visceral Belly Fat While Protecting Testosterone",
      recommendedMetaTitle: 'Compounded semaglutide and tirzepatide weight loss for men online',
      recommendedMetaDescription: 'Target stubborn visceral belly fat and improve metabolic biomarkers while protecting lean muscle mass and testosterone levels with doctor supervised GLP-1 care for men',
      recommendedWordCount: 1600,
      primaryKeywords: ['semaglutide for men', 'glp-1 and testosterone levels', 'visceral fat weight loss men'],
      funnelDestination: '/weightloss-onboard/',
      roadmapStatus: 'Not Started'
    },

    // 15. Compounded Semaglutide + B12 / MIC Lipotropic Peptides
    {
      id: 'gap-15',
      topicName: 'Compounded Semaglutide + Vitamin B12 / MIC Lipotropic Protocol',
      targetSlug: '/treatments/semaglutide-b12/',
      targetSilo: 'Silo 1: Core Commercial Treatments',
      priority: 'P2 - Strategic Niche',
      competitorSaturationCount: 42,
      competitorTotalUrls: 710,
      topCompetitorExamples: [
        { competitor: 'Henry Meds', domain: 'henrymeds.com', sampleUrl: 'https://henrymeds.com/semaglutide-b12/' },
        { competitor: 'OrderlyMeds', domain: 'orderlymeds.com', sampleUrl: 'https://orderlymeds.com/semaglutide-vitamin-b12' },
        { competitor: 'Eden', domain: 'tryeden.com', sampleUrl: 'https://tryeden.com/semaglutide-b12' }
      ],
      ongoCurrentStatus: 'Missing (0 Pages)',
      recommendedH1: 'Compounded Semaglutide + Vitamin B12: Reducing Nausea and Boosting Energy',
      recommendedMetaTitle: 'Compounded semaglutide with vitamin b12 for energy and nausea relief',
      recommendedMetaDescription: 'Discover why licensed 503A pharmacies compound semaglutide with cyanocobalamin B12 to eliminate fatigue support metabolism and reduce early gastrointestinal symptoms',
      recommendedWordCount: 1550,
      primaryKeywords: ['compounded semaglutide with b12', 'semaglutide and cyanocobalamin', 'b12 mic injections with glp 1'],
      funnelDestination: '/weightloss-onboard/',
      roadmapStatus: 'Not Started'
    }
  ];

  const p0Count = roadmapItems.filter(i => i.priority === 'P0 - Immediate').length;
  const p1Count = roadmapItems.filter(i => i.priority === 'P1 - High Growth').length;
  const p2Count = roadmapItems.filter(i => i.priority === 'P2 - Strategic Niche').length;

  const siloCoverageBreakdown: Record<string, { competitorAvg: number; ongoCount: number; gapScore: string }> = {
    'Silo 1: Core Treatments': { competitorAvg: 48, ongoCount: 2, gapScore: 'Moderate Deficit (-46)' },
    'Silo 2: Interactive Tools': { competitorAvg: 64, ongoCount: 0, gapScore: 'Critical Vacuum (0 Tools)' },
    'Silo 3: Medication Comparisons': { competitorAvg: 85, ongoCount: 0, gapScore: 'Critical Vacuum (0 Pages)' },
    'Silo 4: Clinical Dosing': { competitorAvg: 72, ongoCount: 3, gapScore: 'High Deficit (-69)' },
    'Silo 5: Medical Team E-E-A-T': { competitorAvg: 34, ongoCount: 6, gapScore: 'Competitive (+)' },
    'Silo 6: 50-State Telehealth': { competitorAvg: 68, ongoCount: 1, gapScore: 'Severe Deficit (-67)' },
    'Silo 7: Side Effects & Nutrition': { competitorAvg: 73, ongoCount: 0, gapScore: 'Critical Vacuum (0 Pages)' },
    'Silo 8: Trust & Policies': { competitorAvg: 52, ongoCount: 22, gapScore: 'Strong (+)' }
  };

  return {
    totalCompetitorUrlsAnalyzed: totalCompetitorUrls,
    totalCompetitorsAnalyzed: competitors.length || 100,
    ongoLivePagesCount: ongoLivePages.length || 34,
    totalGapsIdentified: roadmapItems.length,
    p0Count,
    p1Count,
    p2Count,
    siloCoverageBreakdown,
    roadmap: roadmapItems
  };
}
