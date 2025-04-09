import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Slide, CarouselSettings } from '../../types/carousel';

const PreviewContainer = styled.div`
  width: 100%;
  background-color: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const DeviceFrame = styled.div<{ platform: string }>`
  width: 100%;
  max-width: ${props => {
    switch (props.platform) {
      case 'instagram': return '375px';
      case 'twitter': return '500px';
      case 'facebook': return '500px';
      case 'linkedin': 
      default: return '550px';
    }
  }};
  margin: 0 auto;
  border: ${props => {
    switch (props.platform) {
      case 'instagram': return '10px solid #000';
      case 'twitter': return '10px solid #1DA1F2';
      case 'facebook': return '10px solid #4267B2';
      case 'linkedin': 
      default: return '10px solid #0077B5';
    }
  }};
  border-radius: 20px;
  overflow: hidden;
  position: relative;
`;

const SlidesContainer = styled.div<{ currentSlide: number }>`
  display: flex;
  transition: transform 0.5s ease;
  transform: translateX(-${props => props.currentSlide * 100}%);
  height: 100%;
`;

const SlideWrapper = styled.div`
  flex: 0 0 100%;
  width: 100%;
  position: relative;
`;

const SlideContent = styled.div<{ backgroundColor: string; textColor: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background-color: ${props => props.backgroundColor};
  color: ${props => props.textColor};
  height: 100%;
  min-height: 300px;
  text-align: center;
`;

const SlideTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const SlideSubtitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 16px;
  opacity: 0.8;
`;

const SlideBody = styled.p`
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 24px;
`;

const SlideImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  margin-bottom: 16px;
  border-radius: 4px;
`;

const SlideButton = styled.button<{ textColor: string; backgroundColor: string }>`
  padding: 10px 20px;
  background-color: ${props => props.textColor};
  color: ${props => props.backgroundColor};
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
`;

const NavigationButtons = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  pointer-events: none;
`;

const NavButton = styled.button`
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  pointer-events: auto;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const Indicators = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
`;

const Indicator = styled.button<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#0077B5' : '#ddd'};
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#0077B5' : '#bbb'};
  }
`;

const PlatformLabel = styled.div`
  position: absolute;
  top: -30px;
  left: 0;
  font-weight: 600;
  color: #333;
`;

interface CarouselPreviewProps {
  slides: Slide[];
  settings: CarouselSettings;
  platform?: string;
}

