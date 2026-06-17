import type { NavLink } from '@/lib/types';

/* ---------------------------------------------------------------------------
   Inline SVG icon strings for dropdown items. Rendered (white stroke) inside
   the circular yellow icon badge via dangerouslySetInnerHTML.
   --------------------------------------------------------------------------- */
const ICON_SHIELD = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>`;

const ICON_PERSON_BADGE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4l1.4 1.4L20 3"/></svg>`;

const ICON_DOCUMENT_LAW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M10 12h5M10 16h5"/></svg>`;

const ICON_MAGNIFIER = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/></svg>`;

const ICON_BAR_CHART = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/></svg>`;

const ICON_TEAM = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3 19a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14c2.8 0 5 2 5 5"/></svg>`;

const ICON_HEART = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.5 12 20 12 20z"/></svg>`;

const ICON_BRIEFCASE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;

const ICON_MEDAL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5"/><path d="M9 13l-2 8 5-3 5 3-2-8"/></svg>`;

const ICON_BLOG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>`;

const ICON_MAIL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 7l8 6 8-6"/></svg>`;

/** Center navigation links with optional hover dropdowns. */
export const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Products',
    href: '#products',
    wide: true,
    dropdown: [
      { label: 'Sanction Screening', href: '#products', icon: ICON_SHIELD },
      { label: 'PEP Screening', href: '#products', icon: ICON_PERSON_BADGE },
      { label: 'Regulatory & Enforcement Monitoring', href: '#products', icon: ICON_DOCUMENT_LAW },
      { label: 'AML Screening', href: '#products', icon: ICON_MAGNIFIER },
      { label: 'Credit & Risk Analytics (BRE)', href: '#products', icon: ICON_BAR_CHART },
    ],
  },
  { label: 'Pricing', href: '/pricing' },
  {
    label: 'About Us',
    href: '#',
    dropdown: [
      { label: 'Our Team', href: '#', icon: ICON_TEAM },
      { label: 'Life at Resurgent India', href: '#', icon: ICON_HEART },
    ],
  },
  {
    label: 'Explore',
    href: '#',
    dropdown: [
      { label: 'Careers', href: '#', icon: ICON_BRIEFCASE },
      { label: 'Recognitions', href: '#', icon: ICON_MEDAL },
      { label: 'Our Blogs', href: '#', icon: ICON_BLOG },
      { label: 'Newsletters', href: '#', icon: ICON_MAIL },
    ],
  },
  { label: 'Contact Us', href: '/contact-us' },
];
