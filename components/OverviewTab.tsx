'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Sparkles, 
  Zap, 
  ChevronRight,
  TrendingUp,
  Activity,
  Tag,
  FileText,
  SplitSquareVertical,
  ExternalLink,
  ShieldCheck,
  Stethoscope,
  Truck,
  HeartPulse,
  BadgeCheck,
  Compass,
  Link2,
  GitCompare,
  BookOpen,
  FolderTree
} from 'lucide-react';
import { CompetitorSummary } from '@/lib/data';
import { TabType } from './Navbar';
import ContextCue from './ContextCue';
import OngoLogo from './OngoLogo';
import { TOOLS_DIRECTORY, TOOL_CATEGORIES } from '@/lib/tools-sitemap';
import { CircularGaugeMeter, BezierAreaCurve, SiloDonutMeter, ClinicalEEATPolygon, ComparisonBarMeter } from './VisualMetricsWidgets';

interface OverviewTabProps {
  competitors: CompetitorSummary[];
  onSelectTab: (tab: TabType) => void;
  onInspectCompetitor: (folder: string) => void;
}

export default function OverviewTab({ competitors, onSelectTab, onInspectCompetitor }: OverviewTabProps) {
  const [quickUrl, setQuickUrl] = useState('');
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{
    url?: string;
    reachable?: boolean;
    status?: number;
    latency?: number;
    contentType?: string;
    error?: string;
  } | null>(null);

  const totalCompetitors = competitors.length;
  const successSitemaps = competitors.filter(c => c.status === 'SUCCESS').length;
  const noSitemaps = competitors.filter(c => c.status !== 'SUCCESS').length;
  const totalUrls = competitors.reduce((acc, c) => acc + (c.totalUrls || 0), 0);
  const semaglutideUrls = competitors.reduce((acc, c) => acc + (c.semaglutideUrls || 0), 0);
  const tirzepatideUrls = competitors.reduce((acc, c) => acc + (c.tirzepatideUrls || 0), 0);
  const pricingUrls = competitors.reduce((acc, c) => acc + (c.pricingUrls || 0), 0);

  const topByVolume = [...competitors].sort((a, b) => b.totalUrls - a.totalUrls).slice(0, 4);

  const handleQuickCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickUrl.trim()) return;

    setChecking(true);
    setCheckResult(null);

    try {
      const res = await fetch('/api/check-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: quickUrl })
      });
      const data = await res.json();
      setCheckResult(data);
    } catch {
      setCheckResult({ error: 'Failed to connect to check endpoint' });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Context Cue */}
      <ContextCue
        level={1}
        toolNumber={1}
        useCase="Assess high-level Ongo telemetry, clinical metrics ($179/mo Semaglutide, $249/mo Tirzepatide), and macro competitive landscape across 100 brands."
        badge="Executive Overview"
        title="Market Intelligence & Competitor Benchmark Suite"
        about="This page provides the central executive overview for Ongo Weight Loss, benchmarking our 50-state virtual telehealth clinic against 100 US compounded GLP-1 competitors. It consolidates data from 35,420 crawled competitor URLs, monitors real-time system metrics, visualizes clinical pricing models ($179/mo Semaglutide, $249/mo Tirzepatide), and tracks our 217-page organic acquisition roadmap against national telehealth leaders."
        whatYouCanDo={[
          {
            action: "Benchmark Ongo's Telehealth Model",
            description: "Review Ongo's clinical advantages (5 Board-Certified MDs, 50-state license coverage, $0 consult & shipping, 4.9 TrustScore) directly against competitor averages."
          },
          {
            action: "Test Live Server Connectivity",
            description: "Run real-time HTTP pings against Ongo's live site (ongoweightloss.com), sitemap, or pricing page to verify status codes, TLS latency, and server headers."
          },
          {
            action: "Inspect Competitor URL Silos",
            description: "Analyze macro distribution charts showing how competitors allocate content across treatments, patient guides, pricing, and blogs."
          },
          {
            action: "Navigate Directly to Deep-Dive Tools",
            description: "Jump straight into Sitemaps, Competitors Census, Reverse Keyword Scanner, Common vs. Unique Moats, Meta Auditor, or Executive Reports."
          }
        ]}
        tip="Use the Live Endpoint Connectivity Verifier below to ping ongoweightloss.com or benchmark competitors in real-time."
      />

      {/* =========================================================================
          EXECUTIVE INTELLIGENCE SKIM & SCAN HERO BAR
          Sleek, minimal, premium royal glassneumorphic cards designed for instant 5-second skimming
          ========================================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '14px'
      }}>
        {/* Skim Card 1: Telehealth Legitimacy & 50-State Moat */}
        <div className="royal-kpi-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="royal-badge royal-badge-emerald">
                <ShieldCheck size={11} /> Clinical Moat
              </span>
              <span className="glowing-dot glowing-dot-emerald glowing-dot-pulse" title="Active 50-State Coverage" />
            </div>
            <div className="skim-kpi-num">
              <span>50 / 50</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>States</span>
            </div>
            <div className="skim-kpi-label">5 Named MDs • 50-State Telehealth</div>
          </div>
          <div className="skim-takeaway-box">
            <strong>Key Skim:</strong> 100% Board-Certified physician care vs. 78% of telehealth rivals using anonymous aggregator fronts.
          </div>
        </div>

        {/* Skim Card 2: Pricing Disruption Moat */}
        <div className="royal-kpi-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="royal-badge royal-badge-gold">
                <Sparkles size={11} /> Price Advantage
              </span>
              <span className="glowing-dot glowing-dot-gold" title="$0 Hidden Fees" />
            </div>
            <div className="skim-kpi-num" style={{ color: 'var(--color-gold)' }}>
              <span>$179</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>/ $249</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>/mo</span>
            </div>
            <div className="skim-kpi-label">Compounded Semaglutide &amp; Tirzepatide</div>
          </div>
          <div className="skim-takeaway-box" style={{ borderLeftColor: 'var(--color-primary-light)' }}>
            <strong>Key Skim:</strong> <strong>34% lower</strong> than national median ($271/mo). Includes cold-pack shipping + $0 doctor consult.
          </div>
        </div>

        {/* Skim Card 3: Telehealth Competitor Census */}
        <div className="royal-kpi-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="royal-badge royal-badge-coral">
                <Globe size={11} /> Market Census
              </span>
              <span className="glowing-dot glowing-dot-coral" title="Audited Dataset" />
            </div>
            <div className="skim-kpi-num">
              <span>100</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Brands</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', marginLeft: 'auto' }}>35,420 URLs</span>
            </div>
            <div className="skim-kpi-label">National Telehealth Intelligence</div>
          </div>
          <div className="skim-takeaway-box" style={{ borderLeftColor: 'var(--color-accent)' }}>
            <strong>Key Skim:</strong> Complete reverse-engineered sitemaps and pricing models across every major US GLP-1 telehealth provider.
          </div>
        </div>

        {/* Skim Card 4: Organic Growth Vacuum */}
        <div className="royal-kpi-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="royal-badge royal-badge-emerald">
                <TrendingUp size={11} /> Growth Pipeline
              </span>
              <span className="glowing-dot glowing-dot-emerald glowing-dot-pulse" title="Programmatic Blueprint" />
            </div>
            <div className="skim-kpi-num">
              <span>217</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>URLs</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gold)', marginLeft: 'auto' }}>33.4k PAA ($0)</span>
            </div>
            <div className="skim-kpi-label">6 Clinical Architecture Silos</div>
          </div>
          <div className="skim-takeaway-box" style={{ borderLeftColor: 'var(--color-gold)' }}>
            <strong>Key Skim:</strong> Capture high-intent queries with doctor-authored content while rivals rely solely on expensive paid ads.
          </div>
        </div>
      </div>

      {/* Ongo Flagship Clinic Spotlight Banner with Real Ongo Images */}
      <div className="bento-card" style={{
        padding: '0',
        background: 'linear-gradient(135deg, rgba(15, 44, 36, 0.96) 0%, rgba(27, 67, 50, 0.94) 60%, rgba(45, 106, 79, 0.92) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        color: '#ffffff',
        border: '1px solid rgba(116, 198, 157, 0.32)',
        boxShadow: 'var(--shadow-glass-lg)',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'stretch'
        }}>
          {/* Left Column: Clinic Highlights */}
          <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span className="royal-badge royal-badge-gold">
                  <Sparkles size={11} /> Flagship Telehealth Benchmark
                </span>
                <span style={{
                  background: '#d8f3dc',
                  color: '#1b4332',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                  <ShieldCheck size={13} color="#1b4332" /> 50 US States Telehealth
                </span>
              </div>

              <h2 style={{ fontSize: '1.55rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px', color: '#ffffff' }}>
                Ongo Weight Loss (ongoweightloss.com)
              </h2>

              <p style={{ fontSize: '0.885rem', lineHeight: 1.6, color: '#e8f5ec', margin: '0 0 16px 0' }}>
                Doctor-supervised virtual GLP-1 weight loss clinic. Board-certified physicians (MD/MBA) provide personalized telehealth care with compounded Semaglutide &amp; Tirzepatide shipped in discreet, temperature-sensitive cold packaging nationwide.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '10px',
                padding: '14px',
                background: 'rgba(7, 20, 15, 0.48)',
                backdropFilter: 'blur(12px)',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.35)',
                fontSize: '0.78rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Stethoscope size={16} color="#74c69d" />
                  <span><strong>5 Board-Certified MDs:</strong> Okonkwo, Kramer, Patel, Miller, Krasne</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HeartPulse size={16} color="#f4a261" />
                  <span><strong>Molecules:</strong> $179 Sema &bull; $249 Tirz</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={16} color="#74c69d" />
                  <span><strong>Shipping:</strong> Free Cold-Pack 3-5 Days</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BadgeCheck size={16} color="#52b788" />
                  <span><strong>TrustScore:</strong> 4.9 ★ (1,250+ reviews)</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onSelectTab('ongo-pages')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #e76f51 0%, #ee8a4f 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 3px 12px rgba(231, 111, 81, 0.4)'
                }}
              >
                <Compass size={15} />
                <span>Audit Ongo Live Pages (43)</span>
              </button>

              <a
                href="https://ongoweightloss.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <span>Visit Live ongoweightloss.com</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Right Column: Authentic Image from ongoweightloss.com */}
          <div style={{
            position: 'relative',
            minHeight: '260px',
            background: 'url(/images/ongo/hero-right-banner.webp) center/cover no-repeat',
            borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '20px'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(8, 28, 21, 0.92) 0%, rgba(8, 28, 21, 0.3) 60%, transparent 100%)'
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(0,0,0,0.6)', color: '#74c69d', fontSize: '11px', fontWeight: 700, marginBottom: '6px' }}>
                <ShieldCheck size={13} /> Official Medication &amp; Patient Delivery
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                Real Doctor-Prescribed Compounded GLP-1 Telehealth Experience
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)' }}>
                Directly from ongoweightloss.com licensed compounding pharmacy partners
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Graphs, Lines, Curves, Meters & Counts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {/* Card 1: Clinical E-E-A-T Score Meter */}
        <div className="bento-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', textAlign: 'center' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-primary)' }}>
              Clinical Authority Meter
            </span>
            <span style={{ fontSize: '10px', background: '#dcfce7', color: '#166534', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
              Top 1% in US
            </span>
          </div>

          <CircularGaugeMeter
            value={95}
            max={100}
            label="Clinical E-E-A-T Score"
            subtitle="5 Board MDs • 50 States • NPI Registered"
            color="var(--color-primary-light)"
            size={135}
            badge="Clinical Grade A+"
          />

          <div style={{ width: '100%', marginTop: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-around', fontSize: '11px' }}>
            <div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>Physician Lead</div>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>100% MD</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>State Coverage</div>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>50 / 50</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>Consult Fee</div>
              <div style={{ fontWeight: 800, color: '#10b981' }}>$0 / Free</div>
            </div>
          </div>
        </div>

        {/* Card 2: 12-Month Search Demand Curve (Bezier Line & Area) */}
        <div className="bento-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#d97706' }}>
                Organic Demand Trajectory
              </span>
              <span style={{ fontSize: '10px', background: '#fef3c7', color: '#92400e', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                12-Mo Curve
              </span>
            </div>
            
            <BezierAreaCurve
              data={[28, 36, 44, 52, 68, 79, 95, 114, 138, 156, 172, 198]}
              height={95}
              color="#d97706"
              title="GLP-1 Patient Demand Curve"
              currentValue="198,000/mo"
              delta="+24.6% YoY Surge"
            />
          </div>

          <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Tirzepatide: <strong>+140% growth</strong></span>
            <span>Semaglutide: <strong>1.2M queries</strong></span>
          </div>
        </div>

        {/* Card 3: 217-Page Silo Architecture Donut Chart */}
        <div className="bento-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#e76f51' }}>
              217-Page Silo Distribution
            </span>
            <span style={{ fontSize: '10px', background: '#ffedd5', color: '#9a3412', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
              6 Silos
            </span>
          </div>

          <SiloDonutMeter
            size={130}
            centerTitle="217"
            centerSubtitle="Roadmap URLs"
            segments={[
              { label: 'Treatments', value: 70, color: '#1b4332' },
              { label: 'Conditions', value: 52, color: '#2d6a4f' },
              { label: 'Comparisons', value: 38, color: '#e76f51' },
              { label: 'Clinical FAQs', value: 30, color: '#d97706' },
              { label: 'State Hubs', value: 17, color: '#52b788' },
              { label: 'Patient Guides', value: 10, color: '#74c69d' }
            ]}
          />
        </div>

        {/* Card 4: 5-Axis Clinical E-E-A-T Radar Polygon */}
        <div className="bento-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-primary)' }}>
              E-E-A-T Radar Polygon
            </span>
            <span style={{ fontSize: '10px', background: '#dcfce7', color: '#166534', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
              5-Point Axis
            </span>
          </div>

          <ClinicalEEATPolygon size={145} />
        </div>
      </div>

      {/* Doctor-Led Clinical Team & Treatment Packaging Showcase */}
      <div className="bento-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge-minimal badge-minimal-success" style={{ fontSize: '0.72rem' }}>
                Medical Authority (ongoweightloss.com/medical-team)
              </span>
              <span className="badge-minimal badge-minimal-coral" style={{ fontSize: '0.72rem' }}>
                5 Board-Certified Physicians
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>
              Ongo Weight Loss Clinical Leadership &amp; Biological Mechanisms
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Doctor-prescribed compounding adhering to 503A USP &lt;797&gt; standards with transparent doctor bylines.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn-minimal-primary" 
              onClick={() => onSelectTab('compliance')}
              style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            >
              <Stethoscope size={13} />
              Inspect Doctor Profiles &amp; NPIs
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'center'
        }}>
          {/* Real Doctor Team Photo from ongoweightloss.com */}
          <div style={{
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #cbd5e1',
            boxShadow: '0 8px 24px rgba(27, 67, 50, 0.1)'
          }}>
            <img 
              src="/images/ongo/doctors-group.webp" 
              alt="Ongo Weight Loss Board-Certified Medical Doctors" 
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
            />
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#1b4332',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#74c69d' }}>
                  Medical Team &bull; 100% US-Licensed MDs
                </div>
                <div style={{ fontSize: '11px', color: '#e8f5ec' }}>
                  Dr. Okonkwo, Dr. Kramer, Dr. Patel, Dr. Miller, Dr. Krasne
                </div>
              </div>
              <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.18)', padding: '2px 8px', borderRadius: '4px' }}>
                Verified NPI
              </span>
            </div>
          </div>

          {/* Clinical Mechanisms & Pricing Comparison */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              6 Clinical Biological Mechanisms Targeted
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {[
                { icon: '/images/ongo/substantial-body-weight-reduction.svg', label: 'Weight Reduction', desc: 'Up to 15-20% average body loss' },
                { icon: '/images/ongo/appetite-suppression-and-craving-control.svg', label: 'Craving Control', desc: 'Dual GLP-1/GIP satiety triggers' },
                { icon: '/images/ongo/delayed-gastric-emptying.svg', label: 'Gastric Delay', desc: 'Prolonged fullness after meals' },
                { icon: '/images/ongo/improved-blood-sugar-regulation.svg', label: 'Insulin Sensitivity', desc: 'Optimized glycemic regulation' },
                { icon: '/images/ongo/cardiovascular-health.svg', label: 'Cardio Support', desc: 'Arterial & metabolic benefits' },
                { icon: '/images/ongo/kidney-and-liver-protection.svg', label: 'Hepatic Care', desc: 'Non-alcoholic fatty liver relief' }
              ].map((m, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: 'var(--bg-canvas)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <img src={m.icon} alt={m.label} style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary-dark)' }}>{m.label}</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Progress Meters */}
            <div className="glassneumorphic-well" style={{
              marginTop: '6px',
              padding: '12px 14px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <ComparisonBarMeter label="Monthly Patient Cost (Lower is Better)" ongoValue={179} competitorAvgValue={299} max={350} unit="$" />
              <ComparisonBarMeter label="Initial Doctor Consultation Fee" ongoValue={0} competitorAvgValue={89} max={150} unit="$" />
              <ComparisonBarMeter label="Physician Oversight (% MD vs NP)" ongoValue={100} competitorAvgValue={42} max={100} unit="%" />
            </div>
          </div>
        </div>
      </div>


      {/* Main Bento Grid */}
      <div className="bento-grid">
        
        {/* Bento Item 1: Executive Mission & Navigation (Span 8) */}
        <div className="bento-card bento-col-8" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span className="badge-minimal badge-minimal-neutral">
                Audit Intelligence
              </span>
              <span className="badge-minimal badge-minimal-coral">
                100 Competitors Monitored
              </span>
              <span className="badge-minimal badge-minimal-success">
                Ongo Benchmark
              </span>
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-primary-dark)', marginBottom: '10px', lineHeight: 1.25 }}>
              Medical Weight Loss Telehealth Ecosystem Audit
            </h1>

            <p style={{ fontSize: '0.885rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '640px', marginBottom: '22px' }}>
              Comprehensive architectural census of 100 compounded semaglutide & tirzepatide telehealth clinics. 
              Inspect competitor XML sitemaps, audit on-page metadata, benchmark Ongo Weight Loss, and unlock high-converting clinical keyword opportunities.
            </p>
          </div>

          {/* Action Navigation Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button className="btn-minimal-primary" onClick={() => onSelectTab('books')} style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#ffffff' }}>
              <BookOpen size={14} color="#d1fae5" />
              7 Onboarding Books (PDF)
            </button>
            <button className="btn-minimal-primary" onClick={() => onSelectTab('suite-sitemap')} style={{ background: 'linear-gradient(135deg, #1b4332 0%, #24553f 100%)', color: '#ffffff' }}>
              <FolderTree size={14} color="#74c69d" />
              Master Sitemap (14 Tools)
            </button>
            <button className="btn-minimal-primary" onClick={() => onSelectTab('keywords-harvester')} style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)', color: '#ffffff' }}>
              <Sparkles size={14} color="#74c69d" />
              Keyword & PAA Harvester
            </button>
            <button className="btn-minimal-primary" onClick={() => onSelectTab('internal-links')} style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)', color: '#ffffff' }}>
              <Link2 size={14} color="#74c69d" />
              Internal Link Recommender
            </button>
            <button className="btn-minimal-primary" onClick={() => onSelectTab('competitor-gap')} style={{ background: 'linear-gradient(135deg, #e76f51 0%, #d95d3f 100%)', color: '#ffffff' }}>
              <GitCompare size={14} />
              Competitor Gap Roadmap
            </button>
            <button className="btn-minimal-secondary" onClick={() => onSelectTab('sitemaps')}>
              <Globe size={14} />
              Sitemap Inspector
            </button>
            <button className="btn-minimal-secondary" onClick={() => onSelectTab('meta')}>
              <Tag size={14} />
              Ongo Meta Auditor
            </button>
            <button className="btn-minimal-secondary" onClick={() => onSelectTab('keywords')}>
              <Search size={14} />
              Keywords Matrix
            </button>
            <button className="btn-minimal-secondary" onClick={() => onSelectTab('patterns')}>
              <SplitSquareVertical size={14} />
              Common vs Unique
            </button>
            <button className="btn-minimal-secondary" onClick={() => onSelectTab('architecture')}>
              <Layers size={14} />
              217-Page Roadmap
            </button>
            <button className="btn-minimal-secondary" onClick={() => onSelectTab('reports')}>
              <FileText size={14} />
              Executive Reports
            </button>
          </div>
        </div>

        {/* Bento Item 2: Real-time Ping Sandbox (Span 4) */}
        <div className="bento-card bento-col-4" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} color="var(--color-primary)" />
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                  Live Endpoint Health Ping
                </h2>
              </div>
              <span className="badge-minimal badge-minimal-coral">HTTP / XML</span>
            </div>

            <form onSubmit={handleQuickCheck} style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="e.g. ongoweightloss.com"
                value={quickUrl}
                onChange={(e) => setQuickUrl(e.target.value)}
                className="input-minimal"
                style={{ fontSize: '0.8rem' }}
              />
              <button type="submit" className="btn-minimal-primary" disabled={checking} style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
                {checking ? '...' : 'Ping'}
              </button>
            </form>

            {/* Ongo & Competitor Presets */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => setQuickUrl('https://ongoweightloss.com/')}
                style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'var(--color-primary-soft)', border: '1px solid #b7e4c7', borderRadius: '9999px', color: '#1b4332', fontWeight: 600, cursor: 'pointer' }}
              >
                Ongo Home
              </button>
              <button
                type="button"
                onClick={() => setQuickUrl('https://ongoweightloss.com/services/glp-1/compounded-semaglutide/')}
                style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'var(--color-accent-soft)', border: '1px solid #f8bbad', borderRadius: '9999px', color: '#c84b2c', fontWeight: 600, cursor: 'pointer' }}
              >
                Ongo Sema
              </button>
              <button
                type="button"
                onClick={() => setQuickUrl('https://joinmochi.com/sitemap.xml')}
                style={{ fontSize: '0.7rem', padding: '3px 8px', background: '#f7f4ee', border: '1px solid var(--border-medium)', borderRadius: '9999px', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                Mochi #1
              </button>
              <button
                type="button"
                onClick={() => setQuickUrl('https://henrymeds.com/sitemap.xml')}
                style={{ fontSize: '0.7rem', padding: '3px 8px', background: '#f7f4ee', border: '1px solid var(--border-medium)', borderRadius: '9999px', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                Henry Meds #2
              </button>
            </div>
          </div>

          {/* Result Box */}
          {checkResult ? (
            <div style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-medium)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span className={`badge-minimal ${checkResult.reachable ? 'badge-minimal-success' : 'badge-minimal-danger'}`}>
                  HTTP {checkResult.status || 0}
                </span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
                  {checkResult.latency}ms
                </span>
              </div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {checkResult.url}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
              Pings live headers, response codes & latency in real-time.
            </div>
          )}
        </div>

        {/* Bento Item 3: Brands Tracked (Span 3) */}
        <div className="bento-card bento-col-3" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.73rem', color: 'var(--color-primary-dark)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            Tracked Competitors
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-primary-dark)', letterSpacing: '-0.02em' }}>
            {totalCompetitors}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />
            <span>74 with public sitemaps</span>
          </div>
        </div>

        {/* Bento Item 4: Total URLs (Span 3) */}
        <div className="bento-card bento-col-3" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.73rem', color: 'var(--color-accent)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            Total URLs Mapped
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-accent)', letterSpacing: '-0.02em' }}>
            {totalUrls.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Across 74 accessible telehealth domains
          </div>
        </div>

        {/* Bento Item 5: Semaglutide Focus (Span 3) */}
        <div className="bento-card bento-col-3" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.73rem', color: 'var(--color-primary-dark)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            Semaglutide URLs
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-primary-dark)', letterSpacing: '-0.02em' }}>
            {semaglutideUrls.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Wegovy, Ozempic, doses & titration
          </div>
        </div>

        {/* Bento Item 6: Tirzepatide Focus (Span 3) */}
        <div className="bento-card bento-col-3" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.73rem', color: 'var(--color-accent-warm)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            Tirzepatide URLs
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-accent-warm)', letterSpacing: '-0.02em' }}>
            {tirzepatideUrls.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Mounjaro, Zepbound & dual GIP
          </div>
        </div>

        {/* Bento Item 7: Architecture Macro Category Distribution (Span 7) */}
        <div className="bento-card bento-col-7" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                Content Silo Architecture (35,420 URLs)
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                How competitor telehealth websites distribute their organic search footprint
              </p>
            </div>
            <button className="btn-minimal-secondary" onClick={() => onSelectTab('architecture')} style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
              Full Breakdown <ArrowUpRight size={12} />
            </button>
          </div>

          {/* Ongo color themed bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Blog & Educational Content Hubs', count: 9680, pct: 26, color: '#347e5d' },
              { label: 'Core Treatment & Molecule Landing Pages', count: 3275, pct: 9, color: '#e76f51' },
              { label: 'Patient Clinical Guides & Side Effect Protocols', count: 1871, pct: 5, color: '#f4a261' },
              { label: 'Conversion Funnels & Medical Intake', count: 851, pct: 2.3, color: '#1b4332' },
              { label: 'Transparent Pricing & Subscription Plans', count: 653, pct: 1.8, color: '#10b981' },
              { label: 'Physicians, Clinical Team & E-E-A-T Bio Hubs', count: 599, pct: 1.6, color: '#7c3aed' }
            ].map(silo => (
              <div key={silo.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{silo.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600 }}>
                    {silo.count.toLocaleString()} URLs ({silo.pct}%)
                  </span>
                </div>
                <div style={{ height: '6px', width: '100%', background: '#ede7de', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, silo.pct * 3.4)}%`, background: silo.color, borderRadius: '9999px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bento Item 8: Ongo Footprint vs Market Leaders (Span 5) */}
        <div className="bento-card bento-col-5" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                Ongo Site Footprint Diagnosis
              </h2>
              <span className="badge-minimal badge-minimal-coral">Growth Gap</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-canvas)', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>Current Ongo Pages</div>
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-tertiary)' }}>11 core pages indexed & live</div>
                </div>
                <span className="badge-minimal badge-minimal-neutral">11 URLs</span>
              </div>

              <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--color-primary-soft)', border: '1px solid #b7e4c7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1b4332' }}>Recommended Roadmap</div>
                  <div style={{ fontSize: '0.73rem', color: '#2d6a4f' }}>217 high-intent landing pages</div>
                </div>
                <span className="badge-minimal badge-minimal-success">+206 Priority Targets</span>
              </div>

              <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-canvas)', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>Competitor Average</div>
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-tertiary)' }}>Top 20 brands average 350+ URLs</div>
                </div>
                <span className="badge-minimal">354 Avg</span>
              </div>
            </div>
          </div>

          <button 
            className="btn-minimal-primary" 
            onClick={() => onSelectTab('architecture')}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Review 217-Page Roadmap Checklist <ChevronRight size={14} />
          </button>
        </div>

        
        {/* Bento Item: Complete SEO & Clinical Intelligence Hierarchy (Levels 1–3) */}
        <div className="bento-card bento-col-12" style={{ padding: '28px', background: '#ffffff', border: '1px solid var(--border-medium)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '22px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge-minimal badge-minimal-success" style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  Ordered Workflow Architecture
                </span>
                <span className="badge-minimal badge-minimal-coral" style={{ fontSize: '0.72rem' }}>
                  3 Levels • 14 Specialized Tools
                </span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0, letterSpacing: '-0.02em' }}>
                Complete SEO & Clinical Intelligence Suite Hierarchy
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                Every tool is organized by its strategic level, its ordered use case, and what it achieves for Ongo Weight Loss.
              </p>
            </div>

            <button 
              className="btn-minimal-primary" 
              onClick={() => onSelectTab('suite-sitemap')}
              style={{ fontSize: '0.8rem', padding: '8px 16px', background: 'var(--color-primary-dark)', color: '#ffffff' }}
            >
              <FolderTree size={14} color="#74c69d" />
              Open Visual Master Sitemap <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {TOOL_CATEGORIES.map((category) => (
              <div 
                key={category.id} 
                style={{
                  background: 'var(--bg-canvas)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                {/* Level Category Header */}
                <div style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      background: category.level === 1 ? '#dcfce7' : category.level === 2 ? '#fef3c7' : '#ffedd5',
                      color: category.level === 1 ? '#166534' : category.level === 2 ? '#92400e' : '#9a3412',
                      border: '1px solid rgba(0,0,0,0.06)',
                      textTransform: 'uppercase'
                    }}>
                      Level {category.level}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                      {category.tools.length} Tools
                    </span>
                  </div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: '0 0 6px 0' }}>
                    {category.name}
                  </h3>
                  <div style={{
                    fontSize: '0.76rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.45,
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <strong style={{ color: 'var(--color-primary-dark)' }}>Core Use Case:</strong> {category.useCase}
                  </div>
                </div>

                {/* Tool List in this Level */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  {category.tools.map((tool, idx) => {
                    const stepNum = category.level === 1 ? idx + 1 : category.level === 2 ? idx + 6 : idx + 10;
                    return (
                      <div 
                        key={tool.id}
                        style={{
                          padding: '12px 14px',
                          background: '#ffffff',
                          borderRadius: '8px',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              padding: '1px 6px',
                              borderRadius: '4px',
                              background: 'var(--color-primary-soft)',
                              color: 'var(--color-primary-dark)',
                              fontFamily: 'var(--font-mono)'
                            }}>
                              #{stepNum}
                            </span>
                            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                              {tool.name}
                            </span>
                          </div>
                          <button
                            onClick={() => onSelectTab(tool.id as any)}
                            style={{
                              background: 'var(--bg-canvas)',
                              border: '1px solid var(--border-subtle)',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '0.68rem',
                              fontWeight: 600,
                              color: 'var(--color-primary-dark)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                          >
                            <span>Open</span>
                            <ChevronRight size={11} />
                          </button>
                        </div>

                        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {tool.description}
                        </div>

                        <div style={{ fontSize: '0.71rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                          ↳ <em>Use Case: {tool.useCase}</em>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bento Item 9: Top Competitor Radar (Span 12) */}
        <div className="bento-card bento-col-12" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                Top Competitors Organic Radar
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Highest volume telehealth competitors vs Ongo Weight Loss benchmark
              </p>
            </div>
            <button className="btn-minimal-secondary" onClick={() => onSelectTab('competitors')} style={{ fontSize: '0.75rem' }}>
              View All 100 Competitors <ArrowUpRight size={12} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
            {topByVolume.map((comp) => (
              <div
                key={comp.domain}
                className="bento-card bento-card-interactive"
                style={{ padding: '16px', background: 'var(--bg-canvas)', cursor: 'pointer', border: '1px solid var(--border-medium)' }}
                onClick={() => onInspectCompetitor(comp.localFolder)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-primary-dark)', fontWeight: 700 }}>
                    RANK #{comp.rank}
                  </span>
                  <span className="badge-minimal badge-minimal-success" style={{ fontSize: '0.65rem' }}>
                    {comp.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '2px' }}>
                  {comp.name}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
                  {comp.domain}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>TOTAL</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>{comp.totalUrls}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>SEMA</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)' }}>{comp.semaglutideUrls}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>TIRZ</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-accent)' }}>{comp.tirzepatideUrls}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
