// GET /api/schedule/available/2026-10-24 — return available time slots for a date.
//
// In production, this queries the `schedules` and `holidays` tables:
//   1. Find the schedule for the date's day-of-week.
//   2. Exclude holidays that cover the date.
//   3. Generate time slots (30-minute increments).
//   4. Exclude slots that are already booked (date, time) IN ('pending','confirmed').

import { type NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Placeholder data — replace with Supabase queries.
// ---------------------------------------------------------------------------
// These would come from the database:
//   const schedule = await supabase
//     .from('schedules')
//     .select('*')
//     .eq('day_of_week', dayName)
//     .single();
//   const holidays = await supabase
//     .from('holidays')
//     .select('start_date, end_date')
//     .eq('start_date', '<=', date)
//     .eq('end_date', '>=', date);

// Let's precompute what a typical schedule looks like for this demo.
// The actual logic lives in the admin dashboard (Phase 5).
const DUMMY_SCHEDULE = {
  weekday: 'Sunday', // day of week for the date
  open: '08:00',
  close: '12:00',
  open2: '17:00',
  close2: '22:00',
};

// DUMMY_BOOKED_SLOTS: slots already taken on this date.
// In a real system, these come from bookings with status IN ('pending','confirmed').
const DUMMY_BOOKED_SLOTS = ['09:00', '10:00', '18:00', '18:30'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function dayName(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[d.getDay()] ?? 'Sunday';
}

function getWeekdayNumber(dateStr: string): number {
  const d = new Date(dateStr + 'T00:00:00');
  return d.getDay() ?? 0;
}

function generateSlots(open: string, close: string, open2?: string, close2?: string): string[] {
  const slots: string[] = [];
  const parse = (time: string): number => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };
  const format = (mins: number): string => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  if (open && close) {
    let start = parse(open);
    let end = parse(close);
    for (let m = start; m + 30 <= end; m += 30) {
      slots.push(format(m));
    }
  }
  if (open2 && close2) {
    let start = parse(open2);
    let end = parse(close2);
    for (let m = start; m + 30 <= end; m += 30) {
      slots.push(format(m));
    }
  }
  return slots;
}

// ---------------------------------------------------------------------------
// GET /api/schedule/available/2026-10-24
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid date parameter' },
        { status: 400 }
      );
    }

    // Determine the day of week for the requested date.
    const dayName_ = dayName(date);

    // In production, fetch the schedule and holidays from Supabase:
    //   const schedule = await supabase
    //     .from('schedules')
    //     .select('*')
    //     .eq('day_of_week', dayName_)
    //     .single();
    //   const holidays = await supabase
    //     .from('holidays')
    //     .select('start_date, end_date')
    //     .eq('start_date', '<=', date)
    //     .eq('end_date', '>=', date);

    // Placeholder schedule (demo)
    const schedule = DUMMY_SCHEDULE;

    // Determine if this date is a holiday.
    // In production, check the holidays table here.

    const rawSlots = generateSlots(
      schedule.open,
      schedule.close,
      schedule.open2,
      schedule.close2
    );

    // Idempotent slot filtering: remove booked slots.
    const availableSlots = rawSlots.filter((slot) => !DUMMY_BOOKED_SLOTS.includes(slot));

    return NextResponse.json({
      success: true,
      date,
      day_of_week: dayName_,
      available_slots: availableSlots,
      note: 'Replace with Supabase queries for schedule + holidays + booked slots.',
    });
  } catch (error) {
    console.error('[schedule:GET]', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
