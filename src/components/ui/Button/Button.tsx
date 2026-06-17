'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ButtonVariant } from '@/lib/types';

/**
 * Brand colors are hardcoded (not CSS variables) because the Next.js 16
 * Turbopack production build on Render drops `var(--…)` references, which
 * left these buttons rendering as unstyled text after deploy. Inline styles
 * with JS hover handlers are immune to that build issue.
 */
const COLORS = {
  accent: '#f5a623',
  accentDark: '#d98e1a',
  navy: '#1E3A5F',
  navyDark: '#172e52',
  white: '#ffffff',
};

interface ButtonProps {
  children: React.ReactNode;
  /** "primary" = amber filled | "outline" = amber border | "dark" = navy filled */
  variant?: ButtonVariant;
  /** Render as an anchor link instead of a button. */
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  className?: string;
  ariaLabel?: string;
}

function getVariantStyle(variant: ButtonVariant, hovered: boolean): React.CSSProperties {
  switch (variant) {
    case 'outline':
      return hovered
        ? {
            backgroundColor: COLORS.accent,
            color: COLORS.navy,
            borderColor: COLORS.accent,
            boxShadow: '0 8px 20px rgba(245, 166, 35, 0.3)',
          }
        : { backgroundColor: 'transparent', color: COLORS.accent, borderColor: COLORS.accent };
    case 'dark':
      return hovered
        ? {
            backgroundColor: COLORS.navyDark,
            color: COLORS.white,
            borderColor: COLORS.navyDark,
            boxShadow: '0 8px 20px rgba(26, 58, 107, 0.35)',
          }
        : { backgroundColor: COLORS.navy, color: COLORS.white, borderColor: COLORS.navy };
    case 'primary':
    default:
      return hovered
        ? {
            backgroundColor: COLORS.accentDark,
            color: COLORS.navy,
            borderColor: COLORS.accentDark,
            boxShadow: '0 8px 20px rgba(245, 166, 35, 0.35)',
          }
        : { backgroundColor: COLORS.accent, color: COLORS.navy, borderColor: COLORS.accent };
  }
}

/**
 * Shared button. Renders a Next.js <Link> when `href` is provided,
 * otherwise a native <button>.
 */
export default function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  type = 'button',
  fullWidth = false,
  className = '',
  ariaLabel,
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 26px',
    fontSize: 15,
    fontWeight: 600,
    borderRadius: 8,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    border: '2px solid transparent',
    lineHeight: 1,
    textDecoration: 'none',
    fontFamily: 'inherit',
    transition:
      'transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease',
    transform: hovered ? 'scale(1.02)' : 'scale(1)',
    width: fullWidth ? '100%' : undefined,
    ...getVariantStyle(variant, hovered),
  };

  const interactionHandlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onFocus: () => setHovered(true),
    onBlur: () => setHovered(false),
  };

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        style={style}
        aria-label={ariaLabel}
        onClick={onClick}
        {...interactionHandlers}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={className}
      style={style}
      onClick={onClick}
      aria-label={ariaLabel}
      {...interactionHandlers}
    >
      {children}
    </button>
  );
}
