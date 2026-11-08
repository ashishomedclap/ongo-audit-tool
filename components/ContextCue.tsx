'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2,
  HelpCircle,
  X
} from 'lucide-react';

export interface ActionItem {
  action: string;
  description: string;
  badge?: string;
}

export interface ContextCueProps {
  badge?: string;
  title: string;
  level?: 1 | 2 | 3;
  toolNumber?: number;
  useCase?: string;
  about?: string | React.ReactNode;
  whatYouCanDo?: ActionItem[];
  summary?: string;
  details?: {
    label: string;
    description: string;
  }[];
  tip?: string;
}

export default function ContextCue({
  badge = 'Guide',
  title,
  level,
  toolNumber,
  useCase,
  about,
  whatYouCanDo,
  summary,
  details,
  tip
}: ContextCueProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const aboutContent = about || summary || '';
  const actionsList: ActionItem[] = whatYouCanDo && whatYouCanDo.length > 0
    ? whatYouCanDo
    : details
    ? details.map(d => ({ action: d.label, description: d.description }))
    : [];

  const displayText = useCase || (typeof aboutContent === 'string' ? aboutContent : title);

  return (
    <div style={{
      borderRadius: '12px',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      marginBottom: '16px'
    }}>
      {/* Sleek 1-Line Minimalist Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 14px',
        gap: '12px',
        fontSize: '0.8rem',
        background: 'var(--bg-surface-alt)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontSize: '0.7rem',
            fontWeight: 700,
            background: 'rgba(30, 90, 64, 0.1)',
            color: 'var(--color-primary-dark)',
            flexShrink: 0
          }}>
            <Sparkles size={11} /> {badge}
          </span>
          <span style={{
            color: 'var(--text-secondary)',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {displayText}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 10px',
              borderRadius: '9999px',
              border: '1px solid var(--border-medium)',
              background: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <HelpCircle size={12} />
            <span>{collapsed ? 'How to use' : 'Close guide'}</span>
            {collapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
          </button>
          <button
            onClick={() => setDismissed(true)}
            title="Dismiss tip"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px'
            }}
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Expanded Friendly Guide */}
      {!collapsed && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {aboutContent && (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  What this tool does
                </div>
                <div>{aboutContent}</div>
                {tip && (
                  <div style={{
                    marginTop: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-surface-alt)',
                    borderLeft: '3px solid var(--color-primary)',
                    fontSize: '0.78rem'
                  }}>
                    <strong>Pro Tip:</strong> {tip}
                  </div>
                )}
              </div>
            )}

            {actionsList.length > 0 && (
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.82rem', marginBottom: '8px' }}>
                  Quick Actions
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {actionsList.slice(0, 4).map((action, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.78rem' }}>
                      <CheckCircle2 size={13} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ color: 'var(--text-primary)' }}>{action.action}: </strong>
                        <span style={{ color: 'var(--text-secondary)' }}>{action.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
