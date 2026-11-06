'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageSquare, 
  AlertTriangle, 
  ThumbsUp, 
  Flame, 
  Search, 
  Filter, 
  ExternalLink, 
  Download, 
  Sparkles, 
  ShieldAlert, 
  Pill, 
  CheckCircle2, 
  Activity,
  ArrowRight,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import ContextCue from './ContextCue';
import { RedditPostSentiment } from '@/app/api/reddit-sentiment/route';

export default function RedditSentimentTab() {
  const [posts, setPosts] = useState<RedditPostSentiment[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'COMPETITOR_COMPLAINT' | 'TITRATION_DOSING' | 'SIDE_EFFECTS' | 'PHARMACY_QUALITY'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  const fetchSentimentData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reddit-sentiment');
      const data = await res.json();
      if (data.success && data.posts) {
        setPosts(data.posts);
      }
    } catch (e) {
      console.error('Failed to load Reddit sentiment:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentimentData();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (selectedCompetitor !== 'all' && (!p.competitorMentioned || !p.competitorMentioned.toLowerCase().includes(selectedCompetitor.toLowerCase()))) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches = 
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.ongoMoatTakeaway.toLowerCase().includes(q) ||
          p.targetContentOpportunity.toLowerCase().includes(q) ||
          (p.competitorMentioned && p.competitorMentioned.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [posts, categoryFilter, selectedCompetitor, searchQuery]);

  const handleExportCsv = () => {
    const headers = ['Category', 'Subreddit', 'Title', 'Upvotes', 'Comments', 'Competitor Mentioned', 'Patient Excerpt', 'Ongo Moat Takeaway', 'Target Content Opportunity', 'Reddit URL'];
    const rows = filteredPosts.map(p => [
      `"${p.category}"`,
      `"${p.subreddit}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      p.upvotes,
      p.commentsCount,
      `"${p.competitorMentioned || 'N/A'}"`,
      `"${p.excerpt.replace(/"/g, '""')}"`,
      `"${p.ongoMoatTakeaway.replace(/"/g, '""')}"`,
      `"${p.targetContentOpportunity.replace(/"/g, '""')}"`,
      `"${p.url}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `reddit_glp1_sentiment_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="gsc-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="gsc-badge-healthy">
                <span className="gsc-pulse-dot" />
                Real Patient Intelligence
              </span>
              <span className="gsc-badge-neutral">
                r/Semaglutide &bull; r/Tirzepatide &bull; r/compoundedcompleted
              </span>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Organic Moat Harvester
              </span>
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Reddit GLP-1 Patient Sentiment &amp; Competitor Complaint Radar
            </h1>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Surveillance on real telehealth complaints (melted cold-packs, hidden monthly fees, prescription delays) to craft high-converting Ongo landing pages and SEO moats.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={handleExportCsv} className="gsc-btn-secondary">
              <Download size={14} />
              Export CSV
            </button>
            <button onClick={fetchSentimentData} className="gsc-btn-primary" disabled={loading}>
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh Feed
            </button>
          </div>
        </div>
      </div>

      <ContextCue
        level={2}
        toolNumber={7}
        useCase="Harvest real-world patient complaints from Reddit to identify competitor service breakdowns and turn them into high-converting Ongo content hooks."
        badge="Patient Voice"
        title="Unfiltered Patient Feedback &amp; Moat Harvester"
        about="Patients on Reddit openly discuss late deliveries, room-temperature vials, hidden fees, and unresponsive telehealth doctors. Ongo uses this intelligence to build trust where rivals fail."
      />

      {/* 4 Metric Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px'
      }}>
        <div className="glass-card" style={{ padding: '16px 20px', borderRadius: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)' }}>COMPETITOR COMPLAINTS</span>
            <AlertTriangle size={15} style={{ color: '#ef4444' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ef4444' }}>
            {posts.filter(p => p.category === 'COMPETITOR_COMPLAINT').length} Verified Failures
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Late shipping, hidden fees &amp; ghosting
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', borderRadius: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)' }}>DOSING &amp; TITRATION QUESTIONS</span>
            <Pill size={15} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981' }}>
            {posts.filter(p => p.category === 'TITRATION_DOSING').length} Clinical Queries
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            0.25mg schedules &amp; food noise return
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', borderRadius: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)' }}>SIDE EFFECT CONCERNS</span>
            <Activity size={15} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f59e0b' }}>
            {posts.filter(p => p.category === 'SIDE_EFFECTS').length} Safety Inquiries
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Nausea mitigation &amp; thigh injections
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', borderRadius: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)' }}>503A PHARMACY EVALUATIONS</span>
            <ShieldAlert size={15} style={{ color: '#0284c7' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0284c7' }}>
            {posts.filter(p => p.category === 'PHARMACY_QUALITY').length} Lab Reviews
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Hallandale, Red Rock &amp; Empower COA
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '18px 20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Discussions' },
              { id: 'COMPETITOR_COMPLAINT', label: '🚨 Rival Complaints' },
              { id: 'TITRATION_DOSING', label: '💊 Titration & Dosing' },
              { id: 'SIDE_EFFECTS', label: '⚠️ Side Effects' },
              { id: 'PHARMACY_QUALITY', label: '🔬 503A Pharmacies' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as any)}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: categoryFilter === cat.id ? 700 : 500,
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: categoryFilter === cat.id ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                  background: categoryFilter === cat.id ? 'rgba(16, 185, 129, 0.16)' : 'var(--bg-input)',
                  color: categoryFilter === cat.id ? '#10b981' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.14s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search complaints, topics, brands..."
              style={{
                width: '100%',
                padding: '7px 10px 7px 32px',
                borderRadius: '8px',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontSize: '0.82rem'
              }}
            />
          </div>
        </div>
      </div>

      {/* Discussion Feed Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredPosts.map(post => (
          <div
            key={post.id}
            className="glass-card"
            style={{
              padding: '20px 24px',
              borderRadius: '16px',
              border: post.category === 'COMPETITOR_COMPLAINT' 
                ? '1px solid rgba(239, 68, 68, 0.3)' 
                : '1px solid var(--border-subtle)',
              transition: 'all 0.15s ease'
            }}
          >
            {/* Top Row: Meta Badges */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: 'rgba(2, 132, 199, 0.14)',
                  color: '#0284c7'
                }}>
                  {post.subreddit}
                </span>

                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: post.category === 'COMPETITOR_COMPLAINT' ? 'rgba(239, 68, 68, 0.14)' : 'rgba(16, 185, 129, 0.14)',
                  color: post.category === 'COMPETITOR_COMPLAINT' ? '#ef4444' : '#10b981'
                }}>
                  {post.sentiment.replace('_', ' ')}
                </span>

                {post.competitorMentioned && (
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(239, 68, 68, 0.08)',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                  }}>
                    Target Rival: {post.competitorMentioned}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ThumbsUp size={12} /> {post.upvotes} upvotes
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MessageSquare size={12} /> {post.commentsCount} comments
                </span>
                <span>by u/{post.author}</span>
              </div>
            </div>

            {/* Post Title */}
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0', lineHeight: 1.35 }}>
              {post.title}
            </h3>

            {/* Excerpt */}
            <p style={{
              fontSize: '0.84rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              margin: '0 0 14px 0',
              fontStyle: 'italic',
              background: 'var(--bg-surface-alt)',
              padding: '10px 14px',
              borderRadius: '8px',
              borderLeft: '3px solid var(--color-primary)'
            }}>
              "{post.excerpt}"
            </p>

            {/* Two Action Columns: Ongo Moat Takeaway & Content Opportunity */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '12px'
            }}>
              {/* Moat Takeaway */}
              <div style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(234, 246, 238, 0.9) 0%, rgba(254, 243, 199, 0.4) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <Sparkles size={15} style={{ color: '#c59b27', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                    Ongo Competitive Moat Directive:
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#14532d', marginTop: '2px', lineHeight: 1.4 }}>
                    {post.ongoMoatTakeaway}
                  </div>
                </div>
              </div>

              {/* Target Content Opportunity */}
              <div style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'var(--bg-surface-alt)',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <TrendingUp size={15} style={{ color: '#0284c7', marginTop: '2px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Target SEO / Landing Page Angle:
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px', lineHeight: 1.4 }}>
                    {post.targetContentOpportunity}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

