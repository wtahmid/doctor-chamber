// Shared types for the doctor-chamber website.

export type Locale = 'en' | 'bn';

export interface SiteConfig {
  name: string;
  tagline: string;
  timezone: string;
  defaultLocale: Locale;
  locales: Locale[];
}

export interface DoctorData {
  name: string;
  qualification: string;
  designation: string;
  description: string;
  photoAlt: string;
  photoPlaceholder: string;
  photoFileName: string;
}

export interface HoursConfig {
  weekdays: { open: string; close: string; open2?: string; close2?: string };
  friday: { open: string; close: string };
  weekend: { closed: boolean };
  timezone: string;
}

export interface PharmacyData {
  name: string;
  phone: string;
  address: string;
  open: string;
  note: string;
}

export interface LocationData {
  mapsUrl: string;
  mapLabel: string;
  addressLine1: string;
  addressLine2: string;
  verifyMap: string;
}

export interface ContactData {
  phone: string;
  whatsapp: string;
  phoneNote: string;
  email: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface BookingFormState {
  name: string;
  mobile: string;
  email: string;
  date: string;
  time: string;
  duration: string;
  reason: string;
}

export interface BookingRecord {
  id: string;
  name: string;
  mobile: string;
  email: string;
  date: string;
  time: string;
  duration: string;
  reason: string;
  reference: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

// Translation messages — keys must be shared between en and bn files.
export interface TranslationMessages {
  siteTitle: string;
  siteTagline: string;
  home: string;
  doctorProfile: string;
  bookAppointment: string;
  chamberLocation: string;
  attachedPharmacy: string;
  privacyPolicy: string;
  bookAppointmentNow: string;
  callNow: string;
  whatsApp: string;
  backToTop: string;
  language: string;
  languageEnglish: string;
  languageBangla: string;
  readingTime: string;
  skipLink: string;
  hero: {
    welcome: string;
    intro: string;
    primaryCta: string;
    secondaryCta: string;
  };
  doctor: {
    title: string;
    name: string;
    qualification: string;
    designation: string;
    description: string;
    photoAlt: string;
    photoPlaceholder: string;
  };
  hours: {
    title: string;
    weekdays: string;
    friday: string;
    weekend: string;
    note: string;
  };
  pharmacy: {
    title: string;
    intro: string;
    note: string;
  };
  location: {
    title: string;
    mapLabel: string;
    addressLine1: string;
    addressLine2: string;
    mapInstructions: string;
    verifyMap: string;
  };
  appointment: {
    title: string;
    name: string;
    namePlaceholder: string;
    mobile: string;
    mobilePlaceholder: string;
    date: string;
    time: string;
    duration: string;
    review: string;
    bookingReference: string;
    confirmation: string;
    confirm: string;
    cancel: string;
    reschedule: string;
    statusConfirmed: string;
    statusPending: string;
    statusCancelled: string;
    confirmationNote: string;
    noAccount: string;
    email: string;
    reason: string;
  };
  contact: {
    title: string;
    phone: string;
    whatsapp: string;
    phoneNote: string;
    clinics: string;
    email: string;
    openingHours: string;
  };
  faq: {
    title: string;
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    q3: string;
    a3: string;
    q4: string;
    a4: string;
    q5: string;
    a5: string;
  };
  footer: {
    copyright: string;
    address: string;
    cta: string;
  };
  privacy: {
    title: string;
    lastUpdated: string;
    intro: string;
    collected: string;
    collectedDetail: string;
    used: string;
    usedDetail: string;
    shared: string;
    sharedDetail: string;
    consent: string;
    consentDetail: string;
    contactLine: string;
    included: string;
  };
  errors: {
    required: string;
    invalidPhone: string;
    invalidDate: string;
    bookingFailed: string;
    unknownError: string;
  };
}
