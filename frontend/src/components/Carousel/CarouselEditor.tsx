import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

import SlideItem from './SlideItem';
import CarouselPreview from './CarouselPreview';
import CarouselSettings from './CarouselSettings';
import SlideEditor from './SlideEditor';
import { Slide, CarouselData, CarouselSettings as SettingsType } from '../../types/carousel';
import { saveCarousel, getCarouselById, updateCarousel } from '../../services/carouselService';

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  gap: 20px;
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const EditorTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.primary ? '#0077B5' : '#fff'};
  color: ${props => props.primary ? '#fff' : '#333'};
  border: 1px solid ${props => props.primary ? '#0077B5' : '#ddd'};

  &:hover {
    background-color: ${props => props.primary ? '#005885' : '#f5f5f5'};
  }
`;

const EditorContent = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  @media (min-width: 1024px) {
    flex-wrap: nowrap;
  }
`;

const SlidesPanel = styled.div`
  flex: 1;
  min-width: 300px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SlidesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
  max-height: 400px;
  overflow-y: auto;
`;

const AddSlideButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #f0f0f0;
  border: 1px dashed #ccc;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e8e8e8;
  }
`;

const PreviewPanel = styled.div`
  flex: 2;
  min-width: 300px;
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 10px 16px;
  background-color: ${props => props.active ? '#fff' : 'transparent'};
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#0077B5' : 'transparent'};
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? '#0077B5' : '#333'};
  transition: all 0.2s ease;

  &:hover {
    color: #0077B5;
  }
`;

interface CarouselEditorProps {
  carouselId?: string;
}

const CarouselEditor: React.FC<CarouselEditorProps> = ({ carouselId }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'settings'>('preview');
  const [name, setName] = useState<string>('Novo Carrossel');
  const [description, setDescription] = useState<string>('');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(null);
  const [settings, setSettings] = useState<SettingsType>({
    autoPlay: false,
    interval: 5000,
    loop: true,
    showIndicators: true,
    showArrows: true,
    responsive: true
  });
  const [platform, setPlatform] = useState<string>('linkedin');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (carouselId) {
      loadCarousel(carouselId);
      setIsEditing(true);
    } else {
      // Adicionar um slide inicial
      addNewSlide();
    }
  }, [carouselId]);

  const loadCarousel = async (id: string) => {
    try {
      const carousel = await getCarouselById(id);
      setName(carousel.name);
      setDescription(carousel.description);
      setSlides(carousel.slides);
      setSettings(carousel.settings);
      setPlatform(carousel.platform);
      
      if (carousel.slides.length > 0) {
        setSelectedSlideId(carousel.slides[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar carrossel:', error);
    }
  };

  const addNewSlide = () => {
    const newSlide: Slide = {
      id: uuidv4(),
      order: slides.length,
      template: 'text-only',
      content: {
        title: 'Novo Slide',
        subtitle: 'Subtítulo',
        body: 'Conteúdo do slide',
        backgroundColor: '#ffffff',
        textColor: '#333333'
      }
    };
    
    setSlides([...slides, newSlide]);
    setSelectedSlideId(newSlide.id);
  };

  const updateSlide = (updatedSlide: Slide) => {
    setSlides(slides.map(slide => 
      slide.id === updatedSlide.id ? updatedSlide : slide
    ));
  };

  const removeSlide = (slideId: string) => {
    const newSlides = slides.filter(slide => slide.id !== slideId);
    setSlides(newSlides);
    
    if (selectedSlideId === slideId) {
      setSelectedSlideId(newSlides.length > 0 ? newSlides[0].id : null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setSlides(slides => {
        const oldIndex = slides.findIndex(slide => slide.id === active.id);
        const newIndex = slides.findIndex(slide => slide.id === over.id);
        
        const reorderedSlides = arrayMove(slides, oldIndex, newIndex);
        
        // Atualizar a ordem dos slides
        return reorderedSlides.map((slide, index) => ({
          ...slide,
          order: index
        }));
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const carouselData: CarouselData = {
        name,
        description,
        slides,
        settings,
        platform
      };
      
      if (isEditing && carouselId) {
        await updateCarousel(carouselId, carouselData);
      } else {
        await saveCarousel(carouselData);
      }
      
      alert('Carrossel salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar carrossel:', error);
      alert('Erro ao salvar carrossel. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedSlide = selectedSlideId 
    ? slides.find(slide => slide.id === selectedSlideId) 
    : null;

  return (
    <EditorContainer>
      <EditorHeader>
        <div>
          <EditorTitle>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              style={{ 
                fontSize: '24px', 
                fontWeight: 600, 
                border: 'none', 
                background: 'transparent',
                width: '100%',
                outline: 'none',
                padding: '5px 0'
              }}
              placeholder="Nome do carrossel"
            />
          </EditorTitle>
          <input 
            type="text" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            style={{ 
              border: 'none', 
              background: 'transparent',
              width: '100%',
              outline: 'none',
              padding: '5px 0'
            }}
            placeholder="Descrição (opcional)"
          />
        </div>
        <ActionButtons>
          <Button onClick={() => window.history.back()}>Cancelar</Button>
          <Button primary onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar Carrossel'}
          </Button>
        </ActionButtons>
      </EditorHeader>

      <EditorContent>
        <SlidesPanel>
          <h3>Slides</h3>
          <SlidesList>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={slides.map(slide => slide.id)}
                strategy={verticalListSortingStrategy}
              >
                {slides.map((slide) => (
                  <SlideItem
                    key={slide.id}
                    slide={slide}
                    isSelected={selectedSlideId === slide.id}
                    onSelect={() => setSelectedSlideId(slide.id)}
                    onRemove={() => removeSlide(slide.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </SlidesList>
          <AddSlideButton onClick={addNewSlide}>
            + Adicionar Slide
          </AddSlideButton>
        </SlidesPanel>

        <PreviewPanel>
          <TabsContainer>
            <Tab
              active={activeTab === 'preview'}
              onClick={() => setActiveTab('preview')}
            >
              Pré-visualização
            </Tab>
            <Tab
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            >
              Configurações
            </Tab>
          </TabsContainer>

          {activeTab === 'preview' ? (
            <CarouselPreview slides={slides} settings={settings} />
          ) : (
            <CarouselSettings
              settings={settings}
              onSettingsChange={setSettings}
              platform={platform}
              onPlatformChange={setPlatform}
            />
          )}
        </PreviewPanel>
      </EditorContent>

      {selectedSlide && (
        <SlideEditor
          slide={selectedSlide}
          onUpdate={updateSlide}
        />
      )}
    </EditorContainer>
  );
};

export default CarouselEditor;
