import React, { useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// Tipos
interface RichTextEditorProps {
  initialValue?: string;
  onChange: (content: string) => void;
  onSave?: (content: string) => void;
  onMediaUpload?: (files: File[]) => Promise<string[]>;
  height?: string;
  placeholder?: string;
  aiSuggestions?: boolean;
}

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  uploading: boolean;
  progress: number;
  error?: string;
  url?: string;
}

// Componente principal
const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialValue = '',
  onChange,
  onSave,
  onMediaUpload,
  height = '400px',
  placeholder = 'Escreva seu conteúdo aqui...',
  aiSuggestions = true
}) => {
  const [editorContent, setEditorContent] = useState(initialValue);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);

  // Configuração do editor
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'color', 'background',
    'align',
    'link', 'image', 'video'
  ];

  // Manipuladores de eventos
  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    onChange(content);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editorContent);
    }
  };

  // Dropzone para upload de arquivos
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newMediaFiles = acceptedFiles.map(file => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      progress: 0
    }));
    
    setMediaFiles(prev => [...prev, ...newMediaFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': [],
      'audio/*': [],
      'application/pdf': []
    }
  });

  // Upload de arquivos
  const uploadFile = async (mediaFile: MediaFile) => {
    if (!onMediaUpload) return;

    try {
      const updatedFile = { ...mediaFile, uploading: true, progress: 0 };
      setMediaFiles(prev => prev.map(f => f.id === mediaFile.id ? updatedFile : f));

      // Simula progresso de upload
      const progressInterval = setInterval(() => {
        setMediaFiles(prev => prev.map(f => {
          if (f.id === mediaFile.id && f.progress < 90) {
            return { ...f, progress: f.progress + 10 };
          }
          return f;
        }));
      }, 300);

      // Upload real
      const urls = await onMediaUpload([mediaFile.file]);
      clearInterval(progressInterval);

      if (urls && urls.length > 0) {
        setMediaFiles(prev => prev.map(f => {
          if (f.id === mediaFile.id) {
            return { ...f, uploading: false, progress: 100, url: urls[0] };
          }
          return f;
        }));
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setMediaFiles(prev => prev.map(f => {
        if (f.id === mediaFile.id) {
          return { ...f, uploading: false, error: 'Falha no upload' };
        }
        return f;
      }));
    }
  };

  // Inserir mídia no editor
  const insertMedia = (mediaFile: MediaFile) => {
    if (!mediaFile.url) return;

    let mediaHtml = '';
    const fileType = mediaFile.file.type.split('/')[0];

    if (fileType === 'image') {
      mediaHtml = `<img src="${mediaFile.url}" alt="Imagem" style="max-width: 100%;" />`;
    } else if (fileType === 'video') {
      mediaHtml = `<video controls style="max-width: 100%;"><source src="${mediaFile.url}" type="${mediaFile.file.type}"></video>`;
    } else if (fileType === 'audio') {
      mediaHtml = `<audio controls><source src="${mediaFile.url}" type="${mediaFile.file.type}"></audio>`;
    } else if (mediaFile.file.type === 'application/pdf') {
      mediaHtml = `<a href="${mediaFile.url}" target="_blank">Visualizar PDF</a>`;
    }

    // Insere o HTML no editor
    setEditorContent(prev => {
      const newContent = prev + mediaHtml;
      onChange(newContent);
      return newContent;
    });
  };

  // Solicitar sugestões de IA
  const requestAiSuggestion = async () => {
    if (!aiSuggestions) return;

    try {
      setIsLoadingSuggestion(true);
      const response = await axios.post('/api/ai/suggestions', {
        content: editorContent,
        type: 'content_improvement'
      });

      if (response.data && response.data.suggestion) {
        setAiSuggestion(response.data.suggestion);
      }
    } catch (error) {
      console.error('Erro ao obter sugestões de IA:', error);
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  // Aplicar sugestão da IA
  const applySuggestion = () => {
    if (aiSuggestion) {
      setEditorContent(aiSuggestion);
      onChange(aiSuggestion);
      setAiSuggestion('');
    }
  };

  // Limpar recursos ao desmontar o componente
  useEffect(() => {
    return () => {
      mediaFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [mediaFiles]);

  return (
    <EditorContainer>
      <EditorToolbar>
        <ToolbarButton onClick={() => setShowMediaLibrary(!showMediaLibrary)}>
          Biblioteca de Mídia
        </ToolbarButton>
        {aiSuggestions && (
          <ToolbarButton 
            onClick={requestAiSuggestion} 
            disabled={isLoadingSuggestion}
          >
            {isLoadingSuggestion ? 'Gerando sugestões...' : 'Sugestões de IA'}
          </ToolbarButton>
        )}
        <ToolbarButton onClick={handleSave}>
          Salvar
        </ToolbarButton>
      </EditorToolbar>

      {/* Editor principal */}
      <EditorWrapper height={height}>
        <ReactQuill
          theme="snow"
          value={editorContent}
          onChange={handleEditorChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </EditorWrapper>

      {/* Sugestões de IA */}
      {aiSuggestion && (
        <SuggestionContainer>
          <SuggestionHeader>
            <h4>Sugestão de melhoria</h4>
            <div>
              <SuggestionButton onClick={applySuggestion}>Aplicar</SuggestionButton>
              <SuggestionButton onClick={() => setAiSuggestion('')}>Ignorar</SuggestionButton>
            </div>
          </SuggestionHeader>
          <SuggestionContent dangerouslySetInnerHTML={{ __html: aiSuggestion }} />
        </SuggestionContainer>
      )}

      {/* Biblioteca de mídia */}
      {showMediaLibrary && (
        <MediaLibrary>
          <MediaLibraryHeader>
            <h3>Biblioteca de Mídia</h3>
            <CloseButton onClick={() => setShowMediaLibrary(false)}>×</CloseButton>
          </MediaLibraryHeader>
          
          <DropzoneArea {...getRootProps()} isDragActive={isDragActive}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Solte os arquivos aqui...</p>
            ) : (
              <p>Arraste e solte arquivos aqui, ou clique para selecionar</p>
            )}
          </DropzoneArea>
          
          <MediaGrid>
            {mediaFiles.map(mediaFile => (
              <MediaItem key={mediaFile.id}>
                <MediaPreview>
                  {mediaFile.file.type.startsWith('image/') ? (
                    <img src={mediaFile.preview} alt="Preview" />
                  ) : mediaFile.file.type.startsWith('video/') ? (
                    <video src={mediaFile.preview} />
                  ) : mediaFile.file.type.startsWith('audio/') ? (
                    <div className="audio-preview">🎵</div>
                  ) : (
                    <div className="file-preview">📄</div>
                  )}
                </MediaPreview>
                <MediaInfo>
                  <p>{mediaFile.file.name}</p>
                  {mediaFile.uploading ? (
                    <ProgressBar progress={mediaFile.progress} />
                  ) : mediaFile.error ? (
                    <ErrorMessage>{mediaFile.error}</ErrorMessage>
                  ) : mediaFile.url ? (
                    <MediaActions>
                      <ActionButton onClick={() => insertMedia(mediaFile)}>Inserir</ActionButton>
                    </MediaActions>
                  ) : (
                    <MediaActions>
                      <ActionButton onClick={() => uploadFile(mediaFile)}>Upload</ActionButton>
                    </MediaActions>
                  )}
                </MediaInfo>
              </MediaItem>
            ))}
          </MediaGrid>
        </MediaLibrary>
      )}
    </EditorContainer>
  );
};

// Estilos
const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  background-color: #fff;
`;

const EditorToolbar = styled.div`
  display: flex;
  padding: 8px;
  border-bottom: 1px solid #ddd;
  background-color: #f8f8f8;
`;

const ToolbarButton = styled.button`
  padding: 6px 12px;
  margin-right: 8px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #3a80d2;
  }
  
  &:disabled {
    background-color: #a0a0a0;
    cursor: not-allowed;
  }
`;

const EditorWrapper = styled.div<{ height: string }>`
  height: ${props => props.height};
  
  .ql-editor {
    min-height: 200px;
    font-size: 16px;
    line-height: 1.5;
  }
`;

const MediaLibrary = styled.div`
  border-top: 1px solid #ddd;
  padding: 16px;
  background-color: #f8f8f8;
`;

const MediaLibraryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  h3 {
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const DropzoneArea = styled.div<{ isDragActive: boolean }>`
  border: 2px dashed ${props => props.isDragActive ? '#4a90e2' : '#ddd'};
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  background-color: ${props => props.isDragActive ? 'rgba(74, 144, 226, 0.1)' : '#fff'};
  margin-bottom: 16px;
  cursor: pointer;
  
  &:hover {
    border-color: #4a90e2;
  }
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const MediaItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  background-color: #fff;
`;

const MediaPreview = styled.div`
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  
  img, video {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
  }
  
  .audio-preview, .file-preview {
    font-size: 32px;
    color: #666;
  }
`;

const MediaInfo = styled.div`
  padding: 8px;
  
  p {
    margin: 0 0 8px;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const MediaActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ActionButton = styled.button`
  padding: 4px 8px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background-color: #3a80d2;
  }
`;

const ProgressBar = styled.div<{ progress: number }>`
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 4px;
  
  &:after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.progress}%;
    background-color: #4caf50;
    transition: width 0.3s ease;
  }
`;

const ErrorMessage = styled.p`
  color: #f44336;
  font-size: 12px;
  margin: 4px 0 0;
`;

const SuggestionContainer = styled.div`
  margin-top: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
`;

const SuggestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  
  h4 {
    margin: 0;
    color: #333;
  }
`;

const SuggestionButton = styled.button`
  padding: 4px 8px;
  margin-left: 8px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background-color: #3a80d2;
  }
`;

const SuggestionContent = styled.div`
  padding: 16px;
  background-color: #fffde7;
  max-height: 200px;
  overflow-y: auto;
`;

export default RichTextEditor;
