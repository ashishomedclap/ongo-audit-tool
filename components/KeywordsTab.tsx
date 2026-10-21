'use client';

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles,
  Download,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Layers,
  Globe,
  Tag,
  TrendingUp,
  Zap,
  Target,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Pill,
  Award,
  BarChart2
} from 'lucide-react';
import { CompetitorSummary, KeywordExplorerItem } from '@/lib/data';
import ContextCue from './ContextCue';

interface KeywordsTabProps {
  competitors: CompetitorSummary[];
  onInspectCompetitor: (folder: string) => void;
}

type ExplorerSortField = 'opportunity' | 'volume' | 'kd' | 'traffic' | 'position' | 'keyword';
type SortOrder = 'asc' | 'desc';

export default function KeywordsTab({ competitors, onInspectCompetitor }: KeywordsTabProps) {
  // Main Tab Mode: 'explorer' (Google Sheet 54.8k Keywords) vs 'sitemap' (URL Slug Crawler)
  const [activeMode, setActiveMode] = useState<'explorer' | 'sitemap'>('explorer');

  // EXPLORER STATE
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompetitor, setSelectedCompetitor] = useState('all');
  const [selectedIntent, setSelectedIntent] = useState('all');
  const [maxKd, setMaxKd] = useState<number | null>(null);
  const [minVolume, setMinVolume] = useState<number | null>(null);
  const [sortField, setSortField] = useState<ExplorerSortField>('opportunity');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [explorerData, setExplorerData] = useState<{
    totalAvailable: number;
    totalResults: number;
    page: number;
    totalPages: number;
    metrics: {
      totalVolume: number;
      totalTraffic: number;
      avgKd: number;
      competitorCounts: Record<string, number>;
      intentCounts: Record<string, number>;
      topOpportunity: KeywordExplorerItem | null;
    };
    items: KeywordExplorerItem[];
  } | null>(null);

  // SITEMAP URL CRAWLER STATE
  const [sitemapQuery, setSitemapQuery] = useState('tirzepatide');
  const [sitemapLoading, setSitemapLoading] = useState(false);
  const [sitemapResults, setSitemapResults] = useState<{
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

  const [copiedText, setCopiedText] = useState<string | null>(null);

  const competitorOptions = [
    { id: 'all', label: 'All Competitors' },
    { id: 'GoodRx', label: 'GoodRx' },
    { id: 'Ro', label: 'Ro' },
    { id: 'WeightWatchers', label: 'WeightWatchers' },
    { id: 'Noom', label: 'Noom' },
    { id: 'PlushCare', label: 'PlushCare' },
    { id: 'Hims', label: 'Hims' },
    { id: 'Lemonaid Health', label: 'Lemonaid Health' },
    { id: 'LifeMD', label: 'LifeMD' },
    { id: 'Join Mochi', label: 'Join Mochi' },
    { id: 'Brello Health', label: 'Brello Health' },
    { id: 'Join Fridays', label: 'Join Fridays' }
  ];

  const intentOptions = [
    { id: 'all', label: 'All Intents' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'informational', label: 'Informational' },
    { id: 'transactional', label: 'Transactional' },
    { id: 'navigational', label: 'Navigational' }
  ];

  const kdOptions = [
    { label: 'Any KD', value: null },
    { label: 'Easy (≤ 25)', value: 25 },
    { label: 'Moderate (≤ 40)', value: 40 },
    { label: 'Hard (≤ 60)', value: 60 }
  ];

  const volumeOptions = [
    { label: 'Any Vol', value: null },
    { label: '100+', value: 100 },
    { label: '500+', value: 500 },
    { label: '1,000+', value: 1000 },
    { label: '10,000+', value: 10000 },
    { label: '50,000+', value: 50000 }
  ];

  // Fetch Explorer Data
  const fetchExplorerData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('mode', 'explorer');
      if (searchTerm.trim()) params.set('q', searchTerm.trim());
      if (selectedCompetitor !== 'all') params.set('competitor', selectedCompetitor);
      if (selectedIntent !== 'all') params.set('intent', selectedIntent);
      if (maxKd !== null) params.set('maxKd', maxKd.toString());
      if (minVolume !== null) params.set('minVolume', minVolume.toString());
      params.set('sort', sortField);
      params.set('order', sortOrder);
      params.set('page', page.toString());
      params.set('limit', pageSize.toString());

      const res = await fetch(`/api/keyword-search?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setExplorerData(data);
      }
    } catch (err) {
      console.error('Failed to fetch keyword explorer data:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCompetitor, selectedIntent, maxKd, minVolume, sortField, sortOrder, page, pageSize]);

  // Initial load & when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExplorerData();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchExplorerData]);

  // Handle Sitemap Crawler Search
  const handleSitemapSearch = async (termToSearch: string) => {
    if (!termToSearch.trim()) return;
    setSitemapLoading(true);
    setSitemapQuery(termToSearch);

    try {
      const res = await fetch(`/api/keyword-search?mode=sitemap&q=${encodeURIComponent(termToSearch.trim())}`);
      const data = await res.json();
      if (data.success) {
        setSitemapResults(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSitemapLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSort = (field: ExplorerSortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  // 1-Click Strategy Presets
  const applyPreset = (preset: {
    term?: string;
    competitor?: string;
    intent?: string;
    maxKd?: number | null;
    minVolume?: number | null;
    sort?: ExplorerSortField;
  }) => {
    setSearchTerm(preset.term || '');
    setSelectedCompetitor(preset.competitor || 'all');
    setSelectedIntent(preset.intent || 'all');
    setMaxKd(preset.maxKd !== undefined ? preset.maxKd : null);
    setMinVolume(preset.minVolume !== undefined ? preset.minVolume : null);
    if (preset.sort) setSortField(preset.sort);
    setPage(1);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCompetitor('all');
    setSelectedIntent('all');
    setMaxKd(null);
    setMinVolume(null);
    setSortField('opportunity');
    setSortOrder('desc');
    setPage(1);
  };

  // Export current results to CSV
  const handleExportCsv = () => {
    if (!explorerData || !explorerData.items) return;

    const headers = ['S No', 'Keyword', 'URL', 'Competitor', 'Position', 'Volume', 'KD', 'Traffic', 'Intent', 'Weighted Opportunity Score'];
    const rows = explorerData.items.map(it => [
      it.id,
      `"${it.keyword.replace(/"/g, '""')}"`,
      `"${it.url.replace(/"/g, '""')}"`,
      `"${it.competitor}"`,
      it.position,
      it.volume,
      it.kd,
      it.traffic,
      `"${it.intent}"`,
      it.opportunityScore
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ongo_keywords_export_${selectedCompetitor}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Intent badge styling
  const getIntentBadgeStyle = (intent: string) => {
    const l = intent.toLowerCase();
    if (l.includes('commercial')) {
      return { bg: 'rgba(52, 126, 93, 0.12)', color: '#2d6a4f', border: '#74c69d' };
    }
    if (l.includes('transactional')) {
      return { bg: 'rgba(231, 111, 81, 0.12)', color: '#c85a3c', border: '#f4a261' };
    }
    if (l.includes('navigational')) {
      return { bg: 'rgba(244, 162, 97, 0.15)', color: '#b26a27', border: '#f4a261' };
    }
    return { bg: 'rgba(67, 97, 238, 0.1)', color: '#3f37c9', border: '#b5c0fe' };
  };

  // KD color
  const getKdBadgeStyle = (kd: number) => {
    if (kd <= 25) return { bg: '#e9f7ee', color: '#1b4332', text: 'Easy' };
    if (kd <= 40) return { bg: '#fff8e7', color: '#855800', text: 'Moderate' };
    if (kd <= 60) return { bg: '#fff0eb', color: '#bc4749', text: 'Hard' };
    return { bg: '#fde8e8', color: '#9b1c1c', text: 'Very Hard' };
  };

  // Position rank styling
  const getPositionBadge = (pos: number) => {
    if (pos <= 3) {
      return { bg: '#fef3c7', color: '#92400e', label: `#${pos} Top 3` };
    }
    if (pos <= 10) {
      return { bg: '#e0e7ff', color: '#3730a3', label: `#${pos} Page 1` };
    }
    return { bg: 'var(--bg-canvas)', color: 'var(--text-secondary)', label: `#${pos}` };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Page Guide Header */}
      <ContextCue
        badge="Keyword Explorer"
        title="54,000+ Keyword Intelligence & Opportunity Radar"
        about="This page is a live Keyword Explorer powered by real organic keyword datasets extracted from 11 top telehealth weight loss competitors (GoodRx, Ro, WeightWatchers, Hims, Noom, PlushCare, Join Mochi, LifeMD, Lemonaid Health, Join Fridays, and Brello Health). It indexes 54,841 keywords with verified monthly search volume, keyword difficulty (KD), Google rankings, search intent, and weighted opportunity scores to pinpoint high-ROI patient acquisition targets for Ongo Weight Loss."
        whatYouCanDo={[
          {
            action: "Filter by 11 Telehealth Competitors",
            description: "Segment keywords by GoodRx (16.7k), Ro (9.5k), WeightWatchers (8.5k), Noom (5.6k), PlushCare (4.8k), Hims (4.5k), Mochi, and more."
          },
          {
            action: "Target by Search Intent",
            description: "Filter by Commercial (ready to buy), Transactional (telehealth checkout), Informational (symptom & dosing), or Navigational."
          },
          {
            action: "Find Low-Competition Keywords (KD ≤ 25/40)",
            description: "Filter by Maximum KD to discover low-hanging fruit where Ongo can quickly outrank competitors on Google."
          },
          {
            action: "Filter by Minimum Monthly Search Volume",
            description: "Isolate high-impact search queries with 500+, 1,000+, 10,000+, or 50,000+ monthly searches."
          },
          {
            action: "1-Click Strategy Presets",
            description: "Click shortcut pills (GLP-1 Quick Wins, Semaglutide, Tirzepatide, Commercial Intent, Dosing & Side Effects) for instant filtering."
          },
          {
            action: "Export to CSV & Copy Keywords",
            description: "Click 'Export Filtered CSV' to download complete research data, or copy individual keywords and ranking landing page URLs."
          },
          {
            action: "Switch to URL Crawler Mode",
            description: "Toggle to 'Competitor URL Crawler' to inspect the raw 35,420 XML sitemap URL slugs across all 100 clinics."
          }
        ]}
        tip="Sort by 'Opportunity Score' (descending) with KD ≤ 35 to surface the absolute best commercial keywords Ongo should target first."
      />

      {/* Dual Mode Switcher Banner */}
      <div className="bento-card" style={{
        padding: '16px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        background: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            background: 'var(--bg-canvas)',
            padding: '3px',
            borderRadius: '9999px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setActiveMode('explorer')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: activeMode === 'explorer' ? 700 : 500,
                border: 'none',
                cursor: 'pointer',
                background: activeMode === 'explorer' ? 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)' : 'transparent',
                color: activeMode === 'explorer' ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: activeMode === 'explorer' ? '0 2px 8px rgba(27, 67, 50, 0.25)' : 'none',
                transition: 'all 0.18s ease'
              }}
            >
              <Sparkles size={14} color={activeMode === 'explorer' ? '#ffffff' : '#347e5d'} />
              <span>Keyword Explorer (54,841 Keywords)</span>
            </button>

            <button
              onClick={() => {
                setActiveMode('sitemap');
                if (!sitemapResults) handleSitemapSearch('tirzepatide');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: activeMode === 'sitemap' ? 700 : 500,
                border: 'none',
                cursor: 'pointer',
                background: activeMode === 'sitemap' ? 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)' : 'transparent',
                color: activeMode === 'sitemap' ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: activeMode === 'sitemap' ? '0 2px 8px rgba(27, 67, 50, 0.25)' : 'none',
                transition: 'all 0.18s ease'
              }}
            >
              <Globe size={14} color={activeMode === 'sitemap' ? '#ffffff' : '#347e5d'} />
              <span>Competitor URL Crawler (35,420 URLs)</span>
            </button>
          </div>
        </div>

        {/* Action Button: Export CSV */}
        {activeMode === 'explorer' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleExportCsv}
              disabled={!explorerData || explorerData.items.length === 0}
              className="btn-minimal-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.78rem',
                padding: '6px 14px',
                borderRadius: '9999px'
              }}
              title="Download current filtered table as CSV"
            >
              <Download size={14} />
              <span>Export Filtered CSV</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: KEYWORD EXPLORER (GOOGLE SHEET DATASET)                            */}
      {/* ========================================================================= */}
      {activeMode === 'explorer' && (
        <>
          {/* Top Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '12px'
          }}>
            {/* Card 1: Total Keywords */}
            <div className="bento-card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Matching Keywords
                </span>
                <Tag size={15} color="var(--color-primary)" />
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                {explorerData ? explorerData.totalResults.toLocaleString() : '...'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                of {explorerData ? explorerData.totalAvailable.toLocaleString() : '54,841'} total in database
              </div>
            </div>

            {/* Card 2: Total Search Volume */}
            <div className="bento-card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Search Volume
                </span>
                <TrendingUp size={15} color="var(--color-accent)" />
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-accent)' }}>
                {explorerData && explorerData.metrics ? (explorerData.metrics.totalVolume >= 1000000 ? `${(explorerData.metrics.totalVolume / 1000000).toFixed(1)}M/mo` : `${(explorerData.metrics.totalVolume / 1000).toFixed(0)}k/mo`) : '...'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Cumulative monthly Google searches
              </div>
            </div>

            {/* Card 3: Average KD */}
            <div className="bento-card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Average KD Difficulty
                </span>
                <Target size={15} color="#347e5d" />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                  {explorerData && explorerData.metrics ? `${explorerData.metrics.avgKd}/100` : '...'}
                </span>
                {explorerData && (
                  <span className="badge-minimal" style={{
                    ...getKdBadgeStyle(explorerData.metrics.avgKd),
                    fontSize: '0.66rem',
                    padding: '1px 6px'
                  }}>
                    {getKdBadgeStyle(explorerData.metrics.avgKd).text}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Lower KD indicates faster organic rank
              </div>
            </div>

            {/* Card 4: Organic Traffic */}
            <div className="bento-card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Estimated Traffic
                </span>
                <Zap size={15} color="#e76f51" />
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                {explorerData && explorerData.metrics ? (explorerData.metrics.totalTraffic >= 1000000 ? `${(explorerData.metrics.totalTraffic / 1000000).toFixed(1)}M/mo` : `${(explorerData.metrics.totalTraffic / 1000).toFixed(0)}k/mo`) : '...'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Monthly clicks captured by competitors
              </div>
            </div>

            {/* Card 5: Top Opportunity Pick */}
            <div className="bento-card" style={{ padding: '16px 20px', borderLeft: '3px solid var(--color-accent)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Top Opportunity Pick
                </span>
                <Award size={15} color="var(--color-accent)" />
              </div>
              <div style={{
                fontSize: '0.92rem',
                fontWeight: 800,
                color: 'var(--color-primary-dark)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }} title={explorerData?.metrics?.topOpportunity?.keyword}>
                {explorerData?.metrics?.topOpportunity?.keyword || 'None'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Score: <strong>{explorerData?.metrics?.topOpportunity?.opportunityScore?.toLocaleString() || 0}</strong> • {explorerData?.metrics?.topOpportunity?.competitor}
              </div>
            </div>
          </div>

          {/* Search & Multi-Filter Bento Box */}
          <div className="bento-card" style={{ padding: '22px' }}>
            
            {/* Main Search Input */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} color="var(--color-primary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search 54k keywords (e.g. semaglutide, tirzepatide, pricing, weight loss, nausea, dosing, telehealth)..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="input-minimal"
                  style={{
                    paddingLeft: '40px',
                    borderRadius: '9999px',
                    fontSize: '0.86rem',
                    height: '42px'
                  }}
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setPage(1);
                    }}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>

              <button
                onClick={resetFilters}
                style={{
                  background: 'var(--bg-canvas)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '9999px',
                  padding: '0 16px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--color-primary-dark)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Reset all filters to default"
              >
                <RefreshCw size={13} />
                <span>Reset</span>
              </button>
            </div>

            {/* Strategy Preset Chips (1-Click Shortcuts) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexWrap: 'wrap',
              marginBottom: '16px',
              paddingBottom: '14px',
              borderBottom: '1px solid var(--border-subtle)'
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '4px' }}>
                Strategy Presets:
              </span>
              
              <button
                onClick={() => applyPreset({ term: 'tirzepatide', maxKd: 40, minVolume: 500, sort: 'opportunity' })}
                className="badge-minimal"
                style={{
                  cursor: 'pointer',
                  background: 'linear-gradient(to right, #e9f7ee, #ffffff)',
                  border: '1px solid #74c69d',
                  color: '#1b4332',
                  padding: '4px 10px',
                  fontSize: '0.73rem',
                  fontWeight: 600
                }}
              >
                ⚡ GLP-1 Quick Wins (KD ≤ 40, Vol ≥ 500)
              </button>

              <button
                onClick={() => applyPreset({ term: 'semaglutide', sort: 'volume' })}
                className="badge-minimal"
                style={{
                  cursor: 'pointer',
                  background: '#fcfaf6',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--color-primary-dark)',
                  padding: '4px 10px',
                  fontSize: '0.73rem'
                }}
              >
                💉 Semaglutide Keywords
              </button>

              <button
                onClick={() => applyPreset({ term: 'tirzepatide', sort: 'volume' })}
                className="badge-minimal"
                style={{
                  cursor: 'pointer',
                  background: '#fcfaf6',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--color-primary-dark)',
                  padding: '4px 10px',
                  fontSize: '0.73rem'
                }}
              >
                🧬 Tirzepatide Keywords
              </button>

              <button
                onClick={() => applyPreset({ intent: 'commercial', sort: 'opportunity' })}
                className="badge-minimal"
                style={{
                  cursor: 'pointer',
                  background: '#fcfaf6',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--color-primary-dark)',
                  padding: '4px 10px',
                  fontSize: '0.73rem'
                }}
              >
                💳 Commercial & Buying Intent
              </button>

              <button
                onClick={() => applyPreset({ term: 'dosing', maxKd: 35 })}
                className="badge-minimal"
                style={{
                  cursor: 'pointer',
                  background: '#fcfaf6',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--color-primary-dark)',
                  padding: '4px 10px',
                  fontSize: '0.73rem'
                }}
              >
                🩺 Dosing, Titration & Side Effects
              </button>

              <button
                onClick={() => applyPreset({ sort: 'opportunity' })}
                className="badge-minimal"
                style={{
                  cursor: 'pointer',
                  background: 'rgba(231, 111, 81, 0.1)',
                  border: '1px solid var(--color-accent)',
                  color: 'var(--color-accent)',
                  padding: '4px 10px',
                  fontSize: '0.73rem',
                  fontWeight: 600
                }}
              >
                🏆 Top Opportunity Score
              </button>
            </div>

            {/* Filter Rows: Competitor, Intent, KD, Volume */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px',
              fontSize: '0.78rem'
            }}>
              
              {/* Competitor Selector */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '5px' }}>
                  Competitor Brand ({competitorOptions.length})
                </label>
                <select
                  value={selectedCompetitor}
                  onChange={(e) => {
                    setSelectedCompetitor(e.target.value);
                    setPage(1);
                  }}
                  className="input-minimal"
                  style={{ width: '100%', borderRadius: '8px', padding: '6px 10px', fontSize: '0.78rem' }}
                >
                  {competitorOptions.map(c => {
                    const count = explorerData?.metrics?.competitorCounts[c.id];
                    return (
                      <option key={c.id} value={c.id}>
                        {c.label} {count ? `(${count.toLocaleString()})` : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Intent Selector */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '5px' }}>
                  Search Intent
                </label>
                <select
                  value={selectedIntent}
                  onChange={(e) => {
                    setSelectedIntent(e.target.value);
                    setPage(1);
                  }}
                  className="input-minimal"
                  style={{ width: '100%', borderRadius: '8px', padding: '6px 10px', fontSize: '0.78rem' }}
                >
                  {intentOptions.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* KD Difficulty Selector */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '5px' }}>
                  Max Difficulty (KD)
                </label>
                <select
                  value={maxKd === null ? '' : maxKd}
                  onChange={(e) => {
                    const val = e.target.value ? parseInt(e.target.value, 10) : null;
                    setMaxKd(val);
                    setPage(1);
                  }}
                  className="input-minimal"
                  style={{ width: '100%', borderRadius: '8px', padding: '6px 10px', fontSize: '0.78rem' }}
                >
                  {kdOptions.map((k, idx) => (
                    <option key={idx} value={k.value === null ? '' : k.value}>
                      {k.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Minimum Volume Selector */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '5px' }}>
                  Min Search Volume
                </label>
                <select
                  value={minVolume === null ? '' : minVolume}
                  onChange={(e) => {
                    const val = e.target.value ? parseInt(e.target.value, 10) : null;
                    setMinVolume(val);
                    setPage(1);
                  }}
                  className="input-minimal"
                  style={{ width: '100%', borderRadius: '8px', padding: '6px 10px', fontSize: '0.78rem' }}
                >
                  {volumeOptions.map((v, idx) => (
                    <option key={idx} value={v.value === null ? '' : v.value}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

            </div>

          </div>

          {/* Results Table Bento Box */}
          <div className="bento-card" style={{ padding: '0', overflow: 'hidden' }}>
            
            {/* Table Top Toolbar */}
            <div style={{
              padding: '14px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              background: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--color-primary-dark)' }}>
                  {loading ? 'Searching keywords...' : `${explorerData ? explorerData.totalResults.toLocaleString() : 0} Keywords Found`}
                </span>
                {selectedCompetitor !== 'all' && (
                  <span className="badge-minimal badge-minimal-coral" style={{ fontSize: '0.68rem', padding: '1px 8px' }}>
                    {selectedCompetitor}
                  </span>
                )}
                {maxKd !== null && (
                  <span className="badge-minimal badge-minimal-success" style={{ fontSize: '0.68rem', padding: '1px 8px' }}>
                    KD ≤ {maxKd}
                  </span>
                )}
              </div>

              {/* Rows Per Page */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                <span>Rows:</span>
                {[25, 50, 100].map(s => (
                  <button
                    key={s}
                    onClick={() => {
                      setPageSize(s);
                      setPage(1);
                    }}
                    style={{
                      background: pageSize === s ? 'var(--color-primary-dark)' : 'var(--bg-canvas)',
                      color: pageSize === s ? '#ffffff' : 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '0.72rem',
                      fontWeight: pageSize === s ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="table-minimal" style={{ width: '100%', fontSize: '0.79rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--color-primary-dark)', color: '#ffffff' }}>
                    <th style={{ width: '45px', textAlign: 'center', padding: '10px 8px', color: '#b7e4c7' }}>#</th>
                    
                    <th 
                      onClick={() => handleSort('keyword')}
                      style={{ textAlign: 'left', padding: '10px 14px', cursor: 'pointer', color: '#ffffff' }}
                      title="Sort by keyword alphabetically"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>Target Keyword</span>
                        {sortField === 'keyword' && (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                      </div>
                    </th>

                    <th style={{ textAlign: 'left', padding: '10px 12px', color: '#ffffff' }}>Competitor</th>
                    
                    <th style={{ textAlign: 'center', padding: '10px 10px', color: '#ffffff' }}>Intent</th>

                    <th 
                      onClick={() => handleSort('volume')}
                      style={{ textAlign: 'right', padding: '10px 12px', cursor: 'pointer', color: '#ffffff' }}
                      title="Sort by monthly search volume"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
                        <span>Volume / mo</span>
                        {sortField === 'volume' && (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                      </div>
                    </th>

                    <th 
                      onClick={() => handleSort('kd')}
                      style={{ textAlign: 'center', padding: '10px 10px', cursor: 'pointer', color: '#ffffff' }}
                      title="Sort by Keyword Difficulty (0-100)"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                        <span>KD</span>
                        {sortField === 'kd' && (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                      </div>
                    </th>

                    <th 
                      onClick={() => handleSort('position')}
                      style={{ textAlign: 'center', padding: '10px 10px', cursor: 'pointer', color: '#ffffff' }}
                      title="Sort by Google rank position"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                        <span>Rank</span>
                        {sortField === 'position' && (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                      </div>
                    </th>

                    <th 
                      onClick={() => handleSort('traffic')}
                      style={{ textAlign: 'right', padding: '10px 12px', cursor: 'pointer', color: '#ffffff' }}
                      title="Sort by monthly organic traffic"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
                        <span>Traffic</span>
                        {sortField === 'traffic' && (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                      </div>
                    </th>

                    <th 
                      onClick={() => handleSort('opportunity')}
                      style={{ textAlign: 'right', padding: '10px 14px', cursor: 'pointer', color: '#f4a261' }}
                      title="Sort by weighted opportunity score"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
                        <span>Opportunity</span>
                        {sortField === 'opportunity' && (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                      </div>
                    </th>

                    <th style={{ textAlign: 'left', padding: '10px 14px', color: '#ffffff' }}>Competitor Ranking URL</th>
                  </tr>
                </thead>

                <tbody>
                  {loading && (!explorerData || explorerData.items.length === 0) ? (
                    <tr>
                      <td colSpan={10} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        <RefreshCw size={20} className="animate-spin" style={{ margin: '0 auto 10px' }} />
                        <div>Loading keyword dataset...</div>
                      </td>
                    </tr>
                  ) : explorerData && explorerData.items.length > 0 ? (
                    explorerData.items.map((item, idx) => {
                      const posBadge = getPositionBadge(item.position);
                      const kdBadge = getKdBadgeStyle(item.kd);
                      const intentStyle = getIntentBadgeStyle(item.intent);
                      const isCopied = copiedText === item.keyword;

                      return (
                        <tr 
                          key={item.id}
                          style={{
                            borderBottom: '1px solid var(--border-subtle)',
                            background: idx % 2 === 0 ? '#ffffff' : 'var(--bg-canvas)'
                          }}
                        >
                          {/* S No */}
                          <td style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                            {(page - 1) * pageSize + idx + 1}
                          </td>

                          {/* Keyword */}
                          <td style={{ padding: '10px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontWeight: 700, color: 'var(--color-primary-dark)', fontSize: '0.84rem' }}>
                                {item.keyword}
                              </span>
                              <button
                                onClick={() => handleCopy(item.keyword)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: isCopied ? '#347e5d' : 'var(--text-tertiary)',
                                  padding: '2px'
                                }}
                                title="Copy keyword"
                              >
                                {isCopied ? <Check size={12} /> : <Copy size={12} />}
                              </button>
                              <a
                                href={`https://www.google.com/search?q=${encodeURIComponent(item.keyword)}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: 'var(--text-tertiary)' }}
                                title="Search on Google"
                              >
                                <ExternalLink size={11} />
                              </a>
                            </div>
                          </td>

                          {/* Competitor */}
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{
                              fontWeight: 600,
                              color: '#1b4332',
                              background: '#e9f7ee',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              border: '1px solid #b7e4c7',
                              whiteSpace: 'nowrap'
                            }}>
                              {item.competitor}
                            </span>
                          </td>

                          {/* Intent */}
                          <td style={{ textAlign: 'center', padding: '10px 10px' }}>
                            <span style={{
                              background: intentStyle.bg,
                              color: intentStyle.color,
                              border: `1px solid ${intentStyle.border}`,
                              borderRadius: '9999px',
                              padding: '2px 8px',
                              fontSize: '0.67rem',
                              fontWeight: 600,
                              textTransform: 'capitalize',
                              whiteSpace: 'nowrap'
                            }}>
                              {item.intent}
                            </span>
                          </td>

                          {/* Volume */}
                          <td style={{ textAlign: 'right', padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                            {item.volume.toLocaleString()}
                          </td>

                          {/* KD */}
                          <td style={{ textAlign: 'center', padding: '10px 10px' }}>
                            <span style={{
                              background: kdBadge.bg,
                              color: kdBadge.color,
                              borderRadius: '6px',
                              padding: '2px 6px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              fontFamily: 'var(--font-mono)'
                            }}>
                              {item.kd}
                            </span>
                          </td>

                          {/* Rank Position */}
                          <td style={{ textAlign: 'center', padding: '10px 10px' }}>
                            <span style={{
                              background: posBadge.bg,
                              color: posBadge.color,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              fontFamily: 'var(--font-mono)'
                            }}>
                              {posBadge.label}
                            </span>
                          </td>

                          {/* Traffic */}
                          <td style={{ textAlign: 'right', padding: '10px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                            {item.traffic.toLocaleString()}
                          </td>

                          {/* Opportunity Score */}
                          <td style={{ textAlign: 'right', padding: '10px 14px' }}>
                            <span style={{
                              color: '#c85a3c',
                              fontWeight: 800,
                              fontFamily: 'var(--font-mono)',
                              background: 'rgba(231, 111, 81, 0.08)',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              fontSize: '0.76rem',
                              border: '1px solid rgba(231, 111, 81, 0.2)'
                            }}>
                              {item.opportunityScore.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                            </span>
                          </td>

                          {/* Ranking URL */}
                          <td style={{ padding: '10px 14px', maxWidth: '280px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  color: 'var(--color-primary)',
                                  textDecoration: 'none',
                                  fontSize: '0.73rem',
                                  fontFamily: 'var(--font-mono)',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: '240px'
                                }}
                                title={item.url}
                              >
                                {item.url.replace(/^https?:\/\/(www\.)?/, '')}
                              </a>
                              <button
                                onClick={() => handleCopy(item.url)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: copiedText === item.url ? '#347e5d' : 'var(--text-tertiary)',
                                  padding: '2px',
                                  flexShrink: 0
                                }}
                                title="Copy full URL"
                              >
                                {copiedText === item.url ? <Check size={11} /> : <Copy size={11} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={10} style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '6px' }}>
                          No matching keywords found
                        </div>
                        <p style={{ fontSize: '0.8rem', maxWidth: '420px', margin: '0 auto 14px' }}>
                          Try clearing the search term, lowering the Minimum Volume, or increasing the Maximum KD threshold.
                        </p>
                        <button onClick={resetFilters} className="btn-minimal-primary" style={{ fontSize: '0.78rem' }}>
                          Reset All Filters
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Bottom Bar */}
            {explorerData && explorerData.totalPages > 1 && (
              <div style={{
                padding: '12px 20px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                background: '#ffffff'
              }}>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                  Showing <strong>{((page - 1) * pageSize) + 1}</strong> to <strong>{Math.min(page * pageSize, explorerData.totalResults)}</strong> of <strong>{explorerData.totalResults.toLocaleString()}</strong> keywords
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page <= 1}
                    style={{
                      background: 'var(--bg-canvas)',
                      border: '1px solid var(--border-subtle)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: page <= 1 ? 'not-allowed' : 'pointer',
                      opacity: page <= 1 ? 0.4 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--color-primary-dark)'
                    }}
                  >
                    <ChevronLeft size={13} />
                    <span>Previous</span>
                  </button>

                  <span style={{ fontSize: '0.74rem', padding: '0 8px', color: 'var(--text-primary)', fontWeight: 600 }}>
                    Page {page} of {explorerData.totalPages}
                  </span>

                  <button
                    onClick={() => setPage(Math.min(explorerData.totalPages, page + 1))}
                    disabled={page >= explorerData.totalPages}
                    style={{
                      background: 'var(--bg-canvas)',
                      border: '1px solid var(--border-subtle)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: page >= explorerData.totalPages ? 'not-allowed' : 'pointer',
                      opacity: page >= explorerData.totalPages ? 0.4 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--color-primary-dark)'
                    }}
                  >
                    <span>Next</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: COMPETITOR URL PATH CRAWLER (35,420 SITEMAP URLS)                 */}
      {/* ========================================================================= */}
      {activeMode === 'sitemap' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Search Header */}
          <div className="bento-card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge-minimal badge-minimal-neutral">Raw XML Sitemap Index</span>
                <span className="badge-minimal badge-minimal-coral">35,420 URLs Indexed</span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                Competitor URL Path & Slug Scanner
              </h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Scan 35,000+ crawled sitemap paths across 100 competitors to inspect clinical URL structures and slug taxonomies
              </p>
            </div>

            {/* Input bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSitemapSearch(sitemapQuery);
              }}
              style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}
            >
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={15} color="var(--color-primary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search URL slugs (e.g. tirzepatide, pricing, oral, nausea, bmi, microdose)..."
                  value={sitemapQuery}
                  onChange={(e) => setSitemapQuery(e.target.value)}
                  className="input-minimal"
                  style={{ paddingLeft: '38px', borderRadius: '9999px' }}
                />
              </div>
              <button type="submit" className="btn-minimal-primary" disabled={sitemapLoading} style={{ minWidth: '140px' }}>
                {sitemapLoading ? 'Scanning...' : 'Scan 35k URLs'}
              </button>
            </form>

            {/* Presets */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[
                'semaglutide', 'tirzepatide', 'compounded', 'oral', 'pricing', 
                'ozempic', 'mounjaro', 'side-effects', 'dosing', 'doctor', 'texas'
              ].map(term => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleSitemapSearch(term)}
                  className="badge-minimal"
                  style={{
                    background: sitemapQuery === term ? 'var(--color-primary-dark)' : 'var(--bg-canvas)',
                    color: sitemapQuery === term ? '#ffffff' : 'var(--color-primary-dark)',
                    border: '1px solid var(--border-medium)',
                    cursor: 'pointer',
                    fontSize: '0.74rem',
                    padding: '4px 10px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Sitemap Results Cards */}
          {sitemapResults && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                  Found {sitemapResults.totalMatchingUrls?.toLocaleString()} matching URLs across {sitemapResults.totalCompetitorsMatched} competitors for &ldquo;{sitemapResults.query}&rdquo;
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '16px' }}>
                {sitemapResults.results?.map(res => (
                  <div key={res.domain} className="bento-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-primary-dark)' }}>
                            {res.competitorName}
                          </span>
                          <span className="badge-minimal badge-minimal-neutral" style={{ fontSize: '0.68rem' }}>
                            Rank #{res.rank}
                          </span>
                        </div>
                        <a
                          href={`https://${res.domain}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '3px', textDecoration: 'none', marginTop: '2px' }}
                        >
                          {res.domain} <ExternalLink size={10} />
                        </a>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          background: 'rgba(231, 111, 81, 0.12)',
                          color: 'var(--color-accent)',
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          fontSize: '0.74rem',
                          fontWeight: 700
                        }}>
                          {res.matchCount} pages
                        </span>
                      </div>
                    </div>

                    {/* Sample URLs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                      {res.sampleUrls.map((url, uidx) => (
                        <div
                          key={uidx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            background: 'var(--bg-canvas)',
                            borderRadius: '6px',
                            border: '1px solid var(--border-subtle)',
                            fontSize: '0.72rem'
                          }}
                        >
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color: 'var(--color-primary-dark)',
                              textDecoration: 'none',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '320px',
                              fontFamily: 'var(--font-mono)'
                            }}
                            title={url}
                          >
                            {url.replace(`https://${res.domain}`, '') || '/'}
                          </a>
                          <button
                            onClick={() => handleCopy(url)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                            title="Copy URL"
                          >
                            {copiedText === url ? <Check size={12} color="#347e5d" /> : <Copy size={12} />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
