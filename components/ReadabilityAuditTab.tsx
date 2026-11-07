'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  Zap,
  HelpCircle,
  Stethoscope,
  Smile,
  ShieldCheck
} from 'lucide-react';
import ContextCue from './ContextCue';

interface JargonRule {
  jargon: string;
  replacement: string;
  category: 'Administration' | 'Pathology' | 'Metabolic' | 'Pharmacology';
}

const MEDICAL_JARGON_DICTIONARY: JargonRule[] = [
  { jargon: 'subcutaneous', replacement: 'under-the-skin injection', category: 'Administration' },
  { jargon: 'gastroparesis', replacement: 'delayed stomach emptying', category: 'Pathology' },
  { jargon: 'hyperglycemia', replacement: 'high blood sugar', category: 'Metabolic' },
  { jargon: 'hypoglycemia', replacement: 'low blood sugar', category: 'Metabolic' },
  { jargon: 'steatohepatitis', replacement: 'fatty liver disease', category: 'Pathology' },
  { jargon: 'titration', replacement: 'gradually adjusting your dose', category: 'Pharmacology' },
  { jargon: 'contraindicated', replacement: 'not recommended or unsafe for', category: 'Administration' },
  { jargon: 'pharmacokinetics', replacement: 'how the body absorbs the medicine', category: 'Pharmacology' },
  { jargon: 'comorbidity', replacement: 'related health condition (like high blood pressure)', category: 'Pathology' },
  { jargon: 'satiety', replacement: 'feeling full after meals', category: 'Metabolic' },
  { jargon: 'pancreatitis', replacement: 'inflammation of the pancreas', category: 'Pathology' },
  { jargon: 'emesis', replacement: 'vomiting or nausea', category: 'Pathology' },
  { jargon: 'polyphagia', replacement: 'excessive hunger', category: 'Metabolic' }
];

const PRESET_TEXTS = [
  {
    id: 'hero-page',
    title: 'Ongo Homepage Patient Introduction',
    text: `At Ongo, our doctor-led virtual medical team makes weight loss simple and accessible. We deliver compounded semaglutide and tirzepatide directly to your home from licensed US pharmacies. Under physician guidance, you will receive personalized support to help you feel full, manage cravings, and build sustainable healthy habits.`
  },
  {
    id: 'clinical-draft',
    title: 'Clinical Service Page (Moderate Reading Level)',
    text: `Compounded semaglutide is a subcutaneous GLP-1 medication indicated for adults with a BMI >= 30. During initial titration, doses start at 0.25mg to minimize gastrointestinal discomfort like nausea or delayed gastric emptying. Patients should note that GLP-1 medications are contraindicated in individuals with personal or family history of medullary thyroid carcinoma or MEN 2 comorbidity.`
  },
  {
    id: 'complex-jargon',
    title: 'High Jargon Endocrinology Draft (Fails AMA Guidelines)',
    text: `The pharmacokinetics of dual incretin receptor agonists elicit profound suppression of postprandial hyperglycemia and hepatic steatohepatitis. Progressive titration is mandatory to mitigate severe emesis and secondary gastroparesis. Patients presenting with acute pancreatitis or pre-existing endocrinological comorbidities require strict contraindication screening.`
  }
];

