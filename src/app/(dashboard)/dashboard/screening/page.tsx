import type { Metadata } from 'next';
import ScreeningClient from './ScreeningClient';

export const metadata: Metadata = {
  title: 'Entity Screening — Resurgent India',
  description: 'Screen individuals and organisations',
};

export default function ScreeningPage() {
  return <ScreeningClient />;
}
