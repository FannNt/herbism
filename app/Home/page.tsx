"use client"

import Navbar from '../components/Navbar';
import HeroPage from '../components/HeroPage';
import ConsultationSection from '../components/ConsultationSection';
import FeaturesSection from '../components/ScanSection';
import PlantCareSection from '../components/PlantCareSection';
import WirelessPlantSection from '../components/WirelessPlantSection';
import Footer from '../components/Footer';
import BackToTopButton from '../components/BackToTopButton';
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

export default function Home() {
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
}
