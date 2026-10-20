'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Search, 
  ExternalLink, 
  ShieldAlert, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Target, 
  Lightbulb,
  ArrowRight,
  TrendingUp,
  FileCheck,
  SplitSquareVertical
} from 'lucide-react';
import { COMMON_PAGE_PATTERNS, UNIQUE_PAGE_PATTERNS, CommonPagePattern, UniquePagePattern } from '@/lib/patterns-data';
import ContextCue from './ContextCue';

export default function CommonVsUniqueTab() {
  const [activeView, setActiveView] = useState<'unique' | 'common'>('unique');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSilo, setSelectedSilo] = useState<string>('ALL');
  const [expandedUniqueId, setExpandedUniqueId] = useState<string | null>(UNIQUE_PAGE_PATTERNS[0].id);

  // Silos for filtering
  const uniqueSilos = ['ALL', ...Array.from(new Set(UNIQUE_PAGE_PATTERNS.map(p => p.silo)))];
  const commonSilos = ['ALL', ...Array.from(new Set(COMMON_PAGE_PATTERNS.map(p => p.silo)))];

  const filteredUnique = UNIQUE_PAGE_PATTERNS.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.urlPattern.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.primaryBrands.some(b => b.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.whyCovered.customerObjection.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.whyCovered.strategicRationale.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSilo = selectedSilo === 'ALL' || item.silo === selectedSilo;
    return matchesSearch && matchesSilo;
  });

  const filteredCommon = COMMON_PAGE_PATTERNS.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pattern.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.purpose.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSilo = selectedSilo === 'ALL' || item.silo === selectedSilo;
    return matchesSearch && matchesSilo;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Context Cue Banner */}
      <ContextCue
        badge="Differentiation & Moat Intelligence"
        title="Common Pages vs. Unique Pages Analysis & Strategic Rationale"
        summary="This audit reveals which pages are universal market table-stakes (Common Pages found on 70%+ of competitors) versus unique high-converting silos built by top market innovators (Unique Pages found on < 10% of competitors) and why they cover them."
        details={[
          {
            label: "Common Pages (The Baseline)",
            description: "Essential transactional and compliance pages (Semaglutide, Tirzepatide, Pricing, How It Works, Medical Team, 50-State Locations) required to compete in the GLP-1 telehealth space."
          },
          {
            label: "Unique Pages (The Differentiators)",
            description: "Innovative silos (Oral Sublingual Lozenges, 503A Sterility Certificates, Flat-Rate Dosing Guarantees, GLP-1 Tapering, TSA Travel Guides, HSA/FSA Optimizers) designed to overcome specific patient objections."
          },
          {
            label: "Why Unique Pages Cover These Topics",
            description: "Each unique page is broken down by its Strategic Rationale, the specific Customer Objection it resolves, its Search Intent advantage, and its conversion lift."
          },
          {
            label: "Ongo Actionable Recommendation",
            description: "Direct recommendations with suggested URL slugs and priority tiers (P0, P1, P2) for Ongo to outrank competitors."
          }
        ]}
        tip="Review the 'Customer Objection' field for unique pages to understand the exact patient fears (price jumps, needle anxiety, fake compounds) that competitors are neutralizing to win customers."
      />

      {/* Mode Switcher & Filter Bento Card */}
      <div className="bento-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Page Pattern Intelligence: Common vs. Unique Pages
            </h1>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              Identify table-stakes industry standards vs. high-converting competitive moats
            </p>
          </div>

          {/* Segmented View Selector */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255, 255, 255, 0.03)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => {
                setActiveView('unique');
                setSelectedSilo('ALL');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                fontSize: '0.8rem',
                borderRadius: '6px',
                border: 'none',
                background: activeView === 'unique' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: activeView === 'unique' ? '#fafafa' : 'var(--text-tertiary)',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              <Sparkles size={14} />
              Unique Pages & Why Covered ({UNIQUE_PAGE_PATTERNS.length})
            </button>

            <button
              onClick={() => {
                setActiveView('common');
                setSelectedSilo('ALL');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                fontSize: '0.8rem',
                borderRadius: '6px',
                border: 'none',
                background: activeView === 'common' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: activeView === 'common' ? '#fafafa' : 'var(--text-tertiary)',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              <Layers size={14} />
              Common Baseline Pages ({COMMON_PAGE_PATTERNS.length})
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder={`Search ${activeView === 'unique' ? 'unique differentiators, brands, objections' : 'common pages, patterns'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-minimal"
              style={{ paddingLeft: '34px' }}
            />
          </div>

          {/* Silo Pills */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {(activeView === 'unique' ? uniqueSilos : commonSilos).map(silo => (
              <button
                key={silo}
                onClick={() => setSelectedSilo(silo)}
                style={{
                  padding: '4px 8px',
                  fontSize: '0.72rem',
                  borderRadius: '5px',
                  border: '1px solid var(--border-subtle)',
                  background: selectedSilo === silo ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  color: selectedSilo === silo ? '#fafafa' : 'var(--text-tertiary)',
                  cursor: 'pointer'
                }}
              >
                {silo}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VIEW 1: UNIQUE PAGES & WHY THEY COVER THEM */}
      {activeView === 'unique' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Showing {filteredUnique.length} Unique Pages Across Competitors
            </span>
            <span className="badge-minimal">Rare Content Moats (&lt; 15% prevalence)</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredUnique.map((item) => {
              const isExpanded = expandedUniqueId === item.id;

              return (
                <div
                  key={item.id}
                  className="bento-card"
                  style={{
                    padding: '20px',
                    transition: 'border-color 0.15s ease'
                  }}
                >
                  {/* Header Row */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '12px',
                    cursor: 'pointer'
                  }}
                  onClick={() => setExpandedUniqueId(isExpanded ? null : item.id)}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge-minimal badge-minimal-neutral" style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
                          {item.silo}
                        </span>
                        <span className="badge-minimal" style={{ fontSize: '0.68rem', color: '#fb7185', borderColor: 'rgba(244, 63, 94, 0.25)' }}>
                          {item.rarity}
                        </span>
                        <span className="badge-minimal" style={{ fontSize: '0.68rem', color: item.ongoRecommendation.priority === 'P0' ? '#fb7185' : '#34d399' }}>
                          Ongo {item.ongoRecommendation.priority}
                        </span>
                      </div>

                      <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>
                        {item.name}
                      </h2>

                      <code style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-canvas)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>
                        {item.urlPattern}
                      </code>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Observed On:</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                          {item.primaryBrands.join(', ')}
                        </div>
                      </div>

                      <button
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-tertiary)',
                          padding: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Customer Objection Callout Strip */}
                  <div style={{
                    marginTop: '12px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'rgba(244, 63, 94, 0.05)',
                    border: '1px solid rgba(244, 63, 94, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.78rem',
                    color: '#fca5a5'
                  }}>
                    <ShieldAlert size={14} style={{ flexShrink: 0 }} />
                    <span><strong>Customer Objection It Solves:</strong> {item.whyCovered.customerObjection}</span>
                  </div>

                  {/* Expanded Breakdown: WHY IT COVERS THIS */}
                  {isExpanded && (
                    <div style={{
                      marginTop: '14px',
                      paddingTop: '14px',
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      {/* 3-Column Bento Grid: Why They Covered It */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '10px'
                      }}>
                        {/* Strategic Rationale */}
                        <div style={{ background: 'var(--bg-canvas)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                            <Target size={13} color="var(--text-secondary)" />
                            Strategic Rationale
                          </div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                            {item.whyCovered.strategicRationale}
                          </p>
                        </div>

                        {/* Conversion & Retention Impact */}
                        <div style={{ background: 'var(--bg-canvas)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                            <TrendingUp size={13} color="#34d399" />
                            Conversion & LTV Impact
                          </div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                            {item.whyCovered.conversionImpact}
                          </p>
                        </div>

                        {/* SEO & Search Advantage */}
                        <div style={{ background: 'var(--bg-canvas)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                            <Search size={13} color="#38bdf8" />
                            SEO Search Advantage
                          </div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                            {item.whyCovered.seoAdvantage}
                          </p>
                        </div>
                      </div>

                      {/* Ongo Recommendation Box */}
                      <div style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-medium)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', maxWidth: '720px' }}>
                          <Lightbulb size={16} color="#fbbf24" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                              Ongo Tactical Action Plan ({item.ongoRecommendation.priority}):
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                              {item.ongoRecommendation.recommendation}
                            </p>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', display: 'block' }}>Suggested Slug:</span>
                          <code style={{ fontSize: '0.72rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                            {item.ongoRecommendation.suggestedSlug}
                          </code>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: COMMON BASELINE PAGES */}
      {activeView === 'common' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Showing {filteredCommon.length} Common Table-Stakes Pages
            </span>
            <span className="badge-minimal badge-minimal-success">Standard Baseline (&gt; 70% prevalence)</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '12px'
          }}>
            {filteredCommon.map((item) => (
              <div key={item.id} className="bento-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge-minimal" style={{ fontSize: '0.68rem' }}>
                      {item.silo}
                    </span>
                    <span className="badge-minimal badge-minimal-success" style={{ fontSize: '0.68rem' }}>
                      {item.presenceRate}% of Competitors
                    </span>
                  </div>

                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>
                    {item.name}
                  </h3>
                  <code style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '8px' }}>
                    {item.pattern}
                  </code>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '10px' }}>
                    {item.purpose}
                  </p>

                  <div style={{ background: 'var(--bg-canvas)', padding: '8px 10px', borderRadius: '5px', border: '1px solid var(--border-subtle)', marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Essential Page Elements:
                    </div>
                    <ul style={{ paddingLeft: '14px', fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {item.keyElements.map((el, i) => (
                        <li key={i} style={{ marginBottom: '2px' }}>{el}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Ongo Status:</span>
                    <span className={`badge-minimal ${item.ongoStatus === 'implemented' ? 'badge-minimal-success' : 'badge-minimal-neutral'}`} style={{ fontSize: '0.68rem' }}>
                      {item.ongoStatus === 'implemented' ? 'Live on Ongo' : 'Planned'}
                    </span>
                  </div>

                  {item.ongoPath && (
                    <code style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      {item.ongoPath}
                    </code>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
