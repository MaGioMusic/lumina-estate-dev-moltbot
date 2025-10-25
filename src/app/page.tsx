import HeroSection from '@/components/HeroSection';
import StatisticsSection from '@/components/StatisticsSection';
import FeaturesSection from '@/components/FeaturesSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import PageSnapshotEmitter from '@/app/components/PageSnapshotEmitter';
import HomeSnapshotButton from '@/app/components/HomeSnapshotButton';

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <PageSnapshotEmitter
        page="home"
        title="Home — Lumina Estate"
        summary="მთავარი გვერდის სექციები და Actions."
        data={{ hasHero: true, featuredCount: 6 }}
        auto
      />
      <HeroSection />
      <StatisticsSection />
      <FeaturesSection />
      <ContactSection />
      <Footer />
      <ScrollToTop />
      <div className="container mx-auto px-6 max-w-6xl py-6">
        <HomeSnapshotButton />
      </div>
    </main>
  );
}
