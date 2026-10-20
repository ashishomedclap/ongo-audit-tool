'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ExternalLink, 
  Eye, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { CompetitorSummary } from '@/lib/data';
import ContextCue from './ContextCue';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ContextCue
        badge="Competitor Directory Cues"
        title="Top 100 US Telehealth Competitors Landscape"
        summary="You are viewing the structured market directory of 100 compounded semaglutide & tirzepatide brands. Each card displays rank, domain, total indexed URLs, and compound-specific landing page counts."
        details={[
          {
            label: "Rank Evaluation",
            description: "Ranks (#1 to #100) are determined by brand search volume, patient review authority, telehealth infrastructure, and organic footprint."
          },
          {
            label: "SEMA vs TIRZ Pills",
            description: "The volume of dedicated URLs mentioning Semaglutide/Wegovy vs Tirzepatide/Mounjaro/Zepbound in their URL structure."
          },
          {
            label: "Pricing Transparency",
            description: "Indicates whether the brand publishes explicit pricing, cost calculator, or subscription plan pages in their public sitemaps."
          },
          {
            label: "Quick Actions",
            description: "Use 'Inspect URLs' to view all crawled paths or 'XML' to view the raw sitemap in a new browser tab."
          }
        ]}
        tip="Brands with high SEMA and TIRZ counts (e.g. Mochi, Eden, Zealthy) dominate long-tail dosage, titration, and side effect queries on Google."
      />

      {/* Top Filter Bento Header */}
      <div className="bento-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              100 Compounded GLP-1 Competitors Directory
            </h1>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              Rankings, sitemap crawl volumes, and drug focus breakdown across US telehealth providers
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <span className="badge-minimal">{filtered.length} Competitors</span>
          </div>
        </div>

        {/* Search & Sort Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 320px' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by brand name, domain, or rank..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-minimal"
              style={{ paddingLeft: '34px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {[
              { id: 'rank', label: 'Rank' },
              { id: 'totalUrls', label: 'URLs' },
              { id: 'semaglutideUrls', label: 'Semaglutide' },
              { id: 'tirzepatideUrls', label: 'Tirzepatide' },
              { id: 'pricingUrls', label: 'Pricing' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => toggleSort(item.id as typeof sortBy)}
                style={{
                  padding: '5px 10px',
                  fontSize: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  background: sortBy === item.id ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  color: sortBy === item.id ? '#fafafa' : 'var(--text-tertiary)',
                  cursor: 'pointer',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {item.label} {sortBy === item.id && <ArrowUpDown size={10} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bento Grid of Competitor Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
        gap: '14px'
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
                gap: '14px'
              }}
            >
              <div>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                    #{comp.rank < 10 ? `0${comp.rank}` : comp.rank}
                  </span>

                  {comp.status === 'SUCCESS' ? (
                    <span className="badge-minimal badge-minimal-success" style={{ fontSize: '0.65rem' }}>
                      <CheckCircle2 size={10} /> {comp.totalUrls} URLs
                    </span>
                  ) : (
                    <span className="badge-minimal badge-minimal-danger" style={{ fontSize: '0.65rem' }}>
                      <AlertCircle size={10} /> No Sitemap
                    </span>
                  )}
                </div>

                {/* Brand & Domain */}
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                  {comp.name}
                </h3>
                <a
                  href={`https://${comp.domain}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-tertiary)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: '14px'
                  }}
                >
                  {comp.domain} <ExternalLink size={9} />
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
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>SEMA</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      {comp.semaglutideUrls}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>TIRZ</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      {comp.tirzepatideUrls}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>PRICING</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
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
                  style={{ flex: 1, padding: '6px 10px', fontSize: '0.75rem' }}
                >
                  <Eye size={12} /> Inspect URLs
                </button>
                {comp.primarySitemap && (
                  <a
                    href={comp.primarySitemap}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-minimal-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.75rem' }}
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
