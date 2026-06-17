'use client';

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import type { Step } from '@/lib/types';
import styles from './GetStarted.module.css';

/** Inline SVG icons keyed by step (yellow, 60x60). */
const ICONS: Record<string, React.ReactNode> = {
  click: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 20l16 6-7 3-3 7-6-16z" />
      <path d="M12 12v-4M12 12h-4M12 12l-3-3M20 12h4M20 12l3-3" />
    </svg>
  ),
  people: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="16" r="6" />
      <circle cx="33" cy="19" r="5" />
      <path d="M8 38c0-6 4.5-10 10-10s10 4 10 10M30 33c4 0 10 2 10 8" />
    </svg>
  ),
  shieldSearch: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 6l14 5v11c0 9-6 15-14 19-8-4-14-10-14-19V11z" />
      <circle cx="22" cy="21" r="5" />
      <path d="M26 25l5 5" />
    </svg>
  ),
  report: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 6h14l8 8v28H14z" />
      <path d="M28 6v8h8" />
      <path d="M20 34v-6M25 34v-10M30 34v-4" />
    </svg>
  ),
};

const STEPS: Step[] = [
  {
    id: 's1',
    badge: 'Step 1',
    icon: 'click',
    description: 'Easy one-click sign-up',
    body: 'Create your Resurgent India account in seconds with no complex forms or paperwork. Choose a plan that fits your compliance needs and get instant access.',
    bullets: ['Choose your plan', 'Enter business details', 'Instant account activation'],
  },
  {
    id: 's2',
    badge: 'Step 2',
    icon: 'people',
    description: 'Onboard your customers',
    body: 'Seamlessly add your customers to the platform using bulk upload or direct API integration. Automated KYC workflows ensure every customer is verified from day one.',
    bullets: ['Import via CSV or API', 'Set customer risk profiles', 'Automated KYC verification'],
  },
  {
    id: 's3',
    badge: 'Step 3',
    icon: 'shieldSearch',
    description: 'Screen & monitor in real time',
    body: 'Run continuous background checks against 13M+ global records and receive instant alerts the moment a customer\'s risk profile changes.',
    bullets: ['AML & PEP screening', 'Real-time risk scoring', 'Automated alerts & notifications'],
  },
  {
    id: 's4',
    badge: 'Step 4',
    icon: 'report',
    description: 'Generate compliance reports',
    body: 'Export audit-ready compliance reports for regulators with a single click. Pre-built templates and scheduled delivery keep your team always prepared.',
    bullets: ['Pre-built report templates', 'Scheduled automated reports', 'Regulator-ready PDF export'],
  },
];

interface GetStartedProps {
  steps?: Step[];
}

export default function GetStarted({ steps = STEPS }: GetStartedProps) {
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className={[styles.section, isVisible ? styles.visible : ''].filter(Boolean).join(' ')}
    >
      <div className={styles.container}>
        <h2 className={styles.heading}>Get Started in Four Easy Steps</h2>

        <div className={styles.grid}>
          {steps.map((step) => (
            <article key={step.id} className={styles.card}>
              <span className={styles.icon}>{ICONS[step.icon]}</span>
              <span className={styles.badge}>{step.badge}</span>
              <p className={styles.text}>{step.description}</p>
              {step.body && (
                <p className={styles.body}>{step.body}</p>
              )}
              {step.bullets && step.bullets.length > 0 && (
                <ul className={styles.bullets}>
                  {step.bullets.map((bullet) => (
                    <li key={bullet} className={styles.bullet}>
                      <span className={styles.bulletDot} aria-hidden="true" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
