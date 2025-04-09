/**
 * Interface para o conteúdo de um slide
 */
export interface SlideContent {
  title?: string;
  subtitle?: string;
  body?: string;
  imageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonText?: string;
  buttonUrl?: string;
  customCss?: string;
}

/**
 * Interface para um slide de carrossel
 */
export interface Slide {
  id: string;
  order: number;
  template: 'text-only' | 'image-text' | 'full-image' | 'quote' | 'stats' | 'custom';
  content: SlideContent;
}

/**
 * Interface para as configurações do carrossel
 */
export interface CarouselSettings {
  autoPlay: boolean;
  interval: number;
  loop: boolean;
  showIndicators: boolean;
  showArrows: boolean;
  responsive: boolean;
}

/**
 * Interface para os dados do carrossel
 */
export interface CarouselData {
  name: string;
  description?: string;
  slides: Slide[];
  settings: CarouselSettings;
  platform?: string;
}

/**
 * Interface para o carrossel completo com dados do banco
 */
export interface Carousel extends CarouselData {
  _id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
