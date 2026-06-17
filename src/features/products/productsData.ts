import type { Product } from '@/lib/types';

/** The five products of the Resurgent India AML/CFT suite. */
export const products: Product[] = [
  {
    id: 'credit-risk-analytics',
    title: 'Credit & Risk Analytics (BRE)',
    description: 'Business Rules Engine for intelligent credit decisioning and risk scoring.',
    bullets: [
      'Configurable rule engine for credit policies',
      'Real-time risk scoring and decisioning',
      'Integrated bureau and alternative data',
      'Portfolio-level risk monitoring',
      'Regulatory capital computation support',
    ],
  },
  {
    id: 'sanction-screening',
    title: 'Sanction Screening',
    description: 'Comprehensive AML sanction screening powered by 13M+ global records.',
    bullets: [
      'Global database 100+ sanction lists (OFAC, UN, HMT, DFAT, Interpol)',
      'Real-time automated screening & alerts',
      'Configurable risk thresholds',
      'Automated STR/CTR report generation',
      'API-ready for BFSI integration',
    ],
  },
  {
    id: 'pep-screening',
    title: 'PEP Screening',
    description:
      'Real-time Politically Exposed Person screening from 1,000+ verified government sources.',
    bullets: [
      '1,000+ government & regulatory data sources',
      'All PEP levels including relatives & associates',
      'Continuous monitoring with instant alerts',
      'Configurable match scoring',
      'RBI/SEBI/PMLA compliant workflows',
    ],
  },
  {
    id: 'regulatory-monitoring',
    title: 'Regulatory & Enforcement Monitoring',
    description:
      'Stay ahead of regulatory changes with real-time enforcement and compliance monitoring.',
    bullets: [
      'Real-time RBI, SEBI, PMLA, FATF updates',
      'Enforcement action database updated daily',
      'Jurisdiction-wise regulatory mapping',
      'Automated compliance gap alerts',
      'Audit-ready reporting',
    ],
  },
  {
    id: 'aml-screening',
    title: 'AML Screening',
    description:
      'End-to-end AML screening across customer lifecycle for complete financial crime coverage.',
    bullets: [
      'Batch and real-time customer screening',
      'AI/ML-powered false positive reduction',
      'Cross-border AML pattern detection',
      'Adverse media integration',
      'Case management with audit trail',
    ],
  },
];
