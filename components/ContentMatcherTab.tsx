'use client';

import React, { useState, useMemo } from 'react';
import { 
  FileCheck2, 
  Search, 
  GitCompare, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ExternalLink, 
  Sparkles, 
  ArrowRight, 
  Download, 
  Copy, 
  Check, 
  Layers, 
  PieChart as PieIcon,
  Stethoscope,
  Link2,
  ListFilter,
  BarChart2,
  RefreshCw
} from 'lucide-react';
import { 
  analyzeContentAndChecklist, 
  generateHeadToHeadComparison, 
  COMPETITOR_BENCHMARK_PAGES, 
  CompetitorBenchmarkPage, 
  IntentBreakdown 
} from '@/lib/content-matcher-engine';
import { OngoLivePageItem } from '@/lib/data';
import ContextCue from './ContextCue';
import CustomUrlScanBar from './CustomUrlScanBar';

interface ContentMatcherTabProps {
  livePages?: OngoLivePageItem[];
}

// Default benchmark content for instant demo
const SAMPLE_ONGO_SEMAGLUTIDE_ARTICLE = `# Compounded Semaglutide for Weight Loss: Doctor-Supervised Clinical Guide

Semaglutide is a once-weekly glucagon-like peptide-1 (GLP-1) receptor agonist prescribed by licensed physicians to support healthy, sustainable weight loss. At Ongo Weight Loss, our board-certified medical doctors design personalized treatment programs tailored to your metabolic health, body mass index (BMI), and lifestyle goals.

## How Compounded Semaglutide Works in the Body
Semaglutide mimics the naturally occurring GLP-1 hormone produced in the intestine after meals. It works through three primary mechanisms:
* **Appetite Regulation:** Signals fullness to the hunger centers in the brain (hypothalamus), reducing intrusive food cravings.
* **Gastric Emptying:** Slows digestion so food remains in the stomach longer, keeping you satisfied on smaller meal portions.
* **Blood Sugar Stabilization:** Improves insulin response and reduces glucagon secretion in response to carbohydrate intake.

## Standard Dosage Titration Schedule
To minimize common gastrointestinal side effects like mild nausea, physician supervision requires starting at a low introductory dose and gradually titrating upward every 4 weeks:
* **Month 1 (Weeks 1–4):** 0.25 mg once weekly subcutaneously (Introductory adaptation phase)
* **Month 2 (Weeks 5–8):** 0.50 mg once weekly (Metabolic activation phase)
* **Month 3 (Weeks 9–12):** 1.00 mg once weekly (Therapeutic acceleration phase)
* **Month 4 (Weeks 13–16):** 1.70 mg once weekly (High-efficacy escalation phase)
* **Month 5+ (Maintenance):** 2.40 mg once weekly (Maximum therapeutic maintenance dose)

## Transparent Flat-Rate Pricing — No Insurance Required
Unlike retail pharmacies charging $1,000+ per month for commercial brand names like Ozempic or Wegovy, Ongo Weight Loss provides compounded semaglutide from state-licensed 503A compounding pharmacies at a predictable flat monthly rate:
* **$179 per month flat rate** — Includes medical consultation, physician dosage monitoring, medication, needles, and temperature-controlled cold shipping.
* **Zero hidden membership fees:** No separate monthly subscription charge.
* **$0 physician consult fee:** Clinical review is included in your monthly medication plan.

## Who Is Eligible for Medical Weight Loss?
Under clinical guidelines established by our medical directors, patients typically qualify if:
* BMI is 30 or greater (classified as obesity), OR
* BMI is 27 or greater accompanied by at least one weight-related condition such as hypertension, elevated cholesterol, or prediabetes.

## Quality & 503A Sterile Compounding Safety
All compounded semaglutide dispensed through Ongo is prepared by licensed 503A sterile compounding pharmacies complying with strict United States Pharmacopeia (USP <797>) standards. Every batch undergoes potency testing and sterility validation.

### Medically Reviewed by
Dr. Kenneth Kramer, MD &bull; Board-Certified Internal Medicine &bull; Medical Director, Ongo Weight Loss.`;

