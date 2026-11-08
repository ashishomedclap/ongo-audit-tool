'use client';

import React, { useState, useMemo } from 'react';
import { 
  Globe, 
  Search, 
  ExternalLink, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  Download
} from 'lucide-react';
import { CompetitorSummary } from '@/lib/data';

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
  const [checkResults, setCheckResults] = useState<Record<string, { status: number; latency: number; reachable: boolean; error?: string }>>({});
  const [page, setPage] = useState(1);
  const pageSize = 50;

  const totalUrlsAll = useMemo(() => competitors.reduce((acc, c) => acc + (c.totalUrls || 0), 0), [competitors]);
  const activeCount = useMemo(() => competitors.filter(c => c.status === 'SUCCESS').length, [competitors]);
  const gatedCount = competitors.length - activeCount;

  const filtered = useMemo(() => {
    return competitors
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
  }, [competitors, search, statusFilter, sortBy, sortAsc]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;

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

  const handleExportCsv = () => {
    const headers = ['Rank', 'Brand', 'Domain', 'Feed Status', 'Total URLs', 'Semaglutide URLs', 'Tirzepatide URLs', 'Sitemap Feed URL'];
    const rows = filtered.map(c => [
      c.rank,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.domain}"`,
      c.status === 'SUCCESS' ? 'Active XML' : 'Gated / WAF',
      c.totalUrls,
      c.semaglutideUrls,
      c.tirzepatideUrls,
      `"${c.primarySitemap || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sitemaps_census_618_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-tool-entry">
      {/* Unified World-Class Tool Workspace Header */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '14px',
        padding: '18px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
      }}>
        {/* Top Header Row: Title, Macro Stats, Export */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                Sitemap &amp; Connectivity Explorer
              </h1>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '9999px',
                background: 'var(--bg-surface-alt)',
                color: 'var(--text-secondary)'
              }}>
                {competitors.length} Feeds Monitored
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', margin: 0 }}>
              Audit XML feeds, real-time HTTP response status codes, latency in ms, and indexed drug URLs across competitor sites.
            </p>
          </div>

          {/* Quick Metrics & Export */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '10px',
              background: 'var(--bg-surface-alt)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.76rem'
            }}>
              <span style={{ fontWeight: 700, color: '#166534' }}>{activeCount} Active Feeds</span>
              <span style={{ color: 'var(--text-muted)' }}>&bull;</span>
              <span style={{ fontWeight: 600, color: '#92400e' }}>{gatedCount} Gated</span>
              <span style={{ color: 'var(--text-muted)' }}>&bull;</span>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{totalUrlsAll.toLocaleString()} URLs</span>
            </div>

            <button
              onClick={handleExportCsv}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 12px',
                borderRadius: '8px',
                background: 'var(--bg-surface-alt)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>

        {/* Integrated Controls Row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          paddingTop: '14px',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '440px' }}>
            <Search size={14} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search competitor brand or domain..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="tool-search-input"
              style={{ paddingLeft: '34px', height: '36px' }}
            />
          </div>

          {/* Status Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setStatusFilter('ALL'); setPage(1); }}
              className={`tool-filter-pill ${statusFilter === 'ALL' ? 'active' : ''}`}
            >
              All ({competitors.length})
            </button>
            <button
              onClick={() => { setStatusFilter('SUCCESS'); setPage(1); }}
              className={`tool-filter-pill ${statusFilter === 'SUCCESS' ? 'active' : ''}`}
            >
              <CheckCircle2 size={12} color="#10b981" /> Active Feeds ({activeCount})
            </button>
            <button
              onClick={() => { setStatusFilter('NO_SITEMAP'); setPage(1); }}
              className={`tool-filter-pill ${statusFilter === 'NO_SITEMAP' ? 'active' : ''}`}
            >
              <AlertCircle size={12} color="#f59e0b" /> Gated ({gatedCount})
            </button>
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            <ArrowUpDown size={12} />
            <select aria-label="Sort sitemaps by" value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setSortAsc(e.target.value === 'rank');
              }}
              style={{
                height: '34px',
                padding: '0 8px',
                borderRadius: '7px',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '0.76rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="rank">Sort by Rank</option>
              <option value="totalUrls">Sort by Total URLs</option>
              <option value="semaglutideUrls">Sort by Semaglutide Pages</option>
              <option value="tirzepatideUrls">Sort by Tirzepatide Pages</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Counter & Pagination Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
        <div>
          Showing <strong>{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)}</strong> of <strong>{filtered.length}</strong> sitemap feeds
          {search && ` matching "${search}"`}
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                color: page === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                fontSize: '0.74rem'
              }}
            >
              <ChevronLeft size={12} /> Prev
            </button>
            <span style={{ fontWeight: 600 }}>{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                color: page === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '0.74rem'
              }}
            >
              Next <ChevronRight size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Clean Modern Data Table */}
      <div style={{
        overflowX: 'auto',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface-alt)', borderBottom: '1px solid var(--border-medium)', color: 'var(--text-tertiary)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <th onClick={() => toggleSort('rank')} style={{ padding: '10px 14px', width: '60px', cursor: 'pointer' }}>
                Rank {sortBy === 'rank' && <ArrowUpDown size={11} />}
              </th>
              <th style={{ padding: '10px 14px' }}>Clinic Brand</th>
              <th style={{ padding: '10px 14px' }}>Domain</th>
              <th style={{ padding: '10px 14px' }}>XML Feed URL</th>
              <th onClick={() => toggleSort('totalUrls')} style={{ padding: '10px 14px', textAlign: 'right', cursor: 'pointer' }}>
                Total URLs {sortBy === 'totalUrls' && <ArrowUpDown size={11} />}
              </th>
              <th onClick={() => toggleSort('semaglutideUrls')} style={{ padding: '10px 14px', textAlign: 'right', cursor: 'pointer' }}>
                Semaglutide {sortBy === 'semaglutideUrls' && <ArrowUpDown size={11} />}
              </th>
              <th onClick={() => toggleSort('tirzepatideUrls')} style={{ padding: '10px 14px', textAlign: 'right', cursor: 'pointer' }}>
                Tirzepatide {sortBy === 'tirzepatideUrls' && <ArrowUpDown size={11} />}
              </th>
              <th style={{ padding: '10px 14px', textAlign: 'center' }}>Live HTTP Ping</th>
              <th style={{ padding: '10px 14px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((comp) => {
              const ping = checkResults[comp.domain];
              const isLoading = checkLoading[comp.domain];

              return (
                <tr
                  key={comp.domain}
                  style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.12s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-alt)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '10px 14px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                    #{comp.rank}
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {comp.name}
                  </td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                    <a href={`https://${comp.domain}`} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      {comp.domain} <ExternalLink size={10} />
                    </a>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    {comp.primarySitemap ? (
                      <a href={comp.primarySitemap} target="_blank" rel="noreferrer" style={{ fontSize: '0.74rem', color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {comp.primarySitemap.replace(/^https?:\/\//, '')} <ExternalLink size={10} />
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>No public XML feed</span>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {comp.totalUrls.toLocaleString()}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                    {comp.semaglutideUrls}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>
                    {comp.tirzepatideUrls}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    {ping ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: ping.reachable ? '#dcfce7' : '#fee2e2',
                        color: ping.reachable ? '#166534' : '#991b1b'
                      }}>
                        {ping.reachable ? `HTTP ${ping.status} (${ping.latency}ms)` : 'Unreachable'}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleLiveCheck(comp)}
                        disabled={isLoading}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-medium)',
                          background: 'var(--bg-surface)',
                          color: 'var(--text-secondary)',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: isLoading ? 'wait' : 'pointer'
                        }}
                      >
                        <Activity size={11} color="var(--color-primary)" />
                        {isLoading ? 'Pinging...' : 'Ping'}
                      </button>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <button
                      onClick={() => onInspectCompetitor(comp.localFolder)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        background: 'var(--color-primary-dark)',
                        color: '#ffffff',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <Eye size={11} style={{ marginRight: '3px' }} /> Inspect
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px 0' }}>
          <button
            onClick={() => { setPage(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={page === 1}
            style={{ padding: '4px 9px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', fontSize: '0.74rem' }}
          >
            First
          </button>
          <button
            onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={page === 1}
            style={{ padding: '4px 11px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 600 }}
          >
            ← Prev
          </button>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={page === totalPages}
            style={{ padding: '4px 11px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 600 }}
          >
            Next →
          </button>
          <button
            onClick={() => { setPage(totalPages); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={page === totalPages}
            style={{ padding: '4px 9px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', fontSize: '0.74rem' }}
          >
            Last
          </button>
        </div>
      )}
    </div>
  );
}
