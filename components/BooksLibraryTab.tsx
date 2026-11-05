'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Download, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  LayoutGrid, 
  ChevronDown,
  Check,
  Search,
  Sparkles
} from 'lucide-react';
import { BooksIndexData, ONGO_PDF_BOOKS, PdfBookItem } from '@/lib/books-data';
import ContextCue from './ContextCue';

interface BooksLibraryTabProps {
  initialIndex?: BooksIndexData;
  initialSlug?: string;
  onBookChange?: (slug: string) => void;
}

export default function BooksLibraryTab({ initialIndex, initialSlug, onBookChange }: BooksLibraryTabProps) {
  const books = initialIndex?.books || ONGO_PDF_BOOKS;
  
  // Default to initialSlug if provided, otherwise the first book
  const defaultBook = initialSlug 
    ? books.find(b => b.slug === initialSlug) || books[0]
    : books[0];

  const [selectedBook, setSelectedBook] = useState<PdfBookItem>(defaultBook);
  const [viewMode, setViewMode] = useState<'reader' | 'grid'>('reader');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownFilter, setDropdownFilter] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync if initialSlug prop changes (e.g. from browser popstate or route navigation)
  useEffect(() => {
    if (initialSlug) {
      const match = books.find(b => b.slug === initialSlug);
      if (match && match.slug !== selectedBook.slug) {
        setSelectedBook(match);
      }
    }
  }, [initialSlug, books, selectedBook.slug]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Central book selection with URL synchronization & scroll-to-top
  const handleSelectBook = (b: PdfBookItem) => {
    setSelectedBook(b);
    setViewMode('reader');
    setDropdownOpen(false);
    onBookChange?.(b.slug);

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      const targetUrl = `/books/${b.slug}`;
      if (window.location.pathname !== targetUrl) {
        window.history.pushState({ tab: 'books', bookSlug: b.slug }, '', targetUrl);
      }
    }
  };

  const currentIndex = books.findIndex(b => b.slug === selectedBook.slug);
  const prevBook = currentIndex > 0 ? books[currentIndex - 1] : null;
  const nextBook = currentIndex < books.length - 1 ? books[currentIndex + 1] : null;

  const filteredDropdownBooks = dropdownFilter.trim()
    ? books.filter(b => 
        b.title.toLowerCase().includes(dropdownFilter.toLowerCase()) ||
        b.subtitle.toLowerCase().includes(dropdownFilter.toLowerCase()) ||
        b.category.toLowerCase().includes(dropdownFilter.toLowerCase()) ||
        String(b.bookNumber).includes(dropdownFilter)
      )
    : books;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Context Cue */}
      <ContextCue
        level={1}
        toolNumber={2}
        badge="7 Books (PDF)"
        title="7 Onboarding Books Digital Library"
        useCase="Study the exact onboarding playbooks covering clinical GLP-1 compounding laws, Next.js technical SEO, off-page PR, and analytics before executing site audits."
        about="This digital library embeds all 7 official onboarding books (2,924 pages, 518,620 words) written for the Ongo Weight Loss team. It renders the original updated PDF volumes directly inside your browser with full table-of-contents navigation, search (Ctrl+F), page zoom, bookmarks, and one-click downloads."
        whatYouCanDo={[
          {
            action: "Switch Books via Dropdown Menu",
            description: "Use the dedicated volume dropdown menu to switch books instantly while updating the browser URL to /books/[slug]."
          },
          {
            action: "Read Full PDF Volumes",
            description: "Read books 1 through 7 with browser-native zooming, multi-page layout, thumbnail panel, and text selection."
          },
          {
            action: "Toggle Reader vs Grid View",
            description: "Switch between the focused distraction-free PDF viewer and the multi-volume visual catalog."
          },
          {
            action: "Download Original PDFs",
            description: "Download any of the 7 updated PDF volumes for offline study or local clinical reference."
          }
        ]}
        tip="Use your browser's native search (Ctrl+F / Cmd+F) inside the embedded PDF viewer to search any clinical phrase, pharmacy statute, or Next.js code snippet across 2,924 pages."
      />

      {/* Sleek Minimalist Tool Header */}
      <div className="tool-header-dark" style={{ padding: '16px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                background: 'rgba(52, 126, 93, 0.25)',
                color: '#74c69d',
                border: '1px solid rgba(116, 198, 157, 0.3)'
              }}>
                <BookOpen size={11} /> Digital Library
              </span>
              <span className="badge-minimal-forest" style={{ fontSize: '0.7rem' }}>
                7 Volumes · 2,924 Pages
              </span>
            </div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
              Ongo Weight Loss · Direct PDF Reader
            </h1>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Full vector charts, clinical diagrams, and native in-browser PDF search/zoom
            </p>
          </div>

          {/* Controls: Book Switcher Dropdown & View Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Dedicated Dropdown Menu to Change the Book */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 14px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(116, 198, 157, 0.4)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  backdropFilter: 'blur(8px)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)')}
                title="Click to open dropdown menu and switch book"
              >
                <div style={{
                  background: '#74c69d',
                  color: '#081c15',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 800
                }}>
                  0{selectedBook.bookNumber}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                  <span style={{ fontSize: '10px', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Change Book Volume
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 700, maxWidth: '210px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedBook.title}
                  </span>
                </div>
                <ChevronDown size={15} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', color: '#74c69d' }} />
              </button>

              {/* Floating Book Dropdown Menu */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '380px',
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
                  border: '1px solid #cbd5e1',
                  padding: '10px',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  {/* Dropdown Header */}
                  <div style={{
                    padding: '8px 10px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#1b4332', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Select Onboarding Volume
                    </span>
                    <span style={{ fontSize: '10px', background: '#dcfce7', color: '#166534', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      7 Books Available
                    </span>
                  </div>

                  {/* Search inside dropdown */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    background: '#f1f5f9',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <Search size={13} color="#64748b" />
                    <input
                      type="text"
                      placeholder="Filter books by title or topic..."
                      value={dropdownFilter}
                      onChange={(e) => setDropdownFilter(e.target.value)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '12px',
                        width: '100%',
                        color: '#1e293b'
                      }}
                      autoFocus
                    />
                  </div>

                  {/* List of Books */}
                  <div style={{
                    maxHeight: '360px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    {filteredDropdownBooks.map(b => {
                      const isSelected = b.slug === selectedBook.slug;
                      return (
                        <button
                          key={b.slug}
                          onClick={() => handleSelectBook(b)}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            padding: '10px',
                            borderRadius: '8px',
                            border: isSelected ? '1px solid #86efac' : '1px solid transparent',
                            background: isSelected ? '#f0fdf4' : 'transparent',
                            color: isSelected ? '#166534' : '#1e293b',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                            transition: 'all 0.12s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            backgroundColor: isSelected ? '#1b4332' : '#f1f5f9',
                            color: isSelected ? '#74c69d' : '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '12px',
                            flexShrink: 0
                          }}>
                            0{b.bookNumber}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '13px', fontWeight: isSelected ? 800 : 700, color: isSelected ? '#166534' : '#0f172a' }}>
                                {b.title}
                              </span>
                              {isSelected && <Check size={14} color="#166534" />}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '1px', lineHeight: 1.3 }}>
                              {b.category}
                            </div>
                            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px' }}>
                              {b.totalPages} pages · {b.fileSize}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* View Mode Switcher */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '3px',
              border: '1px solid rgba(255, 255, 255, 0.18)'
            }}>
              <button
                onClick={() => setViewMode('reader')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === 'reader' ? '#ffffff' : 'transparent',
                  color: viewMode === 'reader' ? '#1b4332' : 'rgba(255,255,255,0.85)',
                  transition: 'all 0.15s ease'
                }}
              >
                <BookOpen size={14} />
                PDF Reader
              </button>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === 'grid' ? '#ffffff' : 'transparent',
                  color: viewMode === 'grid' ? '#1b4332' : 'rgba(255,255,255,0.85)',
                  transition: 'all 0.15s ease'
                }}
              >
                <LayoutGrid size={14} />
                Shelf Grid
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Book Switcher Tabs */}
        <div style={{
          marginTop: '18px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }} className="no-scrollbar">
          {books.map(b => {
            const isSelected = selectedBook.slug === b.slug;
            return (
              <button
                key={b.slug}
                onClick={() => handleSelectBook(b)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: isSelected ? '1px solid #74c69d' : '1px solid rgba(255, 255, 255, 0.15)',
                  background: isSelected ? 'rgba(116, 198, 157, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{
                  background: isSelected ? '#74c69d' : 'rgba(255, 255, 255, 0.2)',
                  color: isSelected ? '#081c15' : '#ffffff',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 800
                }}>
                  0{b.bookNumber}
                </span>
                <span>{b.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Body: Reader Mode or Shelf Grid */}
      {viewMode === 'reader' ? (
        /* DIRECT EMBEDDED PDF VIEWER */
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #cbd5e1',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Reader Top Bar */}
          <div style={{
            padding: '12px 20px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            {/* Book Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                background: '#1b4332',
                color: '#74c69d',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 800
              }}>
                BOOK 0{selectedBook.bookNumber}
              </span>
              <div>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                  {selectedBook.title}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {selectedBook.subtitle} · {selectedBook.totalPages} pages ({selectedBook.fileSize})
                </span>
              </div>
            </div>

            {/* Actions: Direct Quick Select Dropdown + Prev / Next / Fullscreen / Download */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Quick Select Dropdown inside Reader Toolbar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Switch:</span>
                <select
                  value={selectedBook.slug}
                  onChange={(e) => {
                    const match = books.find(b => b.slug === e.target.value);
                    if (match) handleSelectBook(match);
                  }}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '5px 8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#1b4332',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                  title="Quickly switch to another onboarding volume"
                >
                  {books.map(b => (
                    <option key={b.slug} value={b.slug}>
                      Book 0{b.bookNumber}: {b.title} ({b.totalPages} pgs)
                    </option>
                  ))}
                </select>
              </div>

              {/* Prev Book Button */}
              <button
                disabled={!prevBook}
                onClick={() => prevBook && handleSelectBook(prevBook)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: prevBook ? '#ffffff' : '#f1f5f9',
                  color: prevBook ? '#1b4332' : '#94a3b8',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: prevBook ? 'pointer' : 'not-allowed'
                }}
                title={prevBook ? `Go to Book ${prevBook.bookNumber}: ${prevBook.title}` : ''}
              >
                <ChevronLeft size={14} />
                Prev Book
              </button>

              {/* Next Book Button */}
              <button
                disabled={!nextBook}
                onClick={() => nextBook && handleSelectBook(nextBook)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: nextBook ? '#ffffff' : '#f1f5f9',
                  color: nextBook ? '#1b4332' : '#94a3b8',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: nextBook ? 'pointer' : 'not-allowed'
                }}
                title={nextBook ? `Go to Book ${nextBook.bookNumber}: ${nextBook.title}` : ''}
              >
                Next Book
                <ChevronRight size={14} />
              </button>

              {/* Open in New Window Button */}
              <a
                href={selectedBook.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#1b4332',
                  fontSize: '12px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
                title="Open PDF in new browser tab"
              >
                <Maximize2 size={13} />
                Full Window
              </a>

              {/* Download PDF Button */}
              <a
                href={selectedBook.pdfUrl}
                download={selectedBook.fileName}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#1b4332',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <Download size={13} />
                Download PDF
              </a>
            </div>
          </div>

          {/* Interactive Native PDF Iframe */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: 'calc(100vh - 240px)',
            minHeight: '820px',
            backgroundColor: '#525659'
          }}>
            <iframe
              key={selectedBook.slug}
              src={`${selectedBook.pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              title={`Ongo Weight Loss - Book ${selectedBook.bookNumber}: ${selectedBook.title}`}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block'
              }}
            />
          </div>
        </div>
      ) : (
        /* SHELF GRID VIEW */
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '20px'
          }}>
            {books.map(b => (
              <div
                key={b.slug}
                onClick={() => handleSelectBook(b)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(27, 67, 50, 0.12)';
                  e.currentTarget.style.borderColor = '#74c69d';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{
                      backgroundColor: '#e8f5e9',
                      color: '#2d6a4f',
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      BOOK 0{b.bookNumber}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                      {b.totalPages} pages · {b.fileSize}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1b4332', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                    {b.title}
                  </h3>
                  
                  <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                    {b.subtitle}
                  </p>

                  <div style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    color: '#15803d',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    marginBottom: '16px'
                  }}>
                    {b.category}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '16px',
                  marginTop: '12px'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectBook(b);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#1b4332',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2d6a4f')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1b4332')}
                  >
                    <BookOpen size={14} />
                    Open PDF in Reader
                  </button>

                  <a
                    href={b.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#475569',
                      fontSize: '12px',
                      textDecoration: 'none',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc'
                    }}
                  >
                    <ExternalLink size={13} />
                    Full Window
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
