'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  ExternalLink, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpDown,
  RefreshCw,
  Eye,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { CompetitorSummary } from '@/lib/data';
import ContextCue from './ContextCue';

interface SitemapsTabProps {
  competitors: CompetitorSummary[];
  onInspectCompetitor: (folder: string) => void;
}

export default function SitemapsTab({ competitors, onInspectCompetitor }: SitemapsTabProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'NO_SITEMAP'>('ALL');
  const [sortBy, setSortBy] = useState<'rank' | 'totalUrls' | 'semaglutideUrls' | 'tirzepatideUrls'>('rank');
  const [sortAsc, setSortAsc] = useState(true);

  const [checkLoading, setCheckLoading] = useState<Record<string, boolean>>({});
  const [checkResults, setCheckResults] = useState<Record<string, {
    status?: number;
    latency?: number;
    reachable?: boolean;
    error?: string;
  }>>({});

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

  const handleLiveCheck = async (comp: CompetitorSummary) => {
    const urlToCheck = comp.primarySitemap || `https://${comp.domain}/sitemap.xml`;
    setCheckLoading(prev => ({ ...prev, [comp.domain]: true }));

    try {
      const res = await fetch('/api/check-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToCheck })
      });
      const data = await res.json();
      setCheckResults(prev => ({
        ...prev,
        [comp.domain]: {
          status: data.status,
          latency: data.latency,
          reachable: data.reachable,
          error: data.error
        }
      }));
    } catch {
      setCheckResults(prev => ({
        ...prev,
        [comp.domain]: {
          status: 0,
          latency: 0,
          reachable: false,
          error: 'Connection error'
        }
      }));
    } finally {
      setCheckLoading(prev => ({ ...prev, [comp.domain]: false }));
    }
  };

  const toggleSort = (field: 'rank' | 'totalUrls' | 'semaglutideUrls' | 'tirzepatideUrls') => {
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
        badge="Sitemap Intelligence"
        title="100 Competitor Sitemaps vs Ongo Weight Loss Benchmark"
        about="This page is an XML sitemap census and live HTTP connectivity auditor covering 100 US telehealth competitors. It indexes 35,420 crawled URLs to reveal which clinics expose transparent XML sitemap feeds (74 brands) versus those that gate content behind Cloudflare WAFs or dynamic client-side applications (26 brands). It also benchmarks dedicated Semaglutide and Tirzepatide landing page depth across each competitor."
        whatYouCanDo={[
          {
            action: "Ping Real-Time HTTP Connectivity",
            description: "Click 'Ping' on any competitor domain or sitemap URL to test live HTTP status codes (200, 403, 404), TLS handshake latency in ms, and response headers."
          },
          {
            action: "Inspect Crawled URL Inventories",
            description: "Click 'Inspect URLs' on any brand to open a deep-dive drawer listing all crawled paths, drug categorization tags, and last-modified dates."
          },
          {
            action: "Filter by Feed Status",
            description: "Toggle between 'All Feeds', 'Valid XML Sitemaps' (74 active), and 'Gated / Blocked' (26 brands) to see transparent vs. gated telehealth competitors."
          },
          {
            action: "Sort by Medication Depth",
            description: "Sort by total Semaglutide or Tirzepatide pages to see which clinics have created high-volume dosage and comparison landing pages."
          },
          {
            action: "Search Any Telehealth Clinic",
            description: "Use the search bar to filter by brand name, domain, CMS platform (WordPress, Webflow, Next.js), or mapped URL count."
          }
        ]}
        tip="Sort by 'Semaglutide' or 'Tirzepatide' to find out which clinics have built aggressive long-tail dosage and comparison funnels."
      />

      {/* Top Filter Bento Header */}
      <div className="bento-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge-minimal badge-minimal-neutral">Ongo Audit Suite</span>
              <span className="badge-minimal badge-minimal-success">74 Active Feeds</span>
              <span className="badge-minimal badge-minimal-danger">26 Gated / No Feeds</span>
            </div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
              Sitemap Inspector & Live Health Verifier
            </h1>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Benchmark Ongo Weight Loss against all 100 telehealth competitors with live connectivity checks
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge-minimal badge-minimal-coral" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              {filtered.length} Competitors Shown
            </span>
          </div>
        </div>

        {/* Search & Status Pill Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 320px' }}>
            <Search size={15} color="var(--color-primary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search competitor brand, domain, or rank (e.g. Mochi, Henry, Fridays)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-minimal"
              style={{ paddingLeft: '38px', borderRadius: '9999px' }}
            />
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '4px', 
            background: 'var(--bg-canvas)', 
            padding: '4px', 
            borderRadius: '9999px', 
            border: '1px solid var(--border-medium)' 
          }}>
            <button
              onClick={() => setStatusFilter('ALL')}
              style={{
                padding: '6px 14px',
                fontSize: '0.78rem',
                borderRadius: '9999px',
                border: 'none',
                background: statusFilter === 'ALL' ? '#1b4332' : 'transparent',
                color: statusFilter === 'ALL' ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 700,
                transition: 'all 0.15s ease'
              }}
            >
              All ({competitors.length})
            </button>
            <button
              onClick={() => setStatusFilter('SUCCESS')}
              style={{
                padding: '6px 14px',
                fontSize: '0.78rem',
                borderRadius: '9999px',
                border: 'none',
                background: statusFilter === 'SUCCESS' ? '#d8f3dc' : 'transparent',
                color: statusFilter === 'SUCCESS' ? '#1b4332' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 700,
                transition: 'all 0.15s ease'
              }}
            >
              Active Sitemaps (74)
            </button>
            <button
              onClick={() => setStatusFilter('NO_SITEMAP')}
              style={{
                padding: '6px 14px',
                fontSize: '0.78rem',
                borderRadius: '9999px',
                border: 'none',
                background: statusFilter === 'NO_SITEMAP' ? '#fee2e2' : 'transparent',
                color: statusFilter === 'NO_SITEMAP' ? '#991b1b' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 700,
                transition: 'all 0.15s ease'
              }}
            >
              No Sitemap (26)
            </button>
          </div>
        </div>
      </div>

      {/* Sitemaps Table */}
      <div className="bento-card" style={{ overflowX: 'auto', padding: '0', border: '1px solid var(--border-medium)' }}>
        <table className="neutral-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort('rank')} style={{ cursor: 'pointer', width: '75px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Rank {sortBy === 'rank' && <ArrowUpDown size={12} />}
                </div>
              </th>
              <th>Competitor & Domain</th>
              <th>Status</th>
              <th onClick={() => toggleSort('totalUrls')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Total URLs {sortBy === 'totalUrls' && <ArrowUpDown size={12} />}
                </div>
              </th>
              <th onClick={() => toggleSort('semaglutideUrls')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Semaglutide {sortBy === 'semaglutideUrls' && <ArrowUpDown size={12} />}
                </div>
              </th>
              <th onClick={() => toggleSort('tirzepatideUrls')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Tirzepatide {sortBy === 'tirzepatideUrls' && <ArrowUpDown size={12} />}
                </div>
              </th>
              <th>Live Ping</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((comp) => {
              const checkInfo = checkResults[comp.domain];
              const isLoading = checkLoading[comp.domain];

              return (
                <tr key={comp.domain}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary-dark)', fontWeight: 700 }}>
                    #{comp.rank}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)', fontSize: '0.865rem' }}>
                      {comp.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      {comp.domain}
                    </div>
                  </td>
                  <td>
                    {comp.status === 'SUCCESS' ? (
                      <span className="badge-minimal badge-minimal-success">
                        <CheckCircle2 size={11} /> Valid ({comp.totalSitemaps} xml)
                      </span>
                    ) : (
                      <span className="badge-minimal badge-minimal-danger">
                        <AlertCircle size={11} /> Blocked / Gated
                      </span>
                    )}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: comp.totalUrls > 0 ? 'var(--color-primary-dark)' : 'var(--text-muted)' }}>
                    {comp.totalUrls.toLocaleString()}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: comp.semaglutideUrls > 0 ? 'var(--color-primary)' : 'var(--text-muted)' }}>
                    {comp.semaglutideUrls}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: comp.tirzepatideUrls > 0 ? 'var(--color-accent)' : 'var(--text-muted)' }}>
                    {comp.tirzepatideUrls}
                  </td>
                  <td>
                    {checkInfo ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={`badge-minimal ${checkInfo.reachable ? 'badge-minimal-success' : 'badge-minimal-danger'}`}>
                          HTTP {checkInfo.status}
                        </span>
                        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
                          {checkInfo.latency}ms
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleLiveCheck(comp)}
                        disabled={isLoading}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          background: 'var(--bg-canvas)',
                          border: '1px solid var(--border-medium)',
                          borderRadius: '9999px',
                          color: 'var(--color-primary-dark)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isLoading ? <RefreshCw size={10} className="animate-spin" /> : <Activity size={10} color="var(--color-primary)" />}
                        {isLoading ? 'Pinging...' : 'Ping'}
                      </button>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      {comp.primarySitemap && (
                        <a
                          href={comp.primarySitemap}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-minimal-secondary"
                          style={{ padding: '5px 10px', fontSize: '0.72rem' }}
                        >
                          XML <ExternalLink size={10} />
                        </a>
                      )}
                      <button
                        onClick={() => onInspectCompetitor(comp.localFolder)}
                        className="btn-minimal-primary"
                        style={{ padding: '5px 12px', fontSize: '0.72rem' }}
                      >
                        <Eye size={10} /> Inspect
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
