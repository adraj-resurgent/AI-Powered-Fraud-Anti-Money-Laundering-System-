import Image from 'next/image';
import Link from 'next/link';
import { COMPANY, SOCIAL_LINKS } from '@/lib/constants';
import Button from '@/components/ui/Button/Button';
import type { FooterColumn, FooterLink } from '@/lib/types';
import { footerColumns, footerLegalLinks } from './footerData';
import styles from './Footer.module.css';

interface FooterProps {
  columns?: FooterColumn[];
  legalLinks?: FooterLink[];
}

export default function Footer({ columns = footerColumns, legalLinks = footerLegalLinks }: FooterProps) {
  return (
    <footer className={styles.footer}>
      {/* Full-width white banner — sits above the navy body, borders on 3 sides */}
      <div className={styles.topBarBand}>
        <div className={styles.topBar}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/resurgent-logo.png"
              alt="Resurgent India Logo"
              width={486}
              height={104}
              className={styles.logoImg}
            />
          </Link>
          <div className={styles.ctaWrap}>
            <span className={styles.ctaText}>Ready to get started?</span>
            <Button href="/contact-us" variant="outline">
              Request Demo
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        {/* Link columns */}
        <div className={styles.columns}>
          {columns.map((column) => (
            <nav key={column.heading} className={styles.column} aria-label={column.heading}>
              <h3 className={styles.columnHeading}>{column.heading}</h3>
              <ul className={styles.columnLinks}>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={styles.columnLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <ul className={styles.legalLinks}>
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={styles.legalLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.fc3Icons}>
            <a
              href="https://www.linkedin.com/company/resurgentindialtd/posts/?feedView=all"
              className={styles.fc3Icon}
              aria-label="Resurgent India on LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="https://x.com/iResurgentIndia"
              className={styles.fc3Icon}
              aria-label="Resurgent India on X (Twitter)"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.858L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/resurgentindiaofficial/"
              className={styles.fc3Icon}
              aria-label="Resurgent India on Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/channel/UCpCRYINRjwINxFagwXfinyA"
              className={styles.fc3Icon}
              aria-label="Resurgent India on YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>

        <p className={styles.copyright}>{COMPANY.copyright}</p>
        <p className={styles.copyright}>
          Made with <span style={{ color: '#e25555' }}>♥</span> by Aditya
        </p>
      </div>
    </footer>
  );
}
