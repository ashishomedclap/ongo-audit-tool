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
  SplitSquareVertical,
  ShieldCheck
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Context Cue Banner */}
      <ContextCue
        badge="Competitive Moats"
        title="Common Baseline vs. Unique Differentiation Pages"
        about="This page provides competitive pattern intelligence, contrasting 'Common Pages' (table-stakes pages found on 70%+ of telehealth clinics) against 'Unique Pages' (high-converting competitive moats found on fewer than 10% of clinics). It deconstructs the customer friction points, strategic rationale, and SEO intent advantages behind every page pattern to guide Ongo's differentiation."
        whatYouCanDo={[
          {
            action: "Analyze Table-Stakes Baseline",
            description: "Explore the 'Common Pages' view (Semaglutide product, transparent pricing, medical team, telehealth intake, state hubs) required to establish baseline trust."
          },
          {
            action: "Discover High-Converting Moats",
            description: "Switch to 'Unique Pages' to inspect rare, high-leverage pages (503A Sterility Certificates, Flat-Rate Dosing Guarantees, GLP-1 Tapering Off Protocols, TSA Airport Cold-Chain Travel Guides, HSA/FSA Reimbursement Portals)."
          },
          {
            action: "Examine Customer Friction Callouts",
            description: "Read the exact patient fears (needle phobia, hidden tier price jumps, pharmacy legitimacy) that each unique page is engineered to neutralize."
          },
          {
            action: "Filter by Strategic Content Silo",
            description: "Filter pages by Core Clinical, Pricing & Insurance, Medical Authority (E-E-A-T), Patient Retention, or State-Specific Telehealth."
          },
          {
            action: "Review Ongo Recommended Slugs",
            description: "Inspect recommended URL slugs and implementation priority tiers (P0, P1, P2) for Ongo to outrank competitors on specific patient searches."
          }
        ]}
        tip="Review the 'Customer Objection' callout for unique pages to understand the exact patient fears (needle phobia, hidden tier pricing, pharmacy legitimacy) that Ongo can neutralize."
      />

      {/* Mode Switcher & Filter Bento Card */}
      <div className="bento-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge-minimal badge-minimal-neutral">Ongo Moat Intelligence</span>
              <span className="badge-minimal badge-minimal-coral">Pattern Analysis</span>
            </div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
              Page Pattern Intelligence: Common vs. Unique Pages
            </h1>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Identify table-stakes industry standards vs. high-converting competitive moats
            </p>
          </div>

          {/* Segmented View Selector */}
          <div style={{ 
            display: 'flex', 
            gap: '4px', 
            background: 'var(--bg-canvas)', 
            padding: '4px', 
            borderRadius: '9999px', 
            border: '1px solid var(--border-medium)' 
          }}>
            <button
              onClick={() => {
                setActiveView('unique');
                setSelectedSilo('ALL');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                fontSize: '0.78rem',
                borderRadius: '9999px',
                border: 'none',
                background: activeView === 'unique' ? '#1b4332' : 'transparent',
                color: activeView === 'unique' ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 700,
                transition: 'all 0.15s ease'
              }}
            >
              <Sparkles size={13} color={activeView === 'unique' ? '#f4a261' : 'var(--color-primary)'} />
              Unique Moats ({UNIQUE_PAGE_PATTERNS.length})
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
                padding: '6px 16px',
                fontSize: '0.78rem',
                borderRadius: '9999px',
                border: 'none',
                background: activeView === 'common' ? '#1b4332' : 'transparent',
                color: activeView === 'common' ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 700,
                transition: 'all 0.15s ease'
              }}
            >
              <Layers size={13} color={activeView === 'common' ? '#f4a261' : 'var(--color-primary)'} />
              Common Baseline ({COMMON_PAGE_PATTERNS.length})
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 320px' }}>
            <Search size={15} color="var(--color-primary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder={`Search ${activeView === 'unique' ? 'unique differentiators, brands, objections...' : 'common pages, patterns...'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-minimal"
              style={{ paddingLeft: '38px', borderRadius: '9999px' }}
            />
          </div>

          {/* Silo Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {(activeView === 'unique' ? uniqueSilos : commonSilos).map(silo => {
              const isActive = selectedSilo === silo;
              return (
                <button
                  key={silo}
                  onClick={() => setSelectedSilo(silo)}
                  style={{
                    padding: '5px 12px',
                    fontSize: '0.73rem',
                    borderRadius: '9999px',
                    border: '1px solid',
                    borderColor: isActive ? '#1b4332' : 'var(--border-medium)',
                    background: isActive ? '#1b4332' : '#ffffff',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: isActive ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {silo}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* VIEW 1: UNIQUE PAGES & WHY THEY COVER THEM */}
      {activeView === 'unique' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.885rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              Showing {filteredUnique.length} Unique Differentiation Pages
            </span>
            <span className="badge-minimal badge-minimal-coral">Rare Moat Silos (&lt; 15% prevalence)</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredUnique.map((item) => {
              const isExpanded = expandedUniqueId === item.id;

              return (
                <div
                  key={item.id}
                  className="bento-card"
                  style={{
                    padding: '22px',
                    border: '1px solid var(--border-medium)',
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span className="badge-minimal badge-minimal-neutral" style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
                          {item.silo}
                        </span>
                        <span className="badge-minimal badge-minimal-coral" style={{ fontSize: '0.68rem' }}>
                          {item.rarity}
                        </span>
                        <span className={`badge-minimal ${item.ongoRecommendation.priority === 'P0' ? 'badge-minimal-danger' : 'badge-minimal-success'}`} style={{ fontSize: '0.68rem' }}>
                          Ongo {item.ongoRecommendation.priority} Target
                        </span>
                      </div>

                      <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '4px' }}>
                        {item.name}
                      </h2>

                      <code style={{ fontSize: '0.76rem', color: 'var(--color-primary-dark)', background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', padding: '3px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>
                        {item.urlPattern}
                      </code>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Observed On:</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-primary-dark)', fontWeight: 700 }}>
                          {item.primaryBrands.join(', ')}
                        </div>
                      </div>

                      <button
                        style={{
                          background: 'var(--bg-canvas)',
                          border: '1px solid var(--border-medium)',
                          color: 'var(--color-primary-dark)',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Customer Objection Callout Strip in Ongo Coral */}
                  <div style={{
                    marginTop: '14px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'var(--color-accent-soft)',
                    border: '1px solid #f8bbad',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.8rem',
                    color: '#c84b2c'
                  }}>
                    <ShieldAlert size={16} style={{ flexShrink: 0 }} />
                    <span><strong>Customer Friction Point Resolved:</strong> {item.whyCovered.customerObjection}</span>
                  </div>

                  {/* Expanded Breakdown */}
                  {isExpanded && (
                    <div style={{
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px'
                    }}>
                      {/* 3-Column Bento Grid: Why They Covered It */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '12px'
                      }}>
                        {/* Strategic Rationale */}
                        <div style={{ background: 'var(--bg-canvas)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '4px' }}>
                            <Target size={14} color="var(--color-primary)" />
                            Strategic Rationale
                          </div>
                          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {item.whyCovered.strategicRationale}
                          </p>
                        </div>

                        {/* Conversion & Retention Impact */}
                        <div style={{ background: 'var(--bg-canvas)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '4px' }}>
                            <TrendingUp size={14} color="#347e5d" />
                            Conversion & Retention Impact
                          </div>
                          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {item.whyCovered.conversionImpact}
                          </p>
                        </div>

                        {/* SEO Search Advantage */}
                        <div style={{ background: 'var(--bg-canvas)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '4px' }}>
                            <Search size={14} color="var(--color-accent)" />
                            SEO Search Advantage
                          </div>
                          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {item.whyCovered.seoAdvantage}
                          </p>
                        </div>
                      </div>

                      {/* Ongo Tactical Action Plan Box */}
                      <div style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-sm)',
                        background: '#ffffff',
                        border: '2px solid #b7e4c7',
                        boxShadow: '0 4px 14px rgba(27, 67, 50, 0.05)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', maxWidth: '720px' }}>
                          <Lightbulb size={18} color="#f4a261" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '2px' }}>
                              Ongo Tactical Action Plan ({item.ongoRecommendation.priority}):
                            </div>
                            <p style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                              {item.ongoRecommendation.recommendation}
                            </p>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', display: 'block', fontWeight: 600 }}>Suggested URL Slug:</span>
                          <code style={{ fontSize: '0.76rem', color: '#1b4332', background: 'var(--color-primary-soft)', padding: '3px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.885rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              Showing {filteredCommon.length} Common Table-Stakes Pages
            </span>
            <span className="badge-minimal badge-minimal-success">Standard Baseline (&gt; 70% prevalence)</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '14px'
          }}>
            {filteredCommon.map((item) => (
              <div key={item.id} className="bento-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px', border: '1px solid var(--border-medium)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge-minimal" style={{ fontSize: '0.68rem' }}>
                      {item.silo}
                    </span>
                    <span className="badge-minimal badge-minimal-success" style={{ fontSize: '0.68rem' }}>
                      {item.presenceRate}% of Competitors
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '3px' }}>
                    {item.name}
                  </h3>
                  <code style={{ fontSize: '0.74rem', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '8px' }}>
                    {item.pattern}
                  </code>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                    {item.purpose}
                  </p>

                  <div style={{ background: 'var(--bg-canvas)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)', marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-primary-dark)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Essential Page Elements:
                    </div>
                    <ul style={{ paddingLeft: '14px', fontSize: '0.73rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {item.keyElements.map((el, i) => (
                        <li key={i} style={{ marginBottom: '2px' }}>{el}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Ongo Status:</span>
                    <span className={`badge-minimal ${item.ongoStatus === 'implemented' ? 'badge-minimal-success' : 'badge-minimal-neutral'}`} style={{ fontSize: '0.68rem' }}>
                      {item.ongoStatus === 'implemented' ? 'Live on Ongo' : 'Planned'}
                    </span>
                  </div>

                  {item.ongoPath && (
                    <code style={{ fontSize: '0.72rem', color: 'var(--color-primary-dark)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
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
