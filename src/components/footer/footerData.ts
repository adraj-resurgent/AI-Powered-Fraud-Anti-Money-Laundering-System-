import type { FooterColumn, FooterLink } from '@/lib/types';

/** The three link columns shown in the footer body. */
export const footerColumns: FooterColumn[] = [
  {
    heading: 'Products',
    links: [
      { label: 'Sanction Screening', href: '#products' },
      { label: 'PEP Screening', href: '#products' },
      { label: 'Regulatory & Enforcement Monitoring', href: '#products' },
      { label: 'AML Screening', href: '#products' },
      { label: 'Credit & Risk Analytics (BRE)', href: '#products' },
    ],
  },
  {
    heading: 'About',
    links: [
      { label: 'Our Team', href: '#' },
      { label: 'Life at Resurgent India', href: '#' },
      { label: 'Recognitions', href: '#' },
      { label: 'Careers', href: '#' },
    ],
  },
  {
    heading: 'Help and Information',
    links: [
      { label: 'Our Blogs', href: '#' },
      { label: 'Newsletters', href: '#' },
      { label: 'FAQs', href: '/pricing' },
      { label: 'Contact Us', href: '/contact-us' },
    ],
  },
];

/** Links shown in the bottom legal bar. */
export const footerLegalLinks: FooterLink[] = [
  { label: 'Terms & Conditions', href: '#' },
  { label: 'Privacy Policy', href: '#' },
];
