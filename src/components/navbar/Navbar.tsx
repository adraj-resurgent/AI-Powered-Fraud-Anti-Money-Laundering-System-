'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { COMPANY } from '@/lib/constants';
import Button from '@/components/ui/Button/Button';
import type { NavLink } from '@/lib/types';
import { navLinks } from './navLinks';
import styles from './Navbar.module.css';
import DashboardNav from './DashboardNav';

interface NavbarProps {
  links?: NavLink[];
}

export default function Navbar({ links = navLinks }: NavbarProps) {
  const pathname    = usePathname();
  /* ALL hooks must be called before any early return (Rules of Hooks) */
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  /* Show dashboard-specific nav on all /dashboard and /admin routes */
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) {
    return <DashboardNav />;
  }

  const closeMobile = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  return (
    <header
      className={[styles.navbar, mobileOpen ? styles.menuActive : '']
        .filter(Boolean)
        .join(' ')}
    >
      <nav className={styles.inner} aria-label="Primary">
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={closeMobile}>
          <Image
            src={COMPANY.logo}
            alt={COMPANY.logoAlt}
            width={140}
            height={60}
            priority
          />
        </Link>

        {/* Center links (desktop) */}
        <ul className={styles.links}>
          {links.map((link) => (
            <li
              key={link.label}
              className={styles.linkItem}
              onMouseEnter={() => link.dropdown && setOpenDropdown(link.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link href={link.href} className={styles.link}>
                {link.label}
                {link.dropdown && <span className={styles.caret} aria-hidden="true" />}
              </Link>
              {link.dropdown && (
                <ul
                  className={[
                    styles.dropdown,
                    link.wide ? styles.dropdownWide : '',
                    openDropdown === link.label ? styles.dropdownOpen : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {link.dropdown.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className={styles.dropdownLink}>
                        {item.icon && (
                          <span
                            className={styles.dropdownIcon}
                            dangerouslySetInnerHTML={{ __html: item.icon }}
                            aria-hidden="true"
                          />
                        )}
                        <span className={styles.dropdownLabel}>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Right CTAs (desktop) */}
        <div className={styles.actions}>
          <Button href="/contact-us" variant="outline">
            Request Demo
          </Button>
          <Button href="/login" variant="outline">
            User Login
          </Button>
        </div>

        {/* Hamburger (mobile) */}
        <button
          className={styles.hamburger}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile slide-down menu */}
      <div className={[styles.mobileMenu, mobileOpen ? styles.mobileOpen : ''].filter(Boolean).join(' ')}>
        <ul className={styles.mobileLinks}>
          {links.map((link) => (
            <li key={link.label} className={styles.mobileLinkItem}>
              {link.dropdown ? (
                <>
                  <button
                    className={styles.mobileLink}
                    onClick={() =>
                      setOpenDropdown((cur) => (cur === link.label ? null : link.label))
                    }
                    aria-expanded={openDropdown === link.label}
                  >
                    {link.label}
                    <span className={styles.caret} aria-hidden="true" />
                  </button>
                  <ul
                    className={[
                      styles.mobileDropdown,
                      openDropdown === link.label ? styles.mobileDropdownOpen : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {link.dropdown.map((item) => (
                      <li key={item.label}>
                        <Link href={item.href} className={styles.mobileSubLink} onClick={closeMobile}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link href={link.href} className={styles.mobileLink} onClick={closeMobile}>
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className={styles.mobileActions}>
          <Button href="/contact-us" variant="outline" fullWidth>
            Request Demo
          </Button>
          <Button href="/login" variant="outline" fullWidth onClick={closeMobile}>
            User Login
          </Button>
        </div>
      </div>
    </header>
  );
}
