'use client';

import { gsap } from 'gsap';

/**
 * Animate container cards and bento sections on tab switch or mount.
 * Uses lightweight GSAP transforms with GPU acceleration.
 */
export function animatePageEntrance(container: HTMLElement | null) {
  if (!container || typeof window === 'undefined') return;

  // Staggered reveal of direct child cards, bento elements, and tables
  const elements = container.querySelectorAll(
    '.glass-card, .bento-glass, .stat-card, .animate-entrance, [data-animate="card"]'
  );

  if (elements.length > 0) {
    gsap.fromTo(
      elements,
      {
        opacity: 0,
        y: 18,
        scale: 0.985
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        ease: 'power2.out',
        stagger: 0.04,
        clearProps: 'transform' // clean up inline transform to keep layout pristine
      }
    );
  } else {
    // Fallback: smooth fade-in of the entire container
    gsap.fromTo(
      container,
      { opacity: 0.3, y: 12 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    );
  }
}

/**
 * Micro-interaction for hovering interactive buttons or cards
 */
export function animateHoverFloat(element: HTMLElement | null, isHovering: boolean) {
  if (!element || typeof window === 'undefined') return;
  if (isHovering) {
    gsap.to(element, {
      y: -3,
      boxShadow: '0 12px 28px -6px rgba(0, 0, 0, 0.25)',
      duration: 0.25,
      ease: 'power1.out'
    });
  } else {
    gsap.to(element, {
      y: 0,
      boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.08)',
      duration: 0.25,
      ease: 'power1.out'
    });
  }
}

/**
 * Subtle pulse animation for live indicators and radar pings
 */
export function pulseLiveBeacon(beacon: HTMLElement | null) {
  if (!beacon || typeof window === 'undefined') return () => {};
  const tween = gsap.to(beacon, {
    scale: 1.18,
    opacity: 0.7,
    repeat: -1,
    yoyo: true,
    duration: 0.9,
    ease: 'sine.inOut'
  });
  return () => tween.kill();
}
