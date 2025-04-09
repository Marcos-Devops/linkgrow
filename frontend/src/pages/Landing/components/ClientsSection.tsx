import React from 'react';
import styled from 'styled-components';

const SectionContainer = styled.section`
  padding: 5rem 5%;
  background-color: #f8f9fa;
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
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: #6c757d;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ClientsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 2rem;
  align-items: center;
  justify-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ClientItem = styled.div`
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ClientLogo = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  
  img {
    max-width: 100%;
    max-height: 100%;
    filter: grayscale(100%);
    opacity: 0.7;
    transition: all 0.3s ease;
  }
  
  &:hover img {
    filter: grayscale(0%);
    opacity: 1;
  }
`;

const ClientName = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  color: #6c757d;
  margin: 0;
`;

const ClientsSection: React.FC = () => {
  const clients = [
    {
      id: 1,
      name: "TechCorp",
      logo: "https://via.placeholder.com/150x50?text=TechCorp"
    },
    {
      id: 2,
      name: "InnovateLabs",
      logo: "https://via.placeholder.com/150x50?text=InnovateLabs"
    },
    {
      id: 3,
      name: "GlobalSoft",
      logo: "https://via.placeholder.com/150x50?text=GlobalSoft"
    },
    {
      id: 4,
      name: "NextGen Media",
      logo: "https://via.placeholder.com/150x50?text=NextGenMedia"
    },
    {
      id: 5,
      name: "FutureTech",
      logo: "https://via.placeholder.com/150x50?text=FutureTech"
    },
    {
      id: 6,
      name: "DigitalWave",
      logo: "https://via.placeholder.com/150x50?text=DigitalWave"
    }
  ];
  
  // Alternativa: Mostrar rostos de usuários em vez de logos de empresas
  const userProfiles = [
    {
      id: 1,
      name: "Marcos Silva",
      role: "Empreendedor Digital",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: 2,
      name: "Carla Mendes",
      role: "Diretora de Marketing",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      id: 3,
      name: "Ricardo Alves",
      role: "Consultor de Negócios",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
      id: 4,
      name: "Patrícia Costa",
      role: "CEO & Fundadora",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    {
      id: 5,
      name: "Fernando Gomes",
      role: "Especialista em LinkedIn",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg"
    },
    {
      id: 6,
      name: "Luciana Martins",
      role: "Influenciadora Digital",
      avatar: "https://randomuser.me/api/portraits/women/6.jpg"
    }
  ];

  return (
    <SectionContainer>
      <SectionContent>
        <SectionHeader>
          <SectionTitle>Quem usa o Linkgrow</SectionTitle>
          <SectionSubtitle>
            Profissionais e empresas de diversos segmentos confiam no Linkgrow para potencializar sua presença no LinkedIn.
          </SectionSubtitle>
        </SectionHeader>
        
        <ClientsGrid>
          {userProfiles.map(profile => (
            <ClientItem key={profile.id}>
              <ClientLogo>
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  style={{ 
                    borderRadius: '50%', 
                    width: '70px', 
                    height: '70px',
                    filter: 'none',
                    opacity: 1
                  }} 
                />
              </ClientLogo>
              <ClientName style={{ fontWeight: '600', color: '#333' }}>{profile.name}</ClientName>
              <p style={{ fontSize: '0.8rem', color: '#6c757d', margin: '0' }}>{profile.role}</p>
            </ClientItem>
          ))}
        </ClientsGrid>
      </SectionContent>
    </SectionContainer>
  );
};

export default ClientsSection;
