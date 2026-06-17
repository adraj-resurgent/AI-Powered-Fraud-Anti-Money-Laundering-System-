
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { action, id, email, name, company, days = 2, password: customPass, role } = await req.json()

  if (action === 'create') {
    // Use custom password if provided, otherwise auto-generate
    const tempPass = customPass?.trim() || 'Demo@' + Math.random().toString(36).slice(2, 8)
    const hash = await bcrypt.hash(tempPass, 10)
    const expiresAt = new Date(Date.now() + Number(days) * 86400000)
    const userRole = role || 'client'
    await pool.query(
      `INSERT INTO users
        (name, email, password, company, role, account_type, expires_at, is_active)
       VALUES ($1,$2,$3,$4,$5,'demo',$6,true)
       ON CONFLICT (email) DO UPDATE
         SET name=$1, password=$3, company=$4, role=$5, expires_at=$6, is_active=true`,
      [name, email, hash, company, userRole, expiresAt]
    )
    // Only return the password if it was auto-generated (don't echo back custom passwords)
    return NextResponse.json({ ok: true, tempPass: customPass?.trim() ? null : tempPass, expiresAt })
  }

  if (action === 'revoke') {
    await pool.query(
      `UPDATE users SET is_active=false, expires_at=NOW() WHERE id=$1`,
      [id]
    )
    return NextResponse.json({ ok: true })
  }

  if (action === 'extend') {
    await pool.query(
      `UPDATE users
       SET expires_at = GREATEST(expires_at, NOW()) + ($1 || ' days')::interval
       WHERE id=$2`,
      [days, id]
    )
    return NextResponse.json({ ok: true })
  }

  if (action === 'convert') {
    await pool.query(
      `UPDATE users
       SET account_type='full', expires_at=NULL, is_active=true
       WHERE id=$1`,
      [id]
    )
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
