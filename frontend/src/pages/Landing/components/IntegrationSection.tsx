import React from 'react';
import styled from 'styled-components';

const SectionContainer = styled.section`
  padding: 6rem 5%;
  background-color: #ffffff;
  overflow: hidden;
`;

const SectionContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  
  @media (max-width: 992px) {
    flex-direction: column;
    text-align: center;
  }
`;

const TextContent = styled.div`
  flex: 1;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionDescription = styled.p`
  font-size: 1.1rem;
  color: #6c757d;
  line-height: 1.7;
  margin-bottom: 2rem;
`;

const IntegrationFeatures = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  
  @media (max-width: 992px) {
    text-align: left;
  }
`;

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #0077B5, #00A0DC);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  
  svg {
    width: 20px;
    height: 20px;
    color: white;
  }
`;

const FeatureText = styled.div``;

const FeatureTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: #333;
`;

const FeatureDescription = styled.p`
  font-size: 0.95rem;
  color: #6c757d;
  margin: 0;
  line-height: 1.5;
`;

const ImageContent = styled.div`
  flex: 1;
  position: relative;
  
  @media (max-width: 992px) {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }
`;

const IntegrationImage = styled.div`
  position: relative;
  z-index: 2;
  
  img {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
`;

const BackgroundShape = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(0, 119, 181, 0.1), rgba(0, 160, 220, 0.1));
  z-index: 1;
  
  &.shape1 {
    top: -80px;
    right: -80px;
  }
  
  &.shape2 {
    bottom: -60px;
    left: -60px;
    width: 200px;
    height: 200px;
  }
`;

const IntegrationSection: React.FC = () => {
  return (
    <SectionContainer>
      <SectionContent>
        <TextContent>
          <SectionTitle>Integração perfeita com o LinkedIn</SectionTitle>
          <SectionDescription>
            O Linkgrow se conecta diretamente com sua conta do LinkedIn, permitindo gerenciar todo o seu conteúdo 
            e interações sem sair da plataforma. Nossa API segura garante que todas as ações sejam realizadas 
            respeitando os limites e políticas do LinkedIn.
          </SectionDescription>
          
          <IntegrationFeatures>
            <FeatureItem>
              <FeatureIcon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </FeatureIcon>
              <FeatureText>
                <FeatureTitle>Agendamento Inteligente</FeatureTitle>
                <FeatureDescription>
                  Agende posts nos melhores horários para maximizar o engajamento com base em análises da sua rede.
                </FeatureDescription>
              </FeatureText>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureIcon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </FeatureIcon>
              <FeatureText>
                <FeatureTitle>Métricas Detalhadas</FeatureTitle>
                <FeatureDescription>
                  Acompanhe o desempenho de cada post com métricas avançadas e insights acionáveis.
                </FeatureDescription>
              </FeatureText>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureIcon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </FeatureIcon>
              <FeatureText>
                <FeatureTitle>Automação de Interações</FeatureTitle>
                <FeatureDescription>
                  Responda automaticamente a comentários e mensagens com respostas personalizadas.
                </FeatureDescription>
              </FeatureText>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureIcon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </FeatureIcon>
              <FeatureText>
                <FeatureTitle>Conexão Segura</FeatureTitle>
                <FeatureDescription>
                  Integração via OAuth 2.0 sem armazenar suas credenciais, garantindo total segurança.
                </FeatureDescription>
              </FeatureText>
            </FeatureItem>
          </IntegrationFeatures>
        </TextContent>
        
        <ImageContent>
          <BackgroundShape className="shape1" />
          <BackgroundShape className="shape2" />
          <IntegrationImage>
            <img 
              src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Integração com LinkedIn" 
            />
          </IntegrationImage>
        </ImageContent>
      </SectionContent>
    </SectionContainer>
  );
};

export default IntegrationSection;
