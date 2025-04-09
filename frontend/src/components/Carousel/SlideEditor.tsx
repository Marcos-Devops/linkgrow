import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SketchPicker } from 'react-color';
import { Slide } from '../../types/carousel';

const EditorContainer = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const EditorTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
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

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  
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

const ColorPickerContainer = styled.div`
  position: relative;
`;

const ColorPreview = styled.div<{ color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background-color: ${props => props.color};
  border: 1px solid #ddd;
  cursor: pointer;
`;

const ColorPickerPopover = styled.div`
  position: absolute;
  z-index: 10;
  top: 40px;
  left: 0;
`;

const ColorPickerCover = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

interface SlideEditorProps {
  slide: Slide;
  onUpdate: (slide: Slide) => void;
}

const SlideEditor: React.FC<SlideEditorProps> = ({ slide, onUpdate }) => {
  const [template, setTemplate] = useState(slide.template);
  const [title, setTitle] = useState(slide.content.title || '');
  const [subtitle, setSubtitle] = useState(slide.content.subtitle || '');
  const [body, setBody] = useState(slide.content.body || '');
  const [imageUrl, setImageUrl] = useState(slide.content.imageUrl || '');
  const [backgroundColor, setBackgroundColor] = useState(slide.content.backgroundColor || '#ffffff');
  const [textColor, setTextColor] = useState(slide.content.textColor || '#333333');
  const [buttonText, setButtonText] = useState(slide.content.buttonText || '');
  const [buttonUrl, setButtonUrl] = useState(slide.content.buttonUrl || '');
  const [customCss, setCustomCss] = useState(slide.content.customCss || '');
  
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  
  useEffect(() => {
    // Atualizar o estado quando o slide mudar
    setTemplate(slide.template);
    setTitle(slide.content.title || '');
    setSubtitle(slide.content.subtitle || '');
    setBody(slide.content.body || '');
    setImageUrl(slide.content.imageUrl || '');
    setBackgroundColor(slide.content.backgroundColor || '#ffffff');
    setTextColor(slide.content.textColor || '#333333');
    setButtonText(slide.content.buttonText || '');
    setButtonUrl(slide.content.buttonUrl || '');
    setCustomCss(slide.content.customCss || '');
  }, [slide]);
  
  useEffect(() => {
    // Atualizar o slide quando os valores mudarem
    const updatedSlide: Slide = {
      ...slide,
      template,
      content: {
        title,
        subtitle,
        body,
        imageUrl,
        backgroundColor,
        textColor,
        buttonText,
        buttonUrl,
        customCss
      }
    };
    
    onUpdate(updatedSlide);
  }, [
    template, 
    title, 
    subtitle, 
    body, 
    imageUrl, 
    backgroundColor, 
    textColor, 
    buttonText, 
    buttonUrl, 
    customCss
  ]);
  
  return (
    <EditorContainer>
      <EditorTitle>Editar Slide</EditorTitle>
      
      <FormGroup>
        <Label htmlFor="template">Modelo de Slide</Label>
        <Select 
          id="template" 
          value={template} 
          onChange={(e) => setTemplate(e.target.value)}
        >
          <option value="text-only">Apenas Texto</option>
          <option value="image-text">Imagem e Texto</option>
          <option value="full-image">Imagem Completa</option>
          <option value="quote">Citação</option>
          <option value="stats">Estatísticas</option>
          <option value="custom">Personalizado</option>
        </Select>
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="title">Título</Label>
        <Input 
          id="title" 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Título do slide"
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="subtitle">Subtítulo</Label>
        <Input 
          id="subtitle" 
          type="text" 
          value={subtitle} 
          onChange={(e) => setSubtitle(e.target.value)} 
          placeholder="Subtítulo do slide"
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="body">Conteúdo</Label>
        <Textarea 
          id="body" 
          value={body} 
          onChange={(e) => setBody(e.target.value)} 
          placeholder="Conteúdo principal do slide"
        />
      </FormGroup>
      
      {(template === 'image-text' || template === 'full-image') && (
        <FormGroup>
          <Label htmlFor="imageUrl">URL da Imagem</Label>
          <Input 
            id="imageUrl" 
            type="text" 
            value={imageUrl} 
            onChange={(e) => setImageUrl(e.target.value)} 
            placeholder="https://exemplo.com/imagem.jpg"
          />
          {imageUrl && (
            <div style={{ marginTop: '8px' }}>
              <img 
                src={imageUrl} 
                alt="Preview" 
                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }} 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
                onLoad={(e) => {
                  (e.target as HTMLImageElement).style.display = 'block';
                }}
              />
            </div>
          )}
        </FormGroup>
      )}
      
      <TwoColumnGrid>
        <FormGroup>
          <Label>Cor de Fundo</Label>
          <ColorPickerContainer>
            <ColorPreview 
              color={backgroundColor} 
              onClick={() => setShowBackgroundColorPicker(!showBackgroundColorPicker)} 
            />
            {showBackgroundColorPicker && (
              <ColorPickerPopover>
                <ColorPickerCover onClick={() => setShowBackgroundColorPicker(false)} />
                <SketchPicker 
                  color={backgroundColor} 
                  onChange={(color) => setBackgroundColor(color.hex)} 
                />
              </ColorPickerPopover>
            )}
          </ColorPickerContainer>
        </FormGroup>
        
        <FormGroup>
          <Label>Cor do Texto</Label>
          <ColorPickerContainer>
            <ColorPreview 
              color={textColor} 
              onClick={() => setShowTextColorPicker(!showTextColorPicker)} 
            />
            {showTextColorPicker && (
              <ColorPickerPopover>
                <ColorPickerCover onClick={() => setShowTextColorPicker(false)} />
                <SketchPicker 
                  color={textColor} 
                  onChange={(color) => setTextColor(color.hex)} 
                />
              </ColorPickerPopover>
            )}
          </ColorPickerContainer>
        </FormGroup>
      </TwoColumnGrid>
      
      <TwoColumnGrid>
        <FormGroup>
          <Label htmlFor="buttonText">Texto do Botão</Label>
          <Input 
            id="buttonText" 
            type="text" 
            value={buttonText} 
            onChange={(e) => setButtonText(e.target.value)} 
            placeholder="Saiba mais"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="buttonUrl">URL do Botão</Label>
          <Input 
            id="buttonUrl" 
            type="text" 
            value={buttonUrl} 
            onChange={(e) => setButtonUrl(e.target.value)} 
            placeholder="https://exemplo.com"
          />
        </FormGroup>
      </TwoColumnGrid>
      
      {template === 'custom' && (
        <FormGroup>
          <Label htmlFor="customCss">CSS Personalizado</Label>
          <Textarea 
            id="customCss" 
            value={customCss} 
            onChange={(e) => setCustomCss(e.target.value)} 
            placeholder=".slide-container { ... }\n.slide-title { ... }"
          />
        </FormGroup>
      )}
    </EditorContainer>
  );
};

export default SlideEditor;
