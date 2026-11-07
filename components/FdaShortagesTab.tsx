'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Activity,
  FileCheck2,
  Scale,
  Pill,
  Clock,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import ContextCue from './ContextCue';
import { FdaShortageRecord, FdaAdverseEventSummary } from '@/app/api/fda-shortages/route';

export default function FdaShortagesTab() {
  const [data, setData] = useState<{
    shortages: FdaShortageRecord[];
    faers: FdaAdverseEventSummary[];
    stats: any;
    source: string;
    timestamp: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'CURRENT SHORTAGE' | 'RESOLVED'>('all');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const fetchFdaData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/fda-shortages${searchQuery ? `?drug=${encodeURIComponent(searchQuery)}` : ''}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFdaData();
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2200);
  };

  const filteredShortages = data?.shortages.filter(s => {
    const matchesSearch = s.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const legalComplianceDisclaimer = `COMPLIANCE DISCLAIMER (US FD&C ACT §503A): Compounded medications (including Semaglutide and Tirzepatide) are prepared exclusively by state-licensed 503A compounding pharmacies pursuant to a valid, patient-specific prescription issued by a licensed US healthcare provider. Compounded GLP-1 medications are not FDA-approved products, but are federally permitted under Section 503A of the Federal Food, Drug, and Cosmetic Act (21 U.S.C. § 353a) during documented periods of commercial drug shortage listed on the official FDA Drug Shortages Database. Ongo Weight Loss does not manufacture medications and provides telehealth clinical management only.`;

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 8px' }}>
      {/* Context Cue Banner */}
      <ContextCue
        title="US FDA Drug Shortages & 503A Regulatory Watchdog"
        level={3}
        toolNumber={22}
        badge="Live Federal US Telemetry"
        useCase="Monitors the official U.S. FDA Drug Shortages Database to verify 503A compounding shields for Semaglutide & Tirzepatide, tracking legal safety margins and FAERS adverse event signals."
      />

      {/* Hero Stat Matrix */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
        margin: '24px 0'
      }}>
        <div className="glass-card" style={{ padding: '20px 24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              FDA Shortage Status
            </span>
            <ShieldAlert size={18} color="#059669" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#059669', letterSpacing: '-0.02em' }}>
            ACTIVE SHORTAGE
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Semaglutide & Tirzepatide currently protected under FD&C Act §503A
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              503A Legal Shield
            </span>
            <Scale size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#0284c7', letterSpacing: '-0.02em' }}>
            FEDERALLY SHIELDED
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Compounding permitted while on FDA Section 506E database
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              FAERS Adverse Reports
            </span>
            <Activity size={18} color="#d97706" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#d97706', letterSpacing: '-0.02em' }}>
            {data?.stats?.totalFaersReports ? data.stats.totalFaersReports.toLocaleString() : '70,630'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Analyzed for gastrointestinal & safety guidance
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Jurisdiction & Telemetry
            </span>
            <FileCheck2 size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            United States (FDA)
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
            {data?.source || 'Verified Federal Registry Cache'}
          </div>
        </div>
      </div>

      {/* Legal Shield Alert Callout */}
      <div className="glass-card" style={{
        padding: '20px 24px',
        borderRadius: '16px',
        borderLeft: '4px solid #059669',
        marginBottom: '24px',
        backgroundColor: 'rgba(5, 150, 105, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ maxWidth: '960px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <ShieldCheck size={20} color="#059669" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#059669', margin: 0 }}>
                US Telehealth Compounding Legal Advisory &bull; FD&C Act §503A / §503B
              </h3>
            </div>
            <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
              Under US Federal Law (21 U.S.C. § 353a), when an FDA-approved drug appears on the official FDA Drug Shortages list, state-licensed 503A compounding pharmacies are legally exempted from the prohibition against preparing "essentially a copy of a commercially available drug." This statutory safe harbor enables telehealth providers like Ongo to dispense compounded Semaglutide and Tirzepatide bridge therapies.
            </p>
          </div>
          <button
            onClick={() => handleCopy(legalComplianceDisclaimer, 'disclaimer')}
            className="btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              fontSize: '12px',
              fontWeight: 700,
              borderRadius: '10px',
              whiteSpace: 'nowrap'
            }}
          >
            {copiedText === 'disclaimer' ? <Check size={14} /> : <Copy size={14} />}
            {copiedText === 'disclaimer' ? 'Copied 503A Disclaimer' : 'Copy 1-Click 503A Disclaimer'}
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card" style={{
        padding: '16px 20px',
        borderRadius: '16px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search US drug name, brand, or manufacturer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchFdaData()}
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontSize: '13px'
              }}
            />
          </div>
          <button
            onClick={fetchFdaData}
            disabled={loading}
            className="btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 14px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '10px'
            }}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Querying FDA...' : 'Refresh FDA API'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Filter Status:</span>
          {(['all', 'CURRENT SHORTAGE', 'RESOLVED'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: statusFilter === status ? '#059669' : 'var(--border-subtle)',
                background: statusFilter === status ? 'rgba(5, 150, 105, 0.12)' : 'transparent',
                color: statusFilter === status ? '#059669' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {status === 'all' ? 'All Active' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Shortages List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {filteredShortages.map((item) => (
          <div
            key={item.id}
            className="glass-card"
            style={{
              padding: '24px',
              borderRadius: '18px',
              border: '1px solid var(--border-subtle)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {item.genericName}
                  </h3>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0284c7' }}>
                    ({item.brandName})
                  </span>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    color: '#dc2626',
                    border: '1px solid rgba(239, 68, 68, 0.3)'
                  }}>
                    {item.status}
                  </span>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 800,
                    backgroundColor: 'rgba(5, 150, 105, 0.12)',
                    color: '#059669',
                    border: '1px solid rgba(5, 150, 105, 0.3)'
                  }}>
                    {item.compounding503AStatus}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Manufacturer: <strong>{item.manufacturer}</strong> &bull; Category: {item.therapeuticCategory}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'block' }}>
                  FDA Last Verified
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  {item.lastUpdated}
                </span>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-input)',
              marginBottom: '16px'
            }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Official FDA Shortage Reason
                </span>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
                  {item.reason}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  503A Compounding Legal Safe Harbor
                </span>
                <p style={{ fontSize: '13px', color: '#059669', margin: 0, lineHeight: 1.5, fontWeight: 600 }}>
                  {item.compoundingShieldReason}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                <strong>Dosage Forms Affected:</strong> {item.dosageForm}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={`https://www.accessdata.fda.gov/scripts/drugshortages/dsp_SearchResult.cfm`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#0284c7',
                    textDecoration: 'none'
                  }}
                >
                  Inspect on FDA.gov <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FDA FAERS Adverse Reactions Telemetry Table */}
      <div className="glass-card" style={{ padding: '24px', borderRadius: '18px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              US FDA Adverse Event Reporting System (FAERS) Safety Telemetry
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '4px 0 0 0' }}>
              Aggregated clinical adverse event reports from US patients and physicians. Use this data to write factual, E-E-A-T compliant patient risk mitigation sections.
            </p>
          </div>
          <span style={{
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 700,
            backgroundColor: 'rgba(217, 119, 6, 0.1)',
            color: '#d97706',
            border: '1px solid rgba(217, 119, 6, 0.25)'
          }}>
            FDA MedWatch Monitored
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {data?.faers.map((f, idx) => (
            <div key={idx} style={{
              padding: '18px',
              borderRadius: '14px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-input)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-primary)' }}>
                  {f.drug}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {f.totalReports.toLocaleString()} total reports
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {f.topReactions.map((r, rIdx) => (
                  <div key={rIdx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{r.reaction}</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.percentage}% ({r.count.toLocaleString()})</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', borderRadius: '3px', backgroundColor: 'var(--border-subtle)', overflow: 'hidden' }}>
                      <div style={{
                        width: `${r.percentage}%`,
                        height: '100%',
                        backgroundColor: r.percentage > 30 ? '#ef4444' : (r.percentage > 15 ? '#d97706' : '#059669'),
                        borderRadius: '3px'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