const CarouselPreview: React.FC<CarouselPreviewProps> = ({ 
  slides, 
  settings,
  platform = 'linkedin'
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(settings.autoPlay);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && settings.autoPlay) {
      interval = setInterval(() => {
        if (settings.loop || currentSlide < slides.length - 1) {
          setCurrentSlide(prev => 
            prev === slides.length - 1 ? 0 : prev + 1
          );
        } else {
          setIsPlaying(false);
        }
      }, settings.interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentSlide, slides.length, settings.autoPlay, settings.interval, settings.loop]);
  
  const goToNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else if (settings.loop) {
      setCurrentSlide(0);
    }
  };
  
  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (settings.loop) {
      setCurrentSlide(slides.length - 1);
    }
  };
  
  const renderSlide = (slide: Slide) => {
    const { template, content } = slide;
    
    switch (template) {
      case 'text-only':
        return (
          <SlideContent 
            backgroundColor={content.backgroundColor || '#ffffff'} 
            textColor={content.textColor || '#333333'}
          >
            {content.title && <SlideTitle>{content.title}</SlideTitle>}
            {content.subtitle && <SlideSubtitle>{content.subtitle}</SlideSubtitle>}
            {content.body && <SlideBody>{content.body}</SlideBody>}
            {content.buttonText && (
              <SlideButton 
                textColor={content.textColor || '#333333'} 
                backgroundColor={content.backgroundColor || '#ffffff'}
              >
                {content.buttonText}
              </SlideButton>
            )}
          </SlideContent>
        );
        
      case 'image-text':
        return (
          <SlideContent 
            backgroundColor={content.backgroundColor || '#ffffff'} 
            textColor={content.textColor || '#333333'}
          >
            {content.imageUrl && <SlideImage src={content.imageUrl} alt={content.title || 'Slide'} />}
            {content.title && <SlideTitle>{content.title}</SlideTitle>}
            {content.subtitle && <SlideSubtitle>{content.subtitle}</SlideSubtitle>}
            {content.body && <SlideBody>{content.body}</SlideBody>}
            {content.buttonText && (
              <SlideButton 
                textColor={content.textColor || '#333333'} 
                backgroundColor={content.backgroundColor || '#ffffff'}
              >
                {content.buttonText}
              </SlideButton>
            )}
          </SlideContent>
        );
        
      case 'full-image':
        return (
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            height: '100%', 
            minHeight: '300px',
            backgroundImage: `url(${content.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            <div style={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              padding: '20px',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              color: '#fff'
            }}>
              {content.title && <h2 style={{ margin: '0 0 8px' }}>{content.title}</h2>}
              {content.subtitle && <h3 style={{ margin: '0 0 8px', opacity: 0.9 }}>{content.subtitle}</h3>}
              {content.buttonText && (
                <button style={{ 
                  padding: '8px 16px', 
                  backgroundColor: '#fff', 
                  color: '#333',
                  border: 'none',
                  borderRadius: '4px',
                  marginTop: '10px',
                  cursor: 'pointer'
                }}>
                  {content.buttonText}
                </button>
              )}
            </div>
          </div>
        );
        
      case 'quote':
        return (
          <SlideContent 
            backgroundColor={content.backgroundColor || '#f5f5f5'} 
            textColor={content.textColor || '#333333'}
          >
            <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.2 }}>"</div>
            {content.body && (
              <SlideBody style={{ 
                fontSize: '20px', 
                fontStyle: 'italic',
                maxWidth: '80%',
                margin: '0 auto 24px'
              }}>
                {content.body}
              </SlideBody>
            )}
            {content.title && (
              <SlideTitle style={{ fontSize: '18px', marginBottom: '4px' }}>
                — {content.title}
              </SlideTitle>
            )}
            {content.subtitle && (
              <SlideSubtitle style={{ fontSize: '14px', opacity: 0.7 }}>
                {content.subtitle}
              </SlideSubtitle>
            )}
          </SlideContent>
        );
        
      case 'stats':
        return (
          <SlideContent 
            backgroundColor={content.backgroundColor || '#0077B5'} 
            textColor={content.textColor || '#ffffff'}
          >
            {content.title && (
              <SlideTitle style={{ fontSize: '48px', marginBottom: '8px' }}>
                {content.title}
              </SlideTitle>
            )}
            {content.subtitle && (
              <SlideSubtitle style={{ fontSize: '20px', marginBottom: '24px' }}>
                {content.subtitle}
              </SlideSubtitle>
            )}
            {content.body && <SlideBody>{content.body}</SlideBody>}
          </SlideContent>
        );
        
      case 'custom':
      default:
        return (
          <SlideContent 
            backgroundColor={content.backgroundColor || '#ffffff'} 
            textColor={content.textColor || '#333333'}
          >
            {content.title && <SlideTitle>{content.title}</SlideTitle>}
            {content.subtitle && <SlideSubtitle>{content.subtitle}</SlideSubtitle>}
            {content.body && <SlideBody>{content.body}</SlideBody>}
            {/* Aqui poderia ser aplicado o CSS personalizado */}
          </SlideContent>
        );
    }
  };
  
  if (slides.length === 0) {
    return (
      <PreviewContainer>
        <DeviceFrame platform={platform}>
          <div style={{ 
            padding: '40px 20px', 
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <h2>Sem slides para exibir</h2>
            <p>Adicione slides ao seu carrossel para visualizá-los aqui.</p>
          </div>
        </DeviceFrame>
      </PreviewContainer>
    );
  }
  
  return (
    <PreviewContainer>
      <PlatformLabel>
        Visualização para {
          platform === 'linkedin' ? 'LinkedIn' :
          platform === 'instagram' ? 'Instagram' :
          platform === 'facebook' ? 'Facebook' :
          platform === 'twitter' ? 'Twitter' : 'Todas as plataformas'
        }
      </PlatformLabel>
      
      <DeviceFrame platform={platform}>
        <SlidesContainer currentSlide={currentSlide}>
          {slides.map((slide, index) => (
            <SlideWrapper key={slide.id}>
              {renderSlide(slide)}
            </SlideWrapper>
          ))}
        </SlidesContainer>
        
        {settings.showArrows && slides.length > 1 && (
          <NavigationButtons>
            <NavButton onClick={goToPrevSlide}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </NavButton>
            <NavButton onClick={goToNextSlide}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </NavButton>
          </NavigationButtons>
        )}
      </DeviceFrame>
      
      {settings.showIndicators && slides.length > 1 && (
        <Indicators>
          {slides.map((slide, index) => (
            <Indicator 
              key={slide.id} 
              active={index === currentSlide}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </Indicators>
      )}
    </PreviewContainer>
  );
};

export default CarouselPreview;
