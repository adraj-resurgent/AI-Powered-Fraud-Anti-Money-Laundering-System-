import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import pool from '@/lib/db';
import DashboardNav from '@/components/navbar/DashboardNav';

export const dynamic = 'force-dynamic';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

/**
 * Dashboard layout — wraps /dashboard and all sub-routes.
 *
 * Responsibilities:
 *   1. Auth gate — redirects to /login if no valid JWT cookie.
 *   2. Fetches the user's name/company from the DB so DashboardNav
 *      can display them on FIRST load (avoids the sessionStorage
 *      timing race where DashboardNav mounts before DashboardClient
 *      writes its user data).
 *   3. Renders DashboardNav with server-supplied user data as props.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ── Auth check ──────────────────────────────────────────────
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) redirect('/login');

  let userId   = 0;
  let userRole = '';
  try {
    const { payload } = await jwtVerify(token, SECRET);
    userId   = Number(payload.id);
    userRole = String(payload.role ?? '');
  } catch {
    redirect('/login');
  }

  // ── Fetch user display info for DashboardNav ─────────────────
  let userName    = '';
  let userCompany = '';
  try {
    const r = await pool.query<{ name: string; company: string | null }>(
      'SELECT name, company FROM users WHERE id = $1',
      [userId],
    );
    if (r.rows[0]) {
      userName    = r.rows[0].name    ?? '';
      userCompany = r.rows[0].company ?? '';
    }
  } catch { /* use empty strings — nav shows "U" avatar as fallback */ }

  // ── Render dashboard chrome ──────────────────────────────────
  return (
    <>
      <DashboardNav
        userName={userName}
        userRole={userRole}
        userCompany={userCompany}
      />
      {children}
    </>
  );
}
