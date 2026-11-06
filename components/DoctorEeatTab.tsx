'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  Filter,
  Zap,
  Sparkles,
  RefreshCw,
  FileCode
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
  const [npiQuery, setNpiQuery] = useState('Brett Kramer');
  const [npiLoading, setNpiLoading] = useState(false);
  const [npiDoctor, setNpiDoctor] = useState<any>(null);
  const [schemaCopied, setSchemaCopied] = useState(false);

  const handleNpiSearch = async (queryText?: string) => {
    const q = (queryText !== undefined ? queryText : npiQuery).trim();
    if (!q) return;
    setNpiLoading(true);
    try {
      const isNum = /^\d+$/.test(q);
      const parts = q.split(' ').filter(Boolean);
      const url = isNum 
        ? `/api/npi-lookup?number=${q}` 
        : `/api/npi-lookup?lastName=${encodeURIComponent(parts.length > 1 ? parts[parts.length - 1] : parts[0])}&firstName=${encodeURIComponent(parts.length > 1 ? parts[0] : '')}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.results && json.results.length > 0) {
        setNpiDoctor(json.results[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setNpiLoading(false);
    }
  };

  useEffect(() => {
    handleNpiSearch('Brett Kramer');
  }, []);

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

      {/* Live US Federal CMS NPI & State License Verifier Card */}
      <div className="glass-card" style={{
        padding: '22px 24px',
        borderRadius: '18px',
        border: '1px solid var(--border-medium)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '9999px',
                background: 'rgba(16, 185, 129, 0.16)',
                color: '#10b981',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span className="gsc-pulse-dot" />
                Live Federal CMS NPPES API
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Direct Federal Registry Query (Zero API Key Needed)
              </span>
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Federal Doctor NPI &amp; Medical License Verifier
            </h2>
          </div>

          {/* Quick Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '0 1 360px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={npiQuery}
                onChange={(e) => setNpiQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleNpiSearch(); }}
                placeholder="Doctor name or 10-digit NPI number..."
                style={{
                  width: '100%',
                  padding: '8px 10px 8px 32px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem'
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => handleNpiSearch()}
              className="gsc-btn-primary"
              disabled={npiLoading}
              style={{ whiteSpace: 'nowrap', padding: '8px 14px' }}
            >
              <Zap size={13} />
              {npiLoading ? 'Checking...' : 'Verify'}
            </button>
          </div>
        </div>

        {/* 1-Click Doctor Preset Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '4px' }}>
            1-Click Telehealth Medical Directors:
          </span>
          {[
            { label: 'Dr. Brett Kramer, DO (Ongo)', query: 'Brett Kramer', isOngo: true },
            { label: 'Dr. Nkemakonam Okonkwo, MD (Ongo)', query: 'Nkemakonam Okonkwo', isOngo: true },
            { label: 'Dr. Rushi Patel, MD (Ongo)', query: 'Rushi Patel', isOngo: true },
            { label: 'Dr. Sarah Miller, MD (Ongo)', query: 'Sarah Miller', isOngo: true },
            { label: 'Dr. Jason Krasne, MD (Ongo)', query: 'Jason Krasne', isOngo: true },
            { label: 'Dr. Mike Bohl, MD (Ro.co)', query: 'Mike Bohl', isOngo: false },
            { label: 'Dr. Patrick Carroll, MD (Hims)', query: 'Patrick Carroll', isOngo: false }
          ].map(doc => {
            const isSelected = npiQuery === doc.query;
            return (
              <button
                key={doc.query}
                type="button"
                onClick={() => {
                  setNpiQuery(doc.query);
                  handleNpiSearch(doc.query);
                }}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  border: isSelected 
                    ? '1px solid #10b981' 
                    : doc.isOngo ? '1px solid rgba(45, 106, 79, 0.25)' : '1px solid var(--border-subtle)',
                  background: isSelected 
                    ? 'rgba(16, 185, 129, 0.18)' 
                    : doc.isOngo ? 'rgba(34, 197, 94, 0.08)' : 'var(--bg-surface-alt)',
                  color: isSelected 
                    ? '#10b981' 
                    : doc.isOngo ? '#166534' : 'var(--text-secondary)',
                  transition: 'all 0.12s ease'
                }}
              >
                {doc.isOngo ? '🟢 ' : '🔵 '}{doc.label}
              </button>
            );
          })}
        </div>

        {/* Verified Federal Certificate Card */}
        {npiDoctor && (
          <div style={{
            padding: '18px 20px',
            borderRadius: '14px',
            background: 'var(--bg-surface-alt)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {npiDoctor.name}
                  </h3>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    CMS Verified • {npiDoctor.status}
                  </span>
                  {npiDoctor.isOngoDoctor && (
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
                      color: '#ffffff'
                    }}>
                      Ongo Medical Director
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <strong>Specialty / Taxonomy:</strong> {npiDoctor.primaryTaxonomy?.description} ({npiDoctor.primaryTaxonomy?.code})
                </div>
              </div>

              {/* E-E-A-T Score Badge */}
              <div style={{
                textAlign: 'right',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end'
              }}>
                <div style={{
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  color: '#10b981',
                  lineHeight: 1
                }}>
                  {npiDoctor.eeatScore} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 100</span>
                </div>
                <div style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#10b981',
                  marginTop: '3px'
                }}>
                  Google E-E-A-T Grade: {npiDoctor.eeatGrade}
                </div>
              </div>
            </div>

            {/* 4 Telemetry Inset Columns */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '10px'
            }}>
              <div style={{ padding: '10px 12px', background: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>NATIONAL PROVIDER ID (NPI)</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {npiDoctor.npi}
                </div>
              </div>

              <div style={{ padding: '10px 12px', background: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>STATE LICENSE ID</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {npiDoctor.primaryTaxonomy?.license} ({npiDoctor.primaryTaxonomy?.state})
                </div>
              </div>

              <div style={{ padding: '10px 12px', background: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>ENUMERATION DATE</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {npiDoctor.enumerationDate || 'Active Record'}
                </div>
              </div>

              <div style={{ padding: '10px 12px', background: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>PRACTICE LOCATION</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {npiDoctor.addresses?.[0]?.city}, {npiDoctor.addresses?.[0]?.state}
                </div>
              </div>
            </div>

            {/* Action Buttons: Schema Copy & CMS Registry External Link */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', paddingTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(npiDoctor.schemaSnippet);
                    setSchemaCopied(true);
                    setTimeout(() => setSchemaCopied(false), 2000);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '5px 12px',
                    borderRadius: '6px',
                    background: schemaCopied ? '#10b981' : 'var(--bg-surface)',
                    color: schemaCopied ? '#ffffff' : 'var(--text-primary)',
                    border: '1px solid var(--border-medium)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {schemaCopied ? <Check size={13} /> : <FileCode size={13} />}
                  {schemaCopied ? 'Copied Physician JSON-LD Schema!' : 'Copy Schema.org JSON-LD'}
                </button>

                <a
                  href={`https://npiregistry.cms.hhs.gov/provider-view/${npiDoctor.npi}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.78rem',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  <ExternalLink size={12} />
                  View on Official CMS.gov
                </a>
              </div>

              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Verified via US Department of Health &amp; Human Services (HHS) NPPES
              </span>
            </div>
          </div>
        )}
      </div>

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
