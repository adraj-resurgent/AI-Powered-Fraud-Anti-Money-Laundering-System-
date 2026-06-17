import type { WhyUsItem } from '@/lib/types';

/**
 * "Why Resurgent India" highlights. Each `icon` is an inline SVG string
 * rendered via dangerouslySetInnerHTML inside the navy icon tile.
 */
export const whyUsItems: WhyUsItem[] = [
  {
    id: 'data-records',
    title: '13M+ Data Records',
    description: 'Largest proprietary AML dataset in India',
    detail: 'Updated daily with verified government and financial sources.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
      <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </svg>`,
  },
  {
    id: 'global-sources',
    title: '1,000+ Global Sources',
    description: 'Data from OFAC, UN, Interpol, RBI & more',
    detail: 'Covering sanctions, PEP lists, adverse media across 200+ countries.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3z" />
    </svg>`,
  },
  {
    id: 'ai-detection',
    title: 'AI-Powered Detection',
    description: 'ML models that reduce false positives by 90%+',
    detail: 'Continuously learns from new patterns to stay ahead of financial crime.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3" />
      <circle cx="12" cy="12" r="2" />
    </svg>`,
  },
  {
    id: 'compliant',
    title: 'RBI / SEBI / PMLA Compliant',
    description: 'Built to meet every Indian regulatory standard',
    detail: 'Auto-updated whenever compliance guidelines change.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>`,
  },
  {
    id: 'india-focused',
    title: 'India-Focused Intelligence',
    description: 'Deep local data including ED, CBI, and state enforcement',
    detail: 'Purpose-built for Indian financial institutions and fintechs.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>`,
  },
  {
    id: 'expertise',
    title: '25+ Years Domain Expertise',
    description: 'Decades of BFSI compliance knowledge embedded in every product',
    detail: 'Trusted by leading banks, NBFCs, and regulators across India.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="9" r="6" />
      <path d="M9 14.5L7 22l5-3 5 3-2-7.5" />
    </svg>`,
  },
];
