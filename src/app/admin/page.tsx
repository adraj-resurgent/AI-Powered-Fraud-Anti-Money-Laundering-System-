import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
import pool from '@/lib/db';
import AdminPanel, { type User } from './AdminPanel';
import LogoutButton from '@/app/(dashboard)/dashboard/LogoutButton';

export const dynamic = 'force-dynamic';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export default async function AdminPage() {
  // ── Auth check (middleware doesn't cover /admin) ──
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    // Only users with role='admin' can access this page
    if (payload.role !== 'admin') {
      redirect('/dashboard');
    }
  } catch {
    redirect('/login');
  }

  // ── Fetch all users ──
  let users: User[] = [];
  let dbError: string | null = null;

  try {
    const result = await pool.query<User>(`
      SELECT id, name, email, company, role,
             account_type, expires_at, is_active, last_login
      FROM users
      ORDER BY created_at DESC
    `);
    users = result.rows;
  } catch (err) {
    console.error('Admin DB error:', err);
    dbError = 'Could not connect to the database. Check DATABASE_URL in .env.local.';
  }

  return (
    <div className="adm-page">
      {/* Page header */}
      <header className="adm-header">
        <div className="adm-header-inner">
          <div>
            <h1 className="adm-title">Demo Access Admin</h1>
            <p className="adm-subtitle">Resurgent India — User Management</p>
          </div>
          <LogoutButton />
        </div>
      </header>

      {dbError ? (
        <div className="adm-error">
          <strong>Database Error:</strong> {dbError}
        </div>
      ) : (
        <AdminPanel users={users} />
      )}

      <style>{`
        .adm-page { min-height: 80vh; background: #f0f4fa; }
        .adm-header {
          background: linear-gradient(135deg,#172e52 0%,#1E3A5F 100%);
          padding: 0 40px;
        }
        .adm-header-inner {
          max-width: 1300px; margin: 0 auto;
          height: 72px; display: flex; align-items: center;
          justify-content: space-between;
        }
        .adm-title  { font-size: 20px; font-weight: 800; color: #fff; margin: 0; }
        .adm-subtitle { font-size: 13px; color: rgba(255,255,255,0.6); margin: 2px 0 0; }
        .adm-error {
          max-width: 800px; margin: 40px auto;
          background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px;
          padding: 24px 28px; color: #b91c1c; font-size: 15px;
        }
      `}</style>
    </div>
  );
}
