/* ==========================================================================
   Brand-level constants used across the site.
   ========================================================================== */

export const COMPANY = {
  name: 'Resurgent India Pvt Ltd',
  shortName: 'Resurgent India',
  initials: 'RIL',
  logo: '/resurgent-logo.png',
  logoAlt: 'Resurgent India Logo',
  copyright: '© 2005 Resurgent India Pvt Ltd. All rights reserved.',
  email: 'contact@resurgentindia.com',
} as const;

export const TAGLINES = {
  heroLabel: 'Trusted AML Intelligence for BFSI',
  dataRecords: '13M+',
  dataSources: '1,000+',
} as const;

export const BRAND_COLORS = {
  primary: '#1E3A5F',
  accent: '#D4900A',
  white: '#FFFFFF',
  bgLight: '#F7F8FA',
  textDark: '#1A1A2E',
  textMuted: '#6B7280',
  cardNavy: '#1E3A5F',
} as const;

/** Social links for the footer. */
export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com',
  twitter: 'https://www.twitter.com',
} as const;
