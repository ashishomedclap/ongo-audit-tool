'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Search, 
  Copy, 
  Check
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
      <div className="bento-card" style={{
        width: '100%',
        maxWidth: '900px',
        maxHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-bento-hover)'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                #{detail?.summary.rank || '—'}
              </span>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {detail?.summary.name || 'Competitor Detail'}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '3px' }}>
              <a
                href={`https://${detail?.summary.domain}`}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}
              >
                {detail?.summary.domain} <ExternalLink size={10} />
              </a>
              {detail?.summary.primarySitemap && (
                <a
                  href={detail.summary.primarySitemap}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  XML <ExternalLink size={10} />
                </a>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '6px',
              color: 'var(--text-tertiary)',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        {loading ? (
          <div style={{ padding: '50px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Loading competitor data...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            {/* Stats row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              padding: '14px 24px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--bg-canvas)'
            }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>TOTAL INDEXED</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {detail?.allUrls.length || detail?.summary.totalUrls || 0}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>SEMAGLUTIDE</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {semaPages.length}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>TIRZEPATIDE</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {tirzPages.length}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>PRICING</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {pricingPages.length}
                </div>
              </div>
            </div>

            {/* Filter Tabs & Search */}
            <div style={{
              padding: '10px 24px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              borderBottom: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[
                  { id: 'all', label: `All (${allUrls.length})` },
                  { id: 'semaglutide', label: `Semaglutide (${semaPages.length})` },
                  { id: 'tirzepatide', label: `Tirzepatide (${tirzPages.length})` },
                  { id: 'pricing', label: `Pricing (${pricingPages.length})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveUrlTab(tab.id as typeof activeUrlTab)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      borderRadius: '5px',
                      border: 'none',
                      background: activeUrlTab === tab.id ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                      color: activeUrlTab === tab.id ? '#fafafa' : 'var(--text-tertiary)',
                      cursor: 'pointer'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* URL Search input */}
              <div style={{ position: 'relative', width: '220px' }}>
                <Search size={12} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Filter URL paths..."
                  value={urlSearch}
                  onChange={(e) => setUrlSearch(e.target.value)}
                  className="input-minimal"
                  style={{ padding: '4px 8px 4px 26px', fontSize: '0.75rem' }}
                />
              </div>
            </div>

            {/* URL List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 24px' }}>
              {filteredUrls.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px', fontSize: '0.8rem' }}>
                  No URLs match this filter.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {filteredUrls.map((url, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        background: 'var(--bg-canvas)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '5px',
                        fontSize: '0.78rem'
                      }}
                    >
                      <span style={{
                        wordBreak: 'break-all',
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        marginRight: '10px'
                      }}>
                        {url}
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                        <button
                          onClick={() => handleCopy(url)}
                          title="Copy URL"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: copiedUrl === url ? '#34d399' : 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '2px'
                          }}
                        >
                          {copiedUrl === url ? <Check size={11} /> : <Copy size={11} />}
                        </button>

                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: 'var(--text-tertiary)',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <ExternalLink size={11} />
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
