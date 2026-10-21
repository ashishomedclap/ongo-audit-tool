'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  CheckCircle2,
  Info
} from 'lucide-react';

export interface ActionItem {
  action: string;
  description: string;
  badge?: string;
}

export interface ContextCueProps {
  badge?: string;
  title: string;
  // Explicit "What this page is about"
  about?: string | React.ReactNode;
  // Explicit "What you can do from this page"
  whatYouCanDo?: ActionItem[];
  // Fallbacks for backward compatibility
  summary?: string;
  details?: {
    label: string;
    description: string;
  }[];
  tip?: string;
}

export default function ContextCue({
  badge = 'Page Guide',
  title,
  about,
  whatYouCanDo,
  summary,
  details,
  tip
}: ContextCueProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Normalize about content
  const aboutContent = about || summary || '';

  // Normalize what you can do items
  const actionsList: ActionItem[] = whatYouCanDo && whatYouCanDo.length > 0
    ? whatYouCanDo
    : details
    ? details.map(d => ({ action: d.label, description: d.description }))
    : [];

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 4px 18px rgba(27, 67, 50, 0.05)',
      overflow: 'hidden',
      transition: 'all 0.2s ease'
    }}>
      {/* Top Banner Header */}
      <div style={{
        padding: '14px 20px',
        background: 'linear-gradient(to right, #fcfaf6, #ffffff)',
        borderBottom: collapsed ? 'none' : '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span className="badge-minimal badge-minimal-coral" style={{ fontSize: '0.7rem', padding: '2px 9px', letterSpacing: '0.02em' }}>
            {badge}
          </span>
          <h2 style={{
            fontSize: '0.95rem',
            fontWeight: 800,
            color: 'var(--color-primary-dark)',
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            {title}
          </h2>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'var(--bg-canvas)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--color-primary-dark)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.72rem',
            fontWeight: 600,
            padding: '5px 12px',
            borderRadius: '9999px',
            flexShrink: 0,
            transition: 'all 0.15s ease'
          }}
          title={collapsed ? "Expand page instructions" : "Collapse page instructions"}
        >
          <span>{collapsed ? 'Show Page Guide' : 'Hide Page Guide'}</span>
          {collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
        </button>
      </div>

      {/* Guide Content: What this page is about & What you can do from this page */}
      {!collapsed && (
        <div style={{ padding: '18px 20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '16px',
            alignItems: 'stretch'
          }}>
            {/* Box 1: What this page is about */}
            <div style={{
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  background: 'var(--color-primary-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary-dark)'
                }}>
                  <BookOpen size={14} />
                </div>
                <h3 style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--color-primary-dark)',
                  margin: 0
                }}>
                  What this page is about
                </h3>
              </div>

              <div style={{
                color: 'var(--text-secondary)',
                fontSize: '0.81rem',
                lineHeight: 1.6,
                flex: 1
              }}>
                {typeof aboutContent === 'string' ? (
                  <p style={{ margin: 0 }}>{aboutContent}</p>
                ) : (
                  aboutContent
                )}
              </div>
            </div>

            {/* Box 2: What you can do from this page */}
            <div style={{
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  background: 'rgba(231, 111, 81, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-accent)'
                }}>
                  <Zap size={14} />
                </div>
                <h3 style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--color-primary-dark)',
                  margin: 0
                }}>
                  What you can do from this page
                </h3>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                flex: 1
              }}>
                {actionsList.map((item, idx) => (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '0.78rem',
                      lineHeight: 1.45,
                      color: 'var(--text-primary)'
                    }}
                  >
                    <div style={{
                      marginTop: '3px',
                      color: 'var(--color-primary)',
                      flexShrink: 0
                    }}>
                      <CheckCircle2 size={13} color="var(--color-primary)" />
                    </div>
                    <div>
                      <strong style={{ color: 'var(--color-primary-dark)', fontWeight: 700 }}>
                        {item.action}:
                      </strong>{' '}
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {item.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actionable Pro-Tip / Hint */}
          {tip && (
            <div style={{
              marginTop: '14px',
              padding: '9px 14px',
              borderRadius: '8px',
              background: 'var(--color-primary-soft)',
              border: '1px solid #b7e4c7',
              color: '#1b4332',
              fontSize: '0.76rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Sparkles size={14} color="#347e5d" style={{ flexShrink: 0 }} />
              <span><strong>Actionable Hint:</strong> {tip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
