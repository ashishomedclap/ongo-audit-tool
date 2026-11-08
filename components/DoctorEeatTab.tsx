'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Stethoscope, 
  Search, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  Users, 
  Copy, 
  Check, 
  Download,
  Zap,
  FileCode,
  ArrowUpDown,
  AlertTriangle,
  Crown
} from 'lucide-react';
import { CompetitorComplianceItem } from '@/lib/data';

interface DoctorEeatTabProps {
  complianceData: CompetitorComplianceItem[];
  onInspectCompetitor?: (folder: string) => void;
}

export default function DoctorEeatTab({ complianceData, onInspectCompetitor }: DoctorEeatTabProps) {
  const [activeSection, setActiveSection] = useState<'directory' | 'npi' | 'schema'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorTypeFilter, setDoctorTypeFilter] = useState<'all' | 'doctor-led' | 'midlevel'>('all');
  const [eeatFilter, setEeatFilter] = useState<'all' | 'high' | 'moderate' | 'low'>('all');
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
    link.setAttribute('download', `doctor_eeat_audit_618_${new Date().toISOString().slice(0, 10)}.csv`);
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
        {/* Top Header Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                Doctor Credentials &amp; Clinical E-E-A-T
              </h1>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '9999px',
                background: 'var(--bg-surface-alt)',
                color: 'var(--text-secondary)'
              }}>
                {competitorsList.length} Competitors Audited
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', margin: 0 }}>
              Verify physician oversight models, medical director credentials, and CMS NPI registrations across competitors.
            </p>
          </div>

          {/* Right: Ongo MD Benchmark Pill & Actions */}
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
                100% Physician-Led (5 Board-Certified US MDs) &bull; Grade A+
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
            <a
              href="https://ongoweightloss.com/medical-team/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 12px',
                borderRadius: '8px',
                background: 'var(--color-primary-dark)',
                color: '#ffffff',
                fontSize: '0.76rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              Medical Team <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* Integrated Sub-Tool Switcher Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '8px',
          paddingTop: '14px',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveSection('directory')}
            className={`tool-segmented-btn ${activeSection === 'directory' ? 'active' : ''}`}
            style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem' }}
          >
            <Users size={14} /> Doctor Directory ({filteredCompetitors.length})
          </button>
          <button
            onClick={() => setActiveSection('npi')}
            className={`tool-segmented-btn ${activeSection === 'npi' ? 'active' : ''}`}
            style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem' }}
          >
            <Zap size={14} color="#10b981" /> Live NPI Registry Verifier
          </button>
          <button
            onClick={() => setActiveSection('schema')}
            className={`tool-segmented-btn ${activeSection === 'schema' ? 'active' : ''}`}
            style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem' }}
          >
            <FileCode size={14} /> Physician Schema Generator
          </button>
        </div>
      </div>

      {/* SECTION 1: DOCTOR DIRECTORY */}
      {activeSection === 'directory' && (
        <div style={{
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          overflow: 'hidden'
        }}>
          {/* Integrated Table Toolbar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)'
          }}>
            <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
              <Search size={14} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search clinic brand or doctor name (e.g. Mochi, Kramer, Bohl)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="tool-search-input"
                style={{ height: '34px', paddingLeft: '34px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setDoctorTypeFilter('all')}
                className={`tool-filter-pill ${doctorTypeFilter === 'all' ? 'active' : ''}`}
              >
                All Oversight ({competitorsList.length})
              </button>
              <button
                onClick={() => setDoctorTypeFilter('doctor-led')}
                className={`tool-filter-pill ${doctorTypeFilter === 'doctor-led' ? 'active' : ''}`}
              >
                <CheckCircle2 size={12} color="#10b981" /> Doctor-Led Only
              </button>
              <button
                onClick={() => setDoctorTypeFilter('midlevel')}
                className={`tool-filter-pill ${doctorTypeFilter === 'midlevel' ? 'active' : ''}`}
              >
                <AlertTriangle size={12} color="#f59e0b" /> Nurse / Mid-Level
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-alt)', borderBottom: '1px solid var(--border-medium)', color: 'var(--text-tertiary)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '10px 14px', width: '60px' }}>Rank</th>
                  <th style={{ padding: '10px 14px' }}>Clinic Brand</th>
                  <th style={{ padding: '10px 14px' }}>Medical Director</th>
                  <th style={{ padding: '10px 14px' }}>Supervision Model</th>
                  <th style={{ padding: '10px 14px' }}>Doctor Credentials</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>E-E-A-T Grade</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Verify NPI</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompetitors.slice(0, 60).map((comp) => {
                  const isDocLed = comp.doctors.physicianSupervised.toLowerCase().includes('doctor') || comp.doctors.physicianSupervised.toLowerCase().includes('physician');
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
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 400 }}>{comp.domain}</div>
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>
                        {comp.doctors.medicalDirector || 'Undisclosed'}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        {isDocLed ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', fontWeight: 700, color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: '9999px' }}>
                            <CheckCircle2 size={11} /> {comp.doctors.physicianSupervised}
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', fontWeight: 600, color: '#92400e', background: '#fef3c7', padding: '2px 8px', borderRadius: '9999px' }}>
                            {comp.doctors.physicianSupervised}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {comp.doctors.doctorCredentials.join(', ') || 'None Listed'}
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontWeight: 800,
                          fontSize: '0.74rem',
                          background: comp.authors.eeatGrade.startsWith('A') ? '#dcfce7' : comp.authors.eeatGrade.startsWith('B') ? '#fef3c7' : '#fee2e2',
                          color: comp.authors.eeatGrade.startsWith('A') ? '#166534' : comp.authors.eeatGrade.startsWith('B') ? '#92400e' : '#991b1b'
                        }}>
                          {comp.authors.eeatGrade}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        {comp.doctors.medicalDirector && comp.doctors.medicalDirector !== 'Undisclosed' ? (
                          <button
                            onClick={() => {
                              setActiveSection('npi');
                              setNpiQuery(comp.doctors.medicalDirector);
                              handleNpiSearch(comp.doctors.medicalDirector);
                            }}
                            style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              background: 'var(--bg-surface-alt)',
                              border: '1px solid var(--border-medium)',
                              color: 'var(--text-primary)',
                              cursor: 'pointer'
                            }}
                          >
                            Verify NPI
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: LIVE NPI REGISTRY VERIFIER */}
      {activeSection === 'npi' && (
        <div style={{
          padding: '20px',
          borderRadius: '12px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>
              US Federal CMS Registry
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '2px 0 0 0' }}>
              Federal Doctor NPI &amp; Medical License Lookup
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Queries the live NPPES CMS registry to verify doctor names, license states, and 10-digit NPIs.
            </p>
          </div>

          {/* Quick Presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>1-Click Verified MDs:</span>
            {[
              { label: 'Dr. Brett Kramer, DO (Ongo)', query: 'Brett Kramer' },
              { label: 'Dr. Nkemakonam Okonkwo, MD (Ongo)', query: 'Nkemakonam Okonkwo' },
              { label: 'Dr. Rushi Patel, MD (Ongo)', query: 'Rushi Patel' },
              { label: 'Dr. Sarah Miller, MD (Ongo)', query: 'Sarah Miller' },
              { label: 'Dr. Jason Krasne, MD (Ongo)', query: 'Jason Krasne' },
              { label: 'Dr. Mike Bohl, MD (Ro.co)', query: 'Mike Bohl' },
              { label: 'Dr. Patrick Carroll, MD (Hims)', query: 'Patrick Carroll' }
            ].map(doc => (
              <button
                key={doc.query}
                type="button"
                onClick={() => {
                  setNpiQuery(doc.query);
                  handleNpiSearch(doc.query);
                }}
                style={{
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  border: npiQuery === doc.query ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                  background: npiQuery === doc.query ? '#dcfce7' : 'var(--bg-surface-alt)',
                  color: npiQuery === doc.query ? '#166534' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {doc.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ display: 'flex', gap: '8px', maxWidth: '500px' }}>
            <input
              type="text"
              value={npiQuery}
              onChange={(e) => setNpiQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleNpiSearch(); }}
              placeholder="Doctor name or 10-digit NPI number..."
              className="tool-search-input"
              style={{ paddingLeft: '14px', height: '36px' }}
            />
            <button
              onClick={() => handleNpiSearch()}
              disabled={npiLoading}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'var(--color-primary-dark)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {npiLoading ? 'Checking CMS...' : 'Verify'}
            </button>
          </div>

          {/* Results Box */}
          {npiDoctor && (
            <div style={{
              padding: '16px',
              borderRadius: '10px',
              background: 'var(--bg-surface-alt)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: '9999px' }}>
                  ✓ Official Federal Record Verified
                </span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  NPI: {npiDoctor.number}
                </span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {npiDoctor.basic?.first_name} {npiDoctor.basic?.last_name}, {npiDoctor.basic?.credential || 'MD'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Practice: {npiDoctor.addresses?.[0]?.address_1}, {npiDoctor.addresses?.[0]?.city}, {npiDoctor.addresses?.[0]?.state} {npiDoctor.addresses?.[0]?.postal_code}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: PHYSICIAN SCHEMA GENERATOR */}
      {activeSection === 'schema' && (
        <div style={{
          padding: '20px',
          borderRadius: '12px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.74rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                Google Rich Results
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '2px 0 0 0' }}>
                JSON-LD Physician Schema (5 Board-Certified MDs)
              </h2>
            </div>
            <button
              onClick={() => {
                const schema = JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "MedicalBusiness",
                  "name": "Ongo Weight Loss",
                  "url": "https://ongoweightloss.com",
                  "medicalSpecialty": "Weight Loss & Endocrinology",
                  "physicians": [
                    { "@type": "Physician", "name": "Dr. Nkemakonam Okonkwo, MD", "medicalSpecialty": "Internal Medicine" },
                    { "@type": "Physician", "name": "Dr. Brett Kramer, DO", "medicalSpecialty": "Family & Bariatric Medicine" },
                    { "@type": "Physician", "name": "Dr. Rushi Patel, MD", "medicalSpecialty": "Internal Medicine" },
                    { "@type": "Physician", "name": "Dr. Sarah Miller, MD", "medicalSpecialty": "Family Medicine" },
                    { "@type": "Physician", "name": "Dr. Jason Krasne, MD", "medicalSpecialty": "Internal Medicine" }
                  ]
                }, null, 2);
                navigator.clipboard.writeText(schema);
                setSchemaCopied(true);
                setTimeout(() => setSchemaCopied(false), 2000);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'var(--color-primary-dark)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {schemaCopied ? <Check size={14} /> : <Copy size={14} />}
              {schemaCopied ? 'Copied JSON-LD!' : 'Copy Schema Code'}
            </button>
          </div>

          <pre style={{
            background: 'var(--bg-surface-alt)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '14px',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-mono)',
            overflowX: 'auto',
            lineHeight: 1.5,
            color: 'var(--text-primary)'
          }}>
{`{
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "Ongo Weight Loss",
  "url": "https://ongoweightloss.com",
  "medicalSpecialty": "Weight Loss & Endocrinology",
  "physicians": [
    { "@type": "Physician", "name": "Dr. Nkemakonam Okonkwo, MD", "medicalSpecialty": "Internal Medicine" },
    { "@type": "Physician", "name": "Dr. Brett Kramer, DO", "medicalSpecialty": "Family & Bariatric Medicine" },
    { "@type": "Physician", "name": "Dr. Rushi Patel, MD", "medicalSpecialty": "Internal Medicine" },
    { "@type": "Physician", "name": "Dr. Sarah Miller, MD", "medicalSpecialty": "Family Medicine" },
    { "@type": "Physician", "name": "Dr. Jason Krasne, MD", "medicalSpecialty": "Internal Medicine" }
  ]
}`}
          </pre>
        </div>
      )}
    </div>
  );
}
