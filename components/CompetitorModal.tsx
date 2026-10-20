'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Search, 
  Copy, 
  Check, 
  Globe, 
  FileText, 
  Activity, 
  Zap, 
  Layers,
  DollarSign
} from 'lucide-react';
import { CompetitorDetail } from '@/lib/data';

interface CompetitorModalProps {
  folder: string | null;
  onClose: () => void;
}

export default function CompetitorModal({ folder, onClose }: CompetitorModalProps) {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<CompetitorDetail | null>(null);
  const [activeUrlTab, setActiveUrlTab] = useState<'all' | 'semaglutide' | 'tirzepatide' | 'pricing'>('all');
  const [urlSearch, setUrlSearch] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!folder) return;
    setLoading(true);
    fetch(`/api/sitemap-detail?folder=${encodeURIComponent(folder)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDetail(data.detail);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [folder]);

  if (!folder) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const semaPages = detail?.keyGlp1Pages?.semaglutide_pages || [];
  const tirzPages = detail?.keyGlp1Pages?.tirzepatide_pages || [];
  const pricingPages = detail?.keyGlp1Pages?.pricing_pages || [];
  const allUrls = detail?.allUrls || [];

  let currentList = allUrls;
  if (activeUrlTab === 'semaglutide') currentList = semaPages;
  else if (activeUrlTab === 'tirzepatide') currentList = tirzPages;
  else if (activeUrlTab === 'pricing') currentList = pricingPages;

  const filteredUrls = currentList.filter(u => u.toLowerCase().includes(urlSearch.toLowerCase()));

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '960px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                Rank #{detail?.summary.rank || '—'}
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                {detail?.summary.name || 'Competitor Detail'}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
              <a
                href={`https://${detail?.summary.domain}`}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.85rem', color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {detail?.summary.domain} <ExternalLink size={12} />
              </a>
              {detail?.summary.primarySitemap && (
                <a
                  href={detail.summary.primarySitemap}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.8rem', color: '#34d399', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  Sitemap XML <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '8px',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading competitor sitemap data...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            {/* Stats row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              padding: '16px 24px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'rgba(0, 0, 0, 0.2)'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>TOTAL INDEXED</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                  {detail?.allUrls.length || detail?.summary.totalUrls || 0} URLs
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>SEMAGLUTIDE PAGES</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#34d399' }}>
                  {semaPages.length} URLs
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>TIRZEPATIDE PAGES</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#a78bfa' }}>
                  {tirzPages.length} URLs
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>PRICING PAGES</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fb7185' }}>
                  {pricingPages.length} URLs
                </div>
              </div>
            </div>

            {/* Filter Tabs & Search */}
            <div style={{
              padding: '12px 24px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              borderBottom: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setActiveUrlTab('all')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeUrlTab === 'all' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    color: activeUrlTab === 'all' ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  All ({allUrls.length})
                </button>
                <button
                  onClick={() => setActiveUrlTab('semaglutide')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeUrlTab === 'semaglutide' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                    color: activeUrlTab === 'semaglutide' ? '#34d399' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Semaglutide ({semaPages.length})
                </button>
                <button
                  onClick={() => setActiveUrlTab('tirzepatide')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeUrlTab === 'tirzepatide' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    color: activeUrlTab === 'tirzepatide' ? '#a78bfa' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Tirzepatide ({tirzPages.length})
                </button>
                <button
                  onClick={() => setActiveUrlTab('pricing')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeUrlTab === 'pricing' ? 'rgba(244, 63, 94, 0.2)' : 'transparent',
                    color: activeUrlTab === 'pricing' ? '#fb7185' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Pricing ({pricingPages.length})
                </button>
              </div>

              {/* URL Search input */}
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Filter URL paths..."
                  value={urlSearch}
                  onChange={(e) => setUrlSearch(e.target.value)}
                  className="input-field"
                  style={{ padding: '6px 10px 6px 30px', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            {/* URL List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {filteredUrls.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '40px' }}>
                  No matching URLs found in this view.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filteredUrls.map((url, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        fontSize: '0.85rem'
                      }}
                    >
                      <span style={{
                        wordBreak: 'break-all',
                        color: '#e2e8f0',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        marginRight: '12px'
                      }}>
                        {url}
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <button
                          onClick={() => handleCopy(url)}
                          title="Copy URL"
                          style={{
                            background: 'transparent',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            color: copiedUrl === url ? '#34d399' : 'var(--text-muted)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem'
                          }}
                        >
                          {copiedUrl === url ? <Check size={12} /> : <Copy size={12} />}
                        </button>

                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          title="Visit live page in new tab"
                          style={{
                            background: 'rgba(56, 189, 248, 0.1)',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            color: '#38bdf8',
                            textDecoration: 'none',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          Visit <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
