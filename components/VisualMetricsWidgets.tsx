'use client';

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Activity, 
  Stethoscope, 
  Sparkles, 
  Award,
  Zap,
  Globe,
  Layers
} from 'lucide-react';

// ==========================================
// 1. CIRCULAR RADIAL GAUGE METER
// ==========================================
interface CircularGaugeMeterProps {
  value: number;
  max?: number;
  label: string;
  subtitle?: string;
  color?: string;
  size?: number;
  badge?: string;
}

export function CircularGaugeMeter({
  value,
  max = 100,
  label,
  subtitle,
  color = '#2d6a4f',
  size = 130,
  badge
}: CircularGaugeMeterProps) {
  const radius = size * 0.38;
  const strokeWidth = size * 0.085;
  const circumference = 2 * Math.PI * radius;
  // Use a 240-degree arc for a classic speedometer / clinical gauge look
  const arcLength = circumference * 0.75;
  const pct = Math.min(1, Math.max(0, value / max));
  const dashOffset = arcLength * (1 - pct);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      position: 'relative'
    }}>
      <div style={{ position: 'relative', width: size, height: size * 0.85 }}>
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(135deg)', transformOrigin: '50% 50%' }}
        >
          {/* Background Track Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border-medium)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Value Progress Arc with Gradient */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>

        {/* Center Numeric Value & Rating */}
        <div style={{
          position: 'absolute',
          top: '46%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: `${size * 0.22}px`,
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            fontFamily: 'var(--font-mono)'
          }}>
            {value}
            <span style={{ fontSize: `${size * 0.11}px`, color: 'var(--text-muted)' }}>/{max}</span>
          </span>
          {badge && (
            <span style={{
              marginTop: '4px',
              fontSize: '10px',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: '9999px',
              background: 'var(--color-primary-soft)',
              color: 'var(--color-primary)'
            }}>
              {badge}
            </span>
          )}
        </div>
      </div>

      <div style={{ marginTop: '-4px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {label}
        </div>
        {subtitle && (
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '1px' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 2. SMOOTH BEZIER AREA SPARKLINE CURVE
// ==========================================
interface BezierAreaCurveProps {
  data: number[];
  width?: number | string;
  height?: number;
  color?: string;
  fillColor?: string;
  title?: string;
  currentValue?: string;
  delta?: string;
}

export function BezierAreaCurve({
  data = [24, 38, 45, 62, 58, 74, 88, 95, 112, 134, 158, 185],
  width = '100%',
  height = 80,
  color = '#2d6a4f',
  fillColor = 'rgba(45, 106, 79, 0.15)',
  title,
  currentValue,
  delta = '+18.4% MoM'
}: BezierAreaCurveProps) {
  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;
  const paddingX = 10;
  const paddingY = 12;

  const points = data.map((val, idx) => {
    const x = paddingX + (idx / (data.length - 1)) * (300 - paddingX * 2);
    const y = height - paddingY - ((val - minVal) / range) * (height - paddingY * 2);
    return { x, y };
  });

  // Build smooth cubic bezier curve SVG path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  // Area path closing to bottom
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <div style={{ width, display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {(title || currentValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {title && <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</span>}
            {currentValue && (
              <span style={{ marginLeft: '6px', fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {currentValue}
              </span>
            )}
          </div>
          {delta && (
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '9999px',
              background: '#dcfce7',
              color: '#166534',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px'
            }}>
              <TrendingUp size={11} /> {delta}
            </span>
          )}
        </div>
      )}

      <div style={{ width: '100%', height, overflow: 'hidden' }}>
        <svg viewBox={`0 0 300 ${height}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
          <defs>
            <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.32" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          {/* Subtle horizontal baseline grids */}
          <line x1="0" y1={height * 0.25} x2="300" y2={height * 0.25} stroke="var(--border-subtle)" strokeDasharray="3 3" />
          <line x1="0" y1={height * 0.5} x2="300" y2={height * 0.5} stroke="var(--border-subtle)" strokeDasharray="3 3" />
          <line x1="0" y1={height * 0.75} x2="300" y2={height * 0.75} stroke="var(--border-subtle)" strokeDasharray="3 3" />

          {/* Area Fill */}
          <path d={areaD} fill={`url(#grad-${color.replace('#', '')})`} />

          {/* Curve Stroke */}
          <path d={pathD} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />

          {/* Peak End Point Indicator */}
          <circle 
            cx={points[points.length - 1].x} 
            cy={points[points.length - 1].y} 
            r="4.5" 
            fill="#ffffff" 
            stroke={color} 
            strokeWidth="2.5" 
          />
        </svg>
      </div>
    </div>
  );
}

// ==========================================
// 3. SEGMENTED DONUT SILO RATIO METER
// ==========================================
interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export function SiloDonutMeter({
  segments,
  size = 140,
  centerTitle = '217',
  centerSubtitle = 'Silo Pages'
}: {
  segments: DonutSegment[];
  size?: number;
  centerTitle?: string;
  centerSubtitle?: string;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const radius = size * 0.36;
  const strokeWidth = size * 0.16;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPct = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          {segments.map((seg, idx) => {
            const pct = seg.value / total;
            const strokeDasharray = `${pct * circumference} ${circumference}`;
            const strokeDashoffset = -(accumulatedPct * circumference);
            accumulatedPct += pct;

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="butt"
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, fontFamily: 'var(--font-mono)' }}>
            {centerTitle}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '2px' }}>
            {centerSubtitle}
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, minWidth: '150px' }}>
        {segments.map((seg, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: seg.color }} />
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{seg.label}</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
              {seg.value} ({Math.round((seg.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 4. CLINICAL E-E-A-T 5-AXIS RADAR POLYGON
// ==========================================
export function ClinicalEEATPolygon({ size = 150 }: { size?: number }) {
  const center = size / 2;
  const radius = size * 0.38;
  const axes = [
    { label: 'MD Board', score: 0.98 },
    { label: '50-State', score: 1.0 },
    { label: 'NPI ID', score: 0.95 },
    { label: '503A Rx', score: 0.92 },
    { label: 'YMYL Trust', score: 0.90 }
  ];

  const numAxes = axes.length;
  const angleStep = (Math.PI * 2) / numAxes;

  const polygonPoints = axes.map((axis, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = radius * axis.score;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const gridCircles = [0.33, 0.66, 1.0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Grid Concentric Polygons */}
        {gridCircles.map((scale, idx) => {
          const gridPoints = Array.from({ length: numAxes }).map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const r = radius * scale;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(' ');
          return (
            <polygon 
              key={idx} 
              points={gridPoints} 
              fill="none" 
              stroke="var(--border-medium)" 
              strokeWidth="1" 
              strokeDasharray={idx < 2 ? "2 2" : "none"} 
            />
          );
        })}

        {/* Spokes */}
        {axes.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="var(--border-medium)" strokeWidth="1" />;
        })}

        {/* Filled Radar Area */}
        <polygon 
          points={polygonPoints} 
          fill="rgba(45, 106, 79, 0.28)" 
          stroke="#1b4332" 
          strokeWidth="2" 
        />

        {/* Vertex Dots */}
        {axes.map((axis, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const r = radius * axis.score;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          return (
            <circle key={i} cx={x} cy={y} r="3.5" fill="#74c69d" stroke="#1b4332" strokeWidth="1.5" />
          );
        })}
      </svg>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '-4px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>
          Overall E-E-A-T Score: 95/100 (Clinical Grade A+)
        </span>
      </div>
    </div>
  );
}

// ==========================================
// 5. COMPARISON PROGRESS METER BARS
// ==========================================
export function ComparisonBarMeter({
  label,
  ongoValue,
  competitorAvgValue,
  max = 100,
  unit = ''
}: {
  label: string;
  ongoValue: number;
  competitorAvgValue: number;
  max?: number;
  unit?: string;
}) {
  const ongoPct = Math.min(100, (ongoValue / max) * 100);
  const compPct = Math.min(100, (competitorAvgValue / max) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
        <span style={{ fontSize: '10px', color: '#64748b' }}>
          Ongo <strong>{ongoValue}{unit}</strong> vs Avg <strong>{competitorAvgValue}{unit}</strong>
        </span>
      </div>

      {/* Ongo Bar */}
      <div style={{ height: '7px', width: '100%', background: 'var(--border-subtle)', borderRadius: '9999px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ height: '100%', width: `${ongoPct}%`, background: 'var(--color-primary-light)', borderRadius: '9999px' }} />
      </div>

      {/* Competitor Avg Bar */}
      <div style={{ height: '4px', width: '100%', background: 'var(--border-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${compPct}%`, background: '#94a3b8', borderRadius: '9999px' }} />
      </div>
    </div>
  );
}

