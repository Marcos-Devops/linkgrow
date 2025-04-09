import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const SectionContainer = styled.section`
  padding: 6rem 5%;
  background-color: #ffffff;
`;

const SectionContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
  max-width: 700px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const BillingToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
`;

const BillingOption = styled.span<{ active: boolean }>`
  font-size: 1rem;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? '#0077B5' : '#6c757d'};
  cursor: pointer;
  transition: all 0.3s ease;
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 60px;
  height: 30px;
  border-radius: 15px;
  background-color: #0077B5;
  margin: 0 1rem;
  cursor: pointer;
`;

const ToggleKnob = styled.div<{ isYearly: boolean }>`
  position: absolute;
  top: 3px;
  left: ${props => props.isYearly ? '33px' : '3px'};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: white;
  transition: all 0.3s ease;
`;

const SaveLabel = styled.span`
  position: absolute;
  top: -20px;
  right: -30px;
  background: linear-gradient(135deg, #ff6b6b, #f03e3e);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PricingCard = styled.div<{ featured?: boolean }>`
  background: ${props => props.featured ? 'linear-gradient(135deg, #f8f9fa, #e9ecef)' : '#fff'};
  border-radius: 8px;
  padding: 3rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, ${props => props.featured ? '0.1' : '0.05'});
  border: ${props => props.featured ? '2px solid #0077B5' : '1px solid #dee2e6'};
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: 0;
  right: 2rem;
  background: linear-gradient(135deg, #0077B5, #00A0DC);
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  border-radius: 0 0 10px 10px;
`;

const PlanName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
`;

const PlanPrice = styled.div`
  margin-bottom: 2rem;
`;

const Price = styled.h4`
  font-size: 3rem;
  font-weight: 700;
  color: #0077B5;
  margin: 0;
  
  span {
    font-size: 1rem;
    font-weight: 400;
    color: #6c757d;
  }
`;

const BillingCycle = styled.p`
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0.5rem 0 0;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
`;

const FeatureItem = styled.li<{ included?: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: ${props => props.included ? '#333' : '#adb5bd'};
  font-size: 1rem;
  
  svg {
    width: 20px;
    height: 20px;
    margin-right: 0.75rem;
    color: ${props => props.included ? '#0077B5' : '#dee2e6'};
  }
`;

const PlanButton = styled(Link)<{ featured?: boolean }>`
  display: block;
  width: 100%;
  padding: 0.875rem;
  text-align: center;
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  text-decoration: none;
  
  ${props => props.featured 
    ? `
      background: linear-gradient(135deg, #0077B5, #00A0DC);
      color: white;
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 7px 14px rgba(0, 119, 181, 0.3);
      }
    ` 
    : `
      background: transparent;
      color: #0077B5;
      border: 1px solid #0077B5;
      
      &:hover {
        background-color: rgba(0, 119, 181, 0.1);
      }
    `}
`;

const PricingSection: React.FC = () => {
  const [isYearly, setIsYearly] = useState(true);
  
  const toggleBilling = () => {
    setIsYearly(!isYearly);
  };
  
  const plans = [
    {
      id: 'free',
      name: 'Free',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        { text: 'Até 5 posts agendados por mês', included: true },
        { text: 'Editor básico de conteúdo', included: true },
        { text: 'Análise de métricas limitada', included: true },
        { text: 'Integração com LinkedIn', included: true },
        { text: 'Suporte por e-mail', included: true },
        { text: 'Editor de carrosséis', included: false },
        { text: 'Assistente de IA', included: false },
        { text: 'Engajamento automatizado', included: false }
      ],
      featured: false
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 29,
      yearlyPrice: 19,
      features: [
        { text: 'Até 50 posts agendados por mês', included: true },
        { text: 'Editor avançado de conteúdo', included: true },
        { text: 'Análise completa de métricas', included: true },
        { text: 'Integração com LinkedIn', included: true },
        { text: 'Suporte prioritário', included: true },
        { text: 'Editor de carrosséis', included: true },
        { text: 'Assistente de IA (limitado)', included: true },
        { text: 'Engajamento automatizado', included: false }
      ],
      featured: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 79,
      yearlyPrice: 59,
      features: [
        { text: 'Posts ilimitados', included: true },
        { text: 'Editor avançado de conteúdo', included: true },
        { text: 'Análise completa de métricas', included: true },
        { text: 'Integração com todas as redes', included: true },
        { text: 'Suporte VIP', included: true },
        { text: 'Editor de carrosséis', included: true },
        { text: 'Assistente de IA ilimitado', included: true },
        { text: 'Engajamento automatizado', included: true }
      ],
      featured: false
    }
  ];
  
  return (
    <SectionContainer id="planos">
      <SectionContent>
        <SectionHeader>
          <SectionTitle>Planos e Preços</SectionTitle>
          <SectionSubtitle>
            Escolha o plano ideal para suas necessidades e comece a transformar sua presença no LinkedIn hoje mesmo.
          </SectionSubtitle>
          
          <BillingToggle>
            <BillingOption active={!isYearly} onClick={() => setIsYearly(false)}>
              Mensal
            </BillingOption>
            
            <ToggleSwitch onClick={toggleBilling}>
              <ToggleKnob isYearly={isYearly} />
              {isYearly && <SaveLabel>-30%</SaveLabel>}
            </ToggleSwitch>
            
            <BillingOption active={isYearly} onClick={() => setIsYearly(true)}>
              Anual
            </BillingOption>
          </BillingToggle>
        </SectionHeader>
        
        <PricingGrid>
          {plans.map(plan => (
            <PricingCard key={plan.id} featured={plan.featured}>
              {plan.featured && <PopularBadge>Mais Popular</PopularBadge>}
              
              <PlanName>{plan.name}</PlanName>
              
              <PlanPrice>
                <Price>
                  R$ {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  <span>/mês</span>
                </Price>
                <BillingCycle>
                  {isYearly 
                    ? 'Faturado anualmente' 
                    : plan.id === 'free' ? 'Sempre gratuito' : 'Faturado mensalmente'}
                </BillingCycle>
              </PlanPrice>
              
              <FeaturesList>
                {plan.features.map((feature, index) => (
                  <FeatureItem key={index} included={feature.included}>
                    {feature.included ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {feature.text}
                  </FeatureItem>
                ))}
              </FeaturesList>
              
              <PlanButton 
                to={plan.id === 'free' ? '/auth/register' : '/auth/register?plan=' + plan.id} 
                featured={plan.featured}
              >
                {plan.id === 'free' ? 'Começar Grátis' : 'Assinar Agora'}
              </PlanButton>
            </PricingCard>
          ))}
        </PricingGrid>
      </SectionContent>
    </SectionContainer>
  );
};

export default PricingSection;
