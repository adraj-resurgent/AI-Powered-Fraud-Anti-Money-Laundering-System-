'use client';

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import styles from './DetailCard.module.css';

interface FeatureListItem {
  id: string;
  label: string;
  color: 'teal' | 'orange' | 'yellow' | 'blue';
  icon: React.ReactNode;
}

interface FeatureRow {
  id: string;
  title: string;
  body: string;
}

const LIST_ITEMS: FeatureListItem[] = [
  {
    id: 'onboarding',
    label: 'Super Simple Onboarding',
    color: 'teal',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M19 8v6M22 11h-6" />
      </svg>
    ),
  },
  {
    id: 'monitoring',
    label: 'AI-Powered Transaction Monitoring',
    color: 'orange',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17l5-5 4 4 8-8" />
        <path d="M16 8h4v4" />
      </svg>
    ),
  },
  {
    id: 'alerts',
    label: 'Intelligent Alert System',
    color: 'yellow',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.7 21a2 2 0 0 1-3.4 0" />
      </svg>
    ),
  },
  {
    id: 'export',
    label: 'Flexible File Exporting',
    color: 'blue',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="M7 10l5 5 5-5M12 15V3" />
      </svg>
    ),
  },
];

const FEATURE_ROWS: FeatureRow[] = [
  {
    id: 'bfsi',
    title: 'Built for Every BFSI Entity',
    body: 'Designed for Banks, NBFCs, Insurance, E-Commerce, Payment Aggregators, Jewellers, Real Estate, and Trading & Brokerage firms regulated under RBI, SEBI, IRDAI and PMLA.',
  },
  {
    id: 'data',
    title: '13M+ Proprietary Data Records',
    body: 'Sourced from 1,000+ global and Indian databases including OFAC, HMT, UN, DFAT, UAE Terrorist List, UNSCR, FBI, Interpol, and Indian enforcement agencies.',
  },
  {
    id: 'experience',
    title: 'Seamless Compliance Experience',
    body: 'Intuitive interface built for compliance officers — easy onboarding, real-time screening, and one-click report generation with zero learning curve.',
  },
];

export default function DetailCard() {
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className={[styles.section, isVisible ? styles.visible : ''].filter(Boolean).join(' ')}
    >
      <div className={styles.container}>
        {/* LEFT — feature list card */}
        <div className={styles.listCard}>
          {LIST_ITEMS.map((item) => (
            <div key={item.id} className={styles.listRow}>
              <span className={[styles.listIcon, styles[item.color]].join(' ')}>{item.icon}</span>
              <span className={styles.listLabel}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* RIGHT — heading + feature rows */}
        <div className={styles.content}>
          <h2 className={styles.heading}>
            All-in-one <span className={styles.accent}>AML/CFT</span> compliance solution
          </h2>

          <div className={styles.rows}>
            {FEATURE_ROWS.map((row) => (
              <div key={row.id} className={styles.featureRow}>
                <span className={styles.rowIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <h3 className={styles.rowTitle}>{row.title}</h3>
                  <p className={styles.rowBody}>{row.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
