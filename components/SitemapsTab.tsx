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
  Activity
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Filter Bento Header */}
      <div className="bento-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Sitemap Inspector & Live Health Verifier
            </h1>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              Verify status, response codes, latency, and crawl depth for all 100 competitors
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <span className="badge-minimal badge-minimal-success">74 Active Sitemaps</span>
            <span className="badge-minimal badge-minimal-danger">26 Blocked</span>
          </div>
        </div>

        {/* Search & Status Pill Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search competitor name or domain..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-minimal"
              style={{ paddingLeft: '34px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255, 255, 255, 0.03)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setStatusFilter('ALL')}
              style={{
                padding: '5px 10px',
                fontSize: '0.75rem',
                borderRadius: '6px',
                border: 'none',
                background: statusFilter === 'ALL' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: statusFilter === 'ALL' ? '#fafafa' : 'var(--text-tertiary)',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              All ({competitors.length})
            </button>
            <button
              onClick={() => setStatusFilter('SUCCESS')}
              style={{
                padding: '5px 10px',
                fontSize: '0.75rem',
                borderRadius: '6px',
                border: 'none',
                background: statusFilter === 'SUCCESS' ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                color: statusFilter === 'SUCCESS' ? '#34d399' : 'var(--text-tertiary)',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Active Sitemaps (74)
            </button>
            <button
              onClick={() => setStatusFilter('NO_SITEMAP')}
              style={{
                padding: '5px 10px',
                fontSize: '0.75rem',
                borderRadius: '6px',
                border: 'none',
                background: statusFilter === 'NO_SITEMAP' ? 'rgba(244, 63, 94, 0.12)' : 'transparent',
                color: statusFilter === 'NO_SITEMAP' ? '#fb7185' : 'var(--text-tertiary)',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              No Sitemap (26)
            </button>
          </div>
        </div>
      </div>

      {/* Minimal Neutral Table */}
      <div className="bento-card" style={{ overflowX: 'auto', padding: '0' }}>
        <table className="neutral-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort('rank')} style={{ cursor: 'pointer', width: '70px' }}>
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
              <th>Live Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((comp) => {
              const checkInfo = checkResults[comp.domain];
              const isLoading = checkLoading[comp.domain];

              return (
                <tr key={comp.domain}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                    #{comp.rank}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {comp.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      {comp.domain}
                    </div>
                  </td>
                  <td>
                    {comp.status === 'SUCCESS' ? (
                      <span className="badge-minimal badge-minimal-success">
                        <CheckCircle2 size={10} /> Valid ({comp.totalSitemaps} xml)
                      </span>
                    ) : (
                      <span className="badge-minimal badge-minimal-danger">
                        <AlertCircle size={10} /> Blocked
                      </span>
                    )}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: comp.totalUrls > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {comp.totalUrls.toLocaleString()}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: comp.semaglutideUrls > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {comp.semaglutideUrls}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: comp.tirzepatideUrls > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {comp.tirzepatideUrls}
                  </td>
                  <td>
                    {checkInfo ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={`badge-minimal ${checkInfo.reachable ? 'badge-minimal-success' : 'badge-minimal-danger'}`}>
                          HTTP {checkInfo.status}
                        </span>
                        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
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
                          padding: '3px 8px',
                          fontSize: '0.72rem',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '4px',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer'
                        }}
                      >
                        {isLoading ? <RefreshCw size={10} className="animate-spin" /> : <Activity size={10} />}
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
                          style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                        >
                          XML <ExternalLink size={10} />
                        </a>
                      )}
                      <button
                        onClick={() => onInspectCompetitor(comp.localFolder)}
                        className="btn-minimal-primary"
                        style={{ padding: '4px 10px', fontSize: '0.72rem' }}
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
