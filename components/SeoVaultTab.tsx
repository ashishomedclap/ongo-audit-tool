'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, Upload, Download, RefreshCw, BarChart2, ExternalLink,
  Link2, Users, TrendingUp, TrendingDown, ChevronLeft, ChevronRight,
  ArrowUpDown, ArrowUp, ArrowDown, Filter, Check, Copy, Shield, Database,
  FileSpreadsheet, AlertCircle, CheckCircle2, Info, X, Layers,
  Globe, Tag, Minus, Plus, Calendar
} from 'lucide-react';
import ContextCue from './ContextCue';

// ─── Types ───────────────────────────────────────────────────────────
interface VaultMeta {
  lastUpdated: string;
  version: string;
  counts: { keywords: number; backlinks: number; competitors: number; referringDomains: number };
  kpis: {
    top3Keywords: number; top10Keywords: number; totalSearchVolume: number;
    totalTrafficCost: number; totalEstimatedTraffic: number;
    dofollowBacklinks: number; nofollowBacklinks: number; highAuthBacklinks: number;
    averageCompetitorRelevance: number;
  };
}
interface VaultKeyword {
  id: string; keyword: string; position: number; prevPosition: number;
  searchVolume: number; keywordDifficulty: number; cpc: number; url: string;
  traffic: number; trafficPercent: number; trafficCost: number;
  trends: string; timestamp: string; serpFeatures: string[];
  intents: string[]; positionType: string;
}
interface VaultBacklink {
  id: string; ascore: number; sourceTitle: string; sourceUrl: string;
  targetUrl: string; anchor: string; externalLinks: number; internalLinks: number;
  isNofollow: boolean; isSponsored: boolean; firstSeen: string; lastSeen: string;
  isNew: boolean; isLost: boolean; sourceDomain: string; isText: boolean; isImage: boolean;
}
interface VaultCompetitor {
  id: string; domain: string; relevance: number; commonKeywords: number;
  organicKeywords: number; organicTraffic: number; organicCost: number; adwordsKeywords: number;
}

type ActiveDataset = 'keywords' | 'backlinks' | 'competitors';
type SortDir = 'asc' | 'desc';

// ─── Helpers ─────────────────────────────────────────────────────────
function fmtNum(n: number, dec = 0) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toFixed(dec);
}
function fmtDate(d: string) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return d; }
}
function kdColor(kd: number) {
  if (kd <= 20) return { color: '#059669', bg: 'rgba(5,150,105,0.1)' };
  if (kd <= 50) return { color: '#d97706', bg: 'rgba(217,119,6,0.1)' };
  return { color: '#dc2626', bg: 'rgba(220,38,38,0.1)' };
}
function posChange(pos: number, prev: number) {
  if (!pos || !prev || pos === prev) return null;
  return pos < prev ? 'up' : 'down';
}

