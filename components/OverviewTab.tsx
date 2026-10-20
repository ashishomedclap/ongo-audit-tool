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
  FileText
} from 'lucide-react';
import { CompetitorSummary } from '@/lib/data';
import ContextCue from './ContextCue';

interface OverviewTabProps {
  competitors: CompetitorSummary[];
  onSelectTab: (tab: 'sitemaps' | 'competitors' | 'keywords' | 'meta' | 'architecture' | 'reports') => void;
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ContextCue
        badge="Dashboard Overview"
        title="GLP-1 Telehealth Competitive Landscape"
        summary="This dashboard synthesizes architectural, sitemap, and SEO data from 100 US compounded semaglutide & tirzepatide telehealth competitors to establish an optimization benchmark for Ongo Weight Loss."
        details={[
          {
            label: "Sitemaps Tracked",
            description: "74 of 100 competitors expose public XML sitemaps containing 35,420 mapped URLs. 26 brands use heavy Cloudflare/Akamai bot management or headless architectures without public feeds."
          },
          {
            label: "Molecule Distribution",
            description: "Competitors index more than double the volume of Semaglutide pages (2,400+) compared to Tirzepatide (1,100+), reflecting historic Ozempic/Wegovy demand."
          },
          {
            label: "Ongo Expansion Target",
            description: "While top competitors average 350+ URLs, Ongo currently operates 11 core live pages. The 217-page roadmap provides a step-by-step checklist to bridge this organic reach gap."
          }
        ]}
        tip="Use the Live Ping box on the right to test connectivity and response latency for any sitemap or URL in real-time."
      />

