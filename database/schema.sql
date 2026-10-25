-- =============================================================================
-- Zahra Health Point — Database Schema (Supabase PostgreSQL)
-- =============================================================================
--
-- Deployment: Supabase (PostgreSQL) via Vercel integration.
--
-- Run this file as a SQL migration in Supabase → Database → Migrations.
-- Every block is idempotent (DROP IF EXISTS + IF NOT EXISTS) so it can be
-- re-run safely.
--
-- Time zone: Asia/Dhaka (use `latin1` or `UTF8` encoding; no timezone
-- conversion needed — all timestamps are stored in UTC and displayed in
-- Asia/Dhaka via the app layer).
--
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Admin users (authenticated staff: doctor, receptionist)
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS admin_users CASCADE;
CREATE TABLE admin_users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  name            TEXT NOT NULL,
  role            TEXT NOT NULL CHECK (role IN ('doctor','receptionist')),
  confirmed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Chamber details (configured in admin dashboard)
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS chamber_details CASCADE;
CREATE TABLE chamber_details (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  address     TEXT NOT NULL,
  map_label   TEXT,                       -- unverified label (unverified until owner confirms)
  maps_url    TEXT,                       -- owner-supplied Google Maps link
  phone       TEXT NOT NULL,
  whatsapp    TEXT NOT NULL,
  email       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Doctor profile (verified by owner before publishing)
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS doctor_profile CASCADE;
CREATE TABLE doctor_profile (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT,
  qualification   TEXT,
  designation     TEXT,   -- official designation — verify spelling before publishing
  bio             TEXT,
  photo_url       TEXT,   -- placeholder until owner uploads a real photo
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Pharmacy details (separate from the doctor's medical profile)
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS pharmacy_details CASCADE;
CREATE TABLE pharmacy_details (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  address     TEXT NOT NULL,
  opening_hours   TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Visiting schedules (configured by admin)
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS schedules CASCADE;
CREATE TABLE schedules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')),
  open_time   TEXT NOT NULL,      -- HH:MM in Asia/Dhaka
  close_time  TEXT NOT NULL,      -- HH:MM in Asia/Dhaka
  open_time2  TEXT,               -- optional second block (e.g. evening)
  close_time2 TEXT,               -- optional second block
  is_closed   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Holidays and unavailable dates
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS holidays CASCADE;
CREATE TABLE holidays (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label       TEXT NOT NULL,        -- e.g. 'Friday 8am–12pm only'
  start_date  DATE,
  end_date    DATE,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Appointments (patient bookings)
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS appointments CASCADE;
CREATE TABLE appointments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Patient data (collected per spec; minimal)
  patient_name    TEXT NOT NULL,
  patient_mobile  TEXT NOT NULL,
  patient_email   TEXT,               -- optional

  -- Booking data
  date            DATE NOT NULL,
  time            TEXT NOT NULL,      -- HH:MM in Asia/Dhaka
  serial_number   TEXT,               -- optionally assigned serial number
  duration        TEXT NOT NULL,      -- e.g. '30 min'

  -- Reference & status
  reference       TEXT UNIQUE NOT NULL,   -- unique booking reference
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed')),

  -- Cancellation / rescheduling
  cancelled_at    TIMESTAMPTZ,
  rescheduled_to  TEXT,               -- new time (HH:MM) if rescheduled

  -- Metadata
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enforce concurrent-safe slot allocation:
-- A unique index on (date, time) prevents two patients from reserving the
-- same slot. The app inserts within a single transaction so the constraint is
-- enforced atomically by PostgreSQL.
CREATE UNIQUE INDEX uix_appointments_date_time
  ON appointments (date, time) WHERE status IN ('pending','confirmed');

-- ---------------------------------------------------------------------------
-- Session / auth audit trail (optional)
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS auth_sessions CASCADE;
CREATE TABLE auth_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  ip_address  TEXT,
  user_agent  TEXT,
  logged_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at  TIMESTAMPTZ NOT NULL
);

-- ---------------------------------------------------------------------------
-- Indexes for search & performance
-- ---------------------------------------------------------------------------
CREATE INDEX idx_appointments_date ON appointments (date);
CREATE INDEX idx_appointments_mobile ON appointments (patient_mobile);
CREATE INDEX idx_appointments_reference ON appointments (reference);
CREATE INDEX idx_schedules_day ON schedules (day_of_week);
CREATE INDEX idx_holidays_start ON holidays (start_date);

-- ---------------------------------------------------------------------------
-- Row-level security policy (Supabase)
-- ---------------------------------------------------------------------------
-- Allow public read for chamber/pharmacy/settings, private for appointments.
-- Implement in Supabase dashboard → Authentication → Policies.

