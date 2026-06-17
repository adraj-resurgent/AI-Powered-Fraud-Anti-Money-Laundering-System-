
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import pool from '@/lib/db'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // 1. Find user in database
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1', [email]
    )
    const user = result.rows[0]

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // 3. Check if account is active
    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Your account has been deactivated. Contact support.' },
        { status: 403 }
      )
    }

    // 4. Check demo expiry
    if (user.account_type === 'demo' && user.expires_at) {
      if (new Date(user.expires_at) < new Date()) {
        return NextResponse.json(
          { error: 'Your demo access has expired. Contact sales@resurgentindia.com' },
          { status: 403 }
        )
      }
    }

    // 5. Create JWT token
    const token = await new SignJWT({
      id:           user.id,
      email:        user.email,
      role:         user.role,
      account_type: user.account_type,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15m')
      .sign(SECRET)

    // 6. Set token as HttpOnly cookie
    const response = NextResponse.json({
      ok:   true,
      name: user.name,
      role: user.role,
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   900, // 15 minutes
      path:     '/',
    })

    // 7. Update last login time
    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    )

    return response

  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Try again.' },
      { status: 500 }
    )
  }
}