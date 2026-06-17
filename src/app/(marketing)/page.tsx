import HeroSection from '@/features/hero/HeroSection';
import ProductSection from '@/features/products/ProductSection';
import GetStarted from '@/features/get-started/GetStarted';
import DetailCard from '@/features/detail-card/DetailCard';
import ComplianceBanner from '@/features/compliance-banner/ComplianceBanner';
import WhyUs from '@/features/why-us/WhyUs';
import DemoSection from '@/features/demo-section/DemoSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductSection />
      <GetStarted />
      <DetailCard />
      <ComplianceBanner />
      <WhyUs />
      <DemoSection />
    </>
  );
}
