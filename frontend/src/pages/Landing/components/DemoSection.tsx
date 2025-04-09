import React from 'react';
import styled from 'styled-components';

const SectionContainer = styled.section`
  padding: 6rem 5%;
  background-color: #f8f9fa;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
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
  margin: 0 auto;
  line-height: 1.6;
`;

const DemoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4rem;
  
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 3rem;
  }
`;

const DemoContent = styled.div`
  flex: 1;
`;

const DemoImageContainer = styled.div`
  flex: 1.2;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: #f1f3f5;
    border-bottom: 1px solid #dee2e6;
    z-index: 1;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 15px;
    left: 20px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #fa5252;
    box-shadow: 20px 0 0 #fcc419, 40px 0 0 #40c057;
    z-index: 2;
  }
`;

const DemoImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  transform: translateY(0);
  transition: transform 0.5s ease;
  
  &:hover {
    transform: translateY(-30%);
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const FeatureIcon = styled.div`
  margin-right: 1rem;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  
  svg {
    width: 100%;
    height: 100%;
    color: #0077B5;
  }
`;

const FeatureContent = styled.div``;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: #333;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #6c757d;
  line-height: 1.6;
  margin: 0;
`;

const DemoSection: React.FC = () => {
  const features = [
    {
      id: 1,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      title: 'Crie posts em segundos',
      description: 'Nosso editor intuitivo com IA permite que você crie conteúdo de alta qualidade em questão de segundos.'
    },
    {
      id: 2,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Agende automaticamente',
      description: 'Programe seus posts para os melhores horários e deixe o Linkgrow cuidar da publicação para você.'
    },
    {
      id: 3,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Acompanhe métricas',
      description: 'Visualize dados detalhados de engajamento para entender o que funciona melhor para o seu público.'
    },
    {
      id: 4,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: 'Automatize seu crescimento',
      description: 'Configure rotinas de engajamento automático para maximizar seu alcance e interações.'
    }
  ];

  return (
    <SectionContainer id="como-funciona">
      <SectionHeader>
        <SectionTitle>Veja como é simples usar o Linkgrow</SectionTitle>
        <SectionSubtitle>
          Uma interface intuitiva e poderosa para gerenciar toda sua presença no LinkedIn em um só lugar.
        </SectionSubtitle>
      </SectionHeader>
      
      <DemoContainer>
        <DemoContent>
          <FeatureList>
            {features.map(feature => (
              <FeatureItem key={feature.id}>
                <FeatureIcon>
                  {feature.icon}
                </FeatureIcon>
                <FeatureContent>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDescription>{feature.description}</FeatureDescription>
                </FeatureContent>
              </FeatureItem>
            ))}
          </FeatureList>
        </DemoContent>
        
        <DemoImageContainer>
          <DemoImage 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
            alt="Dashboard do Linkgrow"
          />
        </DemoImageContainer>
      </DemoContainer>
    </SectionContainer>
  );
};

export default DemoSection;
