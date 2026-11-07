'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Copy,
  Check,
  ExternalLink,
  Award,
  FileCheck2,
  Sparkles,
  Download,
  Filter,
  CheckCircle2,
  Stethoscope,
  Bookmark,
  Code2,
  RefreshCw
} from 'lucide-react';
import ContextCue from './ContextCue';
import { ClinicalStudy } from '@/app/api/clinical-citations/route';

export default function ClinicalCitationsTab() {
  const [studies, setStudies] = useState<ClinicalStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<'AMA' | 'APA' | 'NLM'>('AMA');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [schemaModalStudy, setSchemaModalStudy] = useState<ClinicalStudy | null>(null);

  const fetchStudies = async (q = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/clinical-citations${q ? `?q=${encodeURIComponent(q)}` : ''}`);
      const json = await res.json();
      if (json.success && json.studies) {
        setStudies(json.studies);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudies();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateSchemaJsonLd = (study: ClinicalStudy) => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ScholarlyArticle",
      "name": study.title,
      "headline": study.title,
      "author": {
        "@type": "Person",
        "name": study.authors.split(',')[0]
      },
      "publisher": {
        "@type": "Organization",
        "name": study.journal
      },
      "datePublished": study.pubYear,
      "sameAs": study.pubmedUrl,
      "identifier": {
        "@type": "PropertyValue",
        "propertyID": "PMID",
        "value": study.pmid
      }
    }, null, 2);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 8px' }}>
      {/* Context Cue Banner */}
      <ContextCue
        title="US PubMed & NLM Clinical Citation Generator"
        level={2}
        toolNumber={23}
        badge="National Library of Medicine (NLM)"
        useCase="Provides 1-click clinical citations from 36M+ peer-reviewed US medical publications (NEJM, JAMA, Lancet) to substantiate telehealth weight loss claims and satisfy Google YMYL E-E-A-T standards."
      />

      {/* Top Header Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
        margin: '24px 0'
      }}>
        <div className="glass-card" style={{ padding: '20px 24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Federal Database
            </span>
            <BookOpen size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#0284c7', letterSpacing: '-0.02em' }}>
            NLM / PubMed (NIH)
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            36M+ US Biomedical & Clinical Records
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Indexed Landmark Trials
            </span>
            <Award size={18} color="#059669" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#059669', letterSpacing: '-0.02em' }}>
            STEP, SURMOUNT, SELECT
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Pre-formatted for 1-click writer insertion
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Citation Standards
            </span>
            <FileCheck2 size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#8b5cf6', letterSpacing: '-0.02em' }}>
            AMA, APA & NLM
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Includes Schema.org ScholarlyArticle JSON-LD
          </div>
        </div>
      </div>

      {/* Search & Formatting Bar */}
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
              placeholder="Search clinical trial, author, drug, or PubMed term..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchStudies(searchQuery)}
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
            onClick={() => fetchStudies(searchQuery)}
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
            {loading ? 'Searching PubMed...' : 'Search'}
          </button>
        </div>

        {/* Citation Format Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Citation Style:</span>
          {(['AMA', 'APA', 'NLM'] as const).map(fmt => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: selectedFormat === fmt ? '#0284c7' : 'var(--border-subtle)',
                background: selectedFormat === fmt ? 'rgba(2, 132, 199, 0.12)' : 'transparent',
                color: selectedFormat === fmt ? '#0284c7' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Studies Directory */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
        {studies.map(study => {
          const currentCitation = selectedFormat === 'AMA' 
            ? study.amaCitation 
            : (selectedFormat === 'APA' ? study.apaCitation : study.nlmcitation);

          return (
            <div
              key={study.id}
              className="glass-card"
              style={{
                padding: '24px',
                borderRadius: '18px',
                border: '1px solid var(--border-subtle)',
                transition: 'transform 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', marginBottom: '12px' }}>
                <div style={{ maxWidth: '980px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 800,
                      backgroundColor: 'rgba(2, 132, 199, 0.1)',
                      color: '#0284c7'
                    }}>
                      {study.studyType}
                    </span>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-secondary)'
                    }}>
                      PMID: {study.pmid}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)' }}>
                      {study.journal} ({study.pubYear})
                    </span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                    {study.title}
                  </h3>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Authors: {study.authors}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setSchemaModalStudy(study)}
                    className="btn-secondary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      borderRadius: '8px'
                    }}
                  >
                    <Code2 size={13} />
                    Schema.org
                  </button>
                  <a
                    href={study.pubmedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      borderRadius: '8px',
                      textDecoration: 'none'
                    }}
                  >
                    PubMed <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* Clinical Outcomes Callout */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '12px',
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-input)',
                marginBottom: '16px'
              }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                    Sample Size & Cohort
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>
                    {study.sampleSize}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                    Clinical Efficacy Metric
                  </span>
                  <span style={{ fontSize: '13px', color: '#059669', fontWeight: 700 }}>
                    {study.meanWeightLossPercentage}
                  </span>
                </div>
              </div>

              {/* Copyable Citation Box */}
              <div style={{
                padding: '14px 16px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'rgba(2, 132, 199, 0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono, monospace)', lineHeight: 1.5 }}>
                  {currentCitation}
                </div>
                <button
                  onClick={() => handleCopy(currentCitation, study.id)}
                  className="btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {copiedId === study.id ? <Check size={13} /> : <Copy size={13} />}
                  {copiedId === study.id ? `Copied ${selectedFormat}` : `Copy ${selectedFormat}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schema.org Modal */}
      {schemaModalStudy && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div className="glass-card" style={{
            maxWidth: '720px',
            width: '100%',
            padding: '28px',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code2 size={20} color="#0284c7" />
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  ScholarlyArticle JSON-LD Schema Snippet
                </h3>
              </div>
              <button
                onClick={() => setSchemaModalStudy(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                &times;
              </button>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Paste this JSON-LD block inside the HTML <code>&lt;head&gt;</code> of your Ongo weight loss guide to explicitly inform Google and AI crawlers of your clinical source citations:
            </p>

            <pre style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: '#0a0f12',
              color: '#38bdf8',
              fontSize: '12px',
              fontFamily: 'monospace',
              overflowX: 'auto',
              maxHeight: '320px',
              marginBottom: '18px'
            }}>
              {generateSchemaJsonLd(schemaModalStudy)}
            </pre>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setSchemaModalStudy(null)}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '8px' }}
              >
                Close
              </button>
              <button
                onClick={() => handleCopy(generateSchemaJsonLd(schemaModalStudy), 'schema-modal')}
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '12px', borderRadius: '8px' }}
              >
                {copiedId === 'schema-modal' ? <Check size={14} /> : <Copy size={14} />}
                {copiedId === 'schema-modal' ? 'Copied JSON-LD' : 'Copy JSON-LD'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
