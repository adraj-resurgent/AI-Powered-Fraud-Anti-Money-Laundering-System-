
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function middleware(req: NextRequest) {

  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const { payload } = await jwtVerify(token, SECRET)

    const response = NextResponse.next()
    response.headers.set('x-user-id',    String(payload.id))
    response.headers.set('x-user-role',  String(payload.role))
    response.headers.set('x-user-email', String(payload.email))
    return response

  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/aml/:path*',
    '/sanctions/:path*',
    '/pep/:path*',
    '/reports/:path*',
  ]
}