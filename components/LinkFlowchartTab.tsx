'use client';

import React, { useState } from 'react';
import {
  GitMerge,
  ArrowRight,
  Zap,
  Sliders,
  Copy,
  Check,
  Repeat,
  Compass,
  Stethoscope,
  Calculator,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Info,
  TrendingUp,
  RotateCw
} from 'lucide-react';
import ContextCue from './ContextCue';

interface FlowPreset {
  id: string;
  label: string;
  ruleName: string;
  sourceTitle: string;
  sourceUrl: string;
  sourceType: string;
  sourcePr: number;
  outboundCount: number;
  targetTitle: string;
  targetUrl: string;
  targetType: string;
  targetSilo: string;
  anchorText: string;
  placementLocation: string;
  rationale: string;
}

const FLOW_PRESETS: FlowPreset[] = [
  {
    id: 'spoke-money',
    label: '💊 Spoke ➔ Money Page',
    ruleName: 'Vertical Funneling (Rule 1)',
    sourceTitle: 'Semaglutide Dosing Guide & Units Chart',
    sourceUrl: '/blog/semaglutide/semaglutide-dosing-guide/',
    sourceType: 'Informational Blog Spoke',
    sourcePr: 100,
    outboundCount: 4,
    targetTitle: 'Doctor-Prescribed Compounded Semaglutide',
    targetUrl: '/services/glp-1/compounded-semaglutide/',
    targetType: 'Commercial Money Page (P0)',
    targetSilo: 'GLP-1 Medication Silo',
    anchorText: 'doctor-prescribed compounded semaglutide',
    placementLocation: 'First 150 words of intro body paragraph',
    rationale: 'Funnels high-intent readers researching dosage directly to the treatment purchase page to maximize organic conversion.'
  },
  {
    id: 'safety-doctor',
    label: '🩺 Safety ➔ Doctor E-E-A-T',
    ruleName: 'Medical E-E-A-T Loop (Rule 3)',
    sourceTitle: 'Quality, Safety & Compounding Pharmacy Standards',
    sourceUrl: '/about/quality-and-safety/',
    sourceType: 'Trust & Governance Page',
    sourcePr: 100,
    outboundCount: 2,
    targetTitle: 'Dr. Benjamin Krasne, MD — Clinical Director',
    targetUrl: '/medical-team/dr-benjamin-krasne/',
    targetType: 'Physician Bio Authority Node',
    targetSilo: 'Medical Team Silo',
    anchorText: 'reviewed by Dr. Benjamin Krasne, MD',
    placementLocation: 'Author / Medical Reviewer Byline Header',
    rationale: 'Satisfies Google YMYL medical quality rater guidelines by linking clinical claims directly to verified physician credentials.'
  },
  {
    id: 'home-pillar',
    label: '🏠 Home ➔ Category Pillar',
    ruleName: 'Vertical Funneling (Rule 1)',
    sourceTitle: 'Ongo Weight Loss — Homepage',
    sourceUrl: '/',
    sourceType: 'Root Domain (Highest Authority)',
    sourcePr: 250,
    outboundCount: 8,
    targetTitle: 'GLP-1 Medical Weight Loss Programs',
    targetUrl: '/services/glp-1/',
    targetType: 'Core Service Pillar',
    targetSilo: 'Services & Programs Silo',
    anchorText: 'doctor-supervised virtual GLP-1 weight loss care',
    placementLocation: 'Hero section primary feature card',
    rationale: 'Passes prime homepage authority down into the core program cluster to boost ranking for high-volume head keywords.'
  },
  {
    id: 'tirzepatide-intake',
    label: '🧭 Guide ➔ Intake Screener',
    ruleName: 'Conversion Funnel Push (Rule 4)',
    sourceTitle: 'Compounded Tirzepatide Dosing & Titration Guide',
    sourceUrl: '/blog/tirzepatide/tirzepatide-dosing-guide/',
    sourceType: 'Educational Spoke',
    sourcePr: 100,
    outboundCount: 3,
    targetTitle: 'Online Medical Eligibility Screener',
    targetUrl: '/eligibility/',
    targetType: 'Patient Intake Funnel',
    targetSilo: 'Intake & Conversion Silo',
    anchorText: 'check your clinical eligibility for tirzepatide',
    placementLocation: 'Mid-article clinical eligibility callout box',
    rationale: 'Converts educated patients actively reading titration protocols into completed telehealth intake questionnaires.'
  },
  {
    id: 'houston-pricing',
    label: '📍 Local Hub ➔ Transparent Pricing',
    ruleName: 'Contextual Tool Bridge (Rule 2)',
    sourceTitle: 'Houston Weight Loss Clinic & Telehealth',
    sourceUrl: '/houston-weight-loss/',
    sourceType: 'Geographic Landing Page',
    sourcePr: 120,
    outboundCount: 5,
    targetTitle: 'Transparent Monthly Pricing & Medication Plans',
    targetUrl: '/pricing/',
    targetType: 'Commercial Plan Comparison',
    targetSilo: 'Pricing & Plans Silo',
    anchorText: 'transparent monthly GLP-1 pricing with medication included',
    placementLocation: 'Local insurance & cost FAQ section',
    rationale: 'Overcomes patient price hesitation for local searchers by linking directly to all-inclusive monthly pricing.'
  }
];

