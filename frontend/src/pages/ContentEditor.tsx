import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import RichTextEditor from '../components/Editor/RichTextEditor';
import PostPreview from '../components/Editor/PostPreview';
import { useNavigate, useParams } from 'react-router-dom';

interface ContentEditorProps {
  isEditing?: boolean;
}

interface PostData {
  id?: string;
  title: string;
  content: string;
  platform: 'linkedin' | 'twitter' | 'facebook' | 'instagram';
  scheduledDate?: Date;
  tags: string[];
  status: 'draft' | 'scheduled' | 'published';
}

const ContentEditor: React.FC<ContentEditorProps> = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  
  const [loading, setLoading] = useState<boolean>(isEditing);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [postData, setPostData] = useState<PostData>({
    title: '',
    content: '',
    platform: 'linkedin',
    tags: [],
    status: 'draft'
  });

  const [currentTag, setCurrentTag] = useState<string>('');
  const [showAiPanel, setShowAiPanel] = useState<boolean>(false);
  const [processingAi, setProcessingAi] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // Carregar dados do post se estiver editando
  useEffect(() => {
    if (isEditing && postId) {
      const fetchPost = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/posts/${postId}`);
          setPostData(response.data.data);
        } catch (err) {
          setError('Erro ao carregar o post. Por favor, tente novamente.');
          console.error('Erro ao carregar post:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    }
  }, [isEditing, postId]);

  // Manipuladores de eventos
  const handleContentChange = (content: string) => {
    setPostData(prev => ({ ...prev, content }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostData(prev => ({ ...prev, title: e.target.value }));
  };

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPostData(prev => ({ 
      ...prev, 
      platform: e.target.value as 'linkedin' | 'twitter' | 'facebook' | 'instagram' 
    }));
  };

  const handleScheduledDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostData(prev => ({ ...prev, scheduledDate: new Date(e.target.value) }));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTag(e.target.value);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!postData.tags.includes(currentTag.trim())) {
        setPostData(prev => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim()]
        }));
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPostData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Upload de arquivos para processamento de IA
  const handleFileUpload = async (files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await axios.post('/api/ai/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data.urls;
    } catch (error) {
      console.error('Erro ao fazer upload de arquivos:', error);
      setError('Erro ao fazer upload de arquivos. Por favor, tente novamente.');
      return [];
    }
  };

  // Processamento de IA
  const processWithAI = async () => {
    if (uploadedFiles.length === 0) {
      setError('Por favor, faça upload de pelo menos um arquivo para processamento.');
      return;
    }

    try {
      setProcessingAi(true);
      
      // Upload dos arquivos
      const fileUrls = await handleFileUpload(uploadedFiles);
      
      // Solicitar processamento de IA
      const response = await axios.post('/api/ai/process', {
        files: fileUrls,
        context: {
          title: postData.title,
          platform: postData.platform,
          tags: postData.tags,
          existingContent: postData.content
        }
      });

      if (response.data && response.data.suggestions) {
        setAiSuggestions(response.data.suggestions);
      }
    } catch (error) {
      console.error('Erro ao processar com IA:', error);
      setError('Erro ao processar com IA. Por favor, tente novamente.');
    } finally {
      setProcessingAi(false);
    }
  };

  // Aplicar sugestão da IA
  const applySuggestion = (suggestion: string) => {
    setPostData(prev => ({ ...prev, content: suggestion }));
    setAiSuggestions([]);
  };

  // Salvar ou agendar post
  const savePost = async (status: 'draft' | 'scheduled' | 'published' = 'draft') => {
    if (!postData.title.trim()) {
      setError('Por favor, adicione um título ao seu post.');
      return;
    }

    if (!postData.content.trim()) {
      setError('Por favor, adicione conteúdo ao seu post.');
      return;
    }

    if (status === 'scheduled' && !postData.scheduledDate) {
      setError('Por favor, selecione uma data para agendar o post.');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const dataToSend = {
        ...postData,
        status
      };
      
      let response;
      if (isEditing && postId) {
        response = await axios.put(`/api/posts/${postId}`, dataToSend);
      } else {
        response = await axios.post('/api/posts', dataToSend);
      }
      
      setSuccessMessage(
        status === 'draft' 
          ? 'Post salvo como rascunho com sucesso!' 
          : status === 'scheduled'
            ? 'Post agendado com sucesso!'
            : 'Post publicado com sucesso!'
      );
      
      // Redirecionar após alguns segundos
      setTimeout(() => {
        navigate('/posts');
      }, 2000);
      
    } catch (err) {
      console.error('Erro ao salvar post:', err);
      setError('Erro ao salvar o post. Por favor, tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingContainer>Carregando...</LoadingContainer>;
  }

  return (
    <EditorPageContainer>
      <PageHeader>
        <h1>{isEditing ? 'Editar Post' : 'Criar Novo Post'}</h1>
        <ActionsContainer>
          <Button onClick={() => navigate('/posts')}>Cancelar</Button>
          <Button 
            onClick={() => savePost('draft')} 
            disabled={saving}
            variant="secondary"
          >
            {saving ? 'Salvando...' : 'Salvar Rascunho'}
          </Button>
          <Button 
            onClick={() => savePost('scheduled')} 
            disabled={saving || !postData.scheduledDate}
            variant="primary"
          >
            {saving ? 'Agendando...' : 'Agendar Post'}
          </Button>
          <Button 
            onClick={() => savePost('published')} 
            disabled={saving}
            variant="success"
          >
            {saving ? 'Publicando...' : 'Publicar Agora'}
          </Button>
        </ActionsContainer>
      </PageHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

      <EditorContainer>
        <EditorColumn>
          <FormGroup>
            <Label htmlFor="title">Título do Post</Label>
            <Input
              id="title"
              type="text"
              value={postData.title}
              onChange={handleTitleChange}
              placeholder="Digite o título do seu post"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="platform">Plataforma</Label>
            <Select
              id="platform"
              value={postData.platform}
              onChange={handlePlatformChange}
            >
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="scheduledDate">Data de Publicação (opcional)</Label>
            <Input
              id="scheduledDate"
              type="datetime-local"
              value={postData.scheduledDate ? new Date(postData.scheduledDate).toISOString().slice(0, 16) : ''}
              onChange={handleScheduledDateChange}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="tags">Tags</Label>
            <TagsContainer>
              {postData.tags.map(tag => (
                <Tag key={tag}>
                  {tag}
                  <TagRemoveButton onClick={() => removeTag(tag)}>×</TagRemoveButton>
                </Tag>
              ))}
              <TagInput
                type="text"
                value={currentTag}
                onChange={handleTagInputChange}
                onKeyDown={handleTagKeyDown}
                placeholder="Adicione tags e pressione Enter"
              />
            </TagsContainer>
          </FormGroup>

          <AiToolsToggle onClick={() => setShowAiPanel(!showAiPanel)}>
            {showAiPanel ? 'Esconder Ferramentas de IA' : 'Mostrar Ferramentas de IA'}
          </AiToolsToggle>

          {showAiPanel && (
            <AiToolsPanel>
              <h3>Ferramentas de IA</h3>
              <p>Faça upload de arquivos para que a IA gere sugestões de conteúdo</p>
              
              <FileUploadArea>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setUploadedFiles(Array.from(e.target.files));
                    }
                  }}
                />
                <FileList>
                  {uploadedFiles.map((file, index) => (
                    <FileItem key={index}>
                      {file.name}
                      <FileRemoveButton
                        onClick={() => {
                          setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                        }}
                      >
                        ×
                      </FileRemoveButton>
                    </FileItem>
                  ))}
                </FileList>
              </FileUploadArea>
              
              <Button
                onClick={processWithAI}
                disabled={processingAi || uploadedFiles.length === 0}
                variant="primary"
                fullWidth
              >
                {processingAi ? 'Processando...' : 'Processar com IA'}
              </Button>
              
              {aiSuggestions.length > 0 && (
                <SuggestionsContainer>
                  <h4>Sugestões de Conteúdo</h4>
                  {aiSuggestions.map((suggestion, index) => (
                    <SuggestionItem key={index}>
                      <SuggestionPreview dangerouslySetInnerHTML={{ __html: suggestion.substring(0, 100) + '...' }} />
                      <SuggestionActions>
                        <Button
                          onClick={() => applySuggestion(suggestion)}
                          variant="secondary"
                          small
                        >
                          Aplicar
                        </Button>
                      </SuggestionActions>
                    </SuggestionItem>
                  ))}
                </SuggestionsContainer>
              )}
            </AiToolsPanel>
          )}

          <EditorLabel>Conteúdo do Post</EditorLabel>
          <RichTextEditor
            initialValue={postData.content}
            onChange={handleContentChange}
            onMediaUpload={handleFileUpload}
            height="400px"
            placeholder="Comece a escrever seu post aqui..."
            aiSuggestions={true}
          />
        </EditorColumn>
        
        <PreviewColumn>
          <PreviewLabel>Pré-visualização em Tempo Real</PreviewLabel>
          <PostPreview
            content={postData.content}
            title={postData.title}
            author={{
              name: 'Seu Nome',
              avatar: 'https://via.placeholder.com/40'
            }}
            publishDate={postData.scheduledDate || new Date()}
            platform={postData.platform}
          />
        </PreviewColumn>
      </EditorContainer>
    </EditorPageContainer>
  );
};

// Estilos
const EditorPageContainer = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h1 {
    margin: 0;
    font-size: 24px;
    color: #333;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'success'; fullWidth?: boolean; small?: boolean }>`
  padding: ${props => props.small ? '4px 8px' : '8px 16px'};
  background-color: ${props => {
    switch (props.variant) {
      case 'primary':
        return '#4a90e2';
      case 'secondary':
        return '#6c757d';
      case 'success':
        return '#28a745';
      default:
        return '#f8f9fa';
    }
  }};
  color: ${props => props.variant ? 'white' : '#333'};
  border: 1px solid ${props => {
    switch (props.variant) {
      case 'primary':
        return '#4a90e2';
      case 'secondary':
        return '#6c757d';
      case 'success':
        return '#28a745';
      default:
        return '#ddd';
    }
  }};
  border-radius: 4px;
  cursor: pointer;
  font-size: ${props => props.small ? '12px' : '14px'};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  &:hover {
    background-color: ${props => {
      switch (props.variant) {
        case 'primary':
          return '#3a80d2';
        case 'secondary':
          return '#5a6268';
        case 'success':
          return '#218838';
        default:
          return '#e2e6ea';
      }
    }};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EditorContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const EditorColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const PreviewColumn = styled.div`
  display: flex;
  flex-direction: column;
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
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  background-color: #e1f0ff;
  color: #0077b5;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 12px;
`;

const TagRemoveButton = styled.button`
  background: none;
  border: none;
  color: #0077b5;
  margin-left: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    color: #005885;
  }
`;

const TagInput = styled.input`
  flex: 1;
  min-width: 100px;
  border: none;
  outline: none;
  font-size: 14px;
`;

const EditorLabel = styled.div`
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
`;

const PreviewLabel = styled.div`
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
`;

const AiToolsToggle = styled.button`
  background: none;
  border: none;
  color: #4a90e2;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 16px;
  text-align: left;
  padding: 0;
  
  &:hover {
    text-decoration: underline;
  }
`;

const AiToolsPanel = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: #f8f9fa;
  
  h3 {
    margin-top: 0;
    margin-bottom: 8px;
    font-size: 16px;
  }
  
  p {
    margin-bottom: 16px;
    font-size: 14px;
    color: #666;
  }
`;

const FileUploadArea = styled.div`
  margin-bottom: 16px;
`;

const FileList = styled.div`
  margin-top: 8px;
`;

const FileItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 4px;
  font-size: 12px;
`;

const FileRemoveButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  
  &:hover {
    color: #333;
  }
`;

const SuggestionsContainer = styled.div`
  margin-top: 16px;
  
  h4 {
    margin-top: 0;
    margin-bottom: 8px;
    font-size: 14px;
  }
`;

const SuggestionItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: #fff;
`;

const SuggestionPreview = styled.div`
  font-size: 12px;
  margin-bottom: 8px;
  color: #666;
`;

const SuggestionActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 18px;
  color: #666;
`;

export default ContentEditor;
