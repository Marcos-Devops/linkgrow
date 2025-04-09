import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostPreview from '../PostPreview';

describe('PostPreview Component', () => {
  const mockAuthor = {
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/40'
  };

  const mockDate = new Date('2023-01-01T12:00:00');

  test('renders with minimal props', () => {
    render(<PostPreview content="<p>Test content</p>" />);
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
    expect(screen.getByText(/Pré-visualização do LinkedIn/i)).toBeInTheDocument();
  });

  test('renders with all props', () => {
    render(
      <PostPreview 
        content="<p>Full test content</p>"
        title="Test Title"
        author={mockAuthor}
        publishDate={mockDate}
        platform="twitter"
      />
    );
    
    expect(screen.getByText('Full test content')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(/Pré-visualização do Twitter/i)).toBeInTheDocument();
    
    // Verifica se a data formatada está presente
    const formattedDate = new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(mockDate);
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  test('renders HTML content correctly', () => {
    render(
      <PostPreview 
        content="<p>Paragraph</p><strong>Bold text</strong><em>Italic text</em>"
      />
    );
    
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
    expect(screen.getByText('Bold text')).toBeInTheDocument();
    expect(screen.getByText('Italic text')).toBeInTheDocument();
  });

  test('renders different platforms correctly', () => {
    const { rerender } = render(<PostPreview content="<p>Content</p>" platform="linkedin" />);
    expect(screen.getByText(/Pré-visualização do LinkedIn/i)).toBeInTheDocument();
    
    rerender(<PostPreview content="<p>Content</p>" platform="facebook" />);
    expect(screen.getByText(/Pré-visualização do Facebook/i)).toBeInTheDocument();
    
    rerender(<PostPreview content="<p>Content</p>" platform="instagram" />);
    expect(screen.getByText(/Pré-visualização do Instagram/i)).toBeInTheDocument();
    
    rerender(<PostPreview content="<p>Content</p>" platform="twitter" />);
    expect(screen.getByText(/Pré-visualização do Twitter/i)).toBeInTheDocument();
  });

  test('renders engagement metrics', () => {
    render(<PostPreview content="<p>Content</p>" />);
    
    expect(screen.getByText('👍 0')).toBeInTheDocument();
    expect(screen.getByText('💬 0')).toBeInTheDocument();
    expect(screen.getByText('🔄 0')).toBeInTheDocument();
  });

  test('renders preview disclaimer', () => {
    render(<PostPreview content="<p>Content</p>" />);
    
    expect(screen.getByText(/Esta é apenas uma pré-visualização/i)).toBeInTheDocument();
  });
});
