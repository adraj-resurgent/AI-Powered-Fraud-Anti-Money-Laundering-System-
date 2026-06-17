import type { PricingPlan } from '@/lib/types';

/** The two AML 360 pricing plans. */
export const pricingPlans: PricingPlan[] = [
  {
    id: 'annual',
    name: 'AML 360 — Annual',
    badge: 'Best Value',
    price: '$950',
    period: '/ year',
    description:
      'Full-suite AML/CFT compliance platform — Sanctions, PEP, Regulatory Monitoring, AML Screening & Credit Risk Analytics.',
    features: [
      'All 5 products included',
      'Unlimited screenings',
      '13M+ data records access',
      'Automated STR/CTR reports',
      'API access',
      'Priority support',
      'Annual compliance review call',
    ],
    highlighted: true,
  },
  {
    id: 'monthly',
    name: 'AML 360 — Monthly',
    badge: 'Flexible',
    price: '$110',
    period: '/ month',
    description:
      'Same complete AML/CFT suite, billed monthly. Scale up or down as your compliance needs evolve.',
    features: [
      'All 5 products included',
      'Unlimited screenings',
      '13M+ data records access',
      'Automated STR/CTR reports',
      'API access',
      'Standard support',
    ],
    highlighted: false,
  },
];

/** Pricing FAQ accordion items. */
export const pricingFaqs: { question: string; answer: string }[] = [
  {
    question: 'Is there a free trial?',
    answer: 'Yes, we offer a 14-day free trial with full access.',
  },
  {
    question: 'Can I switch plans?',
    answer: 'Yes, you can upgrade or downgrade anytime.',
  },
  {
    question: 'Do you offer custom enterprise pricing?',
    answer: 'Yes, contact our sales team for a tailored quote.',
  },
];
