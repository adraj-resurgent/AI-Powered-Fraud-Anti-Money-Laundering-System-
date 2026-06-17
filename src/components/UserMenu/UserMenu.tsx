'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import s from './UserMenu.module.css';

interface Props {
  userName: string;
  userRole: string;
}

export default function UserMenu({ userName, userRole }: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = userName
    .split(' ')
    .map((w) => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/login');
    }
  };

  return (
    <>
      <div className={s.userMenu} ref={menuRef}>
        <button
          className={s.trigger}
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
        >
          <div className={s.avatar}>{initials}</div>
          <div className={s.userInfo}>
            <span className={s.userName}>{userName}</span>
            {userRole && <span className={s.rolePill}>{userRole}</span>}
          </div>
          <span className={s.chevron} aria-hidden="true">▾</span>
        </button>

        {menuOpen && (
          <div className={s.dropdown} role="menu">
            <button className={s.dropItem} role="menuitem" onClick={() => setMenuOpen(false)}>
              <span className={s.dropIcon}>👤</span> My Profile
            </button>
            <button className={s.dropItem} role="menuitem" onClick={() => setMenuOpen(false)}>
              <span className={s.dropIcon}>⚙️</span> Settings
            </button>
            <div className={s.dropDivider} />
            <button
              className={`${s.dropItem} ${s.dropItemDanger}`}
              role="menuitem"
              onClick={() => { setMenuOpen(false); setConfirmOpen(true); }}
            >
              <span className={s.dropIcon}>🚪</span> Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Confirmation modal */}
      {confirmOpen && (
        <div className={s.modalBackdrop} onClick={() => setConfirmOpen(false)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h3 className={s.modalTitle}>Sign out of Resurgent India?</h3>
            <p className={s.modalBody}>
              You will need to log in again to access your compliance dashboard.
            </p>
            <div className={s.modalActions}>
              <button className={s.cancelBtn} onClick={() => setConfirmOpen(false)}>
                Cancel
              </button>
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
