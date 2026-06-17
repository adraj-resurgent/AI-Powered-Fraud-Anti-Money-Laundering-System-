'use client';

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import styles from './ComplianceBanner.module.css';

export default function ComplianceBanner() {
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className={[styles.section, isVisible ? styles.visible : ''].filter(Boolean).join(' ')}
      style={{ backgroundColor: '#1E3A5F', color: '#ffffff' }}
    >
      <div className={styles.container}>
        {/* LEFT â€” illustration (inline SVG) */}
        <div className={styles.illustration}>
          <svg viewBox="0 0 420 360" className={styles.svg} role="img" aria-label="Compliance analyst at a data dashboard">
            {/* Network graph */}
            <g className={styles.network} stroke="rgba(255,255,255,0.5)" strokeWidth="1.5">
              <line x1="70" y1="60" x2="150" y2="100" />
              <line x1="150" y1="100" x2="100" y2="170" />
              <line x1="150" y1="100" x2="240" y2="80" />
              <line x1="240" y1="80" x2="320" y2="130" />
              <line x1="100" y1="170" x2="180" y2="200" />
              <line x1="240" y1="80" x2="180" y2="200" />
            </g>
            <g className={styles.nodes}>
              <circle cx="70" cy="60" r="7" fill="#d4900a" />
              <circle cx="150" cy="100" r="9" fill="#ffffff" />
              <circle cx="240" cy="80" r="7" fill="#d4900a" />
              <circle cx="320" cy="130" r="6" fill="#ffffff" />
              <circle cx="100" cy="170" r="6" fill="#ffffff" />
              <circle cx="180" cy="200" r="8" fill="#d4900a" />
            </g>

            {/* Bar chart */}
            <g className={styles.bars}>
              <rect x="60" y="250" width="26" height="70" rx="4" fill="#d4900a" />
              <rect x="98" y="220" width="26" height="100" rx="4" fill="#d4900a" opacity="0.85" />
              <rect x="136" y="270" width="26" height="50" rx="4" fill="#d4900a" opacity="0.7" />
              <rect x="174" y="235" width="26" height="85" rx="4" fill="#d4900a" opacity="0.9" />
              <line x1="50" y1="322" x2="220" y2="322" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
            </g>

            {/* Shield */}
            <g className={styles.shield}>
              <path
                d="M320 200 l46 16 v34 c0 28-20 46-46 56 -26-10-46-28-46-56 v-34 z"
                fill="none"
                stroke="#d4900a"
                strokeWidth="3"
              />
              <path
                d="M305 248 l11 11 22-24"
                fill="none"
                stroke="#d4900a"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* Abstract human figure silhouette */}
            <g className={styles.figure} fill="rgba(255,255,255,0.9)">
              <circle cx="300" cy="86" r="22" />
              <path d="M262 160 c0-26 17-42 38-42 s38 16 38 42 z" />
            </g>
          </svg>
        </div>

        {/* RIGHT â€” text */}
        <div className={styles.content}>
          <h2 className={styles.heading}>
            Stay Compliant with Resurgent India&apos;s AML Suite
          </h2>
          <p className={styles.body}>
            Using machine learning and continuous multi-source data monitoring, Resurgent India
            empowers BFSI institutions to detect fraud, simplify Customer Due Diligence (CDD), and
            stay audit-ready. Trusted by regulated entities across Banking, Insurance, Payments, and
            NBFCs across India and beyond.
          </p>
        </div>
      </div>
    </section>
  );
}