const ONGO_PAGE_LIST = [
  { url: '/', title: 'Ongo Weight Loss — Homepage', type: 'Domain Root', silo: 'Core Domain', basePr: 250 },
  { url: '/pricing/', title: 'Transparent Monthly Pricing & Plans', type: 'Commercial Money Page', silo: 'Pricing Silo', basePr: 140 },
  { url: '/services/glp-1/', title: 'GLP-1 Medical Weight Loss Programs', type: 'Core Service Pillar', silo: 'Services Silo', basePr: 160 },
  { url: '/services/glp-1/compounded-semaglutide/', title: 'Doctor-Prescribed Compounded Semaglutide', type: 'Commercial Money Page', silo: 'GLP-1 Silo', basePr: 130 },
  { url: '/services/glp-1/compounded-tirzepatide/', title: 'Doctor-Prescribed Compounded Tirzepatide', type: 'Commercial Money Page', silo: 'GLP-1 Silo', basePr: 130 },
  { url: '/how-it-works/', title: 'How Ongo Works — 3-Step Care Model', type: 'Educational Funnel', silo: 'Support Silo', basePr: 110 },
  { url: '/eligibility/', title: 'Clinical Eligibility Screener', type: 'Patient Intake Funnel', silo: 'Intake Silo', basePr: 120 },
  { url: '/about/', title: 'About Ongo Health & Mission', type: 'Brand Story', silo: 'About Silo', basePr: 100 },
  { url: '/about/clinical-excellence/', title: 'Clinical Excellence & Safety Protocols', type: 'Governance & Quality', silo: 'About Silo', basePr: 95 },
  { url: '/about/quality-and-safety/', title: 'Quality, Safety & Compounding Pharmacy Standards', type: 'Governance & Quality', silo: 'About Silo', basePr: 95 },
  { url: '/medical-team/', title: 'Ongo Medical Team & Physician Directory', type: 'Physician Authority', silo: 'Medical Silo', basePr: 115 },
  { url: '/medical-team/dr-benjamin-krasne/', title: 'Dr. Benjamin Krasne, MD — Clinical Director', type: 'Physician Bio', silo: 'Medical Silo', basePr: 100 },
  { url: '/medical-team/dr-emeka-okonkwo/', title: 'Dr. Emeka Okonkwo, MD — Physician', type: 'Physician Bio', silo: 'Medical Silo', basePr: 90 },
  { url: '/houston-weight-loss/', title: 'Houston Weight Loss Clinic & Telehealth', type: 'Local Hub', silo: 'Location Silo', basePr: 105 },
  { url: '/blog/semaglutide/semaglutide-dosing-guide/', title: 'Semaglutide Dosing Guide & Units Chart', type: 'Informational Spoke', silo: 'Blog Silo', basePr: 100 },
  { url: '/blog/tirzepatide/tirzepatide-dosing-guide/', title: 'Compounded Tirzepatide Dosing & Titration Guide', type: 'Informational Spoke', silo: 'Blog Silo', basePr: 100 },
  { url: '/blog/what-are-glp-1-medications-and-how-they-support-weight-loss/', title: 'What Are GLP-1 Medications and How They Work', type: 'Educational Spoke', silo: 'Blog Silo', basePr: 95 },
  { url: '/blog/how-glp-1-medications-help-weight-loss-complete-guide/', title: 'How GLP-1 Medications Help Weight Loss Guide', type: 'Educational Spoke', silo: 'Blog Silo', basePr: 90 },
  { url: '/faq/', title: 'Frequently Asked Questions & Answers', type: 'Support & FAQs', silo: 'Support Silo', basePr: 100 },
  { url: '/contact/', title: 'Contact Support & Patient Care', type: 'Contact & Support', silo: 'Support Silo', basePr: 85 }
];

