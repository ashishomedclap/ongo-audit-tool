'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, Copy, Check, Search, BookOpen, Layers } from 'lucide-react';

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
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px', alignItems: 'start' }}>
      {/* Sidebar of Available Reports */}
      <div className="glass-panel" style={{ padding: '20px', position: 'sticky', top: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <FileText size={18} color="#34d399" />
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
            Intelligence Reports
          </h2>
        </div>

        <div style={{ position: 'relative', marginBottom: '14px' }}>
          <Search size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            style={{ padding: '6px 10px 6px 30px', fontSize: '0.8rem' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '500px', overflowY: 'auto' }}>
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
                  borderRadius: '6px',
                  border: isSelected ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                  background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  color: isSelected ? '#34d399' : 'var(--text-muted)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: isSelected ? '#fff' : '#cbd5e1' }}>
                  {rep.title}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  {rep.sizeKb} KB &bull; Markdown
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Report Content View */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        {/* Top Action Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '16px',
          marginBottom: '24px'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase' }}>
              Strategic Intelligence Artifact
            </span>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
              {selectedReport}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleCopy}
              className="btn-secondary"
              style={{ padding: '8px 12px', fontSize: '0.8rem' }}
            >
              {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy Content'}
            </button>
            <button
              onClick={handleDownload}
              className="btn-primary"
              style={{ padding: '8px 12px', fontSize: '0.8rem' }}
            >
              <Download size={14} />
              Download .md
            </button>
          </div>
        </div>

        {/* Report Content */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading report markdown...
          </div>
        ) : (
          <div className="markdown-prose">
            <pre style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: 'inherit',
              lineHeight: 1.7,
              fontSize: '0.9rem',
              color: '#cbd5e1'
            }}>
              {content}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
