import React from 'react';
import styled from 'styled-components';

interface PostPreviewProps {
  content: string;
  title?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  publishDate?: Date;
  platform?: 'linkedin' | 'twitter' | 'facebook' | 'instagram';
}

const PostPreview: React.FC<PostPreviewProps> = ({
  content,
  title,
  author,
  publishDate = new Date(),
  platform = 'linkedin'
}) => {
  // Formata a data de publicação
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(publishDate);

  // Determina o ícone da plataforma
  const getPlatformIcon = () => {
    switch (platform) {
      case 'linkedin':
        return '🔵'; // Substitua por um ícone real do LinkedIn
      case 'twitter':
        return '🐦'; // Substitua por um ícone real do Twitter
      case 'facebook':
        return '📘'; // Substitua por um ícone real do Facebook
      case 'instagram':
        return '📸'; // Substitua por um ícone real do Instagram
      default:
        return '🔵';
    }
  };

  return (
    <PreviewContainer>
      <PreviewHeader>
        <PlatformIndicator>
          {getPlatformIcon()} Pré-visualização do {platform.charAt(0).toUpperCase() + platform.slice(1)}
        </PlatformIndicator>
      </PreviewHeader>
      
      <PostContainer>
        {author && (
          <AuthorSection>
            <AuthorAvatar src={author.avatar || 'https://via.placeholder.com/40'} alt={author.name} />
            <AuthorInfo>
              <AuthorName>{author.name}</AuthorName>
              <PostDate>{formattedDate}</PostDate>
            </AuthorInfo>
          </AuthorSection>
        )}
        
        {title && <PostTitle>{title}</PostTitle>}
        
        <PostContent dangerouslySetInnerHTML={{ __html: content }} />
        
        <PostEngagement>
          <EngagementItem>👍 0</EngagementItem>
          <EngagementItem>💬 0</EngagementItem>
          <EngagementItem>🔄 0</EngagementItem>
        </PostEngagement>
      </PostContainer>
      
      <PreviewFooter>
        <PreviewNote>
          Esta é apenas uma pré-visualização. O post real pode aparecer diferente.
        </PreviewNote>
      </PreviewFooter>
    </PreviewContainer>
  );
};

// Estilos
const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
`;

const PreviewHeader = styled.div`
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
`;

const PlatformIndicator = styled.div`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const PostContainer = styled.div`
  padding: 16px;
`;

const AuthorSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const AuthorAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #333;
`;

const PostDate = styled.div`
  font-size: 12px;
  color: #777;
`;

const PostTitle = styled.h2`
  font-size: 18px;
  margin: 0 0 12px;
  color: #333;
`;

const PostContent = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 16px;
  
  img, video {
    max-width: 100%;
    border-radius: 4px;
    margin: 8px 0;
  }
  
  a {
    color: #0077b5;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  p {
    margin: 8px 0;
  }
`;

const PostEngagement = styled.div`
  display: flex;
  border-top: 1px solid #e0e0e0;
  padding-top: 12px;
  margin-top: 12px;
`;

const EngagementItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 16px;
  color: #666;
  font-size: 14px;
`;

const PreviewFooter = styled.div`
  padding: 8px 16px;
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
`;

const PreviewNote = styled.div`
  font-size: 12px;
  color: #777;
  text-align: center;
  font-style: italic;
`;

export default PostPreview;