      <div className="bento-grid">
      {/* Bento Item 1: Executive Mission & Navigation (Span 8) */}
      <div className="bento-card bento-col-8" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span className="badge-minimal badge-minimal-neutral">
              Audit Intelligence
            </span>
            <span className="badge-minimal">
              100 Compounded Brands
            </span>
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.25 }}>
            Medical Weight Loss Telehealth Ecosystem Audit
          </h1>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '640px', marginBottom: '24px' }}>
            Comprehensive architectural census of 100 compounded semaglutide & tirzepatide competitors.
            Inspect active XML sitemaps, audit on-page metadata, benchmark Ongo Weight Loss, and discover high-intent keyword gaps.
          </p>
        </div>

        {/* Action Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button className="btn-minimal-primary" onClick={() => onSelectTab('sitemaps')}>
            <Globe size={14} />
            Sitemap Inspector
          </button>
          <button className="btn-minimal-secondary" onClick={() => onSelectTab('meta')}>
            <Tag size={14} />
            Ongo Meta Audit
          </button>
          <button className="btn-minimal-secondary" onClick={() => onSelectTab('keywords')}>
            <Search size={14} />
            Keywords Scanner
          </button>
          <button className="btn-minimal-secondary" onClick={() => onSelectTab('architecture')}>
            <Layers size={14} />
            217-Page Roadmap
          </button>
          <button className="btn-minimal-secondary" onClick={() => onSelectTab('reports')}>
            <FileText size={14} />
            Reports
          </button>
        </div>
      </div>

      {/* Bento Item 2: Real-time Ping Sandbox (Span 4) */}
      <div className="bento-card bento-col-4" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} color="var(--text-secondary)" />
              <h2 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Live Sitemap Health Ping
              </h2>
            </div>
            <span className="badge-minimal">HTTP / XML</span>
          </div>

          <form onSubmit={handleQuickCheck} style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="e.g. joinmochi.com/sitemap.xml"
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              className="input-minimal"
              style={{ fontSize: '0.8rem' }}
            />
            <button type="submit" className="btn-minimal-primary" disabled={checking} style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
              {checking ? '...' : 'Ping'}
            </button>
          </form>

          {/* Preset Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => setQuickUrl('https://ongoweightloss.com/')}
              style={{ fontSize: '0.7rem', padding: '3px 7px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              Ongo Live
            </button>
            <button
              type="button"
              onClick={() => setQuickUrl('https://joinmochi.com/sitemap.xml')}
              style={{ fontSize: '0.7rem', padding: '3px 7px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              Mochi #1
            </button>
            <button
              type="button"
              onClick={() => setQuickUrl('https://henrymeds.com/sitemap.xml')}
              style={{ fontSize: '0.7rem', padding: '3px 7px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              Henry Meds #2
            </button>
          </div>
        </div>

        {/* Result Area */}
        {checkResult ? (
          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-canvas)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span className={`badge-minimal ${checkResult.reachable ? 'badge-minimal-success' : 'badge-minimal-danger'}`}>
                HTTP {checkResult.status || 0}
              </span>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                {checkResult.latency}ms
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {checkResult.url}
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
            Pings live headers, response codes & latency in real-time.
          </div>
        )}
      </div>

      {/* Bento Item 3: Brands Tracked (Span 3) */}
      <div className="bento-card bento-col-3" style={{ padding: '20px' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
          Tracked Brands
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {totalCompetitors}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)' }} />
          <span>74 with public sitemaps</span>
        </div>
      </div>

      {/* Bento Item 4: Total URLs (Span 3) */}
      <div className="bento-card bento-col-3" style={{ padding: '20px' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
          Total URLs Mapped
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {totalUrls.toLocaleString()}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
          Across 74 accessible domains
        </div>
      </div>

      {/* Bento Item 5: Semaglutide Focus (Span 3) */}
      <div className="bento-card bento-col-3" style={{ padding: '20px' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
          Semaglutide URLs
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {semaglutideUrls.toLocaleString()}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
          Wegovy, Ozempic, vials & doses
        </div>
      </div>

      {/* Bento Item 6: Tirzepatide Focus (Span 3) */}
      <div className="bento-card bento-col-3" style={{ padding: '20px' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
          Tirzepatide URLs
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {tirzepatideUrls.toLocaleString()}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
          Mounjaro, Zepbound & dual GIP
        </div>
      </div>

      {/* Bento Item 7: Architecture Macro Category Distribution (Span 7) */}
      <div className="bento-card bento-col-7" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Content Silo Architecture (36k+ URLs)
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              How competitor telehealth websites distribute their organic search footprint
            </p>
          </div>
          <button className="btn-minimal-secondary" onClick={() => onSelectTab('architecture')} style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
            Full Breakdown <ArrowUpRight size={12} />
          </button>
        </div>

        {/* Minimal neutral bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { label: 'Blog & Content Hubs', count: 9680, pct: 26 },
            { label: 'Core Treatment & Product Pages', count: 3275, pct: 9 },
            { label: 'Patient Education & Guides', count: 1871, pct: 5 },
            { label: 'Conversion Funnels & Intake', count: 851, pct: 2.3 },
            { label: 'Pricing & Transparent Plans', count: 653, pct: 1.8 },
            { label: 'Doctors, Clinical Team & E-E-A-T', count: 599, pct: 1.6 }
          ].map(silo => (
            <div key={silo.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{silo.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                  {silo.count.toLocaleString()} URLs ({silo.pct}%)
                </span>
              </div>
              <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(100, silo.pct * 3)}%`, background: '#e4e4e7' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bento Item 8: Ongo Footprint vs Market Leaders (Span 5) */}
      <div className="bento-card bento-col-5" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Ongo Site Footprint Diagnosis
            </h2>
            <span className="badge-minimal badge-minimal-neutral">Opportunity</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Current Ongo Pages</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>11 core pages live</div>
              </div>
              <span className="badge-minimal">11 URLs</span>
            </div>

            <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Recommended Expansion</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>217 high-intent landing pages</div>
              </div>
              <span className="badge-minimal badge-minimal-success">+206 Target</span>
            </div>

            <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Competitor Average</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Top 20 brands average 350+ URLs</div>
              </div>
              <span className="badge-minimal">354 Avg</span>
            </div>
          </div>
        </div>

        <button 
          className="btn-minimal-secondary" 
          onClick={() => onSelectTab('architecture')}
          style={{ width: '100%' }}
        >
          Review 217-Page Roadmap Checklist <ChevronRight size={14} />
        </button>
      </div>

      {/* Bento Item 9: Top Competitor Radar (Span 12) */}
      <div className="bento-card bento-col-12" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Market Leaders Organic Radar
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              Top 4 telehealth providers by total crawled sitemap pages
            </p>
          </div>
          <button className="btn-minimal-secondary" onClick={() => onSelectTab('competitors')} style={{ fontSize: '0.75rem' }}>
            View All 100 Competitors <ArrowUpRight size={12} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {topByVolume.map((comp) => (
            <div
              key={comp.domain}
              className="bento-card bento-card-interactive"
              style={{ padding: '16px', background: 'var(--bg-canvas)', cursor: 'pointer' }}
              onClick={() => onInspectCompetitor(comp.localFolder)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                  RANK #{comp.rank}
                </span>
                <span className="badge-minimal badge-minimal-success" style={{ fontSize: '0.65rem' }}>
                  {comp.status}
                </span>
              </div>

              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                {comp.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
                {comp.domain}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>TOTAL</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{comp.totalUrls}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>SEMA</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{comp.semaglutideUrls}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>TIRZ</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{comp.tirzepatideUrls}</div>
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
