import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 2rem;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 1rem;
  }
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarPlaceholder = styled.div`
  font-size: 3rem;
  color: #0077B5;
`;

const UploadButton = styled.label`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  padding: 0.3rem 0;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
  
  input {
    display: none;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const ProfileEmail = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const ProfileBio = styled.p`
  font-size: 0.9rem;
  color: #777;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #0077B5;
  }
`;

const Textarea = styled.textarea`
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #0077B5;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const SaveButton = styled(Button)`
  background: linear-gradient(135deg, #0077B5, #00A0DC);
  color: white;
  border: none;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 119, 181, 0.3);
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const CancelButton = styled(Button)`
  background: transparent;
  color: #666;
  border: 1px solid #ddd;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    flex-shrink: 0;
  }
`;

const Profile: React.FC = () => {
  const [formData, setFormData] = useState({
    name: 'João Silva',
    email: 'joao.silva@exemplo.com',
    bio: 'Profissional de marketing digital especializado em estratégias de crescimento para LinkedIn.',
    company: 'Marketing Digital Ltda',
    position: 'Especialista em Marketing Digital',
    website: 'https://joaosilva.com.br'
  });
  
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    // Aqui seria implementada a busca dos dados do perfil na API
    // Simulando o carregamento de dados
    const fetchProfile = async () => {
      try {
        // const response = await api.get('/profile');
        // setFormData(response.data);
        // if (response.data.avatar) {
        //   setAvatar(response.data.avatar);
        // }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      }
    };
    
    fetchProfile();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      
      reader.readAsDataURL(file);
      
      // Aqui seria implementado o upload do avatar para a API
      // const formData = new FormData();
      // formData.append('avatar', file);
      // await api.post('/profile/avatar', formData);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Aqui seria implementada a atualização do perfil na API
      // await api.put('/profile', formData);
      
      // Simulando uma atualização bem-sucedida
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        
        // Esconder a mensagem de sucesso após alguns segundos
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      }, 1500);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setLoading(false);
    }
  };
  
  return (
    <ProfileContainer>
      {success && (
        <SuccessMessage>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="#155724"/>
          </svg>
          Perfil atualizado com sucesso!
        </SuccessMessage>
      )}
      
      <ProfileHeader>
        <ProfileAvatar>
          {avatar ? (
            <AvatarImage src={avatar} alt="Avatar do usuário" />
          ) : (
            <AvatarPlaceholder>
              {formData.name.charAt(0).toUpperCase()}
            </AvatarPlaceholder>
          )}
          <UploadButton>
            Alterar
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleAvatarChange} 
            />
          </UploadButton>
        </ProfileAvatar>
        
        <ProfileInfo>
          <ProfileName>{formData.name}</ProfileName>
          <ProfileEmail>{formData.email}</ProfileEmail>
          <ProfileBio>{formData.bio}</ProfileBio>
        </ProfileInfo>
      </ProfileHeader>
      
      <SectionTitle>Informações do Perfil</SectionTitle>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Nome completo</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">E-mail</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="bio">Biografia</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Conte um pouco sobre você..."
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="company">Empresa</Label>
          <Input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="position">Cargo</Label>
          <Input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="website">Website</Label>
          <Input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
          />
        </FormGroup>
        
        <ButtonGroup>
          <SaveButton type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </SaveButton>
          <CancelButton type="button">
            Cancelar
          </CancelButton>
        </ButtonGroup>
      </Form>
    </ProfileContainer>
  );
};

export default Profile;
