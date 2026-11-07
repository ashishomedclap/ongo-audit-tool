'use client';

import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Search,
  ExternalLink,
  Calendar,
  MapPin,
  Users,
  Award,
  Zap,
  Clock,
  Sparkles,
  RefreshCw,
  Building2,
  CheckCircle2,
  Activity,
  ArrowRight
} from 'lucide-react';
import ContextCue from './ContextCue';
import { ClinicalTrialRecord } from '@/app/api/clinical-trials/route';

export default function ClinicalTrialsTab() {
  const [trials, setTrials] = useState<ClinicalTrialRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<'all' | 'Phase 3' | 'Phase 2'>('all');

  const fetchTrials = async (q = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/clinical-trials${q ? `?q=${encodeURIComponent(q)}` : ''}`);
      const json = await res.json();
      if (json.success && json.trials) {
        setTrials(json.trials);
        setStats(json.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrials();
  }, []);

  const filteredTrials = trials.filter(t => {
    const matchesSearch = t.drugMolecule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.sponsor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.briefTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.mechanismOfAction.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPhase = phaseFilter === 'all' || t.phase === phaseFilter;
    return matchesSearch && matchesPhase;
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 8px' }}>
      {/* Context Cue Banner */}
      <ContextCue
        title="NIH ClinicalTrials.gov Next-Gen Obesity Pipeline Radar"
        level={2}
        toolNumber={25}
        badge="Federal Registry REST API v2"
        useCase="Surveys US FDA Phase 2 and 3 clinical trials for next-generation obesity molecules (Retatrutide, CagriSema, Orforglipron, MariTide) to establish early topical authority 12 months ahead of commercial release."
      />

      {/* Top Stat Matrix */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
        margin: '24px 0'
      }}>
        <div className="glass-card" style={{ padding: '20px 24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              US Federal Registry
            </span>
            <FlaskConical size={18} color="#0d9488" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#0d9488', letterSpacing: '-0.02em' }}>
            ClinicalTrials.gov
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {stats?.liveFederalRegistryCount || 142} Active US Weight Loss Trials
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Monitored Next-Gen Molecules
            </span>
            <Zap size={18} color="#059669" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#059669', letterSpacing: '-0.02em' }}>
            Retatrutide, CagriSema, Orforglipron
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Triple-agonists & once-daily oral pills
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Active US Clinical Sites
            </span>
            <MapPin size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#8b5cf6', letterSpacing: '-0.02em' }}>
            {stats?.totalUSClinicalSites || 314} Study Sites
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Spanning TX, CA, FL, NY, PA & IL
          </div>
        </div>
      </div>

      {/* Strategic Telehealth SEO Alert */}
      <div className="glass-card" style={{
        padding: '20px 24px',
        borderRadius: '16px',
        borderLeft: '4px solid #0d9488',
        marginBottom: '24px',
        backgroundColor: 'rgba(13, 148, 136, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Sparkles size={18} color="#0d9488" />
          <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0d9488', margin: 0 }}>
            Early Topical Authority & SEO Demand Capture Window
          </h4>
        </div>
        <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
          Patient search queries for "Retatrutide results", "CagriSema vs Tirzepatide", and "daily GLP-1 weight loss pill" are rising rapidly in Google US search trends. Publishing comprehensive, doctor-reviewed clinical trial explainers now establishes Page 1 Google rankings and deep topical authority before commercial FDA approval dates.
        </p>
      </div>

      {/* Search & Filter Controls */}
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
              placeholder="Search drug molecule, sponsor (Lilly, Novo), or trial title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchTrials(searchQuery)}
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
            onClick={() => fetchTrials(searchQuery)}
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
            {loading ? 'Searching...' : 'Refresh Trials'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Filter Phase:</span>
          {(['all', 'Phase 3', 'Phase 2'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPhaseFilter(p)}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: phaseFilter === p ? '#0d9488' : 'var(--border-subtle)',
                background: phaseFilter === p ? 'rgba(13, 148, 136, 0.12)' : 'transparent',
                color: phaseFilter === p ? '#0d9488' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {p === 'all' ? 'All Phases' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Trials Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
        {filteredTrials.map(trial => (
          <div
            key={trial.nctId}
            className="glass-card"
            style={{
              padding: '24px',
              borderRadius: '18px',
              border: '1px solid var(--border-subtle)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {trial.drugMolecule}
                  </h3>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 800,
                    backgroundColor: 'rgba(13, 148, 136, 0.12)',
                    color: '#0d9488',
                    border: '1px solid rgba(13, 148, 136, 0.3)'
                  }}>
                    {trial.phase}
                  </span>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    color: '#166534'
                  }}>
                    {trial.overallStatus}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)' }}>
                    {trial.nctId}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Sponsor: <strong>{trial.sponsor}</strong> &bull; Mechanism: {trial.mechanismOfAction}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'block' }}>
                  Primary Completion Target
                </span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {trial.primaryCompletionDate}
                </span>
              </div>
            </div>

            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', lineHeight: 1.4 }}>
              {trial.briefTitle}
            </div>

            {/* Trial Parameters Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '14px',
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-input)',
              marginBottom: '16px'
            }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                  Target Patient Enrollment
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 700 }}>
                  {trial.targetEnrollment.toLocaleString()} participants
                </span>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                  US Study Sites & States
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {trial.usLocationsCount} sites across {trial.usStates.join(', ')}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0d9488', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                  Commercial Impact Timeline
                </span>
                <span style={{ fontSize: '13px', color: '#0d9488', fontWeight: 700 }}>
                  {trial.commercialImpactTimeline}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '840px' }}>
                <strong>Primary Endpoint:</strong> {trial.primaryOutcomeMeasure}
              </div>
              <a
                href={trial.studyUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  textDecoration: 'none'
                }}
              >
                View Protocol on ClinicalTrials.gov <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
