import { Container, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { HealthTipsSection } from './components/HealthTipsSection';
import { BenefitsSection } from './components/BenefitsSection';
import { CallToAction } from './components';
import './Home.css';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box className="home-page">
      <HeroSection scrollY={scrollY} />
      <Container maxWidth="lg" className="home-container">
        <FeaturesSection />
        <HealthTipsSection />
        <BenefitsSection />
        <CallToAction />
      </Container>
    </Box>
  );
}
