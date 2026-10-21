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
  BadgeCheck
} from 'lucide-react';
import { CompetitorSummary } from '@/lib/data';
import ContextCue from './ContextCue';
import OngoLogo from './OngoLogo';

interface OverviewTabProps {
  competitors: CompetitorSummary[];
  onSelectTab: (tab: 'sitemaps' | 'competitors' | 'keywords' | 'patterns' | 'meta' | 'architecture' | 'reports') => void;
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

      {/* Ongo Flagship Clinic Spotlight Banner */}
      <div className="bento-card" style={{
        padding: '24px 28px',
        background: 'linear-gradient(135deg, #1b4332 0%, #24553f 65%, #2d6a4f 100%)',
        color: '#ffffff',
        border: '1px solid #347e5d',
        boxShadow: '0 8px 30px -4px rgba(27, 67, 50, 0.25)'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <div style={{ maxWidth: '780px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '3px 10px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                Flagship Platform Benchmark
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
                gap: '4px'
              }}>
                <ShieldCheck size={13} color="#1b4332" /> 50 US States Telehealth
              </span>
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px', color: '#ffffff' }}>
              Ongo Weight Loss (ongoweightloss.com)
            </h2>

            <p style={{ fontSize: '0.865rem', lineHeight: 1.6, color: '#e8f5ec', margin: 0 }}>
              Doctor-supervised virtual GLP-1 weight loss program. Board-certified physicians (MD/MBA) provide personalized telehealth care with compounded Semaglutide & Tirzepatide shipped in discreet, temperature-sensitive cold packaging nationwide.
            </p>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              marginTop: '16px',
              paddingTop: '14px',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.78rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Stethoscope size={15} color="#74c69d" />
                <span><strong>5 Board-Certified Doctors:</strong> Okonkwo, Kramer, Patel, Miller, Krasne</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HeartPulse size={15} color="#f4a261" />
                <span><strong>Molecules:</strong> Compounded Semaglutide & Tirzepatide</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={15} color="#74c69d" />
                <span><strong>Delivery:</strong> Free 3-5 Days Nationwide</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BadgeCheck size={15} color="#52b788" />
                <span><strong>TrustScore:</strong> 4.9 ★ (1,250+ reviews)</span>
              </div>
            </div>
          </div>

          {/* Right Action Box */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            minWidth: '220px'
          }}>
            <a
              href="https://ongoweightloss.com/weightloss-onboard/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-minimal-primary"
              style={{ padding: '10px 18px', fontSize: '0.85rem', textDecoration: 'none' }}
            >
              <span>See If I'm Eligible</span>
              <ArrowUpRight size={15} />
            </a>
            
            <a
              href="https://ongoweightloss.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                fontSize: '0.78rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <span>Visit Live Website</span>
              <ExternalLink size={13} />
            </a>
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
            <button className="btn-minimal-primary" onClick={() => onSelectTab('sitemaps')}>
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
