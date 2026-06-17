import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// Provided at runtime via env vars — never hardcode (keys leak in source control).
// Prefer an https:// upstream so the API key isn't sent in cleartext.
const UPSTREAM_URL = process.env.SCREENING_UPSTREAM_URL;
const API_KEY = process.env.SCREENING_API_KEY;

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

  // ── Ensure the upstream is configured ──
  if (!UPSTREAM_URL || !API_KEY) {
    console.error('Screening engine not configured: set SCREENING_UPSTREAM_URL and SCREENING_API_KEY');
    return NextResponse.json(
      { error: 'Screening engine is not configured.' },
      { status: 503 },
    );
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
