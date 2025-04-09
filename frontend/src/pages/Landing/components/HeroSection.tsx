import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeroContainer = styled.section`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 10rem 5% 6rem;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 992px) {
    flex-direction: column;
    padding: 8rem 5% 4rem;
  }
`;

const HeroContent = styled.div`
  width: 50%;
  z-index: 2;
  
  @media (max-width: 992px) {
    width: 100%;
    text-align: center;
    margin-bottom: 2rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  background: linear-gradient(135deg, #0077B5, #00A0DC);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  line-height: 1.6;
  color: #495057;
  margin-bottom: 2.5rem;
  max-width: 90%;
  
  @media (max-width: 992px) {
    max-width: 100%;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 992px) {
    justify-content: center;
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
`;

const PrimaryButton = styled(Link)`
  background: linear-gradient(135deg, #0077B5, #00A0DC);
  color: white;
  font-weight: 600;
  text-decoration: none;
  padding: 0.875rem 2rem;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: inline-block;
  text-align: center;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 14px rgba(0, 119, 181, 0.3);
  }
`;

const SecondaryButton = styled.a`
  background: transparent;
  color: #0077B5;
  font-weight: 600;
  text-decoration: none;
  padding: 0.875rem 2rem;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: 1px solid #0077B5;
  display: inline-block;
  text-align: center;
  
  &:hover {
    background-color: rgba(0, 119, 181, 0.1);
  }
`;

const HeroImageContainer = styled.div`
  width: 50%;
  position: relative;
  z-index: 1;
  
  @media (max-width: 992px) {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ShapesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
`;

const Shape = styled.div`
  position: absolute;
  background: linear-gradient(135deg, rgba(0, 119, 181, 0.1), rgba(0, 160, 220, 0.1));
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

const Shape3 = styled(Shape)`
  width: 150px;
  height: 150px;
  top: 30%;
  left: 15%;
`;

const HeroSection: React.FC = () => {
  return (
    <HeroContainer id="inicio">
      <ShapesContainer>
        <Shape1 />
        <Shape2 />
        <Shape3 />
      </ShapesContainer>
      
      <HeroContent>
        <HeroTitle>Construa sua marca pessoal no LinkedIn</HeroTitle>
        <HeroSubtitle>
          Automatize seus posts, conquiste mais conexões e aumente sua influência com o Linkgrow, a plataforma definitiva para crescimento no LinkedIn.
        </HeroSubtitle>
        <ButtonGroup>
          <PrimaryButton to="/register">Comece Agora</PrimaryButton>
          <SecondaryButton href="#como-funciona">Saiba Mais</SecondaryButton>
        </ButtonGroup>
      </HeroContent>
      
      <HeroImageContainer>
        <HeroImage 
          src="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
          alt="Linkgrow - Plataforma de crescimento para LinkedIn"
        />
      </HeroImageContainer>
    </HeroContainer>
  );
};

export default HeroSection;
