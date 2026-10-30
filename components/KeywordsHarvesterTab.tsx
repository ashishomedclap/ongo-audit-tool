'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Download,
  Copy,
  Check,
  ExternalLink,
  Layers,
  HelpCircle,
  TrendingUp,
  Tag,
  ArrowRight,
  Filter,
  RefreshCw,
  FileText,
  DollarSign,
  Activity,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import ContextCue from './ContextCue';

interface HarvestedQueryItem {
  id: string;
  query: string;
  questionType: 'how' | 'what' | 'is' | 'can' | 'why' | 'where' | 'who' | 'vs' | 'cost' | 'general';
  silo: string;
  intent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';
  searchDemand: 'Very High' | 'High' | 'Medium' | 'Normal';
  targetOngoUrl: string;
  recommendedTitle: string;
  suggestedH2: string;
}

interface ClusterSummary {
  silo: string;
  count: number;
  percentage: number;
  topQueries: string[];
  primaryIntent: string;
  recommendedTargetUrl: string;
}

export default function KeywordsHarvesterTab() {
  const [seed, setSeed] = useState('compounded semaglutide');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<HarvestedQueryItem[]>([]);
  const [clusters, setClusters] = useState<ClusterSummary[]>([]);
  const [totalHarvested, setTotalHarvested] = useState(0);
  const [sourceNote, setSourceNote] = useState('');
  
  // Filters
  const [selectedSilo, setSelectedSilo] = useState<string>('all');
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>('all');
  const [selectedIntent, setSelectedIntent] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  
  // Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchHarvestedKeywords = async (seedTerm: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/keywords-harvester', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seed: seedTerm })
      });
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
        setClusters(data.clusters || []);
        setTotalHarvested(data.totalHarvested || 0);
        setSourceNote(data.source || 'Google Suggest API');
      }
    } catch (err) {
      console.error('Error fetching harvested queries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHarvestedKeywords(seed);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (seed.trim()) {
      fetchHarvestedKeywords(seed.trim());
    }
  };

  const handleQuickSeed = (newSeed: string) => {
    setSeed(newSeed);
    fetchHarvestedKeywords(newSeed);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCsv = () => {
    const headers = ['Query', 'Question Type', 'Silo', 'Intent', 'Search Demand', 'Target URL', 'Recommended Title', 'Suggested H2'];
    const rows = filteredItems.map(item => [
      `"${item.query.replace(/"/g, '""')}"`,
      `"${item.questionType}"`,
      `"${item.silo}"`,
      `"${item.intent}"`,
      `"${item.searchDemand}"`,
      `"${item.targetOngoUrl}"`,
      `"${item.recommendedTitle.replace(/"/g, '""')}"`,
      `"${item.suggestedH2.replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ongo_google_paa_harvest_${seed.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyAllQuestions = () => {
    const questionsText = filteredItems.map(item => `- ${item.query}`).join('\n');
    handleCopy(questionsText, 'all-questions');
  };

  // Filtered queries
  const filteredItems = items.filter(item => {
    if (selectedSilo !== 'all' && item.silo !== selectedSilo) return false;
    if (selectedQuestionType !== 'all' && item.questionType !== selectedQuestionType) return false;
    if (selectedIntent !== 'all' && item.intent !== selectedIntent) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      return (
        item.query.toLowerCase().includes(q) ||
        item.silo.toLowerCase().includes(q) ||
        item.recommendedTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getQuestionTypeBadge = (type: string) => {
    switch (type) {
      case 'how':
        return { bg: 'rgba(52, 126, 93, 0.12)', text: '#1b4332', border: '#74c69d' };
      case 'what':
        return { bg: 'rgba(8, 145, 178, 0.12)', text: '#0e7490', border: '#67e8f9' };
      case 'is':
      case 'can':
        return { bg: 'rgba(124, 58, 237, 0.12)', text: '#6d28d9', border: '#c4b5fd' };
      case 'vs':
        return { bg: 'rgba(231, 111, 81, 0.12)', text: '#c2410c', border: '#fdba74' };
      case 'cost':
        return { bg: 'rgba(217, 119, 6, 0.12)', text: '#b45309', border: '#fcd34d' };
      default:
        return { bg: 'rgba(100, 116, 139, 0.12)', text: '#334155', border: '#cbd5e1' };
    }
  };

  const getIntentBadge = (intent: string) => {
    switch (intent) {
      case 'Commercial':
        return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
      case 'Transactional':
        return { bg: '#dcfce7', text: '#15803d', border: '#86efac' };
      case 'Informational':
        return { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' };
      default:
        return { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Strategic Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
        borderRadius: '20px',
        padding: '32px 36px',
        color: '#ffffff',
        boxShadow: '0 12px 32px -4px rgba(27, 67, 50, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '260px',
          height: '260px',
          background: 'radial-gradient(circle, rgba(116, 198, 157, 0.25) 0%, rgba(27, 67, 50, 0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '960px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#d8f3dc'
            }}>
              <Sparkles size={13} color="#74c69d" />
              100% Free Live Intelligence Engine
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(231, 111, 81, 0.2)',
              border: '1px solid rgba(231, 111, 81, 0.4)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#ffcbbd'
            }}>
              Zero API Cost ($0 SaaS)
            </span>
          </div>

          <h1 style={{
            fontSize: '1.9rem',
            fontWeight: 800,
            lineHeight: 1.25,
            marginBottom: '10px',
            color: '#ffffff'
          }}>
            Google Autocomplete & People Also Ask (PAA) Harvester
          </h1>

          <p style={{
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.85)',
            marginBottom: '24px'
          }}>
            Queries Google's live Suggest API concurrently across hundreds of question stems (how, why, cost, vs, units, is safe) to extract the exact conversational queries patients type before buying compounded GLP-1s. Automatically groups queries into Ongo's 8 topical silos.
          </p>

          {/* Interactive Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', maxWidth: '780px' }}>
            <div style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '16px',
                  color: 'var(--color-primary-dark)',
                  pointerEvents: 'none'
                }}
              />
              <input
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="Enter any seed keyword (e.g. compounded semaglutide, tirzepatide cost, oral glp 1)..."
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 46px',
                  borderRadius: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  background: '#ffffff',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: '#1b4332',
                  outline: 'none',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 26px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #e76f51 0%, #d95d3f 100%)',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(231, 111, 81, 0.4)',
                transition: 'all 0.15s ease'
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Harvesting...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Harvest Queries
                </>
              )}
            </button>
          </form>

          {/* Quick-Click Presets */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '16px',
            fontSize: '0.78rem'
          }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>Quick Seeds:</span>
            {[
              'compounded semaglutide',
              'compounded tirzepatide',
              'glp-1 cost without insurance',
              'semaglutide dosing units',
              'tirzepatide vs semaglutide',
              'oral semaglutide chewables',
              'semaglutide side effects'
            ].map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => handleQuickSeed(preset)}
                style={{
                  background: seed === preset ? '#ffffff' : 'rgba(255, 255, 255, 0.16)',
                  color: seed === preset ? '#1b4332' : '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  transition: 'all 0.15s ease'
                }}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ContextCue
        level={2}
        toolNumber={7}
        useCase="Harvest real-time Google search suggestions and question trees across 8 GLP-1 seeds."
        title="Topical Cluster Intelligence"
        about="Google Suggest queries reflect raw, unfiltered patient hesitations and decision queries. Mined questions are grouped directly into Ongo's 8 Hub-and-Spoke Silos so you can copy and deploy them as FAQ schema sections, subheadings (H2/H3), or dedicated blog spokes."
      />

      {/* Categorized Question Clusters (Bento Grid) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              Categorized Question Clusters ({clusters.length} Silos Detected)
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Click any cluster card below to isolate that specific silo in the table.
            </p>
          </div>

          {selectedSilo !== 'all' && (
            <button
              onClick={() => setSelectedSilo('all')}
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--color-accent)',
                background: 'var(--color-accent-soft)',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '9999px',
                cursor: 'pointer'
              }}
            >
              Reset Cluster Filter (Show All)
            </button>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '16px'
        }}>
          {clusters.map(cluster => {
            const isSelected = selectedSilo === cluster.silo;
            return (
              <div
                key={cluster.silo}
                onClick={() => setSelectedSilo(isSelected ? 'all' : cluster.silo)}
                style={{
                  background: isSelected ? '#f0fdf4' : 'var(--bg-surface)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 8px 24px rgba(52, 126, 93, 0.15)' : 'var(--shadow-bento)',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={16} color="var(--color-primary)" />
                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-primary-dark)' }}>
                      {cluster.silo}
                    </span>
                  </div>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    background: isSelected ? 'var(--color-primary)' : 'var(--color-primary-soft)',
                    color: isSelected ? '#ffffff' : 'var(--color-primary-dark)',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {cluster.count} queries ({cluster.percentage}%)
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
                  Target: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary-dark)', fontWeight: 600 }}>{cluster.recommendedTargetUrl}</span>
                </div>

                {/* Sample Questions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {cluster.topQueries.slice(0, 2).map((q, idx) => (
                    <div
                      key={idx}
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        background: 'var(--bg-surface-alt)',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={q}
                    >
                      &bull; {q}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Results Table & Tooling Bar */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-bento)',
        padding: '24px'
      }}>
        {/* Table Toolbar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          marginBottom: '20px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              Harvested Questions & Long-Tail Queries
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              Showing {filteredItems.length} of {totalHarvested} queries harvested for "{seed}".
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            {/* Filter by Question Type */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} color="var(--text-tertiary)" />
              <select
                value={selectedQuestionType}
                onChange={(e) => setSelectedQuestionType(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-input)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Question Types</option>
                <option value="how">"How" Questions</option>
                <option value="what">"What" Questions</option>
                <option value="is">"Is / Can" Questions</option>
                <option value="why">"Why" Questions</option>
                <option value="who">"Who" Questions</option>
                <option value="vs">Comparisons ("Vs")</option>
                <option value="cost">Cost & Price</option>
              </select>
            </div>

            {/* Filter by Intent */}
            <select
              value={selectedIntent}
              onChange={(e) => setSelectedIntent(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-input)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Intents</option>
              <option value="Informational">Informational</option>
              <option value="Commercial">Commercial</option>
              <option value="Transactional">Transactional</option>
            </select>

            {/* Search filter in-table */}
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                placeholder="Search queries..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{
                  padding: '6px 12px 6px 30px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-medium)',
                  fontSize: '0.8rem',
                  outline: 'none',
                  width: '180px'
                }}
              />
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleCopyAllQuestions}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-surface-alt)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {copiedId === 'all-questions' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              {copiedId === 'all-questions' ? 'Copied All!' : 'Copy All Questions'}
            </button>

            <button
              onClick={handleExportCsv}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--color-primary)',
                background: 'var(--color-primary-soft)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--color-primary-dark)',
                cursor: 'pointer'
              }}
            >
              <Download size={14} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Results Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{
                borderBottom: '2px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface-alt)',
                color: 'var(--text-secondary)'
              }}>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Stem / Type</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Harvested Search Query</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Topical Silo</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Intent</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Target Ongo Page</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Recommended Article Title</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    {loading ? 'Harvesting live queries from Google Suggest...' : 'No queries matched your search filter.'}
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const typeBadge = getQuestionTypeBadge(item.questionType);
                  const intentBadge = getIntentBadge(item.intent);
                  const isCopied = copiedId === item.id;

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Question Type */}
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: typeBadge.bg,
                          color: typeBadge.text,
                          border: `1px solid ${typeBadge.border}`,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}>
                          {item.questionType}
                        </span>
                      </td>

                      {/* Query */}
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.query}
                      </td>

                      {/* Silo */}
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-primary-dark)',
                          fontWeight: 600,
                          background: 'rgba(52, 126, 93, 0.08)',
                          padding: '3px 8px',
                          borderRadius: '6px'
                        }}>
                          {item.silo}
                        </span>
                      </td>

                      {/* Intent */}
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: intentBadge.bg,
                          color: intentBadge.text,
                          border: `1px solid ${intentBadge.border}`
                        }}>
                          {item.intent}
                        </span>
                      </td>

                      {/* Target Page */}
                      <td style={{ padding: '12px 14px' }}>
                        <a
                          href={`https://ongoweightloss.com${item.targetOngoUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            color: 'var(--color-primary)',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {item.targetOngoUrl}
                          <ExternalLink size={11} />
                        </a>
                      </td>

                      {/* Recommended Title */}
                      <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '320px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                          {item.recommendedTitle}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                          H2: {item.suggestedH2}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => handleCopy(item.query, item.id)}
                            style={{
                              padding: '5px 8px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-medium)',
                              background: isCopied ? '#dcfce7' : 'var(--bg-surface)',
                              color: isCopied ? '#15803d' : 'var(--text-secondary)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 600
                            }}
                            title="Copy Query"
                          >
                            {isCopied ? <Check size={12} /> : <Copy size={12} />}
                            {isCopied ? 'Copied' : 'Copy'}
                          </button>

                          <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(item.query)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '5px 8px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-medium)',
                              background: 'var(--bg-surface-alt)',
                              color: 'var(--text-secondary)',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                            title="Verify on Google Search"
                          >
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
