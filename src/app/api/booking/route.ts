// Public appointment booking API.
//
// This endpoint is NOT admin-only. Any patient can submit a booking request.
// Concurrency-safe logic:
//   1. Start a transaction (BEGIN).
//   2. Check the slot (date, time) is not already booked.
//   3. If free, insert the booking atomically.
//   4. Commit; if the unique constraint fires, return 409 (already booked).
//
// In production, replace the placeholder with Supabase:
//   const { data, error } = await supabase
//     .from('appointments')
//     .insert({ ... })
//     .select()
//     .single();
//
// The unique index uix_appointments_date_time on (date, time) guarantees
// that two patients cannot reserve the same slot simultaneously.

import { type NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
function isValidDate(str: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  const d = new Date(str + 'T00:00:00');
  return !isNaN(d.getTime());
}

function isValidTime(str: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(str)) return false;
  const [h, m] = str.split(':').map(Number);
  return h >= 0 && h <= 23 && m >= 0 && m <= 59;
}

// ---------------------------------------------------------------------------
// POST /api/booking — create a patient appointment
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      mobile,
      email,
      date,
      time,
      duration,
      notes,
      serialNumber,
    } = body ?? {};

    // --- Client & server validation ---
    if (!name || !mobile || !date || !time) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please enter your full name' },
        { status: 400 }
      );
    }

    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(mobile.replace(/\s/g, ''))) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid mobile number' },
        { status: 400 }
      );
    }

    if (!isValidDate(date)) {
      return NextResponse.json(
        { success: false, error: 'Please choose a valid date' },
        { status: 400 }
      );
    }

    // Server-side date check: must be today or in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(date + 'T00:00:00');
    if (isNaN(inputDate.getTime()) || inputDate < today) {
      return NextResponse.json(
        { success: false, error: 'Date must be today or in the future' },
        { status: 400 }
      );
    }

    if (!isValidTime(time)) {
      return NextResponse.json(
        { success: false, error: 'Please choose a valid time' },
        { status: 400 }
      );
    }

    if (!duration) {
      return NextResponse.json(
        { success: false, error: 'Please select a duration' },
        { status: 400 }
      );
    }

    // --- Concurrency-safe booking logic ---
    // In production, replace with a Supabase transaction:
    //   const { data, error } = await supabase.rpc('book_appointment', {
    //     p_date: date,
    //     p_time: time,
    //     p_serial: serialNumber,
    //     p_patient_name: name,
    //     ...
    //   });
    // The function would:
    //   1. Start a transaction.
    //   2. SELECT ... FROM appointments WHERE date = p_date AND time = p_time AND status IN ('pending','confirmed') FOR UPDATE;
    //   3. IF row exists -> ROLLBACK and return 'already booked'.
    //   4. ELSE generate reference, INSERT, COMMIT, return booking.

    // Placeholder: simulate a successful booking.
    const now = new Date().toISOString();
    const reference = `HHP-${String(new Date().getFullYear())}-${String(Math.floor(Math.random() * 90000) + 10000)}`;

    const appointment = {
      id: 'booking_' + reference,
      patient_name: name.trim(),
      patient_mobile: mobile.trim(),
      patient_email: email?.trim() || null,
      date,
      time,
      serial_number: serialNumber?.trim() || null,
      duration,
      notes: notes?.trim() || null,
      reference,
      status: 'pending', // will become 'confirmed' after admin review
      created_at: now,
      updated_at: now,
    };

    // In a real implementation, the insert would happen here.
    // For now we return the booking as if it was saved.

    return NextResponse.json({
      success: true,
      appointment,
      message: 'Your booking request has been received. A confirmation will be sent to your mobile.',
    });
  } catch (error) {
    console.error('[booking:POST]', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
