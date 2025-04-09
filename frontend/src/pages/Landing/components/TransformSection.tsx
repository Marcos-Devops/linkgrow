import React from 'react';
import styled from 'styled-components';

const SectionContainer = styled.section`
  padding: 6rem 5%;
  background: linear-gradient(135deg, #0077B5 0%, #00A0DC 100%);
  color: white;
`;

const SectionContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  opacity: 0.9;
`;

const TransformGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TransformCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const TransformIcon = styled.div`
  margin-bottom: 1.5rem;
  
  svg {
    width: 40px;
    height: 40px;
    color: white;
  }
`;

const TransformTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const TransformDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.9;
`;

const TransformSection: React.FC = () => {
  const transformItems = [
    {
      id: 1,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: 'Construa sua autoridade',
      description: 'Estabeleça-se como referência em seu nicho com conteúdo consistente e de alta qualidade que ressoa com seu público-alvo.'
    },
    {
      id: 2,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Amplie sua rede',
      description: 'Expanda seu alcance e conecte-se com profissionais relevantes que podem impulsionar sua carreira ou negócio.'
    },
    {
      id: 3,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Ganhe credibilidade',
      description: 'Construa uma reputação sólida com conteúdo profissional e consistente que demonstra seu conhecimento e expertise.'
    },
    {
      id: 4,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Atraia oportunidades',
      description: 'Destaque-se para recrutadores e parceiros de negócios, atraindo propostas de trabalho e colaborações valiosas.'
    },
    {
      id: 5,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Economize tempo',
      description: 'Automatize tarefas repetitivas e foque no que realmente importa: criar conexões significativas e conteúdo de valor.'
    },
    {
      id: 6,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Resultados mensuráveis',
      description: 'Acompanhe seu crescimento com métricas detalhadas e ajuste sua estratégia para maximizar resultados.'
    }
  ];

  return (
    <SectionContainer>
      <SectionContent>
        <SectionHeader>
          <SectionTitle>Como o Linkgrow pode transformar sua presença no LinkedIn?</SectionTitle>
          <SectionSubtitle>
            Descubra como nossa plataforma pode elevar seu perfil profissional e criar oportunidades reais de crescimento.
          </SectionSubtitle>
        </SectionHeader>
        
        <TransformGrid>
          {transformItems.map(item => (
            <TransformCard key={item.id}>
              <TransformIcon>
                {item.icon}
              </TransformIcon>
              <TransformTitle>{item.title}</TransformTitle>
              <TransformDescription>{item.description}</TransformDescription>
            </TransformCard>
          ))}
        </TransformGrid>
      </SectionContent>
    </SectionContainer>
  );
};

export default TransformSection;
