'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useUserSession, clearUserSession } from '@/hooks/useUserSession';
import s from './DashboardNav.module.css';

/* ─── Bell icon SVG ─────────────────────────────────────────── */
const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

/* ─── Help icon SVG ──────────────────────────────────────────── */
const HelpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

/* ─── Nav links ─────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Command Centre',       href: '/dashboard',           soon: false },
  { label: 'Screening & Bulk Ops', href: '/dashboard/screening', soon: false },
  { label: 'Risk Triage',          href: '/dashboard/triage',    soon: true  },
  { label: 'Analytics & Audit',    href: '/dashboard/analytics', soon: true  },
];

/* ─── Profile dropdown items ─────────────────────────────────── */
const PROFILE_ITEMS = [
  { icon: '👤', label: 'My Profile',             danger: false, separator: false },
  { icon: '⚙️', label: 'Settings & Preferences', danger: false, separator: false },
  { icon: '🔑', label: 'API Keys',               danger: false, separator: true  },
  { icon: '📖', label: 'Documentation',          danger: false, separator: true  },
  { icon: '🚪', label: 'Sign Out',               danger: true,  separator: false },
];

interface DashboardNavProps {
  /** Server-supplied user info — avoids the sessionStorage timing race on first load. */
  userName?:    string;
  userRole?:    string;
  userCompany?: string;
}

export default function DashboardNav({
  userName:    propName,
  userRole:    propRole,
  userCompany: propCompany,
}: DashboardNavProps = {}) {
  const router    = useRouter();
  const pathname  = usePathname();
  const session   = useUserSession(); // sessionStorage fallback (populated after first mount)

  const [profileOpen,  setProfileOpen]  = useState(false);
  const [helpOpen,     setHelpOpen]     = useState(false);
  const [confirmOpen,  setConfirmOpen]  = useState(false);
  const [loggingOut,   setLoggingOut]   = useState(false);
  const [hasAlerts,    setHasAlerts]    = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const helpRef    = useRef<HTMLDivElement>(null);

  /* Check for HIGH risk items in localStorage */
  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('ri_search_history') || '[]');
      setHasAlerts(history.some((e: { riskLevel: string }) => e.riskLevel === 'HIGH'));
    } catch { /* ignore */ }
  }, []);

  /* Close dropdowns when clicking outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (helpRef.current    && !helpRef.current.contains(e.target as Node))    setHelpOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : (pathname?.startsWith(href) ?? false);

  const handleLogout = async () => {
    setLoggingOut(true);
    clearUserSession();
    try { await fetch('/api/auth/logout', { method: 'POST' }); } finally {
      router.push('/login');
    }
  };

  // Props from server take priority; fall back to sessionStorage on client
  const displayName = propCompany || propName || session?.company || session?.name || 'User';
  const initial     = displayName.charAt(0).toUpperCase();
  const role        = propRole    || session?.role   || '';

  return (
    <>
      <header className={s.nav}>
        <div className={s.inner}>
          {/* Logo */}
          <Link href="/dashboard" className={s.logo}>
            <Image src="/resurgent-logo.png" alt="Resurgent India" width={160} height={44} priority />
          </Link>

          {/* Center nav links */}
          <nav className={s.centerLinks} aria-label="Dashboard navigation">
            {NAV_LINKS.map((link) =>
              link.soon ? (
                <span key={link.href} className={s.navLinkSoon}>
                  {link.label}
                </span>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${s.navLink} ${isActive(link.href) ? s.navLinkActive : ''}`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Right side: Bell + Help + User badge */}
          <div className={s.rightSide}>
            {/* Bell */}
            <button className={s.iconBtn} aria-label="Notifications">
              <BellIcon />
              {hasAlerts && <span className={s.redDot} aria-label="Unread alerts" />}
            </button>

            {/* Help */}
            <div className={s.helpWrap} ref={helpRef}>
              <button
                className={s.iconBtn}
                aria-label="Help"
                onClick={() => setHelpOpen((v) => !v)}
              >
                <HelpIcon />
              </button>
              {helpOpen && (
                <div className={s.helpDropdown}>
                  <a href="#" className={s.helpItem} onClick={() => setHelpOpen(false)}>
                    📖 Documentation
                  </a>
                  <a href="#" className={s.helpItem} onClick={() => setHelpOpen(false)}>
                    💬 Contact Support
                  </a>
                  <a href="#" className={s.helpItem} onClick={() => setHelpOpen(false)}>
                    ⌨️ Keyboard Shortcuts
                  </a>
                </div>
              )}
            </div>

            {/* User badge + profile dropdown */}
            <div className={s.profileWrap} ref={profileRef}>
              <button
                className={s.userBadge}
                onClick={() => setProfileOpen((v) => !v)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                <div className={s.avatar}>{initial}</div>
                <div className={s.badgeInfo}>
                  <span className={s.badgeName}>{displayName}</span>
                  {role && <span className={s.rolePill}>{role}</span>}
                </div>
                <span className={s.chevron}>▾</span>
              </button>

              {profileOpen && (
                <div className={s.profileDropdown} role="menu">
                  {PROFILE_ITEMS.map((item, idx) => (
                    <div key={item.label}>
                      {idx > 0 && PROFILE_ITEMS[idx - 1].separator && (
                        <div className={s.dropSep} />
                      )}
                      <button
                        className={`${s.dropItem} ${item.danger ? s.dropItemDanger : ''}`}
                        role="menuitem"
                        onClick={() => {
                          if (item.danger) { setProfileOpen(false); setConfirmOpen(true); }
                          else setProfileOpen(false);
                        }}
                      >
                        <span className={s.dropIcon}>{item.icon}</span>
                        {item.label}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sign-out confirmation modal */}
      {confirmOpen && (
        <div className={s.modalBackdrop} onClick={() => setConfirmOpen(false)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h3 className={s.modalTitle}>Sign out of Resurgent India?</h3>
            <p className={s.modalBody}>
              You will need to log in again to access your compliance dashboard.
            </p>
            <div className={s.modalActions}>
              <button className={s.cancelBtn} onClick={() => setConfirmOpen(false)}>Cancel</button>
              <button className={s.signOutBtn} onClick={handleLogout} disabled={loggingOut}>
                {loggingOut ? 'Signing out…' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
