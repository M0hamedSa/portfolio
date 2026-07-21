'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const LINKS = [
  { label: 'AWAKEN', href: '#awaken' },
  { label: 'PROFILE', href: '#profile' },
  { label: 'CREATIONS', href: '#creations' },
  { label: 'SYSTEMS', href: '#systems' },
  { label: 'CONTACT', href: '#contact' },
];

const CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function randomizeText(span: HTMLElement, original: string) {
  const tl = gsap.timeline();
  const totalFrames = 6;
  const frameDuration = 0.06;

  for (let i = 0; i < totalFrames; i++) {
    tl.call(() => {
      const revealCount = Math.floor((i / totalFrames) * original.length);
      span.textContent = original
        .split('')
        .map((c, idx) =>
          idx < revealCount
            ? c
            : CHARS[Math.floor(Math.random() * CHARS.length)]
        )
        .join('');
    }, undefined, `+=${frameDuration}`);
  }

  tl.call(() => { span.textContent = original; });
  return tl;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const timelinRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9998, display: 'flex', justifyContent: 'center', pointerEvents: scrolled ? 'none' : 'auto' }}>
      <nav
        style={{
          width: '80%',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '30px 0',
          transition: 'opacity 0.4s ease',
          opacity: scrolled ? 0 : 1,
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&display=swap');`}</style>
        {LINKS.map((link) => {
          const spanWidth = link.label.length * 19;
          return (
          <a
            key={link.label}
            href={link.href}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 16,
              color: '#c9a96e',
              textShadow: '0 0 20px rgba(201, 169, 110, 0.3), 0 0 40px rgba(201, 169, 110, 0.15)',
              textDecoration: 'none',
              letterSpacing: 3,
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              if (timelinRef.current) timelinRef.current.kill();
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.textShadow = '0 0 30px rgba(255,255,255,0.4), 0 0 60px rgba(255,255,255,0.2)';
              const span = e.currentTarget.querySelector('.nav-text') as HTMLElement;
              if (span) timelinRef.current = randomizeText(span, link.label);
            }}
            onMouseLeave={(e) => {
              if (timelinRef.current) timelinRef.current.kill();
              e.currentTarget.style.color = '#c9a96e';
              e.currentTarget.style.textShadow = '0 0 20px rgba(201, 169, 110, 0.3), 0 0 40px rgba(201, 169, 110, 0.15)';
              const span = e.currentTarget.querySelector('.nav-text') as HTMLElement;
              if (span) span.textContent = link.label;
            }}
          >
            <span className="nav-text" style={{ display: 'inline-block', width: spanWidth, textAlign: 'center' }}>{link.label}</span>
          </a>
          );
        })}
      </nav>
    </div>
  );
}
