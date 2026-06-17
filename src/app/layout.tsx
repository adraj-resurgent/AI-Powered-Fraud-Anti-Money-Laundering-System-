import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Resurgent India — AI-Powered AML/CFT Compliance for BFSI',
  description:
    "Resurgent India's AML/CFT suite detects, screens, and neutralises financial crime in real time. Powered by 13M+ proprietary data records from 1,000+ global sources. Built for Banks, NBFCs, Insurance and Payment Providers.",
  keywords: [
    'AML',
    'CFT',
    'sanction screening',
    'PEP screening',
    'financial crime prevention',
    'BFSI compliance',
    'Resurgent India',
  ],
  icons: {
    icon: '/resurgent_india.png',
  },
};

/**
 * viewport-fit=cover lets env(safe-area-inset-*) resolve on notched iPhones
 * (used by the login footer padding). No maximum-scale — pinch-zoom stays
 * enabled for accessibility; inputs use font-size:16px to avoid focus-zoom.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/**
 * Root layout — HTML shell only.
 * Navbar/Footer are injected by (marketing)/layout.tsx.
 * Dashboard chrome is injected by (dashboard)/layout.tsx.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
