// Shared configuration: site metadata and placeholder data.
//
// NOTE — NO REAL DATA HERE.
// The doctor's name, designation, contact numbers, pharmacy details, and the
// confirmed Google Maps pin are NOT known yet. All of them must be configured
// from the admin dashboard (Phase 5) and verified with the chamber owner
// before launch. This file only holds the *placeholders* used in the first
// working version. If you find a real value here, it was overwritten by mistake.

import type { SiteConfig, DoctorData, HoursConfig, PharmacyData, LocationData, ContactData, FaqItem } from './types';

export const siteConfig: SiteConfig = {
  name: 'Zahra Health Point',
  tagline: 'Compassionate care in Phultala',
  timezone: 'Asia/Dhaka',
  defaultLocale: 'en' as const,
  locales: ['en', 'bn'] as const,
};

// Doctor profile — placeholders. These are not verified data.
export const doctorData: DoctorData = {
  name: '[Name not yet verified]',
  qualification: 'MBBS',
  designation: 'THO', // supplied by owner — verify exact spelling before publishing
  description: 'To be provided. The official designation is supplied by the chamber owner and must be verified before publishing.',
  photoAlt: 'Doctor photo — to be replaced with a verified professional portrait',
  photoPlaceholder: 'Professional doctor photo placeholder (to be replaced before launch)',
  photoFileName: 'doctor-placeholder.jpg',
};

// Chamber visiting hours — to be configurable from the admin dashboard.
export const hoursConfig: HoursConfig = {
  weekdays: { open: '08:00', close: '12:00', open2: '17:00', close2: '22:00' },
  friday: { open: '08:00', close: '12:00' },
  weekend: { closed: true },
  timezone: 'Asia/Dhaka',
};

// Attached pharmacy — placeholders. Verify with the chamber owner.
export const pharmacyData: PharmacyData = {
  name: '[Pharmacy name to be confirmed]',
  phone: '[Pharmacy phone to be confirmed]',
  address: 'Phultala, Jessore Road area — attached to the chamber',
  open: '[Hours to be confirmed]',
  note: 'Medicine stock levels, delivery, and online ordering are not claimed here unless explicitly implemented and verified.',
};

// Location / Google Maps — unverified. Preserve the supplied link exactly.
export const locationData: LocationData = {
  // Supplied by the owner — DO NOT forge coordinates or move the pin.
  mapsUrl:
    'https://maps.app.goo.gl/7xqr4m54xVAYFAx3A?g_st=ic',
  mapLabel: 'Map label (unverified) — please confirm the exact pin with the chamber owner before launch.',
  addressLine1: 'Phultala, Jessore Road area',
  addressLine2: 'Near [landmark to be confirmed]',
  verifyMap: 'Verify exact pin with chamber owner',
};

// Contact numbers — placeholders. Verify before publishing.
export const contactData: ContactData = {
  phone: '[Phone number to be confirmed]',
  whatsapp: '[WhatsApp number to be confirmed]',
  phoneNote: 'Call for urgent matters outside consultation hours.',
  email: '[Email to be confirmed]',
};

// FAQ items — the questions/answers here are generic and safe to publish.
export const faqItems: FaqItem[] = [
  {
    q: 'How do I book an appointment?',
    a: 'Visit the Book an Appointment page, choose your preferred date and time, and submit — no account required.',
  },
  {
    q: 'Are consultations available on weekends?',
    a: 'No. Consultations are on weekdays 8am–12pm and 5pm–10pm; Friday is 8am–12pm only.',
  },
  {
    q: 'Is the pharmacy attached?',
    a: 'Yes. The pharmacy is attached to the chamber; its confirmed name and hours are managed from the admin dashboard.',
  },
  {
    q: 'What language is the site available in?',
    a: 'The site is fully bilingual — English and Bangla — with a language switcher in the header.',
  },
  {
    q: 'How will I receive appointment confirmation?',
    a: 'A confirmation reference is shown on the confirmation screen and can be emailed to you on request.',
  },
];
