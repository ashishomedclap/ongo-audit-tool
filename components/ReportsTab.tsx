'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, Copy, Check, Search, ShieldCheck } from 'lucide-react';
import ContextCue from './ContextCue';

interface ReportMeta {
  id: string;
  title: string;
  filename: string;
  sizeKb: number;
}

interface ReportsTabProps {
  reportsList: ReportMeta[];
}

export default function ReportsTab({ reportsList }: ReportsTabProps) {
  const [selectedReport, setSelectedReport] = useState<string>(
    reportsList.find(r => r.filename.includes('SITEMAP_INTELLIGENCE_REPORT'))?.filename || reportsList[0]?.filename || ''
  );
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!selectedReport) return;
    setLoading(true);
    fetch(`/api/reports?name=${encodeURIComponent(selectedReport)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setContent(data.content);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedReport]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedReport;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredReports = reportsList.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) || 
    r.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <ContextCue
        badge="Executive Briefs"
        title="Curated Competitive Research Documents"
        about="This page serves as an executive library of structured research documents, audit syntheses, and strategic briefs prepared specifically for Ongo Weight Loss leadership. It compiles the full findings of the 100-competitor census, sitemap crawl data, meta optimizations, and content blueprints into presentation-ready reports."
        whatYouCanDo={[
          {
            action: "Browse Executive Research Documents",
            description: "Select between key reports including the 'Competitor Sitemap Census', '217-Page Architecture Checklist', 'Meta Optimization Scorecard', and '100 Competitors Master Directory'."
          },
          {
            action: "Read Formatted Strategic Briefings",
            description: "Review executive summaries, key data tables, clinical recommendations, and strategic action plans in a clean, high-readability briefing format."
          },
          {
            action: "1-Click Copy Full Report Content",
            description: "Click 'Copy Markdown' to copy the entire document to your clipboard for pasting into team Slack channels, Notion, or internal memos."
          },
          {
            action: "Download Raw Markdown Files",
            description: "Click 'Download' to save the complete structured markdown report locally to your computer for offline archiving or sharing with developers and copywriters."
          },
          {
            action: "Search Briefing Topics",
            description: "Use the report search bar to quickly jump to specific documents by keyword or topic."
          }
        ]}
        tip="Click 'Download' to save any report locally as a .md file for sharing with team members or loading into documentation."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '16px', alignItems: 'start' }}>
        {/* Sidebar Bento Tile */}
        <div className="bento-card" style={{ padding: '20px', position: 'sticky', top: '80px', border: '1px solid var(--border-medium)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <FileText size={16} color="var(--color-primary)" />
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              Executive Reports
            </h2>
          </div>

          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <Search size={13} color="var(--color-primary)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-minimal"
              style={{ padding: '6px 10px 6px 30px', fontSize: '0.75rem', borderRadius: '9999px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '520px', overflowY: 'auto' }}>
            {filteredReports.map((rep) => {
              const isSelected = selectedReport === rep.filename;

              return (
                <button
                  key={rep.filename}
                  onClick={() => setSelectedReport(rep.filename)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: isSelected ? '1px solid #1b4332' : '1px solid transparent',
                    background: isSelected ? '#1b4332' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isSelected ? '#ffffff' : 'var(--color-primary-dark)' }}>
                    {rep.title}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: isSelected ? '#b7e4c7' : 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    {rep.sizeKb} KB
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Report Viewer Bento Tile */}
        <div className="bento-card" style={{ padding: '30px', border: '1px solid var(--border-medium)' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '16px',
            marginBottom: '22px'
          }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-accent)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                Ongo Intelligence Artifact
              </span>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                {selectedReport}
              </h1>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleCopy}
                className="btn-minimal-secondary"
                style={{ padding: '6px 14px', fontSize: '0.76rem' }}
              >
                {copied ? <Check size={13} color="#1b4332" /> : <Copy size={13} />}
                {copied ? 'Copied' : 'Copy Text'}
              </button>
              <button
                onClick={handleDownload}
                className="btn-minimal-primary"
                style={{ padding: '6px 14px', fontSize: '0.76rem' }}
              >
                <Download size={13} />
                Download .md
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
              Loading document...
            </div>
          ) : (
            <div className="markdown-prose">
              <pre style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'inherit',
                lineHeight: 1.7,
                fontSize: '0.885rem',
                color: 'var(--text-secondary)'
              }}>
                {content}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
