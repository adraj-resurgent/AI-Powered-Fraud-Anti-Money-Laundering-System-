'use client';

import { useState } from 'react';
import { TAGLINES } from '@/lib/constants';
import AnimatedOrbit from '@/components/ui/AnimatedOrbit/AnimatedOrbit';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const [query, setQuery] = useState('');

  const scrollToDemo = () => {
    const demoSection = document.getElementById('get-demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    scrollToDemo();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      scrollToDemo();
    }
  };

  return (
    <section
      className={styles.hero}
      style={{
        backgroundColor: '#1E3A5F',
        width: '100%',
        height: 'auto',
        paddingTop: '100px',
        paddingBottom: '60px',
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff',
      }}
    >
      {/* Animated dot-grid background — sits behind all content */}
      <div
        className={styles.dotGrid}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      />

      <div className={styles.inner} style={{ position: 'relative', zIndex: 1 }}>
        {/* LEFT */}
        <div className={styles.heroLeft}>
          <span
            style={{
              display: 'inline-block',
              alignSelf: 'flex-start',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid #F5A623',
              borderRadius: '999px',
              padding: '6px 16px',
              fontSize: '13px',
              color: '#F5A623',
              marginBottom: '16px',
            }}
          >
            Trusted AML Intelligence for BFSI
          </span>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: '1.2',
              marginBottom: '20px',
              fontWeight: '800',
            }}
          >
            <span style={{ color: '#ffffff', fontWeight: '800' }}>AI-Powered </span>
            <span style={{ color: '#F5A623', fontWeight: '800' }}>
              Financial Crime Prevention:{' '}
            </span>
            <span style={{ color: '#ffffff', fontWeight: '800' }}>
              Sanctions, Money Laundering, Terrorism Financing &amp; Fraud
            </span>
          </h1>

          <p
            style={{
              color: '#d1d5db',
              lineHeight: '1.6',
              fontSize: '16px',
              marginBottom: '28px',
            }}
          >
            Powered by {TAGLINES.dataRecords} proprietary data records from {TAGLINES.dataSources}{' '}
            global sources, Resurgent India&apos;s AML/CFT suite detects, screens, and neutralises
            financial threats in real time. Built for Banks, NBFCs, Insurance, Payment Providers and
            every regulated BFSI entity.
          </p>

          <form className={styles.searchBar} onSubmit={handleScan}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Scan a person or company..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Scan a person or company"
            />
            <button type="submit" className={styles.scanButton}>
              Scan
            </button>
          </form>
        </div>

        {/* RIGHT */}
        <div className={styles.heroRight}>
          <AnimatedOrbit />
        </div>
      </div>
    </section>
  );
}