export default function ReadabilityAuditTab() {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_TEXTS[0].id);
  const [text, setText] = useState(PRESET_TEXTS[0].text);
  const [copiedText, setCopiedText] = useState(false);

  // Compute Readability Metrics using standard Flesch-Kincaid algorithms
  const metrics = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        wordCount: 0,
        sentenceCount: 0,
        syllableCount: 0,
        fleschEase: 100,
        gradeLevel: 0,
        avgSentenceLength: 0,
        detectedJargon: []
      };
    }

    const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = trimmed.split(/\s+/).filter(w => w.trim().length > 0);
    const sentenceCount = Math.max(sentences.length, 1);
    const wordCount = Math.max(words.length, 1);

    // Heuristic syllable counter
    const countWordSyllables = (word: string) => {
      let w = word.toLowerCase().replace(/[^a-z]/g, '');
      if (w.length <= 3) return 1;
      w = w.replace(/(?:[^laeiouy]|ed|es|e)$/, '');
      w = w.replace(/^y/, '');
      const matches = w.match(/[aeiouy]{1,2}/g);
      return matches ? matches.length : 1;
    };

    let totalSyllables = 0;
    words.forEach(w => {
      totalSyllables += countWordSyllables(w);
    });

    const avgWordsPerSentence = wordCount / sentenceCount;
    const avgSyllablesPerWord = totalSyllables / wordCount;

    // Flesch Reading Ease: 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
    const fleschEase = Math.round(
      Math.max(0, Math.min(100, 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord))
    );

    // Flesch-Kincaid Grade Level: 0.39 * (total words / total sentences) + 11.8 * (total syllables / total words) - 15.59
    const gradeLevel = Math.max(
      1,
      Math.round((0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59) * 10) / 10
    );

    // Jargon detection
    const lowerText = trimmed.toLowerCase();
    const detectedJargon = MEDICAL_JARGON_DICTIONARY.filter(rule => {
      const regex = new RegExp(`\\b${rule.jargon}\\b`, 'i');
      return regex.test(lowerText);
    });

    return {
      wordCount,
      sentenceCount,
      syllableCount: totalSyllables,
      fleschEase,
      gradeLevel,
      avgSentenceLength: Math.round(avgWordsPerSentence * 10) / 10,
      detectedJargon
    };
  }, [text]);

  const handleSelectPreset = (presetId: string) => {
    const found = PRESET_TEXTS.find(p => p.id === presetId);
    if (found) {
      setSelectedPreset(presetId);
      setText(found.text);
    }
  };

  const handleReplaceJargon = (rule: JargonRule) => {
    const regex = new RegExp(`\\b${rule.jargon}\\b`, 'gi');
    setText(prev => prev.replace(regex, rule.replacement));
  };

  const isCompliant = metrics.gradeLevel <= 8.5;

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 8px' }}>
      {/* Context Cue Banner */}
      <ContextCue
        title="US AMA/NIH Patient Readability & Jargon Auditor"
        level={2}
        toolNumber={26}
        badge="AMA & NIH Grade Level Compliant"
        useCase="Audits health content against American Medical Association (AMA) guidelines mandating 6th-to-8th grade reading levels, flagging multi-syllabic medical jargon and suggesting patient-friendly alternatives."
      />

      {/* Top Readability Scores Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
        margin: '24px 0'
      }}>
        <div className="glass-card" style={{ padding: '20px 24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Flesch-Kincaid Grade
            </span>
            <BookOpen size={18} color={isCompliant ? '#059669' : '#dc2626'} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '36px', fontWeight: 900, color: isCompliant ? '#059669' : '#dc2626', letterSpacing: '-0.02em' }}>
              Grade {metrics.gradeLevel}
            </span>
            <span style={{
              padding: '3px 10px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 800,
              backgroundColor: isCompliant ? 'rgba(5, 150, 105, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              color: isCompliant ? '#059669' : '#dc2626'
            }}>
              {isCompliant ? 'AMA COMPLIANT (6-8th)' : 'TOO COMPLEX (FAIL)'}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            AMA & NIH mandate: Max 8th-grade level for patient materials
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Flesch Reading Ease
            </span>
            <Smile size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: '36px', fontWeight: 900, color: '#0284c7', letterSpacing: '-0.02em' }}>
            {metrics.fleschEase} <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-tertiary)' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {metrics.fleschEase >= 70 ? 'Very Easy to read for general patients' : (metrics.fleschEase >= 55 ? 'Moderate readability' : 'Dense medical prose')}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Complex Jargon Terms
            </span>
            <AlertTriangle size={18} color={metrics.detectedJargon.length === 0 ? '#059669' : '#ea580c'} />
          </div>
          <div style={{ fontSize: '36px', fontWeight: 900, color: metrics.detectedJargon.length === 0 ? '#059669' : '#ea580c', letterSpacing: '-0.02em' }}>
            {metrics.detectedJargon.length} <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-tertiary)' }}>terms</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {metrics.detectedJargon.length === 0 ? 'Zero clinical jargon barriers detected' : '1-click plain language replacements available'}
          </div>
        </div>
      </div>

      {/* Interactive Editor & Jargon Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {/* Editor Area */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Live Content Editor
            </h3>
            <div style={{ display: 'flex', gap: '6px' }}>
              {PRESET_TEXTS.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p.id)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: selectedPreset === p.id ? '#ea580c' : 'var(--border-subtle)',
                    backgroundColor: selectedPreset === p.id ? 'rgba(234, 88, 12, 0.12)' : 'transparent',
                    color: selectedPreset === p.id ? '#ea580c' : 'var(--text-secondary)'
                  }}
                >
                  {p.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              lineHeight: 1.7,
              fontFamily: 'inherit',
              marginBottom: '14px'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              {metrics.wordCount} words &bull; {metrics.sentenceCount} sentences &bull; {metrics.avgSentenceLength} words/sentence
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(text);
                setCopiedText(true);
                setTimeout(() => setCopiedText(false), 2000);
              }}
              className="btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', fontSize: '12px', borderRadius: '8px' }}
            >
              {copiedText ? <Check size={13} /> : <Copy size={13} />}
              {copiedText ? 'Copied' : 'Copy Optimized Draft'}
            </button>
          </div>
        </div>

        {/* Jargon Replacement Suggestions */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Stethoscope size={18} color="#ea580c" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                1-Click Jargon Simplifier
              </h3>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              {metrics.detectedJargon.length} flagged
            </span>
          </div>

          {metrics.detectedJargon.length === 0 ? (
            <div style={{
              padding: '36px 20px',
              textAlign: 'center',
              backgroundColor: 'rgba(5, 150, 105, 0.04)',
              borderRadius: '12px',
              border: '1px dashed rgba(5, 150, 105, 0.3)'
            }}>
              <CheckCircle2 size={32} color="#059669" style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#059669' }}>
                100% Plain-Language Compliant
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '6px 0 0 0' }}>
                No complex multi-syllabic jargon terms found. Patients will easily understand your telehealth instructions.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {metrics.detectedJargon.map((rule, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-input)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 700,
                        backgroundColor: 'rgba(234, 88, 12, 0.1)',
                        color: '#ea580c'
                      }}>
                        {rule.category}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#dc2626', textDecoration: 'line-through' }}>
                        {rule.jargon}
                      </span>
                      <ArrowRight size={13} color="var(--text-tertiary)" />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#059669' }}>
                        "{rule.replacement}"
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleReplaceJargon(rule)}
                    className="btn-primary"
                    style={{
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      borderRadius: '8px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Replace
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
