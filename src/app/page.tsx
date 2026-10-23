// Homepage: composes all shared sections into the first working version.

import { Hero } from '@/components/home/Hero';
import { DoctorCard } from '@/components/home/DoctorCard';
import { PharmacySection } from '@/components/home/PharmacySection';
import { LocationSection } from '@/components/home/LocationSection';
import { AppointmentSection } from '@/components/home/AppointmentSection';
import { FaqSection } from '@/components/home/FaqSection';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <DoctorCard />
      <LocationSection />
      <PharmacySection />
      <AppointmentSection />
      <FaqSection />
    </div>
  );
}
