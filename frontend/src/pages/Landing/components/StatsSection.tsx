import React from 'react';
import styled from 'styled-components';

const SectionContainer = styled.section`
  padding: 4rem 5%;
  background: linear-gradient(135deg, #0077B5 0%, #00A0DC 100%);
  color: white;
`;

const SectionContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const StatValue = styled.h3`
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
`;

const StatLabel = styled.p`
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  opacity: 0.9;
`;

const StatsSection: React.FC = () => {
  const stats = [
    {
      value: "10k+",
      label: "Usuários Ativos"
    },
    {
      value: "500k+",
      label: "Posts Publicados"
    },
    {
      value: "300%",
      label: "Aumento Médio de Engajamento"
    },
    {
      value: "98%",
      label: "Taxa de Satisfação"
    }
  ];
  
  return (
    <SectionContainer>
      <SectionContent>
        <StatsGrid>
          {stats.map((stat, index) => (
            <StatItem key={index}>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatItem>
          ))}
        </StatsGrid>
      </SectionContent>
    </SectionContainer>
  );
};

export default StatsSection;
