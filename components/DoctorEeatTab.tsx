'use client';

import React, { useState, useMemo } from 'react';
import { 
  Stethoscope, 
  ShieldCheck, 
  Search, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  Users, 
  BookOpen, 
  Copy, 
  Check, 
  Download,
  Filter
} from 'lucide-react';
import { CompetitorComplianceItem } from '@/lib/data';
import ContextCue from './ContextCue';

interface DoctorEeatTabProps {
  complianceData: CompetitorComplianceItem[];
  onInspectCompetitor?: (folder: string) => void;
}

export default function DoctorEeatTab({ complianceData, onInspectCompetitor }: DoctorEeatTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorTypeFilter, setDoctorTypeFilter] = useState<'all' | 'doctor-led' | 'midlevel'>('all');
  const [eeatFilter, setEeatFilter] = useState<'all' | 'high' | 'moderate' | 'low'>('all');
  const [copiedText, setCopiedText] = useState<string | null>(null);

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
        comp.doctors.medicalDirector.toLowerCase().includes(q) ||
        comp.doctors.doctorCredentials.some(c => c.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (doctorTypeFilter === 'doctor-led') {
        const sup = comp.doctors.physicianSupervised.toLowerCase();
        if (!sup.includes('doctor') && !sup.includes('physician')) return false;
      } else if (doctorTypeFilter === 'midlevel') {
        const sup = comp.doctors.physicianSupervised.toLowerCase();
        if (sup.includes('doctor') || sup.includes('physician')) return false;
      }

      if (eeatFilter === 'high') {
        if (!comp.authors.eeatGrade.startsWith('A')) return false;
      } else if (eeatFilter === 'moderate') {
        if (!comp.authors.eeatGrade.startsWith('B')) return false;
      } else if (eeatFilter === 'low') {
        if (comp.authors.eeatGrade.startsWith('A') || comp.authors.eeatGrade.startsWith('B')) return false;
      }

      return true;
    });
  }, [competitorsList, searchQuery, doctorTypeFilter, eeatFilter]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleExportCsv = () => {
    const headers = ['Rank', 'Brand', 'Domain', 'Medical Director', 'Supervision Model', 'Doctor Credentials', 'Consultation Type', 'E-E-A-T Grade', 'Named Authors Count'];
    const rows = filteredCompetitors.map(c => [
      c.rank,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.domain}"`,
      `"${c.doctors.medicalDirector.replace(/"/g, '""')}"`,
      `"${c.doctors.physicianSupervised.replace(/"/g, '""')}"`,
      `"${c.doctors.doctorCredentials.join('; ')}"`,
      `"${c.doctors.consultationType}"`,
      `"${c.authors.eeatGrade}"`,
      c.authors.namedAuthorsCount
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `doctor_eeat_audit_${new Date().toISOString().slice(0, 10)}.csv`);
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
                Clinical Authority &amp; E-E-A-T
              </span>
              <span className="gsc-badge-neutral">
                100 Telehealth Competitors
              </span>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Benchmark: 5 Board-Certified Physicians (100% MD)
              </span>
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f1715', margin: 0, letterSpacing: '-0.02em' }}>
              Doctor Credentials &amp; Clinical E-E-A-T Auditor
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#475569', margin: '4px 0 0 0' }}>
              Audit medical director credentials, physician oversight models, NPI verifications, and clinical author bylines across 100 US telehealth competitors.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleExportCsv}
              className="gsc-btn-secondary"
              title="Export all doctor and E-E-A-T data to CSV"
            >
              <Download size={14} />
              Export CSV
            </button>
            <a
              href="https://ongoweightloss.com/medical-team/"
              target="_blank"
              rel="noreferrer"
              className="gsc-btn-primary"
            >
              <ExternalLink size={14} />
              Ongo Medical Team
            </a>
          </div>
        </div>
      </div>

      <ContextCue
        level={3}
        toolNumber={8}
        useCase="Verify physician credentials, MD vs NP supervision models, and author bylines for Google's healthcare E-E-A-T guidelines."
        badge="Medical Authority"
        title="Physician Credentials & Author Attribution Radar"
        about="Google's search algorithms evaluate healthcare content under strict Your Money or Your Life (YMYL) standards. This tool benchmarks Ongo's 100% physician-led model (5 Board-Certified MDs) against competitors relying on mid-level nurses or anonymous medical content."
      />

      {/* 4 Clarity Executive Scorecards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '14px'
      }}>
        <div className="gsc-scorecard" style={{ borderTop: '3px solid #10b981' }}>
          <div className="gsc-scorecard-label">
            <span>Doctor-Led Supervision</span>
            <Stethoscope size={15} color="#10b981" />
          </div>
          <div className="gsc-scorecard-value">
            {competitorsList.filter(c => c.doctors.physicianSupervised.toLowerCase().includes('doctor') || c.doctors.physicianSupervised.toLowerCase().includes('physician')).length}
            <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}> / 100</span>
          </div>
          <div className="gsc-scorecard-sub">
            <span className="gsc-badge-healthy">Ongo: 100% MD Supervised</span>
          </div>
        </div>

        <div className="gsc-scorecard" style={{ borderTop: '3px solid #3b82f6' }}>
          <div className="gsc-scorecard-label">
            <span>Grade A/A+ E-E-A-T Score</span>
            <Award size={15} color="#3b82f6" />
          </div>
          <div className="gsc-scorecard-value">
            {competitorsList.filter(c => c.authors.eeatGrade.startsWith('A')).length}
            <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}> / 100</span>
          </div>
          <div className="gsc-scorecard-sub">
            <span className="gsc-badge-healthy">Ongo: Grade A+ Verified</span>
          </div>
        </div>

        <div className="gsc-scorecard" style={{ borderTop: '3px solid #8b5cf6' }}>
          <div className="gsc-scorecard-label">
            <span>Ongo Verified Physicians</span>
            <Users size={15} color="#8b5cf6" />
          </div>
          <div className="gsc-scorecard-value">
            5 Board MDs
          </div>
          <div className="gsc-scorecard-sub">
            <span style={{ color: '#475569', fontSize: '0.72rem' }}>Okonkwo, Kramer, Patel, Miller, Krasne</span>
          </div>
        </div>

        <div className="gsc-scorecard" style={{ borderTop: '3px solid #f59e0b' }}>
          <div className="gsc-scorecard-label">
            <span>Doctor Consult Fee</span>
            <ShieldCheck size={15} color="#f59e0b" />
          </div>
          <div className="gsc-scorecard-value" style={{ color: '#059669' }}>
            $0 / Free
          </div>
          <div className="gsc-scorecard-sub">
            <span>Included in $179 / $249 flat rate</span>
          </div>
        </div>
      </div>

      {/* Ongo Flagship Physician Leadership Card */}
      {ongoBenchmark && (
        <div className="gsc-card" style={{ padding: '22px 24px', background: '#ffffff', border: '1px solid #74c69d' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="gsc-badge-healthy">
                <CheckCircle2 size={12} />
                Benchmark #00 · Ongo Weight Loss Medical Team
              </span>
              <span className="gsc-badge-neutral">
                5 Board-Certified Physicians
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Published &amp; verified via <code style={{ color: '#166534' }}>ongoweightloss.com/sitemap.xml</code>
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '12px'
          }}>
            {(ongoBenchmark?.doctors?.doctorProfiles || []).map((doc, idx) => (
              <div
                key={idx}
                style={{
                  background: '#f8fafc',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f1715' }}>
                    {doc.name}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: 700, marginTop: '2px' }}>
                    {doc.specialty}
                  </div>
                  <p style={{
                    fontSize: '0.74rem',
                    color: '#475569',
                    lineHeight: 1.45,
                    margin: '8px 0',
                    fontStyle: 'italic'
                  }}>
                    &ldquo;{doc.bio}&rdquo;
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#64748b' }}>
                    {doc.sitemapUrl.replace('https://ongoweightloss.com', '')}
                  </span>
                  <a
                    href={doc.sitemapUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    View Page <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            ))}
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
              placeholder="Search by clinic, medical director, or credential..."
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
              {[
                { id: 'all', label: 'All Supervision' },
                { id: 'doctor-led', label: 'Doctor-Led Only' },
                { id: 'midlevel', label: 'NP / Mid-Level' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDoctorTypeFilter(tab.id as typeof doctorTypeFilter)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: doctorTypeFilter === tab.id ? 700 : 500,
                    borderRadius: '6px',
                    border: 'none',
                    background: doctorTypeFilter === tab.id ? '#ffffff' : 'transparent',
                    color: doctorTypeFilter === tab.id ? '#0f1715' : '#64748b',
                    cursor: 'pointer',
                    boxShadow: doctorTypeFilter === tab.id ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
              {[
                { id: 'all', label: 'All Grades' },
                { id: 'high', label: 'Grade A/A+' },
                { id: 'moderate', label: 'Grade B' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setEeatFilter(tab.id as typeof eeatFilter)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: eeatFilter === tab.id ? 700 : 500,
                    borderRadius: '6px',
                    border: 'none',
                    background: eeatFilter === tab.id ? '#ffffff' : 'transparent',
                    color: eeatFilter === tab.id ? '#0f1715' : '#64748b',
                    cursor: 'pointer',
                    boxShadow: eeatFilter === tab.id ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 100 Competitors Table */}
      <div className="gsc-card" style={{ overflowX: 'auto' }}>
        <table className="gsc-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Rank</th>
              <th style={{ width: '220px' }}>Clinic Brand</th>
              <th style={{ width: '200px' }}>Medical Director</th>
              <th style={{ width: '200px' }}>Supervision Model</th>
              <th style={{ width: '160px' }}>Doctor Credentials</th>
              <th style={{ width: '110px' }}>E-E-A-T Grade</th>
              <th style={{ width: '130px' }}>Author Attribution</th>
              <th style={{ width: '90px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompetitors.map(c => {
              const isDoctorLed = c.doctors.physicianSupervised.toLowerCase().includes('doctor') || c.doctors.physicianSupervised.toLowerCase().includes('physician');
              const gradeA = c.authors.eeatGrade.startsWith('A');

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
                    <div style={{ fontWeight: 600, color: '#0f1715' }}>
                      {c.doctors.medicalDirector || 'Not Disclosed'}
                    </div>
                  </td>
                  <td>
                    <span className={isDoctorLed ? 'gsc-badge-healthy' : 'gsc-badge-warning'}>
                      {c.doctors.physicianSupervised}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.74rem', color: '#475569' }}>
                    {c.doctors.doctorCredentials.length > 0 ? c.doctors.doctorCredentials.join(', ') : 'None listed'}
                  </td>
                  <td>
                    <span className={gradeA ? 'gsc-badge-healthy' : 'gsc-badge-warning'}>
                      {c.authors.eeatGrade}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.74rem', color: '#475569' }}>
                    {c.authors.namedAuthorsCount > 0 ? `${c.authors.namedAuthorsCount} Named Authors` : 'Anonymous'}
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
