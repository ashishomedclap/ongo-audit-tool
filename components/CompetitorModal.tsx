'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Search, 
  Copy, 
  Check,
  ShieldCheck
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
      backgroundColor: 'rgba(15, 44, 36, 0.65)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="bento-card" style={{
        width: '100%',
        maxWidth: '920px',
        maxHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--border-medium)',
        boxShadow: '0 24px 60px rgba(15, 44, 36, 0.35)',
        background: '#ffffff'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 26px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(180deg, #faf7f2 0%, #ffffff 100%)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--color-primary-dark)', fontWeight: 700 }}>
                RANK #{detail?.summary.rank || '—'}
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                {detail?.summary.name || 'Competitor Detail'}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
              <a
                href={`https://${detail?.summary.domain}`}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.78rem', color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}
              >
                {detail?.summary.domain} <ExternalLink size={11} />
              </a>
              {detail?.summary.primarySitemap && (
                <a
                  href={detail.summary.primarySitemap}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  XML Sitemap <ExternalLink size={10} />
                </a>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-medium)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary-dark)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
            Loading competitor crawled URLs...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            {/* Stats row in warm cream */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              padding: '16px 26px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--bg-canvas)'
            }}>
              <div>
                <div style={{ fontSize: '0.67rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>TOTAL INDEXED</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary-dark)', fontFamily: 'var(--font-mono)' }}>
                  {detail?.allUrls.length || detail?.summary.totalUrls || 0}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.67rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>SEMAGLUTIDE</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                  {semaPages.length}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.67rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>TIRZEPATIDE</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>
                  {tirzPages.length}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.67rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>PRICING</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-accent-warm)', fontFamily: 'var(--font-mono)' }}>
                  {pricingPages.length}
                </div>
              </div>
            </div>

            {/* Filter Tabs & Search */}
            <div style={{
              padding: '12px 26px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              borderBottom: '1px solid var(--border-subtle)',
              background: '#ffffff'
            }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { id: 'all', label: `All (${allUrls.length})` },
                  { id: 'semaglutide', label: `Semaglutide (${semaPages.length})` },
                  { id: 'tirzepatide', label: `Tirzepatide (${tirzPages.length})` },
                  { id: 'pricing', label: `Pricing (${pricingPages.length})` }
                ].map(tab => {
                  const isActive = activeUrlTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveUrlTab(tab.id as typeof activeUrlTab)}
                      style={{
                        padding: '5px 12px',
                        fontSize: '0.74rem',
                        borderRadius: '9999px',
                        border: '1px solid',
                        borderColor: isActive ? '#1b4332' : 'var(--border-medium)',
                        background: isActive ? '#1b4332' : '#ffffff',
                        color: isActive ? '#ffffff' : 'var(--text-secondary)',
                        fontWeight: isActive ? 700 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* URL Search input */}
              <div style={{ position: 'relative', width: '240px' }}>
                <Search size={13} color="var(--color-primary)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Filter URL paths..."
                  value={urlSearch}
                  onChange={(e) => setUrlSearch(e.target.value)}
                  className="input-minimal"
                  style={{ padding: '5px 10px 5px 30px', fontSize: '0.75rem', borderRadius: '9999px' }}
                />
              </div>
            </div>

            {/* URL List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 26px', background: '#ffffff' }}>
              {filteredUrls.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '36px', fontSize: '0.8rem' }}>
                  No URLs match this filter.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {filteredUrls.map((url, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: 'var(--bg-canvas)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        fontSize: '0.78rem'
                      }}
                    >
                      <span style={{
                        wordBreak: 'break-all',
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        marginRight: '12px'
                      }}>
                        {url}
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <button
                          onClick={() => handleCopy(url)}
                          title="Copy URL"
                          style={{
                            background: '#ffffff',
                            border: '1px solid var(--border-medium)',
                            borderRadius: '4px',
                            color: copiedUrl === url ? '#1b4332' : 'var(--text-tertiary)',
                            cursor: 'pointer',
                            padding: '3px 6px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {copiedUrl === url ? <Check size={11} color="#347e5d" /> : <Copy size={11} />}
                        </button>

                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            background: '#ffffff',
                            border: '1px solid var(--border-medium)',
                            borderRadius: '4px',
                            color: 'var(--color-primary-dark)',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '3px 6px'
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
