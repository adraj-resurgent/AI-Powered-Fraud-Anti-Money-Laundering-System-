'use client';

import { useEffect, useState } from 'react';

export interface UserSession {
  name: string;
  role: string;
  company: string;
}

/** Read the user session saved by DashboardClient after every auth'd page load. */
export function useUserSession(): UserSession | null {
  const [session, setSession] = useState<UserSession | null>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('ri_user_session');
      if (raw) setSession(JSON.parse(raw) as UserSession);
    } catch { /* ignore */ }
  }, []);
  return session;
}

export function saveUserSession(data: UserSession): void {
  try { sessionStorage.setItem('ri_user_session', JSON.stringify(data)); } catch { /* ignore */ }
}

export function clearUserSession(): void {
  try { sessionStorage.removeItem('ri_user_session'); } catch { /* ignore */ }
}
