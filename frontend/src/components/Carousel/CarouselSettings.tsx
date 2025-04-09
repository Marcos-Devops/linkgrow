import React from 'react';
import styled from 'styled-components';
import { CarouselSettings as SettingsType } from '../../types/carousel';

const SettingsContainer = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SettingsTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const SettingsGroup = styled.div`
  margin-bottom: 24px;
`;

const GroupTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #0077B5;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #0077B5;
  }
`;

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SwitchLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  margin-right: 10px;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: #0077B5;
  }
  
  &:checked + span:before {
    transform: translateX(24px);
  }
`;

const SwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const SwitchText = styled.span`
  font-weight: 500;
  color: #333;
`;

interface CarouselSettingsProps {
  settings: SettingsType;
  onSettingsChange: (settings: SettingsType) => void;
  platform: string;
  onPlatformChange: (platform: string) => void;
}

const CarouselSettings: React.FC<CarouselSettingsProps> = ({
  settings,
  onSettingsChange,
  platform,
  onPlatformChange
}) => {
  const handleToggleChange = (key: keyof SettingsType) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key]
    });
  };
  
  const handleIntervalChange = (value: string) => {
    onSettingsChange({
      ...settings,
      interval: parseInt(value, 10)
    });
  };
  
  return (
    <SettingsContainer>
      <SettingsTitle>Configurações do Carrossel</SettingsTitle>
      
      <SettingsGroup>
        <GroupTitle>Plataforma</GroupTitle>
        <FormGroup>
          <Label htmlFor="platform">Plataforma de Destino</Label>
          <Select 
            id="platform" 
            value={platform} 
            onChange={(e) => onPlatformChange(e.target.value)}
          >
            <option value="linkedin">LinkedIn</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter</option>
            <option value="all">Todas as plataformas</option>
          </Select>
        </FormGroup>
      </SettingsGroup>
      
      <SettingsGroup>
        <GroupTitle>Comportamento</GroupTitle>
        <FormGroup>
          <SwitchContainer>
            <SwitchLabel>
              <SwitchInput 
                type="checkbox" 
                checked={settings.autoPlay} 
                onChange={() => handleToggleChange('autoPlay')} 
              />
              <SwitchSlider />
            </SwitchLabel>
            <SwitchText>Reprodução Automática</SwitchText>
          </SwitchContainer>
        </FormGroup>
        
        {settings.autoPlay && (
          <FormGroup>
            <Label htmlFor="interval">Intervalo (ms)</Label>
            <Input 
              id="interval" 
              type="number" 
              min="1000" 
              step="500" 
              value={settings.interval} 
              onChange={(e) => handleIntervalChange(e.target.value)} 
            />
          </FormGroup>
        )}
        
        <FormGroup>
          <SwitchContainer>
            <SwitchLabel>
              <SwitchInput 
                type="checkbox" 
                checked={settings.loop} 
                onChange={() => handleToggleChange('loop')} 
              />
              <SwitchSlider />
            </SwitchLabel>
            <SwitchText>Loop Infinito</SwitchText>
          </SwitchContainer>
        </FormGroup>
      </SettingsGroup>
      
      <SettingsGroup>
        <GroupTitle>Aparência</GroupTitle>
        <FormGroup>
          <SwitchContainer>
            <SwitchLabel>
              <SwitchInput 
                type="checkbox" 
                checked={settings.showIndicators} 
                onChange={() => handleToggleChange('showIndicators')} 
              />
              <SwitchSlider />
            </SwitchLabel>
            <SwitchText>Mostrar Indicadores</SwitchText>
          </SwitchContainer>
        </FormGroup>
        
        <FormGroup>
          <SwitchContainer>
            <SwitchLabel>
              <SwitchInput 
                type="checkbox" 
                checked={settings.showArrows} 
                onChange={() => handleToggleChange('showArrows')} 
              />
              <SwitchSlider />
            </SwitchLabel>
            <SwitchText>Mostrar Setas de Navegação</SwitchText>
          </SwitchContainer>
        </FormGroup>
        
        <FormGroup>
          <SwitchContainer>
            <SwitchLabel>
              <SwitchInput 
                type="checkbox" 
                checked={settings.responsive} 
                onChange={() => handleToggleChange('responsive')} 
              />
              <SwitchSlider />
            </SwitchLabel>
            <SwitchText>Design Responsivo</SwitchText>
          </SwitchContainer>
        </FormGroup>
      </SettingsGroup>
    </SettingsContainer>
  );
};

export default CarouselSettings;
