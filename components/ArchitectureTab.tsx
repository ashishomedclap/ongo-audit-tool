'use client';

import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  CheckSquare, 
  Square, 
  Search, 
  Filter, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Users, 
  DollarSign, 
  FileCheck,
  Shield,
  HelpCircle,
  ExternalLink
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

  // Filter master URLs
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8' }}>
            <Layers size={20} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
            Competitor Page Architecture & Master Checklist
          </h1>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Macro category breakdown of 36,000+ competitor URLs paired with Ongo&apos;s 217-page SEO site structure blueprint
        </p>
      </div>

      {/* Category Architecture Distribution Treemap */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
          Competitor Content Silo Distribution (36k+ URLs)
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Proportional volume of content published across the 100 compounded GLP-1 telehealth providers
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '14px'
        }}>
          {Object.entries(architectureOverview).map(([cat, count]) => {
            const pct = Math.round((count / totalAnalyzed) * 100);

            return (
              <div
                key={cat}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                      {cat}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399' }}>
                      {pct}%
                    </span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8', marginBottom: '8px' }}>
                    {count.toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500 }}>URLs</span>
                  </div>
                </div>

                <div style={{ height: '4px', width: '100%', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 217 Pages Master Checklist for Ongo */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
              Ongo Recommended Page Checklist ({masterUrls.length} Planned Pages)
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Click any item to toggle status: Todo &rarr; In Progress &rarr; Done. Progress is saved locally.
            </p>
          </div>

          {/* Progress Tracker */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-success">
              {doneCount} Done
            </span>
            <span className="badge badge-warning">
              {inProgressCount} In Progress
            </span>
            <span className="badge badge-info">
              {masterUrls.length - doneCount - inProgressCount} Todo
            </span>
          </div>
        </div>

        {/* Filters and search */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <Search size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search planned page by path or title (e.g. semaglutide, pricing, doctor)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '36px' }}
            />
          </div>

          {/* Priority filter */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {['ALL', 'P0', 'P1', 'P2'].map(p => (
              <button
                key={p}
                onClick={() => setActivePriority(p)}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  background: activePriority === p ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: activePriority === p ? '#34d399' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {p === 'ALL' ? 'All Priorities' : p}
              </button>
            ))}
          </div>
        </div>

        {/* List of planned pages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '600px', overflowY: 'auto' }}>
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
                  background: status === 'done' 
                    ? 'rgba(16, 185, 129, 0.06)' 
                    : status === 'in_progress' 
                    ? 'rgba(245, 158, 11, 0.06)' 
                    : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${status === 'done' ? 'rgba(16, 185, 129, 0.25)' : status === 'in_progress' ? 'rgba(245, 158, 11, 0.25)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ marginTop: '2px', color: status === 'done' ? '#34d399' : status === 'in_progress' ? '#fbbf24' : 'var(--text-dim)' }}>
                    {status === 'done' ? <CheckSquare size={18} /> : status === 'in_progress' ? <Clock size={18} /> : <Square size={18} />}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 700, color: status === 'done' ? '#94a3b8' : '#fff', textDecoration: status === 'done' ? 'line-through' : 'none' }}>
                        {item.name}
                      </span>
                      <code style={{ fontSize: '0.75rem', color: '#38bdf8', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
                        {item.path}
                      </code>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {item.description}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: item.priority === 'P0' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    color: item.priority === 'P0' ? '#fb7185' : 'var(--text-muted)'
                  }}>
                    {item.priority}
                  </span>

                  <span className={`badge ${status === 'done' ? 'badge-success' : status === 'in_progress' ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: '0.65rem' }}>
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