export default function ContentMatcherTab({ livePages = [] }: ContentMatcherTabProps) {
  const [inputText, setInputText] = useState(SAMPLE_ONGO_SEMAGLUTIDE_ARTICLE);
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string>('mochi-semaglutide');
  const [selectedOngoPageUrl, setSelectedOngoPageUrl] = useState<string>('');
  const [targetTitle, setTargetTitle] = useState('Compounded Semaglutide for Weight Loss | Ongo Clinical Guide');
  const [targetDesc, setTargetDesc] = useState('Doctor-supervised compounded semaglutide weight loss program with flat-rate $179 pricing, 503A sterile pharmacy shipping, and zero insurance requirements.');
  const [copiedLink, setCopiedLink] = useState(false);

  // Selected competitor benchmark
  const activeCompetitor = useMemo(() => {
    return COMPETITOR_BENCHMARK_PAGES.find(c => c.id === selectedCompetitorId) || COMPETITOR_BENCHMARK_PAGES[0];
  }, [selectedCompetitorId]);

  // Content analysis & checklist
  const analysis = useMemo(() => {
    return analyzeContentAndChecklist(inputText, {
      title: targetTitle,
      description: targetDesc
    });
  }, [inputText, targetTitle, targetDesc]);

  // Head-to-Head Comparison
  const comparison = useMemo(() => {
    return generateHeadToHeadComparison(inputText, activeCompetitor);
  }, [inputText, activeCompetitor]);

  // Handle Ongo Page Dropdown Selection
  const handleSelectOngoPage = (url: string) => {
    setSelectedOngoPageUrl(url);
    const found = livePages.find(p => p.url === url);
    if (found) {
      setTargetTitle(found.title || '');
      setTargetDesc(found.description || '');
      // Update draft text with a structured preview of the page
      setInputText(`# ${found.title || 'Page Content'}\n\n${found.description || ''}\n\n## Main Topics & Clinical Overview\n* ${found.primary_keyword || 'GLP-1 Weight Loss'}\n* Doctor consultation and physician review\n* Transparent monthly flat pricing and medication shipping\n\n### Clinical Intent & Audience\nTargeting search query: "${found.primary_keyword || 'compounded glp 1'}" with search intent ${found.intent || 'Commercial'}.\n\n[View Pricing](/pricing/) | [Check Eligibility](/eligibility/) | [Medical Team](/medical-team/)`);
    }
  };

  // Checklist score calculation
  const passedCount = analysis.checklist.filter(c => c.status === 'pass').length;
  const checklistScore = Math.round((passedCount / analysis.checklist.length) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Premium GSC / Clarity Header */}
      <div className="gsc-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="gsc-badge-healthy">
                <span className="gsc-pulse-dot" />
                Content Matcher &amp; SERP Intent Engine
              </span>
              <span className="gsc-badge-neutral">
                Score: {checklistScore}% Optimal
              </span>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Intent: <strong style={{ color: '#15803d' }}>{analysis.intent.primaryIntent}</strong> ({analysis.stats.wordCount} words)
              </span>
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f1715', margin: 0, letterSpacing: '-0.02em' }}>
              Content Matcher &amp; Competitor Head-to-Head Auditor
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#475569', margin: '4px 0 0 0' }}>
              Analyze page copy against search intent vectors, run automated on-page SEO checklists, and compare Ongo content head-to-head against ranking competitors.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                const csvContent = "data:text/csv;charset=utf-8," + 
                  "Checklist Item,Status,Value,Recommendation\n" +
                  analysis.checklist.map(c => `"${c.title}","${c.status}","${c.value}","${c.recommendation}"`).join("\n");
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "content_audit_checklist.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="gsc-btn-secondary"
            >
              <Download size={14} />
              Export Checklist CSV
            </button>
          </div>
        </div>
      </div>

      <ContextCue
        level={2}
        toolNumber={5}
        useCase="Audit any draft article or live page against competitor pages, verify on-page SEO essentials, and diagnose search intent."
        title="Content Matching & Head-to-Head Engine"
        about="Google evaluates content under rigorous E-E-A-T guidelines. This tool audits your text for 8 critical ranking factors (keyword density, bullets, headings, word count, internal links, meta tags, and 503A disclaimers) and benchmarks your copy directly against market leaders like Mochi, Ro, Henry Meds, and OrderlyMeds."
      />

      {/* Custom URL Scanner Bar */}
      <CustomUrlScanBar
        toolName="Content Matcher"
        placeholder="Enter custom URL to extract text and audit against competitors..."
        onScanComplete={(page) => {
          if (!page) return;
          setTargetTitle(page.title || '');
          setTargetDesc(page.description || '');
          setInputText(`# ${page.title || 'Page Content'}\n\n${page.description || ''}\n\n## H1: ${page.h1 || 'Overview'}\n\nClinical page content extracted from ${page.url}. Categories: ${page.category}. Keyword: ${page.primary_keyword}.\n\n* Core medical oversight with board-certified physicians\n* 503A sterile compounding compliance\n* Transparent monthly flat pricing\n\n[Check Eligibility](/eligibility/) | [View Pricing](/pricing/)`);
        }}
      />

      {/* Top Selector Bar: Choose Ongo Page vs Competitor Page */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '16px 20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
        alignItems: 'center'
      }}>
        {/* Ongo Page Picker */}
        <div>
          <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px', display: 'block' }}>
            Step 1: Choose Your Page (From Ongo Live 56 Pages):
          </label>
          <select
            value={selectedOngoPageUrl}
            onChange={(e) => handleSelectOngoPage(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              fontSize: '0.82rem',
              color: '#0f1715',
              fontWeight: 600
            }}
          >
            <option value="">-- Or Keep Custom Pasted Draft Below --</option>
            {livePages.map((page) => (
              <option key={page.id} value={page.url}>
                {page.title ? `${page.title.slice(0, 48)}... (${page.path})` : page.path}
              </option>
            ))}
          </select>
        </div>

        {/* Competitor Matcher Dropdown */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#1e293b', display: 'block' }}>
              Step 2: Choose Competitor Page to Compare Against:
            </label>
            <a
              href={activeCompetitor.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.72rem',
                color: '#15803d',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              Open {activeCompetitor.competitorName} Live <ExternalLink size={11} />
            </a>
          </div>

          <select
            value={selectedCompetitorId}
            onChange={(e) => setSelectedCompetitorId(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              fontSize: '0.82rem',
              color: '#0f1715',
              fontWeight: 600
            }}
          >
            {COMPETITOR_BENCHMARK_PAGES.map((comp) => (
              <option key={comp.id} value={comp.id}>
                {comp.competitorName} &bull; {comp.topic} ({comp.wordCount} words)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main 2-Column Workspace: Content Input & Intent Pie Chart */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 0.75fr)',
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* Left Column: Draft Content Input Box & Live Word Counters */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCheck2 size={16} color="#15803d" />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f1715' }}>
                Page Content Draft / Live Source
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', fontSize: '0.74rem', color: '#64748b' }}>
              <span><strong>{analysis.stats.wordCount}</strong> words</span>
              <span>&bull;</span>
              <span><strong>{analysis.stats.bulletCount}</strong> bullets</span>
              <span>&bull;</span>
              <span><strong>{analysis.stats.headingsCount}</strong> headings</span>
            </div>
          </div>

          {/* Editable Content Box */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={14}
            placeholder="Paste your page content or markdown text here..."
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              fontSize: '0.82rem',
              lineHeight: 1.55,
              color: '#0f1715',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              resize: 'vertical'
            }}
          />

          {/* Meta Tags Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            backgroundColor: '#f8fafc',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                <span>Meta Title Tag</span>
                <span style={{ color: targetTitle.length >= 45 && targetTitle.length <= 65 ? '#15803d' : '#d97706' }}>
                  {targetTitle.length} / 60 ch
                </span>
              </label>
              <input
                type="text"
                value={targetTitle}
                onChange={(e) => setTargetTitle(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.76rem',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                <span>Meta Description</span>
                <span style={{ color: targetDesc.length >= 120 && targetDesc.length <= 165 ? '#15803d' : '#d97706' }}>
                  {targetDesc.length} / 155 ch
                </span>
              </label>
              <input
                type="text"
                value={targetDesc}
                onChange={(e) => setTargetDesc(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.76rem',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Search Intent Visual Donut / Pie Chart */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieIcon size={16} color="#3b82f6" />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f1715' }}>
                Search Intent Breakdown
              </span>
            </div>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: '#dcfce7',
              color: '#15803d'
            }}>
              {analysis.intent.primaryIntent}
            </span>
          </div>

          {/* Precision SVG Donut / Pie Chart */}
          <div style={{ position: 'relative', width: '180px', height: '180px', margin: '4px 0' }}>
            <svg width="180" height="180" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
              {(() => {
                const radius = 38;
                const circumference = 2 * Math.PI * radius;
                const { informational, commercial, transactional, trust } = analysis.intent;

                const infoOffset = 0;
                const infoLength = (informational / 100) * circumference;

                const commOffset = infoLength;
                const commLength = (commercial / 100) * circumference;

                const transOffset = infoLength + commLength;
                const transLength = (transactional / 100) * circumference;

                const trustOffset = infoLength + commLength + transLength;
                const trustLength = (trust / 100) * circumference;

                return (
                  <>
                    <circle cx="50" cy="50" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="18" />
                    
                    {/* Informational slice (Blue) */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="18"
                      strokeDasharray={`${infoLength} ${circumference}`}
                      strokeDashoffset={-infoOffset}
                    />

                    {/* Commercial slice (Green) */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="18"
                      strokeDasharray={`${commLength} ${circumference}`}
                      strokeDashoffset={-commOffset}
                    />

                    {/* Transactional slice (Amber) */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="18"
                      strokeDasharray={`${transLength} ${circumference}`}
                      strokeDashoffset={-transOffset}
                    />

                    {/* Trust & E-E-A-T slice (Purple) */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="18"
                      strokeDasharray={`${trustLength} ${circumference}`}
                      strokeDashoffset={-trustOffset}
                    />
                  </>
                );
              })()}
            </svg>

            {/* Center Label */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f1715' }}>
                {Math.max(analysis.intent.informational, analysis.intent.commercial, analysis.intent.transactional, analysis.intent.trust)}%
              </span>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                {analysis.intent.primaryIntent}
              </span>
            </div>
          </div>

          {/* Intent Legend Pills */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e293b' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
                Informational (Clinical Education)
              </span>
              <span style={{ fontWeight: 700, color: '#0f1715' }}>{analysis.intent.informational}%</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e293b' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                Commercial (Pricing &amp; Cost)
              </span>
              <span style={{ fontWeight: 700, color: '#0f1715' }}>{analysis.intent.commercial}%</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e293b' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                Transactional (Intake &amp; Orders)
              </span>
              <span style={{ fontWeight: 700, color: '#0f1715' }}>{analysis.intent.transactional}%</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e293b' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#8b5cf6' }} />
                Trust &amp; E-E-A-T (Doctor/503A)
              </span>
              <span style={{ fontWeight: 700, color: '#0f1715' }}>{analysis.intent.trust}%</span>
            </div>
          </div>

          {/* Strategic Recommendation Callout */}
          <div style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '8px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            fontSize: '0.74rem',
            lineHeight: 1.45,
            color: '#475569'
          }}>
            <strong>Recommendation:</strong> {analysis.intent.recommendation}
          </div>
        </div>
      </div>

      {/* Head-to-Head Competitor Comparison Matrix ("Read-to-Post Compare") */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GitCompare size={18} color="#15803d" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f1715', margin: 0 }}>
                Head-to-Head Benchmark: Ongo vs. {activeCompetitor.competitorName}
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
              Comparing your draft against <em>"{activeCompetitor.title}"</em>
            </p>
          </div>

          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '6px',
            backgroundColor: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0'
          }}>
            {comparison.executiveVerdict}
          </div>
        </div>

        {/* 2-Column Comparison Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px'
        }}>
          {/* Ongo Page Card */}
          <div style={{
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #cbd5e1'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1b4332' }}>
                🟢 Ongo Weight Loss (Your Page)
              </span>
              <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                {comparison.ongoMetrics.readingEase}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Word Count</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f1715' }}>
                  {comparison.ongoMetrics.wordCount}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Bullet Points</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f1715' }}>
                  {comparison.ongoMetrics.bulletCount}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Heading Sections</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f1715' }}>
                  {comparison.ongoMetrics.headingsCount}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Topic Match</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d' }}>
                  {comparison.ongoMetrics.keywordCoveragePct}%
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.74rem', color: '#475569', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
              <strong>Target Page:</strong> {selectedOngoPageUrl || 'Custom draft copy'}
            </div>
          </div>

          {/* Competitor Page Card */}
          <div style={{
            padding: '16px',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #cbd5e1'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0369a1' }}>
                🔵 {activeCompetitor.competitorName} (Ranking Benchmark)
              </span>
              <a
                href={activeCompetitor.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}
              >
                Inspect Page <ExternalLink size={11} />
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Word Count</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f1715' }}>
                  {comparison.competitorMetrics.wordCount}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Bullet Points</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f1715' }}>
                  {comparison.competitorMetrics.bulletCount}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Heading Sections</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f1715' }}>
                  {comparison.competitorMetrics.headingsCount}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Primary Intent</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7' }}>
                  {activeCompetitor.intent}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.74rem', color: '#475569', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
              <strong>Competitor Moat:</strong> {activeCompetitor.pros}
            </div>
          </div>
        </div>

        {/* Content Topics Gap Box: What Competitor Covers That Ongo Misses */}
        <div style={{
          padding: '14px 16px',
          backgroundColor: '#fffbeb',
          borderRadius: '8px',
          border: '1px solid #fef3c7',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={15} color="#b45309" />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#92400e' }}>
              Topics Covered by {activeCompetitor.competitorName} to Incorporate into Ongo:
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {activeCompetitor.keyTopicsCovered.map((topic, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.74rem',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: '#ffffff',
                  color: '#78350f',
                  border: '1px solid #fde68a',
                  fontWeight: 600
                }}
              >
                + {topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 8-Point On-Page SEO & Content Quality Checklist */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f1715', margin: 0 }}>
              On-Page SEO &amp; Healthcare Content Checklist ({passedCount} / {analysis.checklist.length} Passed)
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
              Automated audit evaluating keywords, bullet points, meta lengths, link equity, and medical E-E-A-T credentials.
            </p>
          </div>

          <span style={{
            fontSize: '0.76rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: '6px',
            backgroundColor: checklistScore >= 80 ? '#dcfce7' : '#fef3c7',
            color: checklistScore >= 80 ? '#15803d' : '#b45309',
            border: `1px solid ${checklistScore >= 80 ? '#86efac' : '#fde68a'}`
          }}>
            Checklist Health: {checklistScore}%
          </span>
        </div>

        {/* Checklist Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="gsc-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Status</th>
                <th style={{ width: '220px' }}>Audit Factor</th>
                <th style={{ width: '180px' }}>Detected Value</th>
                <th>Recommendation &amp; Action Fix</th>
                <th style={{ width: '90px' }}>Importance</th>
              </tr>
            </thead>
            <tbody>
              {analysis.checklist.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.status === 'pass' && <CheckCircle2 size={16} color="#15803d" />}
                    {item.status === 'warning' && <AlertTriangle size={16} color="#d97706" />}
                    {item.status === 'fail' && <XCircle size={16} color="#dc2626" />}
                  </td>
                  <td style={{ fontWeight: 700, color: '#0f1715' }}>
                    {item.title}
                  </td>
                  <td style={{ fontSize: '0.76rem', color: '#475569', fontWeight: 600 }}>
                    {item.value}
                  </td>
                  <td style={{ fontSize: '0.76rem', color: item.status === 'pass' ? '#15803d' : '#1e293b' }}>
                    {item.recommendation}
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: item.importance === 'Critical' ? '#fee2e2' : item.importance === 'High' ? '#fef3c7' : '#f1f5f9',
                      color: item.importance === 'Critical' ? '#991b1b' : item.importance === 'High' ? '#92400e' : '#475569'
                    }}>
                      {item.importance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

