'use client';

import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  CheckSquare, 
  Square, 
  Search, 
  Clock, 
  CheckCircle2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { MasterUrlItem } from '@/lib/data';
import ContextCue from './ContextCue';

interface ArchitectureTabProps {
  architectureOverview: Record<string, number>;
  masterUrls: MasterUrlItem[];
}

export default function ArchitectureTab({ architectureOverview, masterUrls }: ArchitectureTabProps) {
  const [activeSilo, setActiveSilo] = useState<string>('ALL');
  const [activePriority, setActivePriority] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [pageStatuses, setPageStatuses] = useState<Record<string, 'todo' | 'in_progress' | 'done'>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ongo_page_checklist');
      if (saved) {
        setPageStatuses(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const toggleStatus = (id: string) => {
    setPageStatuses(prev => {
      const cur = prev[id] || 'todo';
      const next: 'todo' | 'in_progress' | 'done' = cur === 'todo' ? 'in_progress' : cur === 'in_progress' ? 'done' : 'todo';
      const updated: Record<string, 'todo' | 'in_progress' | 'done'> = { ...prev, [id]: next };
      try {
        localStorage.setItem('ongo_page_checklist', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const totalAnalyzed = Object.values(architectureOverview).reduce((a, b) => a + b, 0) || 35420;

  const filteredUrls = masterUrls.filter(item => {
    const matchesSearch = 
      item.path.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());

    const matchesSilo = activeSilo === 'ALL' || item.silo.toLowerCase().includes(activeSilo.toLowerCase());
    const matchesPriority = activePriority === 'ALL' || item.priority === activePriority;

    return matchesSearch && matchesSilo && matchesPriority;
  });

  const doneCount = Object.values(pageStatuses).filter(s => s === 'done').length;
  const inProgressCount = Object.values(pageStatuses).filter(s => s === 'in_progress').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <ContextCue
        badge="Strategic Architecture"
        title="Content Silo Breakdown & Ongo 217-Page Roadmap"
        about="This page maps the macro content architecture of 35,420 competitor URLs across 6 clinical silos and presents Ongo Weight Loss's comprehensive 217-Page Organic Expansion Roadmap. It provides a prioritized, actionable blueprint to scale Ongo from its current 11 live pages to 228 authoritative URLs."
        whatYouCanDo={[
          {
            action: "Track Execution with Local Persistence",
            description: "Click the status badge on any of the 217 pages to cycle between 'Todo' → 'In Progress' → 'Done'. Your progress saves automatically in browser localStorage."
          },
          {
            action: "Filter by Priority Tiers (P0, P1, P2)",
            description: "Filter to 'P0: Mission Critical' (immediate commercial revenue funnels), 'P1: High Impact' (state hubs and dosage comparisons), or 'P2: Scale & Dominance' (long-tail guides)."
          },
          {
            action: "Browse by Content Silo",
            description: "Filter pages across Core Treatments, Pricing & Transparency, Clinical Authority (E-E-A-T), State Telehealth Landing Pages, or Patient Education."
          },
          {
            action: "Inspect Slugs & Search Intent",
            description: "Review recommended URL slugs, target keywords, monthly search volume estimates, and patient intent for all 217 blueprint pages."
          },
          {
            action: "View Competitor Silo Allocations",
            description: "Benchmark how the 100 competitors allocate content (26% blogs, 9% treatments, 5% education, 1.8% pricing) to optimize Ongo's publishing cadence."
          }
        ]}
        tip="Filter by 'P0' to focus exclusively on high-priority commercial funnels needed to capture immediate Google search traffic."
      />

      {/* Top Header Bento Box */}
      <div className="bento-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge-minimal badge-minimal-neutral">Ongo Expansion Suite</span>
          <span className="badge-minimal badge-minimal-coral">217 Target Pages</span>
        </div>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
          Page Architecture & 217-Page Expansion Checklist
        </h1>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Macro category breakdown of 35,000+ competitor URLs paired with Ongo&apos;s strategic roadmap
        </p>
      </div>

      {/* Category Architecture Distribution Bento Grid */}
      <div className="bento-card" style={{ padding: '24px', border: '1px solid var(--border-medium)' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '4px' }}>
          Competitor Content Silo Distribution (35,420 URLs)
        </h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
          Proportional volume of pages published across 100 compounded GLP-1 providers
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px'
        }}>
          {Object.entries(architectureOverview).map(([cat, count], idx) => {
            const pct = Math.round((count / totalAnalyzed) * 100);
            const colors = ['#347e5d', '#e76f51', '#f4a261', '#1b4332', '#10b981', '#7c3aed'];
            const barColor = colors[idx % colors.length];

            return (
              <div
                key={cat}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-canvas)',
                  border: '1px solid var(--border-medium)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                      {cat}
                    </span>
                    <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {pct}%
                    </span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', fontFamily: 'var(--font-mono)', marginBottom: '10px' }}>
                    {count.toLocaleString()} <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>URLs</span>
                  </div>
                </div>

                <div style={{ height: '5px', width: '100%', background: '#ede7de', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: '9999px' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 217 Pages Master Checklist Bento Box */}
      <div className="bento-card" style={{ padding: '24px', border: '1px solid var(--border-medium)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              Ongo 217-Page Expansion Blueprint
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Click items to toggle status: Todo &rarr; In Progress &rarr; Done. Progress is saved locally in your browser.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <span className="badge-minimal badge-minimal-success" style={{ padding: '4px 10px' }}>{doneCount} Done</span>
            <span className="badge-minimal badge-minimal-coral" style={{ padding: '4px 10px' }}>{inProgressCount} In Progress</span>
            <span className="badge-minimal badge-minimal-neutral" style={{ padding: '4px 10px' }}>{masterUrls.length - doneCount - inProgressCount} Todo</span>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search size={15} color="var(--color-primary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search planned page by path, compound, or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-minimal"
              style={{ paddingLeft: '38px', borderRadius: '9999px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['ALL', 'P0', 'P1', 'P2'].map(p => {
              const isActive = activePriority === p;
              return (
                <button
                  key={p}
                  onClick={() => setActivePriority(p)}
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.78rem',
                    borderRadius: '9999px',
                    border: '1px solid',
                    borderColor: isActive ? '#1b4332' : 'var(--border-medium)',
                    background: isActive ? '#1b4332' : '#ffffff',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {p === 'ALL' ? 'All Tiers' : `${p} Priority`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Checklist items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '580px', overflowY: 'auto' }}>
          {filteredUrls.map((item) => {
            const status = pageStatuses[item.id] || 'todo';

            return (
              <div
                key={item.id}
                onClick={() => toggleStatus(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: status === 'done' ? '#f0fdf4' : '#ffffff',
                  border: `1px solid ${status === 'done' ? '#86efac' : 'var(--border-medium)'}`,
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ marginTop: '2px', color: status === 'done' ? '#1b4332' : status === 'in_progress' ? '#d97706' : 'var(--text-muted)' }}>
                    {status === 'done' ? <CheckSquare size={17} color="#1b4332" /> : status === 'in_progress' ? <Clock size={17} color="#d97706" /> : <Square size={17} />}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.885rem', color: status === 'done' ? 'var(--text-tertiary)' : 'var(--color-primary-dark)', textDecoration: status === 'done' ? 'line-through' : 'none' }}>
                        {item.name}
                      </span>
                      <code style={{ fontSize: '0.74rem', color: 'var(--color-primary)', background: 'var(--color-primary-soft)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {item.path}
                      </code>
                    </div>
                    <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                      {item.description}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    padding: '3px 7px',
                    borderRadius: '9999px',
                    background: item.priority === 'P0' ? '#fee2e2' : 'var(--bg-canvas)',
                    color: item.priority === 'P0' ? '#991b1b' : 'var(--color-primary-dark)',
                    border: `1px solid ${item.priority === 'P0' ? '#fecaca' : 'var(--border-subtle)'}`
                  }}>
                    {item.priority}
                  </span>

                  <span className={`badge-minimal ${status === 'done' ? 'badge-minimal-success' : status === 'in_progress' ? 'badge-minimal-coral' : ''}`} style={{ fontSize: '0.67rem' }}>
                    {status === 'done' ? 'DONE' : status === 'in_progress' ? 'IN PROGRESS' : 'TODO'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
