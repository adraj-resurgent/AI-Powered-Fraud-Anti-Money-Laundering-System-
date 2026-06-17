'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

/**
 * Product card. Every card looks identical by default (white background); the
 * only visual change is on hover — a 3D lift with a sky-blue glow on all four
 * edges. All styling is inline so it survives the Turbopack production build.
 */
const AMBER = '#F5A623';
const AMBER_DARK = '#E09612';
const DEEP_NAVY = '#0F2044';
const TEXT_GRAY = '#374151';

const HOVER_GLOW = `
  0 0 8px 2px rgba(56, 189, 248, 0.6),
  0 -4px 12px 2px rgba(56, 189, 248, 0.5),
  0 4px 12px 2px rgba(56, 189, 248, 0.5),
  -4px 0 12px 2px rgba(56, 189, 248, 0.5),
  4px 0 12px 2px rgba(56, 189, 248, 0.5)
`;

export default function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);

  const lift = hovered ? 'translateY(-12px) scale(1.04)' : 'translateY(0) scale(1)';

  const cardStyle: React.CSSProperties = {
    // minHeight (not fixed height) so narrower mobile cards grow instead of
    // clipping content; align-items:stretch on the track keeps them uniform.
    minHeight: 510,
    boxSizing: 'border-box',
    scrollSnapAlign: 'start',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#F0F2F5',
    borderRadius: '16px',
    padding: '28px',
    cursor: 'pointer',
    outline: 'none',
    WebkitTransition: '-webkit-transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease',
    WebkitTransform: lift,
    transform: lift,
    border: hovered ? '2px solid rgba(56, 189, 248, 0.8)' : '2px solid transparent',
    boxShadow: hovered ? HOVER_GLOW : '0 4px 20px rgba(0,0,0,0.08)',
  };

  return (
    <article
      className={styles.card}
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      aria-label={product.title}
    >
      <h3
        style={{
          fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
          fontWeight: '800',
          marginBottom: 12,
          color: DEEP_NAVY,
        }}
      >
        {product.title}
      </h3>
      <p
        style={{
          fontSize: '14px',
          lineHeight: '1.6',
          marginBottom: '16px',
          color: TEXT_GRAY,
        }}
      >
        {product.description}
      </p>

      <ul
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          marginBottom: 8,
          listStyle: 'none',
          padding: 0,
        }}
      >
        {product.bullets.map((bullet) => (
          <li
            key={bullet}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: '10px',
              marginBottom: '10px',
              fontSize: '14px',
              lineHeight: '1.5',
              color: TEXT_GRAY,
            }}
          >
            <span
              style={{
                backgroundColor: AMBER,
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                minWidth: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#FFFFFF',
                marginTop: 1,
              }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/contact-us"
        style={{
          backgroundColor: AMBER,
          color: DEEP_NAVY,
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: '700',
          fontSize: '15px',
          cursor: 'pointer',
          width: '100%',
          marginTop: '20px',
          transition: 'all 0.2s ease',
          display: 'block',
          textAlign: 'center',
          textDecoration: 'none',
          boxSizing: 'border-box',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = AMBER_DARK;
          e.currentTarget.style.color = '#FFFFFF';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = AMBER;
          e.currentTarget.style.color = DEEP_NAVY;
        }}
      >
        Request Demo
      </Link>
    </article>
  );
}
