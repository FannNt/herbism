"use client"
import Navbar from '../components/Navbar';
import HeroPage from './HeroPage';
import ConsultationSection from './ConsultationSection';
import FeaturesSection from './ScanSection';
import PlantCareSection from './PlantCareSection';
import WirelessPlantSection from './WirelessPlantSection';
import Footer from './Footer';
import BackToTopButton from './BackToTopButton';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function HomeContent() {
  const { currentMode } = useTheme();
  
  return (
    <main className="overflow-x-hidden w-full">
      <Navbar />
      <HeroPage />
      <ConsultationSection/>
      <FeaturesSection />
      <PlantCareSection />
      <WirelessPlantSection />
      <Footer />
      <BackToTopButton />
    </main>
  );
}

export default function HomePage() {
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
}
