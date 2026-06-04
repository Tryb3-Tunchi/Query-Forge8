'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TourStep {
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    target: 'schema-selector',
    title: 'Choose Your Data Source',
    description: 'Switch between Users, Products, and Orders. The entire builder adapts to whichever schema you pick — fields, operators, everything.',
    position: 'bottom',
  },
  {
    target: 'root-group',
    title: 'Your Query Lives Here',
    description: 'This is your condition group. Every filter rule you add goes inside here. You can nest groups inside groups for complex logic.',
    position: 'right',
  },
  {
    target: 'logic-toggle',
    title: 'AND / OR Logic',
    description: 'AND means every condition must match. OR means at least one must match. You can set different logic at each level of nesting.',
    position: 'bottom',
  },
  {
    target: 'add-controls',
    title: 'Add Rules & Groups',
    description: 'Add Rule creates a single condition. Add Group creates a nested block where you can add more conditions with their own AND/OR logic.',
    position: 'top',
  },
  {
    target: 'run-button',
    title: 'Run Your Query',
    description: 'Click this to execute your query against the mock dataset. You can also press Ctrl+R on keyboard.',
    position: 'left',
  },
  {
    target: 'sidebar-preview',
    title: 'Live Preview',
    description: 'See your query as SQL, MongoDB, or JSON in real time. It updates every time you change a condition.',
    position: 'right',
  },
  {
    target: 'sidebar-results',
    title: 'Inspect Results',
    description: 'After running, see exactly which records matched. Sort by columns, search, and paginate through results.',
    position: 'right',
  },
];

const STORAGE_KEY = 'queryforge-tour-done';

export function OnboardingTour() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      // Small delay so the app renders first
      setTimeout(() => setActive(true), 1200);
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    const current = TOUR_STEPS[step];
    const el = document.getElementById(current.target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
      }, 300);
    }
  }, [step, active]);

  const handleNext = () => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      handleDone();
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const handleDone = () => {
    setActive(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleSkip = () => {
    setActive(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  if (!active || !targetRect) return null;

  const current = TOUR_STEPS[step];
  const TOOLTIP_WIDTH = 300;
  const TOOLTIP_HEIGHT = 160;
  const GAP = 16;

  // Calculate tooltip position
  let tooltipX = 0;
  let tooltipY = 0;

  switch (current.position) {
    case 'bottom':
      tooltipX = targetRect.left + targetRect.width / 2 - TOOLTIP_WIDTH / 2;
      tooltipY = targetRect.bottom + GAP;
      break;
    case 'top':
      tooltipX = targetRect.left + targetRect.width / 2 - TOOLTIP_WIDTH / 2;
      tooltipY = targetRect.top - TOOLTIP_HEIGHT - GAP;
      break;
    case 'right':
      tooltipX = targetRect.right + GAP;
      tooltipY = targetRect.top + targetRect.height / 2 - TOOLTIP_HEIGHT / 2;
      break;
    case 'left':
      tooltipX = targetRect.left - TOOLTIP_WIDTH - GAP;
      tooltipY = targetRect.top + targetRect.height / 2 - TOOLTIP_HEIGHT / 2;
      break;
  }

  // Clamp to viewport
  tooltipX = Math.max(12, Math.min(tooltipX, window.innerWidth - TOOLTIP_WIDTH - 12));
  tooltipY = Math.max(12, Math.min(tooltipY, window.innerHeight - TOOLTIP_HEIGHT - 12));

  return (
    <>
      {/* Dark overlay with hole */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9000,
          pointerEvents: 'none',
        }}
      >
        {/* Top */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: Math.max(0, targetRect.top - 6),
          background: 'rgba(8,11,15,0.85)',
        }} />
        {/* Bottom */}
        <div style={{
          position: 'absolute',
          top: targetRect.bottom + 6, left: 0, right: 0, bottom: 0,
          background: 'rgba(8,11,15,0.85)',
        }} />
        {/* Left */}
        <div style={{
          position: 'absolute',
          top: targetRect.top - 6,
          left: 0,
          width: Math.max(0, targetRect.left - 6),
          height: targetRect.height + 12,
          background: 'rgba(8,11,15,0.85)',
        }} />
        {/* Right */}
        <div style={{
          position: 'absolute',
          top: targetRect.top - 6,
          left: targetRect.right + 6,
          right: 0,
          height: targetRect.height + 12,
          background: 'rgba(8,11,15,0.85)',
        }} />

        {/* Highlight border */}
        <div style={{
          position: 'absolute',
          top: targetRect.top - 6,
          left: targetRect.left - 6,
          width: targetRect.width + 12,
          height: targetRect.height + 12,
          border: '2px solid var(--amber-pure)',
          borderRadius: '8px',
          boxShadow: '0 0 0 4px rgba(245,166,35,0.2), 0 0 30px rgba(245,166,35,0.3)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.92, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -8 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            left: tooltipX,
            top: tooltipY,
            width: TOOLTIP_WIDTH,
            zIndex: 9001,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--amber-dim)',
            borderRadius: '10px',
            padding: '18px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 20px rgba(245,166,35,0.15)',
            pointerEvents: 'all',
          }}
        >
          {/* Step indicator */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {TOUR_STEPS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === step ? '16px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    background: i === step
                      ? 'var(--amber-pure)'
                      : i < step
                        ? 'var(--amber-dim)'
                        : 'var(--border-medium)',
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>
            <button
              onClick={handleSkip}
              style={{
                background: 'none', border: 'none',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)', fontSize: '10px',
                cursor: 'pointer', letterSpacing: '0.05em',
              }}
            >
              SKIP TOUR
            </button>
          </div>

          {/* Content */}
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '13px',
            color: 'var(--amber-pure)', fontWeight: 600,
            marginBottom: '6px',
          }}>
            {current.title}
          </div>
          <div style={{
            fontFamily: 'var(--font-sans)', fontSize: '13px',
            color: 'var(--text-secondary)', lineHeight: 1.6,
            marginBottom: '16px',
          }}>
            {current.description}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={handlePrev}
              disabled={step === 0}
              style={{
                background: 'none',
                border: '1px solid var(--border-subtle)',
                color: step === 0 ? 'var(--text-muted)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)', fontSize: '11px',
                padding: '5px 12px', borderRadius: '4px',
                cursor: step === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              ← Back
            </button>

            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px',
              color: 'var(--text-muted)',
            }}>
              {step + 1} / {TOUR_STEPS.length}
            </span>

            <button
              onClick={handleNext}
              style={{
                background: 'var(--amber-pure)', color: '#000',
                border: 'none',
                fontFamily: 'var(--font-mono)', fontSize: '11px',
                fontWeight: 700,
                padding: '6px 14px', borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {step === TOUR_STEPS.length - 1 ? 'Done ✓' : 'Next →'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Restart tour button — always visible bottom left */}
      <button
        onClick={() => {
          localStorage.removeItem(STORAGE_KEY);
          setStep(0);
          setActive(true);
        }}
        style={{
          position: 'fixed',
          bottom: '16px', left: '16px',
          zIndex: 8999,
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)', fontSize: '10px',
          padding: '5px 10px', borderRadius: '4px',
          cursor: 'pointer',
          display: active ? 'none' : 'block',
          letterSpacing: '0.05em',
        }}
      >
        ? Tour
      </button>
    </>
  );
}