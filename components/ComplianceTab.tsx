'use client';

import React, { useState, useMemo } from 'react';
import { 
  Stethoscope, 
  ShieldCheck, 
  MapPin, 
  FileText, 
  ExternalLink, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ChevronRight, 
  Award, 
  Pill, 
  Sparkles, 
  Check, 
  Copy,
  Users,
  Layers,
  HeartHandshake,
  Clock,
  BookOpen,
  DollarSign
} from 'lucide-react';
import { CompetitorComplianceItem } from '@/lib/data';
import ContextCue from './ContextCue';

interface ComplianceTabProps {
  complianceData: CompetitorComplianceItem[];
  onInspectCompetitor?: (folder: string) => void;
}

type DimensionFilter = 'all' | 'doctors' | 'authors' | 'categories' | 'policies' | 'states';

export default function ComplianceTab({ complianceData, onInspectCompetitor }: ComplianceTabProps) {
  const [activeDimension, setActiveDimension] = useState<DimensionFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctorType, setSelectedDoctorType] = useState('all'); // all | doctor-led | np-led
  const [selectedConsultType, setSelectedConsultType] = useState('all'); // all | video | async
  const [selectedCoverage, setSelectedCoverage] = useState('all'); // all | 50-states | partial
  const [selectedEeat, setSelectedEeat] = useState('all'); // all | high (A/A+) | moderate (B) | low (C)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Extract Ongo Benchmark (Rank 0) and Competitors (Rank 1..100)
  const ongoBenchmark = useMemo(() => {
    return complianceData.find(c => c.isBenchmark) || complianceData[0];
  }, [complianceData]);

  const competitorsList = useMemo(() => {
    return complianceData.filter(c => !c.isBenchmark);
  }, [complianceData]);

  // Filter pipeline
  const filteredCompetitors = useMemo(() => {
    return competitorsList.filter(comp => {
      // Search query across name, domain, doctors, pharmacies, states
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = comp.name.toLowerCase().includes(q) || comp.domain.toLowerCase().includes(q);
        const matchesDoc = comp.doctors.medicalDirector.toLowerCase().includes(q) || 
                           comp.doctors.doctorCredentials.some(c => c.toLowerCase().includes(q)) ||
                           comp.doctors.doctorTeamSample.some(d => d.toLowerCase().includes(q));
        const matchesPharm = comp.policies.namedPharmacies.some(p => p.toLowerCase().includes(q)) || 
                             comp.policies.pharmacyType.toLowerCase().includes(q);
        const matchesState = comp.states.coverageSummary.toLowerCase().includes(q) ||
                             comp.states.excludedStates.some(s => s.toLowerCase().includes(q));
        const matchesMed = comp.categories.medications.some(m => m.toLowerCase().includes(q));

        if (!matchesName && !matchesDoc && !matchesPharm && !matchesState && !matchesMed) {
          return false;
        }
      }

      // Doctor supervision filter
      if (selectedDoctorType === 'doctor-led') {
        if (!comp.doctors.physicianSupervised.toLowerCase().includes('doctor') && 
            !comp.doctors.physicianSupervised.toLowerCase().includes('physician')) {
          return false;
        }
      } else if (selectedDoctorType === 'np-led') {
        if (!comp.doctors.physicianSupervised.toLowerCase().includes('nurse') && 
            !comp.doctors.physicianSupervised.toLowerCase().includes('clinician')) {
          return false;
        }
      }

      // Consultation format filter
      if (selectedConsultType === 'video') {
        if (!comp.doctors.consultationType.toLowerCase().includes('video')) return false;
      } else if (selectedConsultType === 'async') {
        if (!comp.doctors.consultationType.toLowerCase().includes('async') && 
            !comp.doctors.consultationType.toLowerCase().includes('questionnaire')) return false;
      }

      // Coverage filter
      if (selectedCoverage === '50-states') {
        if (comp.states.totalStatesCovered !== 50) return false;
      } else if (selectedCoverage === 'partial') {
        if (comp.states.totalStatesCovered >= 50) return false;
      }

      // E-E-A-T Grade filter
      if (selectedEeat === 'high') {
        if (!comp.authors.eeatGrade.startsWith('A')) return false;
      } else if (selectedEeat === 'moderate') {
        if (!comp.authors.eeatGrade.startsWith('B')) return false;
      } else if (selectedEeat === 'low') {
        if (comp.authors.eeatGrade.startsWith('A') || comp.authors.eeatGrade.startsWith('B')) return false;
      }

      return true;
    });
  }, [competitorsList, searchQuery, selectedDoctorType, selectedConsultType, selectedCoverage, selectedEeat]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const total = competitorsList.length;
    const doctorLedCount = competitorsList.filter(c => 
      c.doctors.physicianSupervised.toLowerCase().includes('doctor') || 
      c.doctors.physicianSupervised.toLowerCase().includes('physician')
    ).length;
    const fiftyStatesCount = competitorsList.filter(c => c.states.totalStatesCovered === 50).length;
    const highEeatCount = competitorsList.filter(c => c.authors.eeatGrade.startsWith('A')).length;
    const sterile503aCount = competitorsList.filter(c => c.policies.pharmacyType.includes('503A')).length;

    return {
      total,
      doctorLedCount,
      fiftyStatesCount,
      highEeatCount,
      sterile503aCount
    };
  }, [competitorsList]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const getEeatBadgeStyle = (grade: string) => {
    if (grade.startsWith('A')) return { bg: '#e9f7ee', color: '#1b4332', border: '#74c69d' };
    if (grade.startsWith('B')) return { bg: '#fff8e7', color: '#855800', border: '#f4a261' };
    return { bg: '#fde8e8', color: '#9b1c1c', border: '#fca5a5' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Page Guide Header */}
      <ContextCue
        badge="Clinical & E-E-A-T Intelligence"
        title="Competitor Clinical Radar: Doctors, Authors, Policies & State Coverage"
        about="This page provides a specialized clinical compliance, medical authority, and regulatory audit comparing Ongo Weight Loss (#00 Flagship Benchmark) against 100 US telehealth competitors across 5 mission-critical dimensions: (1) Physician oversight & named doctors info, (2) Medical author attribution & editorial review standards, (3) Treatment categories & compounding formulations, (4) Pharmacy sourcing, pricing policies, cancellation terms & lab mandates, and (5) 50-state geographic telehealth coverage."
        whatYouCanDo={[
          {
            action: "Inspect Named Doctors & Medical Leadership",
            description: "Check medical director names, MD/DO board certifications, physician-led supervision vs. mid-level NP/PA models, and consultation formats (video vs. asynchronous form review)."
          },
          {
            action: "Audit E-E-A-T & Medical Author Attribution",
            description: "Review whether articles are clinically reviewed by doctors, view named author bylines, and inspect E-E-A-T transparency grades."
          },
          {
            action: "Explore Categories & Treatment Specializations",
            description: "Filter by Compounded Semaglutide, Tirzepatide, Oral Sublingual Drops, B12/MIC Injections, Peptides (Sermorelin, NAD+), and TRT co-care."
          },
          {
            action: "Compare Clinical & Pharmacy Policies",
            description: "Inspect 503A sterile compounding vs. 503B outsourcing facilities, flat-rate pricing models, cancellation terms, refund guarantees, and mandatory lab bloodwork policies."
          },
          {
            action: "Analyze 50-State Telehealth Licensing",
            description: "Filter providers by full nationwide 50-state coverage vs. restricted states (California, Mississippi, Louisiana, Alabama, etc.) and state video visit mandates."
          },
          {
            action: "Benchmark Against Ongo Weight Loss",
            description: "Compare Ongo's doctor-led 50-state model ($179 Sema / $249 Tirz, $0 consult/shipping, 100% MD review) directly against any competitor."
          }
        ]}
        tip="Filter by '50 States' and '100% Doctor-Led' to see which few competitors match Ongo's clinical telehealth standards."
      />

      {/* Top Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '12px'
      }}>
        {/* Card 1: Doctor-Supervised */}
        <div className="bento-card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Doctor-Supervised
            </span>
            <Stethoscope size={15} color="var(--color-primary)" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
            {metrics.doctorLedCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Have MD/DO medical directors or physician teams
          </div>
        </div>

        {/* Card 2: 50-State Coverage */}
        <div className="bento-card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              50-State Nationwide
            </span>
            <MapPin size={15} color="#347e5d" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#347e5d' }}>
            {metrics.fiftyStatesCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Full 50-state telehealth licensing (like Ongo)
          </div>
        </div>

        {/* Card 3: E-E-A-T Grade A/A+ */}
        <div className="bento-card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              E-E-A-T Verified Authors
            </span>
            <Award size={15} color="#f4a261" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#b26a27' }}>
            {metrics.highEeatCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Articles clinically reviewed with doctor bylines
          </div>
        </div>

        {/* Card 4: 503A Compounding */}
        <div className="bento-card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              503A Sterile Compounding
            </span>
            <Pill size={15} color="var(--color-accent)" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-accent)' }}>
            {metrics.sterile503aCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Disclose state-licensed sterile pharmacy partners
          </div>
        </div>

        {/* Card 5: Ongo Flagship Advantage */}
        <div className="bento-card" style={{ padding: '16px 20px', borderLeft: '3px solid var(--color-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Ongo Benchmark
            </span>
            <ShieldCheck size={15} color="var(--color-primary)" />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
            100% MD &bull; 50 States
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            $179 Sema / $249 Tirz flat rate &bull; $0 consult/shipping
          </div>
        </div>
      </div>

      {/* Pinned Ongo Weight Loss Flagship Clinic Benchmark Card */}
      {ongoBenchmark && (
        <div className="bento-card" style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #1b4332 0%, #24553f 65%, #2d6a4f 100%)',
          color: '#ffffff',
          border: '1px solid #347e5d',
          boxShadow: '0 8px 30px -4px rgba(27, 67, 50, 0.25)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '18px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{
                  background: 'linear-gradient(135deg, #e76f51 0%, #ee8a4f 100%)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  letterSpacing: '0.04em'
                }}>
                  BENCHMARK #00
                </span>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#b7e4c7',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '9999px'
                }}>
                  Self Baseline Clinic
                </span>
                <span style={{
                  background: '#52b788',
                  color: '#1b4332',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '9999px'
                }}>
                  E-E-A-T Grade A+
                </span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                {ongoBenchmark.name} &mdash; Clinical & Regulatory Standards
              </h2>
              <div style={{ fontSize: '0.84rem', color: '#b7e4c7', marginTop: '4px' }}>
                https://{ongoBenchmark.domain} &bull; Internal Medicine & Obesity Medicine Board-Certified Physician Oversight
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href="https://ongoweightloss.com/"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  background: '#ffffff',
                  color: '#1b4332',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <span>Visit Live Clinic</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* 5-Column Detailed Benchmark Matrix */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '14px',
            fontSize: '0.78rem'
          }}>
            {/* Box 1: Doctors */}
            <div style={{ background: 'rgba(0, 0, 0, 0.18)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f4a261', fontWeight: 700, marginBottom: '6px' }}>
                <Stethoscope size={14} />
                <span>Doctors & Oversight</span>
              </div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.82rem', marginBottom: '4px' }}>
                {ongoBenchmark.doctors.medicalDirector}
              </div>
              <div style={{ color: '#d8f3dc', fontSize: '0.74rem', lineHeight: 1.45 }}>
                &bull; {ongoBenchmark.doctors.physicianSupervised}<br />
                &bull; Credentials: {ongoBenchmark.doctors.doctorCredentials.join(', ')}<br />
                &bull; {ongoBenchmark.doctors.consultationType}
              </div>
            </div>

            {/* Box 2: Authors */}
            <div style={{ background: 'rgba(0, 0, 0, 0.18)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f4a261', fontWeight: 700, marginBottom: '6px' }}>
                <BookOpen size={14} />
                <span>Authors & E-E-A-T</span>
              </div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.82rem', marginBottom: '4px' }}>
                100% Doctor-Authored
              </div>
              <div style={{ color: '#d8f3dc', fontSize: '0.74rem', lineHeight: 1.45 }}>
                &bull; Grade: <strong>A+ Verified MD Review</strong><br />
                &bull; {ongoBenchmark.authors.namedAuthorsCount} Named MD Authors with published bios<br />
                &bull; Strict clinical citation standards
              </div>
            </div>

            {/* Box 3: Categories */}
            <div style={{ background: 'rgba(0, 0, 0, 0.18)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f4a261', fontWeight: 700, marginBottom: '6px' }}>
                <Pill size={14} />
                <span>Treatments & Forms</span>
              </div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.82rem', marginBottom: '4px' }}>
                Compounded GLP-1 & GIP
              </div>
              <div style={{ color: '#d8f3dc', fontSize: '0.74rem', lineHeight: 1.45 }}>
                &bull; Semaglutide ($179/mo) & Tirzepatide ($249/mo)<br />
                &bull; Subcutaneous Injections<br />
                &bull; Free Zofran anti-nausea medication included
              </div>
            </div>

            {/* Box 4: Policies */}
            <div style={{ background: 'rgba(0, 0, 0, 0.18)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f4a261', fontWeight: 700, marginBottom: '6px' }}>
                <DollarSign size={14} />
                <span>Pharmacy & Policies</span>
              </div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.82rem', marginBottom: '4px' }}>
                503A State Sterile Sourcing
              </div>
              <div style={{ color: '#d8f3dc', fontSize: '0.74rem', lineHeight: 1.45 }}>
                &bull; $0 Membership, $0 Shipping, $0 Consult<br />
                &bull; Cancel anytime with zero commitment<br />
                &bull; 100% money-back if not clinically approved
              </div>
            </div>

            {/* Box 5: States */}
            <div style={{ background: 'rgba(0, 0, 0, 0.18)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f4a261', fontWeight: 700, marginBottom: '6px' }}>
                <MapPin size={14} />
                <span>Geographic Coverage</span>
              </div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.82rem', marginBottom: '4px' }}>
                All 50 US States Covered
              </div>
              <div style={{ color: '#d8f3dc', fontSize: '0.74rem', lineHeight: 1.45 }}>
                &bull; 100% nationwide licensing<br />
                &bull; 0 restricted or excluded states<br />
                &bull; Free cold-chain overnight shipping
              </div>
            </div>
          </div>

          {/* All 5 Ongo Doctors Live Directory (Verified via Live Sitemap) */}
          {ongoBenchmark.doctors.doctorProfiles && ongoBenchmark.doctors.doctorProfiles.length > 0 && (
            <div style={{
              marginTop: '18px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={16} color="#f4a261" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>
                    Ongo Medical Team Directory &mdash; All 5 Licensed Physicians
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    background: 'rgba(255,255,255,0.16)',
                    color: '#b7e4c7',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontWeight: 700
                  }}>
                    5 of 5 Verified via Sitemap
                  </span>
                </div>
                <a
                  href="https://ongoweightloss.com/sitemap.xml"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '0.72rem',
                    color: '#b7e4c7',
                    textDecoration: 'underline',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>Reference: /sitemap.xml</span>
                  <ExternalLink size={10} />
                </a>
              </div>

              {/* 5 Doctor Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '12px'
              }}>
                {ongoBenchmark.doctors.doctorProfiles.map((doc, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(0, 0, 0, 0.28)',
                      borderRadius: '10px',
                      padding: '14px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      {/* Doctor Name & Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                        <div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>
                            {doc.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#f4a261', fontWeight: 700, marginTop: '2px' }}>
                            {doc.specialty}
                          </div>
                        </div>
                        <span style={{
                          background: 'rgba(52, 126, 93, 0.4)',
                          border: '1px solid #52b788',
                          color: '#b7e4c7',
                          fontSize: '0.66rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          whiteSpace: 'nowrap'
                        }}>
                          {doc.role.includes('15+') ? '15+ Yrs Exp' : doc.role.includes('10+') ? '10+ Yrs Exp' : doc.role.includes('8+') ? '8+ Yrs Exp' : doc.role.includes('7+') ? '7+ Yrs Exp' : 'MD'}
                        </span>
                      </div>

                      {/* NPI & Licensure Badge */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '8px 0' }}>
                        {doc.npiId && (
                          <a
                            href={doc.npiRegistryUrl || `https://npiregistry.cms.hhs.gov/provider-view/${doc.npiId}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: 'rgba(255, 255, 255, 0.1)',
                              color: '#d8f3dc',
                              fontSize: '0.68rem',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              textDecoration: 'none',
                              border: '1px solid rgba(255, 255, 255, 0.12)'
                            }}
                          >
                            <span>NPI: {doc.npiId}</span>
                            <ExternalLink size={9} />
                          </a>
                        )}
                        <span style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#d8f3dc',
                          fontSize: '0.68rem',
                          padding: '2px 7px',
                          borderRadius: '4px',
                          border: '1px solid rgba(255, 255, 255, 0.12)'
                        }}>
                          {(doc.statesCount ?? 0) > 0 ? `${doc.statesCount} States Licensed` : 'Multi-State Telehealth'}
                        </span>
                      </div>

                      {/* Clinical Bio */}
                      <p style={{
                        fontSize: '0.73rem',
                        color: 'rgba(255, 255, 255, 0.85)',
                        lineHeight: 1.45,
                        margin: '6px 0 10px 0',
                        fontStyle: 'italic'
                      }}>
                        &ldquo;{doc.bio}&rdquo;
                      </p>
                    </div>

                    {/* Footer link to sitemap URL */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '8px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      fontSize: '0.7rem'
                    }}>
                      <span style={{ color: '#b7e4c7', fontFamily: 'monospace' }}>
                        {doc.sitemapUrl.replace('https://ongoweightloss.com', '')}
                      </span>
                      <a
                        href={doc.sitemapUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#ffffff',
                          fontWeight: 700,
                          textDecoration: 'none',
                          background: 'rgba(255,255,255,0.14)',
                          padding: '3px 8px',
                          borderRadius: '4px'
                        }}
                      >
                        <span>View Page</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Analytical Perspective Filter & Search Bar */}
      <div className="bento-card" style={{ padding: '22px' }}>
        
        {/* Dimension Switcher Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexWrap: 'wrap',
          marginBottom: '16px',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '4px' }}>
            View Focus:
          </span>

          {[
            { id: 'all', label: 'All Dimensions (Full Audit)', icon: Layers },
            { id: 'doctors', label: 'Doctors & Oversight', icon: Stethoscope },
            { id: 'authors', label: 'Authors & E-E-A-T', icon: BookOpen },
            { id: 'categories', label: 'Medications & Treatments', icon: Pill },
            { id: 'policies', label: 'Policies, Pricing & Sourcing', icon: FileText },
            { id: 'states', label: '50-State Coverage', icon: MapPin },
          ].map(dim => {
            const Icon = dim.icon;
            const isActive = activeDimension === dim.id;
            return (
              <button
                key={dim.id}
                onClick={() => setActiveDimension(dim.id as DimensionFilter)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)' : 'var(--bg-canvas)',
                  color: isActive ? '#ffffff' : 'var(--color-primary-dark)',
                  boxShadow: isActive ? '0 2px 8px rgba(27, 67, 50, 0.25)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={13} color={isActive ? '#ffffff' : '#347e5d'} />
                <span>{dim.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Granular Dropdown Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', gridColumn: 'span 2' }}>
            <Search size={15} color="var(--color-primary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search competitor, doctor name, pharmacy (Hallandale, Red Rock), state (Texas, CA)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-minimal"
              style={{ paddingLeft: '38px', borderRadius: '9999px', fontSize: '0.82rem' }}
            />
          </div>

          {/* Doctor Oversight Filter */}
          <div>
            <select
              value={selectedDoctorType}
              onChange={(e) => setSelectedDoctorType(e.target.value)}
              className="input-minimal"
              style={{ width: '100%', borderRadius: '8px', padding: '6px 10px', fontSize: '0.76rem' }}
            >
              <option value="all">Doctor Oversight: All Types</option>
              <option value="doctor-led">100% Doctor / MD Supervised</option>
              <option value="np-led">Nurse Practitioner / Mid-Level Led</option>
            </select>
          </div>

          {/* Consultation Type Filter */}
          <div>
            <select
              value={selectedConsultType}
              onChange={(e) => setSelectedConsultType(e.target.value)}
              className="input-minimal"
              style={{ width: '100%', borderRadius: '8px', padding: '6px 10px', fontSize: '0.76rem' }}
            >
              <option value="all">Consultation: All Formats</option>
              <option value="video">Synchronous Video Telehealth</option>
              <option value="async">Asynchronous Questionnaire / Chat</option>
            </select>
          </div>

          {/* State Coverage Filter */}
          <div>
            <select
              value={selectedCoverage}
              onChange={(e) => setSelectedCoverage(e.target.value)}
              className="input-minimal"
              style={{ width: '100%', borderRadius: '8px', padding: '6px 10px', fontSize: '0.76rem' }}
            >
              <option value="all">Geographic Coverage: All</option>
              <option value="50-states">Full 50 States Nationwide</option>
              <option value="partial">Partial Coverage / Restricted</option>
            </select>
          </div>

          {/* E-E-A-T Grade Filter */}
          <div>
            <select
              value={selectedEeat}
              onChange={(e) => setSelectedEeat(e.target.value)}
              className="input-minimal"
              style={{ width: '100%', borderRadius: '8px', padding: '6px 10px', fontSize: '0.76rem' }}
            >
              <option value="all">E-E-A-T Grade: All</option>
              <option value="high">Grade A / A+ (Doctor Reviewed)</option>
              <option value="moderate">Grade B (Clinician Bylines)</option>
              <option value="low">Grade C (No Named Authors)</option>
            </select>
          </div>
        </div>

      </div>

      {/* Competitors List Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
          Showing {filteredCompetitors.length} of 100 Competitors Benchmark
        </span>
        <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
          Benchmarked against Ongo Weight Loss 50-State Telehealth Model
        </span>
      </div>

      {/* Competitors Detailed Dossier Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredCompetitors.map(comp => {
          const eeatStyle = getEeatBadgeStyle(comp.authors.eeatGrade);

          return (
            <div 
              key={comp.rank}
              className="bento-card"
              style={{
                padding: '20px 24px',
                background: '#ffffff',
                border: '1px solid var(--border-medium)',
                transition: 'all 0.15s ease'
              }}
            >
              {/* Card Top Title Row */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                marginBottom: '14px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    background: 'var(--color-primary-dark)',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    #{comp.rank}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>
                      {comp.name}
                    </h3>
                    <a
                      href={`https://${comp.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: '0.74rem',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {comp.domain} <ExternalLink size={10} />
                    </a>
                  </div>
                </div>

                {/* Key Status Pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span className="badge-minimal" style={{
                    background: comp.states.totalStatesCovered === 50 ? '#e9f7ee' : '#fff8e7',
                    color: comp.states.totalStatesCovered === 50 ? '#1b4332' : '#855800',
                    border: comp.states.totalStatesCovered === 50 ? '1px solid #74c69d' : '1px solid #f4a261',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    <MapPin size={10} style={{ marginRight: '3px', display: 'inline' }} />
                    {comp.states.totalStatesCovered === 50 ? '50 States Nationwide' : `${comp.states.totalStatesCovered} States`}
                  </span>

                  <span className="badge-minimal" style={{
                    ...eeatStyle,
                    border: `1px solid ${eeatStyle.border}`,
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    E-E-A-T: {comp.authors.eeatGrade}
                  </span>

                  <span className="badge-minimal" style={{
                    background: comp.doctors.physicianSupervised.includes('Doctor') ? 'var(--color-primary-soft)' : 'var(--bg-canvas)',
                    color: comp.doctors.physicianSupervised.includes('Doctor') ? 'var(--color-primary-dark)' : 'var(--text-secondary)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.7rem',
                    fontWeight: 600
                  }}>
                    <Stethoscope size={10} style={{ marginRight: '3px', display: 'inline' }} />
                    {comp.doctors.physicianSupervised}
                  </span>
                </div>
              </div>

              {/* Dossier Content Grid: Adapt based on Active Dimension */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '14px',
                fontSize: '0.78rem'
              }}>
                {/* 1. DOCTORS PANEL */}
                {(activeDimension === 'all' || activeDimension === 'doctors') && (
                  <div style={{ background: 'var(--bg-canvas)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '6px' }}>
                      <Stethoscope size={13} color="var(--color-primary)" />
                      <span>Doctors & Leadership</span>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)', fontSize: '0.8rem', marginBottom: '3px' }}>
                      {comp.doctors.medicalDirector}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.73rem', lineHeight: 1.45 }}>
                      <div><strong>Consultation:</strong> {comp.doctors.consultationType}</div>
                      <div><strong>Credentials:</strong> {comp.doctors.doctorCredentials.join(', ')}</div>
                      {comp.doctors.doctorTeamSample.length > 0 && (
                        <div style={{ marginTop: '4px', color: 'var(--text-tertiary)', fontSize: '0.71rem' }}>
                          <em>Team:</em> {comp.doctors.doctorTeamSample.join(', ')}
                        </div>
                      )}
                      {comp.doctors.doctorUrls.length > 0 && (
                        <div style={{ marginTop: '6px' }}>
                          <a href={comp.doctors.doctorUrls[0]} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                            View Provider Page <ExternalLink size={10} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. AUTHORS & E-E-A-T PANEL */}
                {(activeDimension === 'all' || activeDimension === 'authors') && (
                  <div style={{ background: 'var(--bg-canvas)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '6px' }}>
                      <BookOpen size={13} color="#b26a27" />
                      <span>Authors & E-E-A-T Standards</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span className="badge-minimal" style={{ ...eeatStyle, fontSize: '0.68rem', padding: '1px 6px' }}>
                        Grade {comp.authors.eeatGrade}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                        {comp.authors.namedAuthorsCount > 0 ? `${comp.authors.namedAuthorsCount} Named Authors` : 'No Author Bylines'}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.73rem', lineHeight: 1.45 }}>
                      <p style={{ margin: '0 0 4px' }}>{comp.authors.reviewProtocol}</p>
                      {comp.authors.authorUrls.length > 0 && (
                        <a href={comp.authors.authorUrls[0]} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                          Author Profiles <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. CATEGORIES & TREATMENTS PANEL */}
                {(activeDimension === 'all' || activeDimension === 'categories') && (
                  <div style={{ background: 'var(--bg-canvas)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '6px' }}>
                      <Pill size={13} color="var(--color-accent)" />
                      <span>Medications & Formulations</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }}>
                      {comp.categories.medications.map((m, midx) => (
                        <span key={midx} style={{
                          background: m.includes('Tirz') ? 'rgba(52, 126, 93, 0.12)' : 'rgba(231, 111, 81, 0.12)',
                          color: m.includes('Tirz') ? '#1b4332' : '#c85a3c',
                          padding: '1px 7px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 600
                        }}>
                          {m}
                        </span>
                      ))}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', lineHeight: 1.4 }}>
                      <div><strong>Delivery:</strong> {comp.categories.forms.join(', ')}</div>
                      <div><strong>Ancillary:</strong> {comp.categories.ancillaryServices.slice(0, 2).join(', ')}</div>
                    </div>
                  </div>
                )}

                {/* 4. POLICIES & PHARMACY PANEL */}
                {(activeDimension === 'all' || activeDimension === 'policies') && (
                  <div style={{ background: 'var(--bg-canvas)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '6px' }}>
                      <FileText size={13} color="var(--color-primary)" />
                      <span>Policies, Sourcing & Pricing</span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.73rem', lineHeight: 1.45 }}>
                      <div><strong>Pricing:</strong> <span style={{ color: 'var(--color-primary-dark)', fontWeight: 600 }}>{comp.policies.pricingModel}</span></div>
                      <div><strong>Pharmacy:</strong> {comp.policies.pharmacyType} ({comp.policies.namedPharmacies.slice(0, 2).join(', ')})</div>
                      <div><strong>Cancellation:</strong> {comp.policies.cancellationPolicy}</div>
                      <div><strong>Labs:</strong> {comp.policies.labRequirements}</div>
                      <div><strong>Shipping:</strong> {comp.policies.shippingPolicy}</div>
                    </div>
                  </div>
                )}

                {/* 5. STATES & COVERAGE PANEL */}
                {(activeDimension === 'all' || activeDimension === 'states') && (
                  <div style={{ background: 'var(--bg-canvas)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '6px' }}>
                      <MapPin size={13} color="#2d6a4f" />
                      <span>Geographic Telehealth Coverage</span>
                    </div>
                    <div style={{ fontWeight: 700, color: comp.states.totalStatesCovered === 50 ? '#1b4332' : '#855800', fontSize: '0.8rem', marginBottom: '3px' }}>
                      {comp.states.coverageSummary}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.73rem', lineHeight: 1.45 }}>
                      {comp.states.excludedStates.length > 0 ? (
                        <div style={{ color: '#bc4749', marginBottom: '3px' }}>
                          <strong>Excluded:</strong> {comp.states.excludedStates.join(', ')}
                        </div>
                      ) : (
                        <div style={{ color: '#2d6a4f', marginBottom: '3px' }}>
                          ✓ Full nationwide patient acceptance
                        </div>
                      )}
                      <div><strong>Mandates:</strong> {comp.states.synchronousMandates}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredCompetitors.length === 0 && (
          <div className="bento-card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <AlertCircle size={28} color="var(--color-accent)" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary-dark)', margin: '0 0 6px' }}>
              No competitors match your active compliance filter
            </h3>
            <p style={{ fontSize: '0.8rem', maxWidth: '400px', margin: '0 auto 14px' }}>
              Try clearing your search query or setting the doctor oversight and state coverage filters back to &ldquo;All&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDoctorType('all');
                setSelectedConsultType('all');
                setSelectedCoverage('all');
                setSelectedEeat('all');
              }}
              className="btn-minimal-primary"
              style={{ fontSize: '0.78rem' }}
            >
              Reset Compliance Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
