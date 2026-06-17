'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/login');
    }
  };

  return (
    <button onClick={handleLogout} disabled={loading} className="logout-btn">
      {loading ? 'Signing out…' : 'Sign Out'}
      <style>{`
        .logout-btn {
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.5);
          color: #ffffff;
          padding: 8px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }
        .logout-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.8);
        }
        .logout-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </button>
  );
}
