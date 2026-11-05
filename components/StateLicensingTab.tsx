'use client';

import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  ShieldCheck, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Download,
  Filter,
  Layers,
  Globe
} from 'lucide-react';
import { CompetitorComplianceItem } from '@/lib/data';
import ContextCue from './ContextCue';

interface StateLicensingTabProps {
  complianceData: CompetitorComplianceItem[];
  onInspectCompetitor?: (folder: string) => void;
}

export default function StateLicensingTab({ complianceData, onInspectCompetitor }: StateLicensingTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [coverageFilter, setCoverageFilter] = useState<'all' | '50-states' | 'restricted'>('all');

  const ongoBenchmark = useMemo(() => {
    return complianceData.find(c => c.isBenchmark) || complianceData[0];
  }, [complianceData]);

  const competitorsList = useMemo(() => {
    return complianceData.filter(c => !c.isBenchmark);
  }, [complianceData]);

  const filteredCompetitors = useMemo(() => {
    return competitorsList.filter(comp => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        comp.name.toLowerCase().includes(q) ||
        comp.domain.toLowerCase().includes(q) ||
        comp.states.coverageSummary.toLowerCase().includes(q) ||
        comp.states.excludedStates.some(s => s.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (coverageFilter === '50-states') {
        if (comp.states.totalStatesCovered !== 50) return false;
      } else if (coverageFilter === 'restricted') {
        if (comp.states.totalStatesCovered >= 50) return false;
      }

      return true;
    });
  }, [competitorsList, searchQuery, coverageFilter]);

  const handleExportCsv = () => {
    const headers = ['Rank', 'Brand', 'Domain', 'Total States Covered', 'Coverage Status', 'Excluded States', 'Video Visit Mandates'];
    const rows = filteredCompetitors.map(c => [
      c.rank,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.domain}"`,
      c.states.totalStatesCovered,
      c.states.totalStatesCovered === 50 ? '50 States Nationwide' : 'Restricted Coverage',
      `"${c.states.excludedStates.join('; ')}"`,
      `"${c.states.synchronousMandates.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `state_telehealth_licensing_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Premium GSC / Clarity Header */}
      <div className="gsc-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="gsc-badge-healthy">
                <span className="gsc-pulse-dot" />
                Telehealth Regulatory Jurisdiction
              </span>
              <span className="gsc-badge-neutral">
                50-State Legal Coverage
              </span>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Ongo: 100% Nationwide Availability
              </span>
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f1715', margin: 0, letterSpacing: '-0.02em' }}>
              50-State Telehealth Licensing &amp; Video Regulations
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#475569', margin: '4px 0 0 0' }}>
              Benchmark nationwide telehealth medical coverage, asynchronous intake vs video visit mandates, and excluded state jurisdictions across 100 clinics.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleExportCsv}
              className="gsc-btn-secondary"
              title="Export state licensing matrix to CSV"
            >
              <Download size={14} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <ContextCue
        level={3}
        toolNumber={9}
        useCase="Map state-by-state telehealth licensing coverage and video consultation mandates."
        badge="Jurisdiction Radar"
        title="Telehealth Legal Coverage by State"
        about="Telehealth prescribing laws vary significantly across US states. While states like California, Mississippi, and Louisiana have strict synchronous video mandates, Ongo's multi-state physician team provides complete 50-state legal coverage."
      />

      {/* 4 Clarity Executive Scorecards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '14px'
      }}>
        <div className="gsc-scorecard" style={{ borderTop: '3px solid #10b981' }}>
          <div className="gsc-scorecard-label">
            <span>50-State Nationwide Coverage</span>
            <Globe size={15} color="#10b981" />
          </div>
          <div className="gsc-scorecard-value">
            {competitorsList.filter(c => c.states.totalStatesCovered === 50).length}
            <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}> / 100</span>
          </div>
          <div className="gsc-scorecard-sub">
            <span className="gsc-badge-healthy">Ongo: 50 of 50 States</span>
          </div>
        </div>

        <div className="gsc-scorecard" style={{ borderTop: '3px solid #f59e0b' }}>
          <div className="gsc-scorecard-label">
            <span>Restricted Geographic Coverage</span>
            <AlertCircle size={15} color="#f59e0b" />
          </div>
          <div className="gsc-scorecard-value">
            {competitorsList.filter(c => c.states.totalStatesCovered < 50).length}
            <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}> / 100</span>
          </div>
          <div className="gsc-scorecard-sub">
            <span className="gsc-badge-warning">Exclude CA, NY, LA, or MS</span>
          </div>
        </div>

        <div className="gsc-scorecard" style={{ borderTop: '3px solid #3b82f6' }}>
          <div className="gsc-scorecard-label">
            <span>Ongo State Coverage</span>
            <MapPin size={15} color="#3b82f6" />
          </div>
          <div className="gsc-scorecard-value">
            50 States
          </div>
          <div className="gsc-scorecard-sub">
            <span style={{ color: '#475569', fontSize: '0.72rem' }}>All 50 US States + DC</span>
          </div>
        </div>

        <div className="gsc-scorecard" style={{ borderTop: '3px solid #8b5cf6' }}>
          <div className="gsc-scorecard-label">
            <span>Cold-Pack Delivery</span>
            <ShieldCheck size={15} color="#8b5cf6" />
          </div>
          <div className="gsc-scorecard-value" style={{ color: '#059669' }}>
            Free 3-5 Days
          </div>
          <div className="gsc-scorecard-sub">
            <span>Insulated temperature packaging</span>
          </div>
        </div>
      </div>

      {/* Ongo Flagship Advantage Pin */}
      {ongoBenchmark && (
        <div className="gsc-card" style={{ padding: '20px 24px', background: '#ffffff', border: '1px solid #74c69d' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="gsc-badge-healthy">
                <CheckCircle2 size={12} />
                Benchmark #00 · Ongo Nationwide Footprint
              </span>
              <span className="gsc-badge-neutral">
                50 States Licensed
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 600 }}>
              Zero state exclusions &bull; Fast cold-pack delivery to every US zip code
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="gsc-card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by clinic, state (e.g. California, Texas), or rule..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                fontSize: '0.82rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#0f1715',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
            {[
              { id: 'all', label: 'All Clinics (100)' },
              { id: '50-states', label: '50 States Only' },
              { id: 'restricted', label: 'Restricted States' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCoverageFilter(tab.id as typeof coverageFilter)}
                style={{
                  padding: '4px 12px',
                  fontSize: '0.75rem',
                  fontWeight: coverageFilter === tab.id ? 700 : 500,
                  borderRadius: '6px',
                  border: 'none',
                  background: coverageFilter === tab.id ? '#ffffff' : 'transparent',
                  color: coverageFilter === tab.id ? '#0f1715' : '#64748b',
                  cursor: 'pointer',
                  boxShadow: coverageFilter === tab.id ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="gsc-card" style={{ overflowX: 'auto' }}>
        <table className="gsc-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Rank</th>
              <th style={{ width: '220px' }}>Clinic Brand</th>
              <th style={{ width: '130px' }}>States Covered</th>
              <th style={{ width: '170px' }}>Coverage Status</th>
              <th style={{ width: '240px' }}>Excluded States</th>
              <th style={{ width: '200px' }}>Video Visit Rules</th>
              <th style={{ width: '90px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompetitors.map(c => {
              const is50 = c.states.totalStatesCovered === 50;

              return (
                <tr key={c.rank}>
                  <td style={{ fontWeight: 700, color: '#64748b', fontFamily: 'monospace' }}>
                    #{c.rank}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f1715' }}>{c.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>{c.domain}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, fontSize: '0.92rem', color: is50 ? '#15803d' : '#b45309' }}>
                      {c.states.totalStatesCovered}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}> / 50</span>
                  </td>
                  <td>
                    <span className={is50 ? 'gsc-badge-healthy' : 'gsc-badge-warning'}>
                      {is50 ? '● 50 States Nationwide' : '▲ Restricted States'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.74rem', color: '#475569' }}>
                    {c.states.excludedStates.length > 0 ? (
                      <span style={{ color: '#b91c1c', fontWeight: 600 }}>
                        Excludes: {c.states.excludedStates.join(', ')}
                      </span>
                    ) : (
                      <span style={{ color: '#15803d' }}>None (Full Nationwide)</span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.74rem', color: '#475569' }}>
                    {c.states.synchronousMandates || 'Standard Telehealth Guidelines'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <a
                      href={`https://${c.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="gsc-btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                      title={`Visit ${c.domain}`}
                    >
                      Visit <ExternalLink size={10} />
                    </a>
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
