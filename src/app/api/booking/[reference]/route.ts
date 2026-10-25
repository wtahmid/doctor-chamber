// GET /api/booking/[reference] — confirm a booking exists in the database.
//
// In production, fetch the booking from Supabase:
//   const { data, error } = await supabase
//     .from('appointments')
//     .select('*')
//     .eq('reference', reference)
//     .single();
//
// If found, return the booking details. If not found, return 404.
// Never show a confirmation for a booking that was not saved.

import { type NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Placeholder data — replace with Supabase queries.
// ---------------------------------------------------------------------------
const DUMMY_BOOKINGS: Record<string, Record<string, unknown>> = {
  'HHP-2026-55001': {
    id: 'booking_1',
    patient_name: 'Test Patient',
    patient_mobile: '01700000000',
    date: '2026-10-25',
    time: '10:00',
    duration: '30 min',
    reference: 'HHP-2026-55001',
    status: 'pending',
    created_at: new Date().toISOString(),
  },
};

// ---------------------------------------------------------------------------
// GET /api/booking/[reference]
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference || !/^[A-Z0-9\-]+$/.test(reference)) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid booking reference' },
        { status: 400 }
      );
    }

    // In production, fetch from Supabase:
    //   const { data, error } = await supabase
    //     .from('appointments')
    //     .select('*')
    //     .eq('reference', reference)
    //     .single();
    //   if (error || !data) return NextResponse.json({ success: false }, { status: 404 });

    // Placeholder
    const booking = DUMMY_BOOKINGS[reference] ?? null;
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('[booking:confirmation:GET]', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
