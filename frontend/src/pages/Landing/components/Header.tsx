import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 5%;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem 5%;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
`;

const LogoImg = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 1.8rem;
  color: #0077B5;
  
  svg {
    height: 32px;
    margin-right: 8px;
  }
  
  span {
    background: linear-gradient(135deg, #0077B5, #00A0DC);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Nav = styled.nav<{ isOpen: boolean }>`
  display: flex;
  align-items: center;

  @media (max-width: 1024px) {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 250px;
    flex-direction: column;
    background-color: #ffffff;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    padding: 6rem 2rem 2rem;
    transform: ${({ isOpen }) => isOpen ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.3s ease-in-out;
    z-index: 900;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 1024px) {
    flex-direction: column;
    width: 100%;
  }
`;

const NavItem = styled.li`
  margin: 0 1.2rem;

  @media (max-width: 1024px) {
    margin: 0.8rem 0;
    width: 100%;
    text-align: center;
  }
`;

const NavLink = styled.a`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.2s ease;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background-color: #0077B5;
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: #0077B5;
    
    &:after {
      width: 100%;
    }
  }

  @media (max-width: 1024px) {
    display: block;
    padding: 0.5rem 0;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 1024px) {
    flex-direction: column;
    width: 100%;
    margin-top: 1.5rem;
  }
`;

const LoginButton = styled(Link)`
  margin-right: 1rem;
  color: #0077B5;
  font-weight: 600;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 119, 181, 0.1);
  }

  @media (max-width: 1024px) {
    margin: 0.5rem 0;
    width: 100%;
    text-align: center;
  }
`;

const SignUpButton = styled(Link)`
  background: linear-gradient(135deg, #0077B5, #00A0DC);
  color: white;
  font-weight: 600;
  text-decoration: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 119, 181, 0.3);
  }

  @media (max-width: 1024px) {
    margin: 0.5rem 0;
    width: 100%;
    text-align: center;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1000;
  
  @media (max-width: 1024px) {
    display: block;
  }
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
  z-index: 800;
`;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <HeaderContainer style={{ 
      boxShadow: scrolled ? '0 4px 12px rgba(0, 0, 0, 0.08)' : '0 2px 10px rgba(0, 0, 0, 0.05)',
      padding: scrolled ? '1rem 5%' : '1.5rem 5%'
    }}>
      <Logo>
        <LogoImg>
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
        </LogoImg>
      </Logo>

      <MobileMenuButton onClick={toggleMenu} aria-label="Menu">
        {isMenuOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 6H21" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 18H21" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </MobileMenuButton>

      <Overlay isOpen={isMenuOpen} onClick={closeMenu} />

      <Nav isOpen={isMenuOpen}>
        <NavLinks>
          <NavItem>
            <NavLink href="#inicio" onClick={closeMenu}>Início</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#funcionalidades" onClick={closeMenu}>Funcionalidades</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#como-funciona" onClick={closeMenu}>Como Funciona</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#depoimentos" onClick={closeMenu}>Depoimentos</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#planos" onClick={closeMenu}>Planos</NavLink>
          </NavItem>
        </NavLinks>

        <AuthButtons>
          <LoginButton to="/auth/login" onClick={closeMenu}>Entrar</LoginButton>
          <SignUpButton to="/auth/register" onClick={closeMenu}>Começar Agora</SignUpButton>
        </AuthButtons>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
