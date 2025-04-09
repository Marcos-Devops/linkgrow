import React, { useState } from 'react';
import styled from 'styled-components';

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

const TestimonialsWrapper = styled.div`
  position: relative;
`;

const TestimonialSlider = styled.div`
  display: flex;
  overflow-x: hidden;
  scroll-behavior: smooth;
  margin: 0 -1rem;
  padding: 1rem;
`;

const TestimonialCard = styled.div<{ active: boolean }>`
  flex: 0 0 calc(33.333% - 2rem);
  margin: 0 1rem;
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  opacity: ${props => props.active ? 1 : 0.6};
  transform: ${props => props.active ? 'scale(1.05)' : 'scale(1)'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 1024px) {
    flex: 0 0 calc(50% - 2rem);
  }
  
  @media (max-width: 768px) {
    flex: 0 0 calc(100% - 2rem);
  }
`;

const QuoteIcon = styled.div`
  margin-bottom: 1.5rem;
  
  svg {
    width: 40px;
    height: 40px;
    color: #0077B5;
    opacity: 0.3;
  }
`;

const TestimonialText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: #495057;
  margin-bottom: 1.5rem;
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
`;

const AuthorImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #333;
`;

const AuthorRole = styled.p`
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0;
`;

const SliderControls = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  gap: 1rem;
`;

const SliderDot = styled.button<{ active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#0077B5' : '#dee2e6'};
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#0077B5' : '#adb5bd'};
  }
`;

const SliderArrows = styled.div`
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 50%;
  left: -20px;
  right: -20px;
  transform: translateY(-50%);
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SliderArrow = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  svg {
    width: 20px;
    height: 20px;
    color: #0077B5;
  }
  
  &:hover {
    background-color: #0077B5;
    
    svg {
      color: white;
    }
  }
`;

const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      text: "O Linkgrow transformou completamente minha presença no LinkedIn. Em apenas 3 meses, aumentei minha rede em 400% e comecei a receber propostas de emprego semanalmente. A ferramenta de agendamento e o editor de conteúdo com IA são simplesmente fantásticos!",
      name: "Ana Silva",
      role: "Especialista em Marketing Digital",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 2,
      text: "Como empreendedor, sempre tive dificuldade em manter uma presença consistente no LinkedIn. O Linkgrow não só automatizou minhas publicações, mas também melhorou significativamente a qualidade do meu conteúdo. Os resultados foram imediatos!",
      name: "Carlos Mendes",
      role: "CEO & Fundador",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      text: "Nunca imaginei que seria possível criar carrosséis tão profissionais em tão pouco tempo. O Linkgrow simplificou meu fluxo de trabalho e me ajudou a estabelecer minha marca pessoal no LinkedIn. Recomendo a todos os profissionais!",
      name: "Juliana Costa",
      role: "Consultora de RH",
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      id: 4,
      text: "Como profissional de vendas B2B, o LinkedIn é essencial para mim. O Linkgrow me permitiu escalar minha presença na plataforma, gerando leads qualificados de forma consistente. Meus resultados triplicaram em apenas dois meses!",
      name: "Roberto Almeida",
      role: "Diretor Comercial",
      image: "https://randomuser.me/api/portraits/men/67.jpg"
    },
    {
      id: 5,
      text: "A análise de desempenho do Linkgrow me deu insights valiosos sobre o que realmente funciona com meu público. Consegui ajustar minha estratégia e aumentar meu engajamento em mais de 200%. Uma ferramenta indispensável!",
      name: "Fernanda Lima",
      role: "Influenciadora Digital",
      image: "https://randomuser.me/api/portraits/women/65.jpg"
    }
  ];
  
  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? testimonials.length - 3 : prev - 1));
  };
  
  const handleNext = () => {
    setActiveIndex(prev => (prev === testimonials.length - 3 ? 0 : prev + 1));
  };
  
  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };
  
  const visibleTestimonials = testimonials.slice(activeIndex, activeIndex + 3);
  
  return (
    <SectionContainer id="depoimentos">
      <SectionContent>
        <SectionHeader>
          <SectionTitle>O que nossos usuários dizem</SectionTitle>
          <SectionSubtitle>
            Descubra como o Linkgrow está ajudando profissionais e empresas a transformar sua presença no LinkedIn.
          </SectionSubtitle>
        </SectionHeader>
        
        <TestimonialsWrapper>
          <SliderArrows>
            <SliderArrow onClick={handlePrev} aria-label="Anterior">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </SliderArrow>
            <SliderArrow onClick={handleNext} aria-label="Próximo">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </SliderArrow>
          </SliderArrows>
          
          <TestimonialSlider>
            {visibleTestimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={testimonial.id}
                active={index === 1}
              >
                <QuoteIcon>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </QuoteIcon>
                <TestimonialText>
                  {testimonial.text}
                </TestimonialText>
                <TestimonialAuthor>
                  <AuthorImage>
                    <img src={testimonial.image} alt={testimonial.name} />
                  </AuthorImage>
                  <AuthorInfo>
                    <AuthorName>{testimonial.name}</AuthorName>
                    <AuthorRole>{testimonial.role}</AuthorRole>
                  </AuthorInfo>
                </TestimonialAuthor>
              </TestimonialCard>
            ))}
          </TestimonialSlider>
          
          <SliderControls>
            {testimonials.slice(0, testimonials.length - 2).map((_, index) => (
              <SliderDot 
                key={index}
                active={activeIndex === index}
                onClick={() => handleDotClick(index)}
                aria-label={`Ir para depoimento ${index + 1}`}
              />
            ))}
          </SliderControls>
        </TestimonialsWrapper>
      </SectionContent>
    </SectionContainer>
  );
};

export default TestimonialsSection;
