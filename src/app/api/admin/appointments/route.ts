// GET /api/admin/appointments — list appointments (server-side authorization)
//
// Enforces authorization: only authenticated admins may read appointments.
// Returns today's + upcoming appointments first, then older ones.

import { type NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Cookie + session helpers (same as /login)
// ---------------------------------------------------------------------------
const COOKIE_NAME = 'zahra_admin_session';

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

// ---------------------------------------------------------------------------
// Authorization guard
// ---------------------------------------------------------------------------
function requireAdmin(request: NextRequest) {
  const cookies = parseCookies(request);
  const token = cookies[COOKIE_NAME];

  if (!token) {
    return { error: 'Unauthorized', status: 401 };
  }

  // In production, verify the token against your session store.
  // Placeholder: decode the base64 token.
  let admin = null;
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    admin = { id: decoded.adminId, name: decoded.name, role: decoded.role };
  } catch {
    admin = null;
  }

  if (!admin) {
    return { error: 'Unauthorized', status: 401 };
  }

  return { admin, status: 200 };
}

// ---------------------------------------------------------------------------
// GET /api/admin/appointments
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  try {
    const auth = requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    // TODO: replace with a real Supabase query.
    // Example:
    //   const { data, error } = await supabase
    //     .from('appointments')
    //     .select('*')
    //     .order('date', { ascending: true })
    //     .order('time', { ascending: true });

    // Placeholder: return an empty list (database not configured yet)
    const appointments: Array<Record<string, unknown>> = [];

    return NextResponse.json({
      success: true,
      admin: auth.admin,
      appointments,
      count: appointments.length,
    });
  } catch (error) {
    console.error('[admin:appointments:GET]', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/admin/appointments — create an appointment
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const auth = requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { patientName, patientMobile, patientEmail, date, time, duration, notes } = body ?? {};

    // Client & server validation
    if (!patientName || !patientMobile || !date || !time || !duration) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientEmail || '')) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Server-side date check
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const input = new Date(date);
    if (isNaN(input.getTime()) || input < today) {
      return NextResponse.json(
        { success: false, error: 'Date must be today or in the future' },
        { status: 400 }
      );
    }

    // TODO: replace with a real insert.
    // Example:
    //   const reference = generateReference();
    //   const { data, error } = await supabase
    //     .from('appointments')
    //     .insert({
    //       patient_name: patientName,
    //       patient_mobile: patientMobile,
    //       patient_email: patientEmail,
    //       date,
    //       time,
    //       duration,
    //       notes,
    //       reference,
    //       status: 'pending',
    //     })
    //     .select()
    //     .single();
    //   if (error) {
    //     if (error.code === '23505') {
    //       return NextResponse.json(
    //         { success: false, error: 'This time slot is already booked. Please choose another.' },
    //         { status: 409 }
    //       );
    //     }
    //     return NextResponse.json(
    //       { success: false, error: error.message },
    //       { status: 500 }
    //     );
    //   }

    // Placeholder: return success without persisting
    const appointment = {
      id: 'placeholder',
      patient_name: patientName,
      patient_mobile: patientMobile,
      patient_email: patientEmail,
      date,
      time,
      duration,
      notes,
      reference: 'PENDING-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      admin: auth.admin,
      appointment,
    });
  } catch (error) {
    console.error('[admin:appointments:POST]', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
