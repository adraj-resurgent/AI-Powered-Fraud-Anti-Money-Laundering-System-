/* ==========================================================================
   Shared TypeScript interfaces for all data structures across the site.
   ========================================================================== */

/** A single product / capability of the AML suite. */
export interface Product {
  id: string;
  title: string;
  description: string;
  bullets: string[];
}

/** A "Why Resurgent India" highlight card. */
export interface WhyUsItem {
  id: string;
  /** Inline SVG markup string rendered via dangerouslySetInnerHTML. */
  icon: string;
  title: string;
  description: string;
  /** Optional second supporting detail line shown below description. */
  detail?: string;
}

/** A pricing plan. */
export interface PricingPlan {
  id: string;
  name: string;
  badge: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
}

/** A navbar link, optionally with a hover dropdown. */
export interface NavLink {
  label: string;
  href: string;
  dropdown?: NavDropdownItem[];
  /** Render the dropdown as a wide 2-column icon grid (e.g. Products). */
  wide?: boolean;
}

export interface NavDropdownItem {
  label: string;
  href: string;
  /** Inline SVG markup string for the circular icon. */
  icon?: string;
}

/** A footer column. */
export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

export interface FooterLink {
  label: string;
  href: string;
}

/** A "Get Started" step. */
export interface Step {
  id: string;
  badge: string;
  icon: string;
  description: string;
  /** Short paragraph shown below the title. */
  body?: string;
  /** 2-3 key action bullets shown below the body. */
  bullets?: string[];
}

/** Shared button variants. */
export type ButtonVariant = 'primary' | 'outline' | 'dark';
