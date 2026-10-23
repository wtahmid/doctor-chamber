// Supabase Auth is the recommended auth provider (app-level). This route is
// a thin wrapper: verify the admin email + password (from admin_users table)
// server-side, then set an httpOnly cookie with a session token.
//
// Production: replace with @supabase/ssr + cookies.svc using
// supabase.auth.signInWithPassword() with service-role role when needed.

import { type NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Cookie setup
// ---------------------------------------------------------------------------
const COOKIE_NAME = 'zahra_admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function parseCookies(request: NextRequest) {
  const header = request.headers.get('cookie') ?? '';
  const pairs = header.split(';').map((pair) => pair.trim()).filter(Boolean);
  const out: Record<string, string> = {};
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx === -1) continue;
    out[pair.slice(0, idx).trim()] = decodeURIComponent(pair.slice(idx + 1).trim());
  }
  return out;
}

function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
  return response;
}

function clearAuthCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}

// ---------------------------------------------------------------------------
// Dummy credential verifier (replace with real Supabase call in production)
// ---------------------------------------------------------------------------
async function verifyAdmin(email: string, password: string) {
  // TODO: replace with real query against admin_users table.
  // Example:
  //   const { data, error } = await supabase
  //     .from('admin_users')
  //     .select('id,password_hash,name,role,confirmed_at')
  //     .eq('email', email)
  //     .single();
  //   if (error || !data) return null;
  //   const ok = await bcrypt.compare(password, data.password_hash);
  //   return ok ? data : null;

  // In-memory placeholder (default seeded accounts from hospital-hms)
  const seeded = {
    'admin@zahrahealthpoint.com': 'Admin123',
    'dr_sarah_chen@zahrahealthpoint.com': 'Doctor123',
    'patient_raj_mehta@zahrahealthpoint.com': 'Patient123',
  } as Record<string, string>;
  const plain = seeded[email] ?? '';
  return plain === password ? { name: email.split('@')[0], role: 'receptionist', confirmed_at: new Date() } : null;
}

// ---------------------------------------------------------------------------
// POST /api/admin/login — authenticate an administrator
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body ?? {};

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format (client already validates; server re-checks)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const admin = await verifyAdmin(email, password);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // In production, replace this with a real Supabase session token.
    const token = Buffer.from(JSON.stringify({ adminId: email, role: admin.role, name: admin.name })).toString('base64');

    return setAuthCookie(
      NextResponse.json({ success: true, admin: { id: email, name: admin.name, role: admin.role } }),
      token
    );
  } catch (error) {
    console.error('[admin:login]', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// GET /api/admin/me — return the current admin (from the session cookie)
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  try {
    const cookies = parseCookies(request);
    const token = cookies[COOKIE_NAME];

    if (!token) {
      return NextResponse.json({ success: false, admin: null });
    }

    // In production, verify the token against your session store.
    // Placeholder: just decode the base64 token.
    let admin = null;
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      admin = { id: decoded.adminId, name: decoded.name, role: decoded.role };
    } catch {
      admin = null;
    }

    return NextResponse.json({ success: true, admin });
  } catch (error) {
    console.error('[admin:me]', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/admin/logout — clear the session cookie
// ---------------------------------------------------------------------------
export async function LOGOUT() {
  return clearAuthCookie(NextResponse.json({ success: true }));
}