export default function LinkFlowchartTab() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(FLOW_PRESETS[0].id);
  const [currentFlow, setCurrentFlow] = useState<FlowPreset>(FLOW_PRESETS[0]);
  const [outboundLinksCount, setOutboundLinksCount] = useState<number>(FLOW_PRESETS[0].outboundCount);
  const [customAnchorText, setCustomAnchorText] = useState<string>(FLOW_PRESETS[0].anchorText);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Google PageRank Damping Constant
  const dampingFactor = 0.85;

  // Formula: Transferred PR = (Source PR * Damping Factor) / N
  const calculatedTransfer = Math.round(((currentFlow.sourcePr * dampingFactor) / outboundLinksCount) * 100) / 100;
  const projectedTargetPr = Math.round((currentFlow.sourcePr + calculatedTransfer) * 100) / 100;

  const handleSelectPreset = (preset: FlowPreset) => {
    setSelectedPresetId(preset.id);
    setCurrentFlow(preset);
    setOutboundLinksCount(preset.outboundCount);
    setCustomAnchorText(preset.anchorText);
  };

  const handleSelectSource = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = ONGO_PAGE_LIST.find(p => p.url === e.target.value);
    if (!found) return;
    setCurrentFlow(prev => ({
      ...prev,
      sourceTitle: found.title,
      sourceUrl: found.url,
      sourceType: found.type,
      sourcePr: found.basePr
    }));
    setSelectedPresetId('custom');
  };

  const handleSelectTarget = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = ONGO_PAGE_LIST.find(p => p.url === e.target.value);
    if (!found) return;
    setCurrentFlow(prev => ({
      ...prev,
      targetTitle: found.title,
      targetUrl: found.url,
      targetType: found.type,
      targetSilo: found.silo
    }));
    setSelectedPresetId('custom');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generatedHtmlSnippet = `<a href="${currentFlow.targetUrl}" title="${customAnchorText}">${customAnchorText}</a>`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Premium GSC / Clarity Header */}
      <div className="gsc-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="gsc-badge-healthy">
                <span className="gsc-pulse-dot" />
                PageRank Link Topology Visualizer
              </span>
              <span className="gsc-badge-neutral">
                Damping Factor: d = 0.85
              </span>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Calculated Transfer: <strong style={{ color: '#15803d' }}>+{calculatedTransfer} PR</strong>
              </span>
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f1715', margin: 0, letterSpacing: '-0.02em' }}>
              PageRank &amp; Link Equity Flowchart Visualizer
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#475569', margin: '4px 0 0 0' }}>
              Simulate directed PageRank transfer math (d = 0.85) between source spokes and target money pages to optimize internal link equity distribution.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a
              href="/internal-links"
              className="gsc-btn-secondary"
            >
              Internal Links Table ↗
            </a>
          </div>
        </div>

        {/* Quick Flow Presets */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginRight: '4px' }}>
            Presets:
          </span>
          {FLOW_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: selectedPresetId === preset.id ? 700 : 500,
                background: selectedPresetId === preset.id ? '#1b4332' : '#f1f5f9',
                color: selectedPresetId === preset.id ? '#ffffff' : '#334155',
                border: selectedPresetId === preset.id ? '1px solid #1b4332' : '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.12s ease'
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <ContextCue
        useCase="Model and verify the mathematical PageRank transfer between pages before adding links in production."
        title="PageRank Conservation Math (d = 0.85)"
        about="Google's PageRank algorithm divides a page's equity equally across its outbound links: PR(Target) += (PR(Source) × 0.85) / N. Keeping N tight (3-5 focused links) prevents dilution and passes maximum ranking power to high-converting treatment pages."
      />

      {/* Main Flowchart Visual Canvas Bento Box */}
      <div className="bento-card" style={{ padding: '24px', background: '#ffffff', border: '1px solid var(--border-medium)' }}>
        
        {/* Controls Toolbar: Select Source & Target Pages */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          background: 'var(--bg-surface-alt)',
          padding: '16px 20px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          marginBottom: '24px'
        }}>
          {/* Source Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Source Origin Page:
            </label>
            <select
              value={currentFlow.sourceUrl}
              onChange={handleSelectSource}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-medium)',
                fontSize: '0.82rem',
                background: '#ffffff',
                color: 'var(--color-primary-dark)',
                fontWeight: 600
              }}
            >
              {ONGO_PAGE_LIST.map(p => (
                <option key={p.url} value={p.url}>
                  {p.title} ({p.url})
                </option>
              ))}
            </select>
          </div>

          {/* Target Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Target Destination Page:
            </label>
            <select
              value={currentFlow.targetUrl}
              onChange={handleSelectTarget}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-medium)',
                fontSize: '0.82rem',
                background: '#ffffff',
                color: '#c2410c',
                fontWeight: 600
              }}
            >
              {ONGO_PAGE_LIST.map(p => (
                <option key={p.url} value={p.url}>
                  {p.title} ({p.url})
                </option>
              ))}
            </select>
          </div>

          {/* Outbound Link Count Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Outbound Links On Source (N):
              </label>
              <span style={{
                background: '#1b4332',
                color: '#ffffff',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '0.74rem',
                fontWeight: 800
              }}>
                N = {outboundLinksCount}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>1</span>
              <input
                type="range"
                min={1}
                max={12}
                value={outboundLinksCount}
                onChange={(e) => setOutboundLinksCount(Number(e.target.value))}
                style={{ flex: 1, accentColor: '#1b4332', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>12</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            THE VISUAL DIRECTED FLOW DIAGRAM
            ========================================================================= */}
        <div style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
          border: '1px solid var(--border-medium)',
          borderRadius: '16px',
          padding: '28px 24px',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(260px, 1fr) auto minmax(260px, 1fr)',
            alignItems: 'center',
            gap: '24px'
          }}>
            {/* 1. SOURCE NODE */}
            <div style={{
              background: '#ffffff',
              border: '2px solid #347e5d',
              borderRadius: '14px',
              padding: '20px',
              boxShadow: '0 8px 20px -4px rgba(52, 126, 93, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge-minimal" style={{ background: '#e8f5e9', color: '#166534', fontWeight: 800 }}>
                  SOURCE PAGE
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>
                  Base PR: {currentFlow.sourcePr}.00
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-primary-dark)', lineHeight: 1.35 }}>
                {currentFlow.sourceTitle}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <code style={{ fontSize: '0.75rem', color: 'var(--color-primary)', background: 'var(--bg-canvas)', padding: '2px 8px', borderRadius: '4px', wordBreak: 'break-all' }}>
                  {currentFlow.sourceUrl}
                </code>
              </div>

              <div style={{
                marginTop: '8px',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Type: <strong>{currentFlow.sourceType}</strong></span>
                <span style={{ color: '#b45309', fontWeight: 700 }}>Total Outbound: {outboundLinksCount}</span>
              </div>
            </div>

            {/* 2. DIRECTED LINK EQUITY CONDUIT */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '240px',
              gap: '10px',
              padding: '0 10px'
            }}>
              <span className="badge-minimal badge-minimal-neutral" style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700 }}>
                {currentFlow.ruleName}
              </span>

              {/* Exact Anchor Tag Box */}
              <div style={{
                background: '#1b4332',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 800,
                textAlign: 'center',
                boxShadow: '0 4px 14px rgba(27, 67, 50, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>&quot;{customAnchorText}&quot;</span>
              </div>

              {/* Animated Directional Flow Vector */}
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '6px' }}>
                <div style={{ flex: 1, height: '4px', background: 'linear-gradient(90deg, #347e5d 0%, #e76f51 100%)', borderRadius: '2px' }} />
                <ArrowRight size={24} color="#e76f51" strokeWidth={2.5} />
              </div>

              {/* Dynamic Math Boost Badge */}
              <div style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#15803d',
                background: '#dcfce7',
                border: '1px solid #86efac',
                padding: '4px 12px',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Zap size={13} color="#16a34a" />
                <span>+ {calculatedTransfer} PageRank Equity Transferred</span>
              </div>
            </div>

            {/* 3. TARGET DESTINATION NODE */}
            <div style={{
              background: '#ffffff',
              border: '2px solid #e76f51',
              borderRadius: '14px',
              padding: '20px',
              boxShadow: '0 8px 20px -4px rgba(231, 111, 81, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge-minimal" style={{ background: '#fee2e2', color: '#991b1b', fontWeight: 800 }}>
                  TARGET DESTINATION
                </span>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#15803d' }}>
                  Boost: +{calculatedTransfer} PR
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-primary-dark)', lineHeight: 1.35 }}>
                {currentFlow.targetTitle}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <code style={{ fontSize: '0.75rem', color: '#c2410c', background: 'var(--bg-canvas)', padding: '2px 8px', borderRadius: '4px', wordBreak: 'break-all' }}>
                  {currentFlow.targetUrl}
                </code>
              </div>

              <div style={{
                marginTop: '8px',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Silo: <strong>{currentFlow.targetSilo}</strong></span>
                <span style={{ color: '#15803d', fontWeight: 800 }}>
                  Projected: {projectedTargetPr} PR
                </span>
              </div>
            </div>
          </div>

          {/* 4. RECIPROCAL SILO RETENTION LOOP */}
          <div style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px dashed var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            background: 'rgba(52, 126, 93, 0.05)',
            borderRadius: '12px',
            padding: '16px 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '750px' }}>
              <Repeat size={20} color="#1b4332" style={{ flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                  Internal Silo Reciprocal Loop (100% Equity Conserved):
                </span>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '3px 0 0 0', lineHeight: 1.45 }}>
                  Because both pages reside within the <code>ongoweightloss.com</code> domain architecture, 0% of link equity leaks to external competitors. The destination page recirculates contextual trust back through breadcrumbs and clinical author loops.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleCopy(generatedHtmlSnippet, 'html-snippet')}
                className="btn-minimal-forest"
                style={{ fontSize: '0.78rem', padding: '8px 16px' }}
              >
                {copiedId === 'html-snippet' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                {copiedId === 'html-snippet' ? 'Copied HTML Code!' : 'Copy <a href> Tag'}
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Strategic Implementation Card */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px',
          marginTop: '20px'
        }}>
          <div style={{
            background: 'var(--bg-surface-alt)',
            padding: '16px 18px',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)'
          }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '6px' }}>
              Recommended Link Placement
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {currentFlow.placementLocation || 'Place naturally in the top 200 words of the body text as contextual editorial reference.'}
            </p>
          </div>

          <div style={{
            background: 'var(--bg-surface-alt)',
            padding: '16px 18px',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)'
          }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '6px' }}>
              Strategic SEO Rationale
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {currentFlow.rationale}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
