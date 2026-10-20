'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, Copy, Check, Search } from 'lucide-react';

interface ReportMeta {
  id: string;
  title: string;
  filename: string;
  sizeKb: number;
}

interface ReportsTabProps {
  reportsList: ReportMeta[];
}

import ContextCue from './ContextCue';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ContextCue
        badge="Intelligence Report Cues"
        title="Curated Competitive Research Documents"
        summary="You are viewing the markdown research artifacts and audits produced during this intelligence sprint. Use the left column to switch between reports, copy raw content, or export to markdown."
        details={[
          {
            label: "Sitemap Intelligence Report",
            description: "Executive synthesis covering competitive market share, public vs blocked sitemaps, and content publishing cadence."
          },
          {
            label: "Recommended Pages Checklist",
            description: "The 217-page blueprint mapping high-converting topics across P0, P1, and P2 priority tiers."
          },
          {
            label: "Meta Optimization & Comparison",
            description: "Direct comparison between Ongo's live titles/descriptions and search-optimal recommendations."
          },
          {
            label: "100 Competitors List",
            description: "Directory of all 100 brands with domains, tier classifications, and service models."
          }
        ]}
        tip="Click 'Download' to save any report locally as a .md file for sharing with team members or loading into documentation."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '16px', alignItems: 'start' }}>
      {/* Sidebar Bento Tile */}
      <div className="bento-card" style={{ padding: '18px', position: 'sticky', top: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <FileText size={16} color="var(--text-secondary)" />
          <h2 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Artifacts
          </h2>
        </div>

        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <Search size={12} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-minimal"
            style={{ padding: '5px 8px 5px 28px', fontSize: '0.75rem' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '480px', overflowY: 'auto' }}>
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
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: isSelected ? '1px solid var(--border-medium)' : '1px solid transparent',
                  background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 500, color: isSelected ? '#fafafa' : 'var(--text-secondary)' }}>
                  {rep.title}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {rep.sizeKb} KB
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Report Viewer Bento Tile */}
      <div className="bento-card" style={{ padding: '28px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '14px',
          marginBottom: '20px'
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Markdown Document
            </span>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {selectedReport}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={handleCopy}
              className="btn-minimal-secondary"
              style={{ padding: '6px 10px', fontSize: '0.75rem' }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="btn-minimal-primary"
              style={{ padding: '6px 10px', fontSize: '0.75rem' }}
            >
              <Download size={12} />
              Download
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Loading document...
          </div>
        ) : (
          <div className="markdown-prose">
            <pre style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: 'inherit',
              lineHeight: 1.6,
              fontSize: '0.85rem',
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
