import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background-color: #212529;
  color: #adb5bd;
  padding: 5rem 5% 2rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr);
  gap: 3rem;
  margin-bottom: 3rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled.div``;

const LogoContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 1.5rem;
  color: white;
  
  svg {
    height: 28px;
    margin-right: 8px;
  }
  
  span {
    background: linear-gradient(135deg, #0077B5, #00A0DC);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const FooterDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialLink = styled.a`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #343a40;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  svg {
    width: 18px;
    height: 18px;
    color: #adb5bd;
  }
  
  &:hover {
    background-color: #0077B5;
    
    svg {
      color: white;
    }
  }
`;

const ColumnTitle = styled.h4`
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const ColumnLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ColumnLink = styled.li`
  margin-bottom: 0.75rem;
  
  a {
    color: #adb5bd;
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.2s ease;
    
    &:hover {
      color: #0077B5;
    }
  }
`;

const ContactItem = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const ContactIcon = styled.div`
  margin-right: 0.75rem;
  
  svg {
    width: 18px;
    height: 18px;
    color: #0077B5;
  }
`;

const ContactText = styled.p`
  font-size: 0.95rem;
  margin: 0;
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid #343a40;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const Copyright = styled.p`
  font-size: 0.9rem;
  margin: 0;
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  a {
    color: #adb5bd;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s ease;
    
    &:hover {
      color: #0077B5;
    }
  }
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterColumn>
            <LogoContainer>
              <Logo>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="url(#paint1_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="url(#paint2_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="2" y1="7" x2="22" y2="7" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#0077B5"/>
                      <stop offset="1" stopColor="#00A0DC"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="2" y1="19.5" x2="22" y2="19.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#0077B5"/>
                      <stop offset="1" stopColor="#00A0DC"/>
                    </linearGradient>
                    <linearGradient id="paint2_linear" x1="2" y1="14.5" x2="22" y2="14.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#0077B5"/>
                      <stop offset="1" stopColor="#00A0DC"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span>Linkgrow</span>
              </Logo>
            </LogoContainer>
            
            <FooterDescription>
              Automatize seu crescimento no LinkedIn com a plataforma mais completa para criação de conteúdo, 
              agendamento de posts e análise de métricas.
            </FooterDescription>
            
            <SocialLinks>
              <SocialLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </SocialLink>
              <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </SocialLink>
              <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </SocialLink>
              <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </SocialLink>
            </SocialLinks>
          </FooterColumn>
          
          <FooterColumn>
            <ColumnTitle>Empresa</ColumnTitle>
            <ColumnLinks>
              <ColumnLink>
                <Link to="/sobre">Sobre nós</Link>
              </ColumnLink>
              <ColumnLink>
                <Link to="/blog">Blog</Link>
              </ColumnLink>
              <ColumnLink>
                <Link to="/carreiras">Carreiras</Link>
              </ColumnLink>
              <ColumnLink>
                <Link to="/imprensa">Imprensa</Link>
              </ColumnLink>
              <ColumnLink>
                <Link to="/parceiros">Programa de parceiros</Link>
              </ColumnLink>
            </ColumnLinks>
          </FooterColumn>
          
          <FooterColumn>
            <ColumnTitle>Recursos</ColumnTitle>
            <ColumnLinks>
              <ColumnLink>
                <Link to="/recursos/guias">Guias e tutoriais</Link>
              </ColumnLink>
              <ColumnLink>
                <Link to="/recursos/webinars">Webinars</Link>
              </ColumnLink>
              <ColumnLink>
                <Link to="/recursos/casos">Casos de sucesso</Link>
              </ColumnLink>
              <ColumnLink>
                <Link to="/recursos/documentacao">Documentação</Link>
              </ColumnLink>
              <ColumnLink>
                <Link to="/recursos/api">API</Link>
              </ColumnLink>
            </ColumnLinks>
          </FooterColumn>
          
          <FooterColumn>
            <ColumnTitle>Contato</ColumnTitle>
            <ContactItem>
              <ContactIcon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </ContactIcon>
              <ContactText>contato@linkgrow.com.br</ContactText>
            </ContactItem>
            <ContactItem>
              <ContactIcon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </ContactIcon>
              <ContactText>+55 (11) 3456-7890</ContactText>
            </ContactItem>
            <ContactItem>
              <ContactIcon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </ContactIcon>
              <ContactText>
                Av. Paulista, 1000, São Paulo - SP<br />
                CEP: 01310-100
              </ContactText>
            </ContactItem>
          </FooterColumn>
        </FooterGrid>
        
        <FooterBottom>
          <Copyright>
            &copy; {currentYear} Linkgrow. Todos os direitos reservados.
          </Copyright>
          
          <BottomLinks>
            <Link to="/termos">Termos de Uso</Link>
            <Link to="/privacidade">Política de Privacidade</Link>
            <Link to="/cookies">Cookies</Link>
          </BottomLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
