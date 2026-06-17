import type { Metadata } from 'next';
import ContactSection from '@/features/contact/ContactSection';

export const metadata: Metadata = {
  title: 'Contact Us — Resurgent India',
  description:
    "Talk to the Resurgent India team about how our AML/CFT intelligence platform can transform your compliance operations.",
};

export default function ContactUsPage() {
  return <ContactSection />;
}
