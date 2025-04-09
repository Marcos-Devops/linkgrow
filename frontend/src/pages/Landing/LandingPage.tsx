import React from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import DemoSection from './components/DemoSection';
import TestimonialsSection from './components/TestimonialsSection';
import PricingSection from './components/PricingSection';
import FaqSection from './components/FaqSection';
import TransformSection from './components/TransformSection';
import ClientsSection from './components/ClientsSection';
import IntegrationSection from './components/IntegrationSection';
import StatsSection from './components/StatsSection';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';

const LandingPageContainer = styled.div`
  font-family: 'Inter', 'Roboto', sans-serif;
  color: #333;
  overflow-x: hidden;
`;

const LandingPage: React.FC = () => {
  return (
    <LandingPageContainer>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <DemoSection />
      <TransformSection />
      <IntegrationSection />
      <TestimonialsSection />
      <ClientsSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </LandingPageContainer>
  );
};

export default LandingPage;
