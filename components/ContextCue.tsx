'use client';

import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, Sparkles, CheckCircle2 } from 'lucide-react';

interface ContextCueProps {
  badge?: string;
  title: string;
  summary: string;
  details?: {
    label: string;
    description: string;
  }[];
  tip?: string;
}

export default function ContextCue({
  badge = 'What you are seeing',
  title,
  summary,
  details,
  tip
}: ContextCueProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '14px 18px',
      fontSize: '0.8rem',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{
            marginTop: '2px',
            color: 'var(--text-tertiary)',
            flexShrink: 0
          }}>
            <Info size={15} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
              <span className="badge-minimal" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                {badge}
              </span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {title}
              </span>
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {summary}
            </p>
          </div>
        </div>

        {details && details.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.72rem',
              padding: '4px 6px',
              borderRadius: '4px',
              flexShrink: 0
            }}
          >
            <span>{expanded ? 'Less info' : 'Learn more'}</span>
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        )}
      </div>

      {/* Expanded Details */}
      {expanded && details && (
        <div style={{
          marginTop: '12px',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '10px'
        }}>
          {details.map((item, idx) => (
            <div key={idx} style={{ background: 'var(--bg-canvas)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.75rem', marginBottom: '2px' }}>
                {item.label}
              </div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', lineHeight: 1.4 }}>
                {item.description}
              </div>
            </div>
          ))}

          {tip && (
            <div style={{
              gridColumn: '1 / -1',
              padding: '6px 10px',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              fontSize: '0.72rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Sparkles size={12} />
              <span><strong>Actionable Hint:</strong> {tip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
