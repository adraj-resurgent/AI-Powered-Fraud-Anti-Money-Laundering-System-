import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

const UPSTREAM_URL = 'http://65.1.148.112:8002/api/screen';
const API_KEY = 'screen-live-87086a78-5375-4beb-964e-1abf19efeb2d';

/**
 * Server-side proxy for the Entity & Organisation Screening API.
 * Why a proxy instead of a direct browser fetch:
 *   1. Avoids CORS — the external API at an IP:port won't allow localhost origins.
 *   2. Keeps the X-API-Key out of the client bundle.
 *   3. Lets us gate the call behind the logged-in JWT.
 */
export async function POST(req: NextRequest) {
  // ── Auth gate — must be a logged-in user ──
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await jwtVerify(token, SECRET);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Validate input ──
  let name: string;
  try {
    const body = await req.json();
    name = (body?.name ?? '').toString().trim();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: 'Please enter a name to screen.' }, { status: 400 });
  }

  // ── Forward to the screening engine ──
  try {
    const upstream = await fetch(UPSTREAM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify({ name }),
      cache: 'no-store',
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Screening engine returned ${upstream.status}.` },
        { status: 502 },
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Screening proxy error:', err);
    return NextResponse.json(
      { error: 'Could not reach the screening engine. Please try again.' },
      { status: 502 },
    );
  }
}
