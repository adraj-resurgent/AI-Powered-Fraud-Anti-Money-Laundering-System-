import type { Metadata } from 'next';
import PricingSection from '@/features/pricing/PricingSection';

export const metadata: Metadata = {
  title: 'Pricing — Resurgent India AML/CFT Suite',
  description:
    'Flexible, transparent pricing for the Resurgent India AML 360 suite. Annual and monthly plans for BFSI compliance teams of all sizes.',
};

export default function PricingPage() {
  return <PricingSection />;
}
