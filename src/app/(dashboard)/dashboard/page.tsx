import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Dashboard — Resurgent India',
  description: 'Your AML/CFT compliance command centre',
};
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import pool from '@/lib/db';
import DashboardClient from './DashboardClient';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export default async function DashboardPage() {
  // ── Auth check ──
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) redirect('/login');

  let userId: number | null = null;
  let role = '';
  try {
    const { payload } = await jwtVerify(token, SECRET);
    userId = Number(payload.id);
    role = String(payload.role ?? '');
  } catch {
    redirect('/login');
  }

  // ── Look up name + company ──
  let userName = 'there';
  let userCompany = '';
  try {
    const r = await pool.query<{ name: string; company: string | null }>(
      'SELECT name, company FROM users WHERE id = $1',
      [userId],
    );
    if (r.rows[0]?.name)    userName    = r.rows[0].name;
    if (r.rows[0]?.company) userCompany = r.rows[0].company ?? '';
  } catch { /* fall back */ }

  return <DashboardClient userName={userName} userRole={role} userCompany={userCompany} />;
}
