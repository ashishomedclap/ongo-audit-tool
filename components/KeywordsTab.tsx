'use client';

import React, { useState } from 'react';
import { 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CompetitorSummary } from '@/lib/data';

interface KeywordsTabProps {
  competitors: CompetitorSummary[];
  onInspectCompetitor: (folder: string) => void;
}

export default function KeywordsTab({ competitors, onInspectCompetitor }: KeywordsTabProps) {
  const [searchTerm, setSearchTerm] = useState('tirzepatide');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    query?: string;
    totalCompetitorsMatched?: number;
    totalMatchingUrls?: number;
    results?: {
      competitorName: string;
      domain: string;
      rank: number;
      folder: string;
      matchCount: number;
      sampleUrls: string[];
    }[];
  } | null>(null);

  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const presetClusters = [
    { label: 'Semaglutide Vials', term: 'semaglutide' },
    { label: 'Tirzepatide Dual GIP', term: 'tirzepatide' },
    { label: 'Compounded GLP-1', term: 'compounded' },
    { label: 'Oral & Sublingual', term: 'oral' },
    { label: 'Pricing & Cost', term: 'pricing' },
    { label: 'Ozempic & Wegovy', term: 'ozempic' },
    { label: 'Mounjaro & Zepbound', term: 'mounjaro' },
    { label: 'Side Effects & Nausea', term: 'side-effects' },
    { label: 'Dosing & Titration', term: 'dosing' },
    { label: 'Doctor & Clinical Team', term: 'doctor' },
    { label: 'BMI & Eligibility', term: 'eligibility' },
    { label: 'Texas / State Telehealth', term: 'texas' },
  ];

  const handleSearch = async (termToSearch: string) => {
    if (!termToSearch.trim()) return;
    setLoading(true);
    setSearchTerm(termToSearch);

    try {
      const res = await fetch(`/api/keyword-search?q=${encodeURIComponent(termToSearch.trim())}`);
      const data = await res.json();
      if (data.success) {
        setSearchResults(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Search Bento Header */}
      <div className="bento-card" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '14px' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            GLP-1 Keyword Intelligence & URL Scanner
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
            Scan 35,000+ crawled URLs to identify search volume clusters and high-converting keyword gaps
          </p>
        </div>

        {/* Minimal input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchTerm);
          }}
          style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search keyword (e.g. tirzepatide, pricing, oral, nausea, bmi)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-minimal"
              style={{ paddingLeft: '34px' }}
            />
          </div>
          <button type="submit" className="btn-minimal-primary" disabled={loading} style={{ minWidth: '120px' }}>
            {loading ? 'Scanning...' : 'Scan 35k URLs'}
          </button>
        </form>

        {/* Minimal Preset Cluster Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Intent Clusters:</span>
          {presetClusters.map((cluster) => (
            <button
              key={cluster.term}
              type="button"
              onClick={() => handleSearch(cluster.term)}
              style={{
                fontSize: '0.72rem',
                padding: '3px 8px',
                borderRadius: '5px',
                border: '1px solid var(--border-subtle)',
                background: searchTerm === cluster.term ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                color: searchTerm === cluster.term ? '#fafafa' : 'var(--text-tertiary)',
                cursor: 'pointer'
              }}
            >
              {cluster.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {searchResults && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Summary bar */}
          <div className="bento-card" style={{
            padding: '14px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>Keyword:</span>{' '}
              <strong style={{ color: 'var(--text-primary)' }}>&ldquo;{searchResults.query}&rdquo;</strong>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge-minimal badge-minimal-neutral">
                {searchResults.totalMatchingUrls?.toLocaleString()} Matching Pages
              </span>
              <span className="badge-minimal">
                {searchResults.totalCompetitorsMatched} Competitors
              </span>
            </div>
          </div>

          {/* Competitor Matches Grid */}
          {searchResults.results && searchResults.results.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {searchResults.results.map((comp) => (
                <div key={comp.domain} className="bento-card" style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                        #{comp.rank}
                      </span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                        {comp.competitorName}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                        {comp.domain}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="badge-minimal">
                        {comp.matchCount} pages
                      </span>
                      <button
                        onClick={() => onInspectCompetitor(comp.folder)}
                        className="btn-minimal-secondary"
                        style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                      >
                        Inspect
                      </button>
                    </div>
                  </div>

                  {/* Sample URLs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {comp.sampleUrls.map((url, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 10px',
                          background: 'var(--bg-canvas)',
                          borderRadius: '5px',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.75rem'
                        }}
                      >
                        <span style={{
                          color: 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono)',
                          wordBreak: 'break-all'
                        }}>
                          {url}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, marginLeft: '10px' }}>
                          <button
                            onClick={() => handleCopy(url)}
                            title="Copy URL"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: copiedUrl === url ? '#34d399' : 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '2px'
                            }}
                          >
                            {copiedUrl === url ? <Check size={11} /> : <Copy size={11} />}
                          </button>
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color: 'var(--text-tertiary)',
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bento-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No competitor URLs found for &ldquo;{searchResults.query}&rdquo;.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
