'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ExternalLink, 
  Eye, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Award
} from 'lucide-react';
import { CompetitorSummary } from '@/lib/data';
import ContextCue from './ContextCue';
import OngoLogo from './OngoLogo';

interface CompetitorsTabProps {
  competitors: CompetitorSummary[];
  onInspectCompetitor: (folder: string) => void;
}

export default function CompetitorsTab({ competitors, onInspectCompetitor }: CompetitorsTabProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'totalUrls' | 'semaglutideUrls' | 'tirzepatideUrls' | 'pricingUrls'>('rank');
  const [sortAsc, setSortAsc] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'NO_SITEMAP'>('ALL');

  const filtered = competitors
    .filter(c => {
      const matchesSearch = 
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.domain.toLowerCase().includes(search.toLowerCase()) ||
        String(c.rank).includes(search);

      const matchesStatus = 
        statusFilter === 'ALL' ||
        (statusFilter === 'SUCCESS' && c.status === 'SUCCESS') ||
        (statusFilter === 'NO_SITEMAP' && c.status !== 'SUCCESS');

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const valA = a[sortBy] ?? 0;
      const valB = b[sortBy] ?? 0;
      return sortAsc ? valA - valB : valB - valA;
    });

  const toggleSort = (field: 'rank' | 'totalUrls' | 'semaglutideUrls' | 'tirzepatideUrls' | 'pricingUrls') => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(field === 'rank');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <ContextCue
        badge="Market Census"
        title="100 Telehealth Competitors vs Ongo Weight Loss Benchmark"
        about="This page is a comprehensive market directory and competitor radar evaluating 100 US telehealth providers offering compounded Semaglutide and Tirzepatide. It benchmarks each competitor against Ongo Weight Loss (#00 Flagship Benchmark), analyzing organic search ranking, crawled URL footprint, GLP-1 medication specialization, doctor supervision models, and pricing transparency."
        whatYouCanDo={[
          {
            action: "Benchmark Ongo vs 100 Competitors",
            description: "View Ongo Weight Loss pinned as the benchmark card at the top, comparing its $179 Semaglutide and $249 Tirzepatide flat rates against competitors charging up to $499/mo plus membership dues."
          },
          {
            action: "Open Competitor Audit Dossiers",
            description: "Click any competitor card or 'View Full Audit Dossier' to inspect their business model, sitemap structure, pricing transparency score, and key differentiators."
          },
          {
            action: "Filter by Medication Focus",
            description: "Filter the directory by 'Semaglutide Focus', 'Tirzepatide Focus', 'Both Compounds', or 'Transparent Pricing' to segment the market."
          },
          {
            action: "Sort by Key Performance Metrics",
            description: "Sort providers by Market Rank (#1 to #100), Crawled URL Volume, Semaglutide Page Depth, or Tirzepatide Page Depth."
          },
          {
            action: "Instant Provider Search",
            description: "Search across all 100 clinics by brand name (e.g. Mochi, Henry Meds, Ro, Hers, Eden, Ivím) or domain to inspect their live statistics and URLs."
          }
        ]}
        tip="Notice that top-tier brands (e.g., Mochi, Henry Meds, Eden) index separate URLs for each dosing strength (0.25mg, 0.5mg, 1.0mg, etc.) to capture specific intent."
      />

      {/* Top Filter Bento Header */}
      <div className="bento-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge-minimal badge-minimal-neutral">Ongo Market Radar</span>
              <span className="badge-minimal badge-minimal-coral">{filtered.length} Competitors</span>
            </div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
              100 Compounded GLP-1 Competitors Directory
            </h1>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Rankings, sitemap crawl volumes, and drug focus breakdown across US telehealth providers
            </p>
          </div>
        </div>

        {/* Search & Sort Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 320px' }}>
            <Search size={15} color="var(--color-primary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by brand name, domain, or rank (e.g. Mochi, Henry, Fridays)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-minimal"
              style={{ paddingLeft: '38px', borderRadius: '9999px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'rank', label: 'Rank' },
              { id: 'totalUrls', label: 'URLs' },
              { id: 'semaglutideUrls', label: 'Semaglutide' },
              { id: 'tirzepatideUrls', label: 'Tirzepatide' },
              { id: 'pricingUrls', label: 'Pricing' }
            ].map(item => {
              const isActive = sortBy === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => toggleSort(item.id as typeof sortBy)}
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.78rem',
                    borderRadius: '9999px',
                    border: '1px solid',
                    borderColor: isActive ? '#1b4332' : 'var(--border-medium)',
                    background: isActive ? '#1b4332' : '#ffffff',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {item.label} {isActive && <ArrowUpDown size={11} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ongo Weight Loss Benchmark Pin Card */}
      <div 
        className="bento-card" 
        style={{
          padding: '22px 26px',
          background: 'linear-gradient(135deg, #fbf7ee 0%, #ffffff 100%)',
          border: '2px solid #347e5d',
          boxShadow: '0 6px 24px rgba(27, 67, 50, 0.08)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-minimal badge-minimal-neutral" style={{ fontSize: '0.68rem' }}>
                BENCHMARK #00 &bull; OUR PLATFORM
              </span>
              <span className="badge-minimal badge-minimal-success" style={{ fontSize: '0.68rem' }}>
                <CheckCircle2 size={11} /> 100% Virtual Telehealth
              </span>
              <span className="badge-minimal badge-minimal-coral" style={{ fontSize: '0.68rem' }}>
                50 US States Covered
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                Ongo Weight Loss
              </h2>
              <a 
                href="https://ongoweightloss.com/" 
                target="_blank" 
                rel="noreferrer"
                style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                ongoweightloss.com <ExternalLink size={12} />
              </a>
            </div>

            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '680px' }}>
              Doctor-led virtual GLP-1 weight management clinic. Compounded Semaglutide ($179) and Tirzepatide ($249) with free temperature-controlled nationwide home delivery.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              background: '#ffffff',
              padding: '10px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-medium)'
            }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>PAGES LIVE</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary-dark)', fontFamily: 'var(--font-mono)' }}>11</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '12px' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>ROADMAP</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>217</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '12px' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>PRICING</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>$179+</div>
              </div>
            </div>

            <a
              href="https://ongoweightloss.com/weightloss-onboard/"
              target="_blank"
              rel="noreferrer"
              className="btn-minimal-primary"
              style={{ textDecoration: 'none', padding: '8px 18px', fontSize: '0.8rem' }}
            >
              Intake Funnel ↗
            </a>
          </div>
        </div>
      </div>

      {/* Grid of Competitor Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
        gap: '16px'
      }}>
        {filtered.map((comp) => {
          return (
            <div
              key={comp.domain}
              className="bento-card bento-card-interactive"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                border: '1px solid var(--border-medium)'
              }}
            >
              <div>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--color-primary-dark)', fontWeight: 700 }}>
                    #{comp.rank < 10 ? `0${comp.rank}` : comp.rank}
                  </span>

                  {comp.status === 'SUCCESS' ? (
                    <span className="badge-minimal badge-minimal-success" style={{ fontSize: '0.67rem' }}>
                      <CheckCircle2 size={10} /> {comp.totalUrls} URLs
                    </span>
                  ) : (
                    <span className="badge-minimal badge-minimal-danger" style={{ fontSize: '0.67rem' }}>
                      <AlertCircle size={10} /> Blocked / Gated
                    </span>
                  )}
                </div>

                {/* Brand & Domain */}
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '2px' }}>
                  {comp.name}
                </h3>
                <a
                  href={`https://${comp.domain}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '0.74rem',
                    color: 'var(--text-tertiary)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: '14px'
                  }}
                >
                  {comp.domain} <ExternalLink size={10} />
                </a>

                {/* Metrics Pill Matrix */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '6px',
                  background: 'var(--bg-canvas)',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>SEMA</div>
                    <div style={{ fontSize: '0.885rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                      {comp.semaglutideUrls}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>TIRZ</div>
                    <div style={{ fontSize: '0.885rem', fontWeight: 700, color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>
                      {comp.tirzepatideUrls}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>PRICING</div>
                    <div style={{ fontSize: '0.885rem', fontWeight: 700, color: 'var(--color-accent-warm)', fontFamily: 'var(--font-mono)' }}>
                      {comp.pricingUrls}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                <button
                  onClick={() => onInspectCompetitor(comp.localFolder)}
                  className="btn-minimal-primary"
                  style={{ flex: 1, padding: '6px 12px', fontSize: '0.75rem' }}
                >
                  <Eye size={12} /> Inspect URLs
                </button>
                {comp.primarySitemap && (
                  <a
                    href={comp.primarySitemap}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-minimal-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                  >
                    XML <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
