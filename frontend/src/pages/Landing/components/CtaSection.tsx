import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const SectionContainer = styled.section`
  padding: 6rem 5%;
  background: linear-gradient(135deg, #0077B5 0%, #00A0DC 100%);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const SectionContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const SectionTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const SectionDescription = styled.p`
  font-size: 1.3rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
    max-width: 300px;
    margin: 0 auto;
  }
`;

const PrimaryButton = styled(Link)`
  background-color: white;
  color: #0077B5;
  font-weight: 600;
  text-decoration: none;
  padding: 1rem 2.5rem;
  border-radius: 4px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  display: inline-block;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 14px rgba(0, 0, 0, 0.2);
  }
`;

const SecondaryButton = styled.a`
  background: transparent;
  color: white;
  font-weight: 600;
  text-decoration: none;
  padding: 1rem 2.5rem;
  border-radius: 4px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  border: 1px solid white;
  display: inline-block;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Shape = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
`;

const Shape1 = styled(Shape)`
  width: 300px;
  height: 300px;
  top: -150px;
  right: 10%;
`;

const Shape2 = styled(Shape)`
  width: 200px;
  height: 200px;
  bottom: -100px;
  left: 5%;
`;

const CtaSection: React.FC = () => {
  return (
    <SectionContainer>
      <Shape1 />
      <Shape2 />
      
      <SectionContent>
        <SectionTitle>Pronto para transformar sua presença no LinkedIn?</SectionTitle>
        <SectionDescription>
          Junte-se a milhares de profissionais que já estão usando o Linkgrow para automatizar seu crescimento, 
          criar conteúdo de impacto e conquistar mais oportunidades no LinkedIn.
        </SectionDescription>
        
        <ButtonGroup>
          <PrimaryButton to="/auth/register">Começar Agora</PrimaryButton>
          <SecondaryButton href="#como-funciona">Saiba Mais</SecondaryButton>
        </ButtonGroup>
      </SectionContent>
    </SectionContainer>
  );
};

export default CtaSection;
