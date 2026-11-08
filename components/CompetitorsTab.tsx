'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  ExternalLink, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  LayoutGrid, 
  Table as TableIcon, 
  Crown, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown,
  Download,
  Sparkles
} from 'lucide-react';
import { CompetitorSummary } from '@/lib/data';

interface CompetitorsTabProps {
  competitors: CompetitorSummary[];
  onInspectCompetitor: (folder: string) => void;
}

export default function CompetitorsTab({ competitors, onInspectCompetitor }: CompetitorsTabProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'totalUrls' | 'semaglutideUrls' | 'tirzepatideUrls' | 'pricingUrls'>('rank');
  const [sortAsc, setSortAsc] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'NO_SITEMAP'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [page, setPage] = useState(1);
  const pageSize = 48;

  // Filter & Sort
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

  const toggleSort = (field: 'rank' | 'totalUrls' | 'semaglutideUrls' | 'tirzepatideUrls' | 'pricingUrls') => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(field === 'rank');
    }
  };

  const activeCount = competitors.filter(c => c.status === 'SUCCESS').length;
  const gatedCount = competitors.length - activeCount;

  const handleExportCsv = () => {
    const headers = ['Rank', 'Brand', 'Domain', 'Status', 'Total URLs', 'Semaglutide URLs', 'Tirzepatide URLs', 'Pricing URLs', 'Sitemap Feed'];
    const rows = filtered.map(c => [
      c.rank,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.domain}"`,
      c.status === 'SUCCESS' ? 'Active XML' : 'Gated / WAF',
      c.totalUrls,
      c.semaglutideUrls,
      c.tirzepatideUrls,
      c.pricingUrls,
      `"${c.primarySitemap || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `competitor_census_618_${new Date().toISOString().slice(0, 10)}.csv`);
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
        {/* Top Header Row: Title, Benchmark Pill, Actions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                Competitor Directory
              </h1>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '9999px',
                background: 'var(--bg-surface-alt)',
                color: 'var(--text-secondary)'
              }}>
                618 Brands Audited
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', margin: 0 }}>
              Search, filter, and compare 618 compounded GLP-1 telehealth providers against Ongo Weight Loss.
            </p>
          </div>

          {/* Right: Ongo Benchmark Quick Badge & CSV Export */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.05) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontSize: '0.76rem'
            }}>
              <Crown size={14} color="#10b981" />
              <span style={{ fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                Ongo Benchmark:
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>
                $179 Sema &bull; $249 Tirz &bull; 5 US MDs (100%) &bull; $0 Consult
              </span>
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

        {/* Integrated Controls Row: Search, Status Pills, Sort, View Toggle */}
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
              placeholder="Search by clinic name, domain, or rank (e.g. Mochi, Henry, Fridays, Eden)..."
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
              All (618)
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

          {/* Sort & View Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              <ArrowUpDown size={12} />
              <select aria-label="Sort competitors by" value={sortBy}
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
                <option value="rank">Sort by Market Rank</option>
                <option value="totalUrls">Sort by Crawled URLs</option>
                <option value="semaglutideUrls">Sort by Semaglutide Pages</option>
                <option value="tirzepatideUrls">Sort by Tirzepatide Pages</option>
                <option value="pricingUrls">Sort by Pricing Pages</option>
              </select>
            </div>

            {/* Segmented Grid / Table View */}
            <div className="tool-segmented-control">
              <button
                onClick={() => setViewMode('grid')}
                className={`tool-segmented-btn ${viewMode === 'grid' ? 'active' : ''}`}
                title="Grid Card View"
              >
                <LayoutGrid size={13} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`tool-segmented-btn ${viewMode === 'table' ? 'active' : ''}`}
                title="Table Spreadsheet View"
              >
                <TableIcon size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Result Counter & Pagination Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
        <div>
          Showing <strong>{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)}</strong> of <strong>{filtered.length}</strong> providers
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

      {/* View Mode 1: Cards View */}
      {viewMode === 'grid' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '12px'
        }}>
          {paginated.map((comp) => (
            <div
              key={comp.domain}
              className="tool-grid-card"
              onClick={() => onInspectCompetitor(comp.localFolder)}
            >
              <div>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '6px',
                    background: 'var(--bg-surface-alt)',
                    color: 'var(--text-primary)'
                  }}>
                    #{comp.rank}
                  </span>

                  {comp.status === 'SUCCESS' ? (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      background: '#dcfce7',
                      color: '#166534'
                    }}>
                      <CheckCircle2 size={11} /> {comp.totalUrls.toLocaleString()} URLs
                    </span>
                  ) : (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      background: '#fef3c7',
                      color: '#92400e'
                    }}>
                      <AlertCircle size={11} /> Gated WAF
                    </span>
                  )}
                </div>

                {/* Brand & Domain */}
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px 0' }}>
                  {comp.name}
                </h3>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
                  {comp.domain}
                </div>

                {/* Metrics Pill Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '6px',
                  background: 'var(--bg-surface-alt)',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.64rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>SEMA</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                      {comp.semaglutideUrls}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.64rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>TIRZ</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>
                      {comp.tirzepatideUrls}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.64rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>PRICING</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary-dark)', fontFamily: 'var(--font-mono)' }}>
                      {comp.pricingUrls}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onInspectCompetitor(comp.localFolder);
                  }}
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: 'var(--color-primary-dark)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Eye size={12} /> Inspect URLs
                </button>
                <a
                  href={`https://${comp.domain}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: 'var(--bg-surface-alt)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    textDecoration: 'none'
                  }}
                >
                  Visit <ExternalLink size={11} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Mode 2: Table View */}
      {viewMode === 'table' && (
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
                <th style={{ padding: '10px 14px', width: '60px' }}>Rank</th>
                <th style={{ padding: '10px 14px' }}>Clinic Brand</th>
                <th style={{ padding: '10px 14px' }}>Domain</th>
                <th style={{ padding: '10px 14px' }}>Sitemap Feed</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Total URLs</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Semaglutide</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Tirzepatide</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Pricing</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((comp) => (
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
                    {comp.status === 'SUCCESS' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#166534', fontWeight: 700, fontSize: '0.75rem' }}>
                        <CheckCircle2 size={12} color="#10b981" /> Active XML
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#92400e', fontWeight: 600, fontSize: '0.75rem' }}>
                        <AlertCircle size={12} color="#f59e0b" /> Gated / WAF
                      </span>
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
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--color-primary-dark)', fontFamily: 'var(--font-mono)' }}>
                    {comp.pricingUrls}
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
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
