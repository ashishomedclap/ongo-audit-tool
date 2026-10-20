'use client';

import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  CheckSquare, 
  Square, 
  Search, 
  Clock, 
  CheckCircle2
} from 'lucide-react';
import { MasterUrlItem } from '@/lib/data';

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

  const totalAnalyzed = Object.values(architectureOverview).reduce((a, b) => a + b, 0) || 36626;

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Header Bento Box */}
      <div className="bento-card" style={{ padding: '24px' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Page Architecture & 217-Page Expansion Checklist
        </h1>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
          Macro category breakdown of 36,000+ competitor URLs paired with Ongo&apos;s strategic roadmap
        </p>
      </div>

      {/* Category Architecture Distribution Bento Grid */}
      <div className="bento-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Competitor Content Silo Distribution (36k+ URLs)
        </h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
          Proportional volume of pages published across the 100 compounded GLP-1 providers
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '10px'
        }}>
          {Object.entries(architectureOverview).map(([cat, count]) => {
            const pct = Math.round((count / totalAnalyzed) * 100);

            return (
              <div
                key={cat}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-canvas)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {cat}
                    </span>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                      {pct}%
                    </span>
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                    {count.toLocaleString()} <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 400 }}>URLs</span>
                  </div>
                </div>

                <div style={{ height: '3px', width: '100%', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: '#e4e4e7' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 217 Pages Master Checklist Bento Box */}
      <div className="bento-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Ongo 217-Page Recommended Checklist
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              Click items to toggle status: Todo &rarr; In Progress &rarr; Done. Progress is saved locally.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <span className="badge-minimal badge-minimal-success">{doneCount} Done</span>
            <span className="badge-minimal">{inProgressCount} In Progress</span>
            <span className="badge-minimal">{masterUrls.length - doneCount - inProgressCount} Todo</span>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search planned page by path or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-minimal"
              style={{ paddingLeft: '34px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            {['ALL', 'P0', 'P1', 'P2'].map(p => (
              <button
                key={p}
                onClick={() => setActivePriority(p)}
                style={{
                  padding: '5px 10px',
                  fontSize: '0.75rem',
                  borderRadius: '5px',
                  border: '1px solid var(--border-subtle)',
                  background: activePriority === p ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  color: activePriority === p ? '#fafafa' : 'var(--text-tertiary)',
                  cursor: 'pointer'
                }}
              >
                {p === 'ALL' ? 'All' : p}
              </button>
            ))}
          </div>
        </div>

        {/* Checklist items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '550px', overflowY: 'auto' }}>
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
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: status === 'done' ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-canvas)',
                  border: `1px solid ${status === 'done' ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ marginTop: '2px', color: status === 'done' ? '#34d399' : 'var(--text-muted)' }}>
                    {status === 'done' ? <CheckSquare size={16} /> : status === 'in_progress' ? <Clock size={16} /> : <Square size={16} />}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: status === 'done' ? 'var(--text-tertiary)' : 'var(--text-primary)', textDecoration: status === 'done' ? 'line-through' : 'none' }}>
                        {item.name}
                      </span>
                      <code style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', padding: '1px 5px', borderRadius: '3px' }}>
                        {item.path}
                      </code>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                      {item.description}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    padding: '2px 5px',
                    borderRadius: '4px',
                    background: item.priority === 'P0' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                    color: item.priority === 'P0' ? '#fb7185' : 'var(--text-tertiary)'
                  }}>
                    {item.priority}
                  </span>

                  <span className={`badge-minimal ${status === 'done' ? 'badge-minimal-success' : ''}`} style={{ fontSize: '0.65rem' }}>
                    {status === 'done' ? 'DONE' : status === 'in_progress' ? 'PROGRESS' : 'TODO'}
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
