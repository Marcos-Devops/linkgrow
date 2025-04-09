import React from 'react';
import styled from 'styled-components';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Slide } from '../../types/carousel';

const SlideItemContainer = styled.div<{ isSelected: boolean; isDragging: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: ${props => props.isSelected ? '#e6f2ff' : '#fff'};
  border: 1px solid ${props => props.isSelected ? '#0077B5' : '#ddd'};
  border-radius: 4px;
  cursor: grab;
  transition: all 0.2s ease;
  box-shadow: ${props => props.isDragging ? '0 5px 10px rgba(0, 0, 0, 0.15)' : 'none'};
  opacity: ${props => props.isDragging ? 0.8 : 1};
  
  &:hover {
    border-color: ${props => props.isSelected ? '#0077B5' : '#aaa'};
  }
`;

const SlideInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SlideNumber = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0077B5;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
`;

const SlideTitle = styled.div`
  font-weight: 500;
`;

const SlideTemplate = styled.div`
  font-size: 12px;
  color: #666;
`;

const SlideActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f0f0f0;
    color: #333;
  }
`;

interface SlideItemProps {
  slide: Slide;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

const SlideItem: React.FC<SlideItemProps> = ({ slide, isSelected, onSelect, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: slide.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const getTemplateLabel = (template: string): string => {
    const templates: Record<string, string> = {
      'text-only': 'Apenas Texto',
      'image-text': 'Imagem e Texto',
      'full-image': 'Imagem Completa',
      'quote': 'Citação',
      'stats': 'Estatísticas',
      'custom': 'Personalizado'
    };
    
    return templates[template] || template;
  };
  
  return (
    <SlideItemContainer
      ref={setNodeRef}
      style={style}
      isSelected={isSelected}
      isDragging={isDragging}
      onClick={onSelect}
      {...attributes}
      {...listeners}
    >
      <SlideInfo>
        <SlideNumber>{slide.order + 1}</SlideNumber>
        <div>
          <SlideTitle>{slide.content.title || 'Sem título'}</SlideTitle>
          <SlideTemplate>{getTemplateLabel(slide.template)}</SlideTemplate>
        </div>
      </SlideInfo>
      
      <SlideActions>
        <ActionButton 
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          title="Remover slide"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
          </svg>
        </ActionButton>
      </SlideActions>
    </SlideItemContainer>
  );
};

export default SlideItem;