// ─── Main Component ──────────────────────────────────────────────────
export default function SeoVaultTab() {
  const [meta, setMeta] = useState<VaultMeta | null>(null);
  const [activeDataset, setActiveDataset] = useState<ActiveDataset>('keywords');
  const [loading, setLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);

  // Keywords state
  const [kwItems, setKwItems] = useState<VaultKeyword[]>([]);
  const [kwTotal, setKwTotal] = useState(0);
  const [kwPage, setKwPage] = useState(1);
  const [kwSearch, setKwSearch] = useState('');
  const [kwSortBy, setKwSortBy] = useState('position');
  const [kwSortDir, setKwSortDir] = useState<SortDir>('asc');
  const kwPageSize = 50;

  // Backlinks state
  const [blItems, setBlItems] = useState<VaultBacklink[]>([]);
  const [blTotal, setBlTotal] = useState(0);
  const [blPage, setBlPage] = useState(1);
  const [blSearch, setBlSearch] = useState('');
  const [blSortBy, setBlSortBy] = useState('ascore');
  const [blSortDir, setBlSortDir] = useState<SortDir>('desc');
  const [blMinAscore, setBlMinAscore] = useState(0);
  const [blNofollowFilter, setBlNofollowFilter] = useState('all');
  const blPageSize = 50;

  // Competitors state
  const [cpItems, setCpItems] = useState<VaultCompetitor[]>([]);
  const [cpTotal, setCpTotal] = useState(0);
  const [cpPage, setCpPage] = useState(1);
  const [cpSearch, setCpSearch] = useState('');
  const [cpSortBy, setCpSortBy] = useState('relevance');
  const [cpSortDir, setCpSortDir] = useState<SortDir>('desc');
  const cpPageSize = 50;

  // Upload state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<'replace' | 'merge'>('replace');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error' | 'info'; msg: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load meta
  const loadMeta = useCallback(async () => {
    setMetaLoading(true);
    try {
      const r = await fetch('/api/seo-vault?dataset=meta');
      const d = await r.json();
      if (d.meta) setMeta(d.meta);
    } catch {}
    setMetaLoading(false);
  }, []);

  // Load keywords
  const loadKeywords = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        dataset: 'keywords', page: String(kwPage), pageSize: String(kwPageSize),
        search: kwSearch, sortBy: kwSortBy, sortDir: kwSortDir
      });
      const r = await fetch('/api/seo-vault?' + params);
      const d = await r.json();
      setKwItems(d.items || []);
      setKwTotal(d.total || 0);
    } catch {}
    setLoading(false);
  }, [kwPage, kwSearch, kwSortBy, kwSortDir]);

  // Load backlinks
  const loadBacklinks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        dataset: 'backlinks', page: String(blPage), pageSize: String(blPageSize),
        search: blSearch, sortBy: blSortBy, sortDir: blSortDir,
        minAscore: String(blMinAscore), nofollow: blNofollowFilter
      });
      const r = await fetch('/api/seo-vault?' + params);
      const d = await r.json();
      setBlItems(d.items || []);
      setBlTotal(d.total || 0);
    } catch {}
    setLoading(false);
  }, [blPage, blSearch, blSortBy, blSortDir, blMinAscore, blNofollowFilter]);

  // Load competitors
  const loadCompetitors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        dataset: 'competitors', page: String(cpPage), pageSize: String(cpPageSize),
        search: cpSearch, sortBy: cpSortBy, sortDir: cpSortDir
      });
      const r = await fetch('/api/seo-vault?' + params);
      const d = await r.json();
      setCpItems(d.items || []);
      setCpTotal(d.total || 0);
    } catch {}
    setLoading(false);
  }, [cpPage, cpSearch, cpSortBy, cpSortDir]);

  useEffect(() => { loadMeta(); }, [loadMeta]);
  useEffect(() => { if (activeDataset === 'keywords') loadKeywords(); }, [activeDataset, loadKeywords]);
  useEffect(() => { if (activeDataset === 'backlinks') loadBacklinks(); }, [activeDataset, loadBacklinks]);
  useEffect(() => { if (activeDataset === 'competitors') loadCompetitors(); }, [activeDataset, loadCompetitors]);

  const handleSortKw = (field: string) => {
    if (kwSortBy === field) setKwSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setKwSortBy(field); setKwSortDir('asc'); }
    setKwPage(1);
  };
  const handleSortBl = (field: string) => {
    if (blSortBy === field) setBlSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setBlSortBy(field); setBlSortDir('desc'); }
    setBlPage(1);
  };
  const handleSortCp = (field: string) => {
    if (cpSortBy === field) setCpSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setCpSortBy(field); setCpSortDir('desc'); }
    setCpPage(1);
  };

  const SortIcon = ({ field, active, dir }: { field: string; active: string; dir: SortDir }) => {
    if (active !== field) return <ArrowUpDown size={12} style={{ opacity: 0.3 }} />;
    return dir === 'asc' ? <ArrowUp size={12} style={{ color: 'var(--color-primary)' }} /> : <ArrowDown size={12} style={{ color: 'var(--color-primary)' }} />;
  };

  const handleUpload = async () => {
    if (!uploadFile) { setUploadStatus({ type: 'error', msg: 'Please select a file first.' }); return; }
    setUploading(true);
    setUploadStatus({ type: 'info', msg: 'Processing file…' });
    try {
      const fd = new FormData();
      fd.append('file', uploadFile);
      fd.append('mode', uploadMode);
      const r = await fetch('/api/seo-vault', { method: 'POST', body: fd });
      const d = await r.json();
      if (d.success) {
        setUploadStatus({ type: 'success', msg: `✓ Imported ${d.importedCount.toLocaleString()} rows of ${d.dataset} data (${d.mode} mode).` });
        setUploadFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        await loadMeta();
        if (activeDataset === d.dataset) {
          if (d.dataset === 'keywords') loadKeywords();
          else if (d.dataset === 'backlinks') loadBacklinks();
          else if (d.dataset === 'competitors') loadCompetitors();
        }
      } else {
        setUploadStatus({ type: 'error', msg: d.error || 'Upload failed.' });
      }
    } catch (err) {
      setUploadStatus({ type: 'error', msg: 'Network error during upload.' });
    }
    setUploading(false);
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(id); setTimeout(() => setCopied(null), 1500); });
  };

  const thStyle: React.CSSProperties = {
    padding: '8px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 600,
    color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em',
    whiteSpace: 'nowrap', cursor: 'pointer', userSelect: 'none'
  };
  const tdStyle: React.CSSProperties = { padding: '8px 12px', fontSize: '12.5px', verticalAlign: 'middle' };

  const totalPages = (total: number, ps: number) => Math.max(1, Math.ceil(total / ps));
  const curPage = activeDataset === 'keywords' ? kwPage : activeDataset === 'backlinks' ? blPage : cpPage;
  const setPage = activeDataset === 'keywords' ? setKwPage : activeDataset === 'backlinks' ? setBlPage : setCpPage;
  const total = activeDataset === 'keywords' ? kwTotal : activeDataset === 'backlinks' ? blTotal : cpTotal;
  const pageSize = activeDataset === 'keywords' ? kwPageSize : activeDataset === 'backlinks' ? blPageSize : cpPageSize;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* KPI Summary */}
      {meta && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {[
            { label: 'Organic Keywords', value: fmtNum(meta.counts.keywords), sub: `${meta.kpis.top3Keywords} in Top 3`, icon: <Search size={15} />, color: '#059669' },
            { label: 'Backlinks', value: fmtNum(meta.counts.backlinks), sub: `${fmtNum(meta.kpis.dofollowBacklinks)} dofollow`, icon: <Link2 size={15} />, color: '#3b82f6' },
            { label: 'Referring Domains', value: fmtNum(meta.counts.referringDomains), sub: `${fmtNum(meta.kpis.highAuthBacklinks)} high-authority`, icon: <Globe size={15} />, color: '#8b5cf6' },
            { label: 'Competitors', value: fmtNum(meta.counts.competitors), sub: `${meta.kpis.top10Keywords} kws in Top 10`, icon: <Users size={15} />, color: '#f59e0b' },
            { label: 'Est. Traffic', value: fmtNum(meta.kpis.totalEstimatedTraffic), sub: `Traffic cost \$${fmtNum(meta.kpis.totalTrafficCost)}`, icon: <TrendingUp size={15} />, color: '#10b981' },
            { label: 'Search Volume', value: fmtNum(meta.kpis.totalSearchVolume), sub: `Total monthly searches`, icon: <BarChart2 size={15} />, color: '#e76f51' },
          ].map(kpi => (
            <div key={kpi.label} style={{
              background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: 12,
              padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4,
              backdropFilter: 'var(--glass-blur)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: kpi.color }}>{kpi.icon}
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{kpi.label}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{kpi.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{kpi.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* Controls Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {/* Dataset Tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg-glass-inset)', borderRadius: 10, padding: 4 }}>
          {(['keywords', 'backlinks', 'competitors'] as ActiveDataset[]).map(ds => (
            <button key={ds} onClick={() => setActiveDataset(ds)} style={{
              padding: '6px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
              fontSize: 12.5, fontWeight: 600,
              background: activeDataset === ds ? 'var(--color-primary)' : 'transparent',
              color: activeDataset === ds ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.15s'
            }}>
              {ds === 'keywords' ? '🔑 Keywords' : ds === 'backlinks' ? '🔗 Backlinks' : '🏁 Competitors'}
              {meta && (
                <span style={{ marginLeft: 5, fontSize: 10, fontWeight: 400, opacity: 0.7 }}>
                  ({fmtNum(ds === 'keywords' ? meta.counts.keywords : ds === 'backlinks' ? meta.counts.backlinks : meta.counts.competitors)})
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder={activeDataset === 'keywords' ? 'Search keywords or URLs…' : activeDataset === 'backlinks' ? 'Search domain, anchor, URL…' : 'Search competitor domain…'}
            value={activeDataset === 'keywords' ? kwSearch : activeDataset === 'backlinks' ? blSearch : cpSearch}
            onChange={e => {
              if (activeDataset === 'keywords') { setKwSearch(e.target.value); setKwPage(1); }
              else if (activeDataset === 'backlinks') { setBlSearch(e.target.value); setBlPage(1); }
              else { setCpSearch(e.target.value); setCpPage(1); }
            }}
            style={{
              width: '100%', padding: '7px 10px 7px 32px', borderRadius: 8, border: '1px solid var(--border-subtle)',
              background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 13, outline: 'none'
            }}
          />
        </div>

        {/* Backlink Filters */}
        {activeDataset === 'backlinks' && (
          <>
            <select value={blNofollowFilter} onChange={e => { setBlNofollowFilter(e.target.value); setBlPage(1); }}
              style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 12 }}>
              <option value="all">All links</option>
              <option value="dofollow">Dofollow only</option>
              <option value="nofollow">Nofollow only</option>
            </select>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Min AS:</span>
              <input type="number" min={0} max={100} value={blMinAscore || ''} placeholder="0"
                onChange={e => { setBlMinAscore(parseInt(e.target.value, 10) || 0); setBlPage(1); }}
                style={{ width: 56, padding: '7px 8px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 12 }} />
            </div>
          </>
        )}

        <button onClick={loadMeta} style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 8,
          border: '1px solid var(--border-subtle)', background: 'var(--bg-glass)', color: 'var(--text-secondary)',
          cursor: 'pointer', fontSize: 12
        }}>
          <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Refresh
        </button>

        <button onClick={() => { setUploadOpen(o => !o); setUploadStatus(null); }} style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8,
          border: 'none', background: 'var(--color-primary)', color: 'white',
          cursor: 'pointer', fontSize: 12, fontWeight: 600
        }}>
          <Upload size={13} /> Update Database
        </button>
      </div>

      {/* Upload Panel */}
      {uploadOpen && (
        <div style={{
          background: 'var(--bg-glass)', border: '1.5px solid var(--color-primary-soft)',
          borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 14
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileSpreadsheet size={18} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>Upload New SEMrush Export</span>
            </div>
            <button onClick={() => setUploadOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ background: 'rgba(52,126,93,0.06)', borderRadius: 10, padding: '12px 14px', fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <strong>Supported files:</strong> SEMrush <code style={{ background: 'rgba(0,0,0,0.07)', borderRadius: 4, padding: '1px 5px' }}>.xlsx</code> or <code style={{ background: 'rgba(0,0,0,0.07)', borderRadius: 4, padding: '1px 5px' }}>.csv</code> exports for <strong>Organic Keyword Positions</strong>, <strong>Backlinks</strong>, or <strong>Organic Competitors</strong>. The type is auto-detected from column headers.
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 240px' }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>File</label>
              <input ref={fileInputRef} type="file" accept=".xlsx,.csv"
                onChange={e => { setUploadFile(e.target.files?.[0] || null); setUploadStatus(null); }}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1.5px dashed var(--border-medium)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 12.5, cursor: 'pointer' }} />
              {uploadFile && (
                <div style={{ marginTop: 5, fontSize: 11, color: 'var(--color-primary)' }}>
                  ✓ {uploadFile.name} ({(uploadFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>

            <div style={{ flex: '0 0 auto' }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Import Mode</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['replace', 'merge'] as const).map(m => (
                  <button key={m} onClick={() => setUploadMode(m)} style={{
                    padding: '7px 12px', borderRadius: 8, border: '1.5px solid', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    borderColor: uploadMode === m ? 'var(--color-primary)' : 'var(--border-subtle)',
                    background: uploadMode === m ? 'rgba(52,126,93,0.1)' : 'var(--bg-input)',
                    color: uploadMode === m ? 'var(--color-primary)' : 'var(--text-secondary)'
                  }}>
                    {m === 'replace' ? '⟳ Replace' : '+ Merge'}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 5, fontSize: 10.5, color: 'var(--text-muted)' }}>
                {uploadMode === 'replace' ? 'Clears existing data for this type and imports fresh.' : 'Appends new rows to existing database.'}
              </div>
            </div>
          </div>

          {uploadStatus && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 14px', borderRadius: 8,
              background: uploadStatus.type === 'success' ? 'rgba(5,150,105,0.08)' : uploadStatus.type === 'error' ? 'rgba(220,38,38,0.08)' : 'rgba(59,130,246,0.08)',
              border: `1px solid ${uploadStatus.type === 'success' ? 'rgba(5,150,105,0.2)' : uploadStatus.type === 'error' ? 'rgba(220,38,38,0.2)' : 'rgba(59,130,246,0.2)'}`,
              color: uploadStatus.type === 'success' ? '#059669' : uploadStatus.type === 'error' ? '#dc2626' : '#3b82f6',
              fontSize: 12.5
            }}>
              {uploadStatus.type === 'success' ? <CheckCircle2 size={14} style={{ marginTop: 1, flexShrink: 0 }} /> : uploadStatus.type === 'error' ? <AlertCircle size={14} style={{ marginTop: 1, flexShrink: 0 }} /> : <Info size={14} style={{ marginTop: 1, flexShrink: 0 }} />}
              {uploadStatus.msg}
            </div>
          )}

          <button onClick={handleUpload} disabled={!uploadFile || uploading} style={{
            alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6,
            padding: '9px 20px', borderRadius: 9, border: 'none', cursor: !uploadFile || uploading ? 'not-allowed' : 'pointer',
            background: !uploadFile || uploading ? 'var(--border-subtle)' : 'var(--color-primary)',
            color: !uploadFile || uploading ? 'var(--text-muted)' : 'white',
            fontWeight: 700, fontSize: 13
          }}>
            {uploading ? <><RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> Processing…</> : <><Upload size={13} /> Import File</>}
          </button>
        </div>
      )}

      {/* Last updated badge */}
      {meta && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-muted)' }}>
          <Calendar size={12} />
          <span>Database last updated: <strong style={{ color: 'var(--text-secondary)' }}>{fmtDate(meta.lastUpdated)}</strong></span>
          <span style={{ fontSize: 10, background: 'var(--bg-glass-inset)', borderRadius: 5, padding: '2px 6px', color: 'var(--text-muted)', marginLeft: 4 }}>
            v{meta.version}
          </span>
        </div>
      )}

      {/* DATA TABLE */}
      <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: 14, overflow: 'hidden' }}>
        {/* Table Header */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text-primary)' }}>
            {activeDataset === 'keywords' ? '🔑 Organic Keyword Rankings' : activeDataset === 'backlinks' ? '🔗 Backlink Profile' : '🏁 Organic Competitors'}
          </span>
          <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
            {loading ? 'Loading…' : `${total.toLocaleString()} rows · Page ${curPage} of ${totalPages(total, pageSize)}`}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {/* KEYWORDS TABLE */}
          {activeDataset === 'keywords' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead style={{ background: 'var(--bg-glass-inset)' }}>
                <tr>
                  {[
                    { label: '#', field: 'position' },
                    { label: 'Keyword', field: 'keyword' },
                    { label: 'Vol', field: 'searchVolume' },
                    { label: 'KD', field: 'kd' },
                    { label: 'CPC', field: 'cpc' },
                    { label: 'Traffic', field: 'traffic' },
                    { label: 'Intent', field: '' },
                    { label: 'URL', field: '' },
                  ].map(h => (
                    <th key={h.label} style={thStyle} onClick={() => h.field && handleSortKw(h.field)}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {h.label} {h.field && <SortIcon field={h.field} active={kwSortBy} dir={kwSortDir} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {kwItems.map((kw, i) => {
                  const change = posChange(kw.position, kw.prevPosition);
                  const { color: kdCol, bg: kdBg } = kdColor(kw.keywordDifficulty);
                  return (
                    <tr key={kw.id} style={{ borderTop: '1px solid var(--border-subtle)', background: i % 2 === 1 ? 'var(--bg-glass-inset)' : undefined }}>
                      <td style={{ ...tdStyle, fontWeight: 700, minWidth: 60 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ color: 'var(--color-primary)', fontSize: 14 }}>{kw.position}</span>
                          {change === 'up' && <TrendingUp size={11} style={{ color: '#059669' }} />}
                          {change === 'down' && <TrendingDown size={11} style={{ color: '#dc2626' }} />}
                          {!change && kw.prevPosition > 0 && <Minus size={11} style={{ color: 'var(--text-muted)' }} />}
                        </div>
                      </td>
                      <td style={{ ...tdStyle, minWidth: 220 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <button onClick={() => copyText(kw.keyword, kw.id + 'kw')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-muted)', flexShrink: 0 }}>
                            {copied === kw.id + 'kw' ? <Check size={11} style={{ color: '#059669' }} /> : <Copy size={11} />}
                          </button>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{kw.keyword}</span>
                          {kw.positionType && kw.positionType !== 'Organic' && (
                            <span style={{ fontSize: 9.5, padding: '1px 5px', borderRadius: 4, background: 'rgba(139,92,246,0.12)', color: '#7c3aed', fontWeight: 600 }}>{kw.positionType}</span>
                          )}
                        </div>
                      </td>
                      <td style={tdStyle}><span style={{ color: 'var(--text-secondary)' }}>{fmtNum(kw.searchVolume)}</span></td>
                      <td style={tdStyle}>
                        <span style={{ padding: '2px 7px', borderRadius: 5, background: kdBg, color: kdCol, fontWeight: 700, fontSize: 11.5 }}>{kw.keywordDifficulty}</span>
                      </td>
                      <td style={tdStyle}><span style={{ color: 'var(--text-secondary)' }}>${kw.cpc.toFixed(2)}</span></td>
                      <td style={tdStyle}><span style={{ color: '#059669', fontWeight: 600 }}>{fmtNum(kw.traffic)}</span></td>
                      <td style={{ ...tdStyle, minWidth: 110 }}>
                        {kw.intents.slice(0, 2).map(intent => (
                          <span key={intent} style={{
                            display: 'inline-block', marginRight: 3, padding: '1px 5px', borderRadius: 4, fontSize: 9.5, fontWeight: 600,
                            background: intent === 'commercial' ? 'rgba(239,68,68,0.1)' : intent === 'transactional' ? 'rgba(245,158,11,0.1)' : intent === 'informational' ? 'rgba(59,130,246,0.1)' : 'rgba(100,116,139,0.1)',
                            color: intent === 'commercial' ? '#dc2626' : intent === 'transactional' ? '#d97706' : intent === 'informational' ? '#3b82f6' : '#64748b'
                          }}>{intent}</span>
                        ))}
                      </td>
                      <td style={{ ...tdStyle, minWidth: 220 }}>
                        <a href={kw.url} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-primary)', textDecoration: 'none', fontSize: 11.5, maxWidth: 220 }}>
                          <ExternalLink size={10} style={{ flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{kw.url.replace('https://', '').replace('http://', '')}</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* BACKLINKS TABLE */}
          {activeDataset === 'backlinks' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead style={{ background: 'var(--bg-glass-inset)' }}>
                <tr>
                  {[
                    { label: 'AS', field: 'ascore' },
                    { label: 'Source Domain', field: '' },
                    { label: 'Source Title', field: '' },
                    { label: 'Anchor', field: '' },
                    { label: 'Target URL', field: '' },
                    { label: 'Type', field: '' },
                    { label: 'First Seen', field: 'firstSeen' },
                  ].map(h => (
                    <th key={h.label} style={thStyle} onClick={() => h.field && handleSortBl(h.field)}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {h.label} {h.field && <SortIcon field={h.field} active={blSortBy} dir={blSortDir} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {blItems.map((bl, i) => (
                  <tr key={bl.id} style={{ borderTop: '1px solid var(--border-subtle)', background: i % 2 === 1 ? 'var(--bg-glass-inset)' : undefined }}>
                    <td style={{ ...tdStyle, minWidth: 55 }}>
                      <span style={{
                        display: 'inline-block', padding: '2px 7px', borderRadius: 5, fontWeight: 700, fontSize: 12,
                        background: bl.ascore >= 50 ? 'rgba(5,150,105,0.12)' : bl.ascore >= 20 ? 'rgba(245,158,11,0.12)' : 'rgba(100,116,139,0.1)',
                        color: bl.ascore >= 50 ? '#059669' : bl.ascore >= 20 ? '#d97706' : '#64748b'
                      }}>{bl.ascore}</span>
                    </td>
                    <td style={{ ...tdStyle, minWidth: 180 }}>
                      <a href={bl.sourceUrl} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-primary)', textDecoration: 'none', fontSize: 12 }}>
                        <ExternalLink size={10} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 170 }}>{bl.sourceDomain}</span>
                      </a>
                    </td>
                    <td style={{ ...tdStyle, minWidth: 220 }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', maxWidth: 220, color: 'var(--text-secondary)' }}>{bl.sourceTitle || '—'}</span>
                    </td>
                    <td style={{ ...tdStyle, minWidth: 150 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <button onClick={() => bl.anchor && copyText(bl.anchor, bl.id + 'anch')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-muted)', flexShrink: 0 }}>
                          {copied === bl.id + 'anch' ? <Check size={11} style={{ color: '#059669' }} /> : <Copy size={11} />}
                        </button>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140, color: 'var(--text-primary)', fontStyle: bl.anchor ? 'normal' : 'italic' }}>{bl.anchor || 'No anchor'}</span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, minWidth: 220 }}>
                      <a href={bl.targetUrl} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 11.5 }}>
                        <ExternalLink size={10} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{bl.targetUrl.replace('https://ongoweightloss.com', '')}</span>
                      </a>
                    </td>
                    <td style={{ ...tdStyle, minWidth: 100 }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {bl.isNofollow && <span style={{ padding: '1px 5px', borderRadius: 4, fontSize: 9.5, fontWeight: 600, background: 'rgba(220,38,38,0.1)', color: '#dc2626' }}>nofollow</span>}
                        {!bl.isNofollow && <span style={{ padding: '1px 5px', borderRadius: 4, fontSize: 9.5, fontWeight: 600, background: 'rgba(5,150,105,0.1)', color: '#059669' }}>dofollow</span>}
                        {bl.isSponsored && <span style={{ padding: '1px 5px', borderRadius: 4, fontSize: 9.5, fontWeight: 600, background: 'rgba(245,158,11,0.1)', color: '#d97706' }}>sponsored</span>}
                        {bl.isImage && <span style={{ padding: '1px 5px', borderRadius: 4, fontSize: 9.5, fontWeight: 600, background: 'rgba(139,92,246,0.1)', color: '#7c3aed' }}>image</span>}
                        {bl.isNew && <span style={{ padding: '1px 5px', borderRadius: 4, fontSize: 9.5, fontWeight: 600, background: 'rgba(16,185,129,0.1)', color: '#059669' }}>new</span>}
                        {bl.isLost && <span style={{ padding: '1px 5px', borderRadius: 4, fontSize: 9.5, fontWeight: 600, background: 'rgba(100,116,139,0.1)', color: '#64748b' }}>lost</span>}
                      </div>
                    </td>
                    <td style={{ ...tdStyle, minWidth: 100 }}>
                      <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{fmtDate(bl.firstSeen)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* COMPETITORS TABLE */}
          {activeDataset === 'competitors' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead style={{ background: 'var(--bg-glass-inset)' }}>
                <tr>
                  {[
                    { label: '#', field: '' },
                    { label: 'Domain', field: '' },
                    { label: 'Relevance', field: 'relevance' },
                    { label: 'Common Keywords', field: 'commonKeywords' },
                    { label: 'Organic Keywords', field: '' },
                    { label: 'Organic Traffic', field: 'traffic' },
                    { label: 'Organic Cost', field: '' },
                    { label: 'Paid Keywords', field: '' },
                  ].map(h => (
                    <th key={h.label} style={thStyle} onClick={() => h.field && handleSortCp(h.field)}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {h.label} {h.field && <SortIcon field={h.field} active={cpSortBy} dir={cpSortDir} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cpItems.map((cp, i) => (
                  <tr key={cp.id} style={{ borderTop: '1px solid var(--border-subtle)', background: i % 2 === 1 ? 'var(--bg-glass-inset)' : undefined }}>
                    <td style={{ ...tdStyle, minWidth: 36, color: 'var(--text-muted)', fontWeight: 600 }}>{(cpPage - 1) * cpPageSize + i + 1}</td>
                    <td style={{ ...tdStyle, minWidth: 220 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button onClick={() => copyText(cp.domain, cp.id + 'dom')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-muted)', flexShrink: 0 }}>
                          {copied === cp.id + 'dom' ? <Check size={11} style={{ color: '#059669' }} /> : <Copy size={11} />}
                        </button>
                        <a href={'https://' + cp.domain} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
                          <ExternalLink size={10} style={{ flexShrink: 0 }} />
                          {cp.domain}
                        </a>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{
                          width: 50, height: 6, borderRadius: 3, background: 'var(--border-subtle)', overflow: 'hidden'
                        }}>
                          <div style={{ width: `${Math.min(100, cp.relevance * 100)}%`, height: '100%', background: 'var(--color-primary)', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{(cp.relevance * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle }}>
                      <span style={{ fontWeight: 600, color: cp.commonKeywords > 20 ? 'var(--color-primary)' : 'var(--text-secondary)' }}>{cp.commonKeywords.toLocaleString()}</span>
                    </td>
                    <td style={tdStyle}>{fmtNum(cp.organicKeywords)}</td>
                    <td style={tdStyle}>
                      <span style={{ color: cp.organicTraffic > 1000 ? '#059669' : 'var(--text-secondary)', fontWeight: cp.organicTraffic > 1000 ? 600 : 400 }}>{fmtNum(cp.organicTraffic)}</span>
                    </td>
                    <td style={tdStyle}>${fmtNum(cp.organicCost)}</td>
                    <td style={tdStyle}>{cp.adwordsKeywords > 0 ? <span style={{ color: '#d97706', fontWeight: 600 }}>{cp.adwordsKeywords}</span> : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages(total, pageSize) > 1 && (
          <div style={{
            padding: '10px 16px', borderTop: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={curPage === 1} style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 7,
              border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', cursor: curPage === 1 ? 'not-allowed' : 'pointer',
              color: curPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)', fontSize: 12
            }}>
              <ChevronLeft size={13} /> Previous
            </button>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Page {curPage} of {totalPages(total, pageSize)} · {total.toLocaleString()} total
            </span>
            <button onClick={() => setPage(p => Math.min(totalPages(total, pageSize), p + 1))} disabled={curPage >= totalPages(total, pageSize)} style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 7,
              border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', cursor: curPage >= totalPages(total, pageSize) ? 'not-allowed' : 'pointer',
              color: curPage >= totalPages(total, pageSize) ? 'var(--text-muted)' : 'var(--text-primary)', fontSize: 12
            }}>
              Next <ChevronRight size={13} />
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
