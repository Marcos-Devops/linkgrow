import React, { useState } from 'react';
import styled from 'styled-components';

const SettingsContainer = styled.div`
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: #333;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#0077B5' : 'transparent'};
  color: ${props => props.active ? '#0077B5' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #0077B5;
  }
  
  @media (max-width: 576px) {
    padding: 0.8rem 1rem;
  }
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

const Select = styled.select`
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
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

const SwitchLabel = styled.span`
  margin-left: 0.8rem;
  font-size: 0.9rem;
  color: #333;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + & {
    background-color: #0077B5;
  }
  
  input:checked + &:before {
    transform: translateX(24px);
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

const DangerButton = styled(Button)`
  background-color: #fff;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  
  &:hover {
    background-color: #fef5f5;
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

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [accountSettings, setAccountSettings] = useState({
    email: 'joao.silva@exemplo.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    weeklyDigest: true,
    newConnectionRequests: true,
    postEngagement: true,
    marketingEmails: false
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    activityVisibility: 'connections',
    allowTagging: true,
    showOnlineStatus: true
  });
  
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setPrivacySettings(prev => ({
      ...prev,
      [name]: newValue
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Aqui seria implementada a atualização das configurações na API
      // await api.put('/settings/account', accountSettings);
      // ou
      // await api.put('/settings/notifications', notificationSettings);
      // ou
      // await api.put('/settings/privacy', privacySettings);
      
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
      console.error('Erro ao atualizar configurações:', error);
      setLoading(false);
    }
  };
  
  return (
    <SettingsContainer>
      <PageTitle>Configurações</PageTitle>
      
      {success && (
        <SuccessMessage>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="#155724"/>
          </svg>
          Configurações atualizadas com sucesso!
        </SuccessMessage>
      )}
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'account'} 
          onClick={() => setActiveTab('account')}
        >
          Conta
        </Tab>
        <Tab 
          active={activeTab === 'notifications'} 
          onClick={() => setActiveTab('notifications')}
        >
          Notificações
        </Tab>
        <Tab 
          active={activeTab === 'privacy'} 
          onClick={() => setActiveTab('privacy')}
        >
          Privacidade
        </Tab>
        <Tab 
          active={activeTab === 'billing'} 
          onClick={() => setActiveTab('billing')}
        >
          Assinatura
        </Tab>
      </TabsContainer>
      
      {activeTab === 'account' && (
        <>
          <SectionTitle>Informações da Conta</SectionTitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="email">E-mail</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={accountSettings.email}
                onChange={handleAccountChange}
                disabled
              />
            </FormGroup>
            
            <SectionTitle>Alterar Senha</SectionTitle>
            
            <FormGroup>
              <Label htmlFor="currentPassword">Senha atual</Label>
              <Input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={accountSettings.currentPassword}
                onChange={handleAccountChange}
                placeholder="Digite sua senha atual"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="newPassword">Nova senha</Label>
              <Input
                type="password"
                id="newPassword"
                name="newPassword"
                value={accountSettings.newPassword}
                onChange={handleAccountChange}
                placeholder="Digite sua nova senha"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={accountSettings.confirmPassword}
                onChange={handleAccountChange}
                placeholder="Confirme sua nova senha"
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
            
            <div style={{ marginTop: '3rem' }}>
              <SectionTitle>Excluir Conta</SectionTitle>
              <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
                Ao excluir sua conta, todos os seus dados serão permanentemente removidos. Esta ação não pode ser desfeita.
              </p>
              <DangerButton type="button">
                Excluir minha conta
              </DangerButton>
            </div>
          </Form>
        </>
      )}
      
      {activeTab === 'notifications' && (
        <>
          <SectionTitle>Preferências de Notificação</SectionTitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <SwitchContainer>
                <Switch>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onChange={handleNotificationChange}
                  />
                  <Slider />
                </Switch>
                <SwitchLabel>Receber notificações por e-mail</SwitchLabel>
              </SwitchContainer>
            </FormGroup>
            
            <FormGroup>
              <SwitchContainer>
                <Switch>
                  <input
                    type="checkbox"
                    name="weeklyDigest"
                    checked={notificationSettings.weeklyDigest}
                    onChange={handleNotificationChange}
                  />
                  <Slider />
                </Switch>
                <SwitchLabel>Receber resumo semanal de atividades</SwitchLabel>
              </SwitchContainer>
            </FormGroup>
            
            <FormGroup>
              <SwitchContainer>
                <Switch>
                  <input
                    type="checkbox"
                    name="newConnectionRequests"
                    checked={notificationSettings.newConnectionRequests}
                    onChange={handleNotificationChange}
                  />
                  <Slider />
                </Switch>
                <SwitchLabel>Notificar sobre novas solicitações de conexão</SwitchLabel>
              </SwitchContainer>
            </FormGroup>
            
            <FormGroup>
              <SwitchContainer>
                <Switch>
                  <input
                    type="checkbox"
                    name="postEngagement"
                    checked={notificationSettings.postEngagement}
                    onChange={handleNotificationChange}
                  />
                  <Slider />
                </Switch>
                <SwitchLabel>Notificar sobre engajamento em suas publicações</SwitchLabel>
              </SwitchContainer>
            </FormGroup>
            
            <FormGroup>
              <SwitchContainer>
                <Switch>
                  <input
                    type="checkbox"
                    name="marketingEmails"
                    checked={notificationSettings.marketingEmails}
                    onChange={handleNotificationChange}
                  />
                  <Slider />
                </Switch>
                <SwitchLabel>Receber e-mails de marketing e novidades</SwitchLabel>
              </SwitchContainer>
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
        </>
      )}
      
      {activeTab === 'privacy' && (
        <>
          <SectionTitle>Configurações de Privacidade</SectionTitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="profileVisibility">Visibilidade do perfil</Label>
              <Select
                id="profileVisibility"
                name="profileVisibility"
                value={privacySettings.profileVisibility}
                onChange={handlePrivacyChange}
              >
                <option value="public">Público (visível para todos)</option>
                <option value="connections">Apenas conexões</option>
                <option value="private">Privado (apenas você)</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="activityVisibility">Visibilidade de atividades</Label>
              <Select
                id="activityVisibility"
                name="activityVisibility"
                value={privacySettings.activityVisibility}
                onChange={handlePrivacyChange}
              >
                <option value="public">Público (visível para todos)</option>
                <option value="connections">Apenas conexões</option>
                <option value="private">Privado (apenas você)</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <SwitchContainer>
                <Switch>
                  <input
                    type="checkbox"
                    name="allowTagging"
                    checked={privacySettings.allowTagging}
                    onChange={handlePrivacyChange}
                  />
                  <Slider />
                </Switch>
                <SwitchLabel>Permitir que outros usuários me marquem em publicações</SwitchLabel>
              </SwitchContainer>
            </FormGroup>
            
            <FormGroup>
              <SwitchContainer>
                <Switch>
                  <input
                    type="checkbox"
                    name="showOnlineStatus"
                    checked={privacySettings.showOnlineStatus}
                    onChange={handlePrivacyChange}
                  />
                  <Slider />
                </Switch>
                <SwitchLabel>Mostrar status online</SwitchLabel>
              </SwitchContainer>
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
        </>
      )}
      
      {activeTab === 'billing' && (
        <>
          <SectionTitle>Informações de Assinatura</SectionTitle>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ marginBottom: '0.5rem', color: '#0077B5' }}>Plano Pro</h3>
              <p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>R$ 49,90/mês</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Faturado mensalmente • Próxima cobrança em 15/06/2023</p>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                marginTop: '1rem',
                padding: '0.5rem',
                backgroundColor: '#e6f7ff',
                borderRadius: '4px',
                fontSize: '0.9rem',
                color: '#0077B5'
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
                  <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM9 15V13H11V15H9ZM9 5V11H11V5H9Z" fill="#0077B5"/>
                </svg>
                Sua assinatura está ativa
              </div>
            </div>
            
            <ButtonGroup>
              <Button 
                style={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #0077B5', 
                  color: '#0077B5' 
                }}
              >
                Alterar plano
              </Button>
              <DangerButton>
                Cancelar assinatura
              </DangerButton>
            </ButtonGroup>
          </div>
          
          <SectionTitle>Método de Pagamento</SectionTitle>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            padding: '1rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginBottom: '1.5rem'
          }}>
            <div style={{ 
              width: '50px', 
              height: '30px', 
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem'
            }}>
              <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="30" height="20" rx="2" fill="#016FD0"/>
                <path d="M15 16H13V8H15V16Z" fill="white"/>
                <path d="M12 12C12 10.3431 13.3431 9 15 9C16.6569 9 18 10.3431 18 12C18 13.6569 16.6569 15 15 15C13.3431 15 12 13.6569 12 12Z" fill="white"/>
              </svg>
            </div>
            <div>
              <p style={{ fontWeight: 600 }}>Cartão de crédito terminando em 4242</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Expira em 12/2025</p>
            </div>
          </div>
          
          <ButtonGroup>
            <Button 
              style={{ 
                backgroundColor: 'white', 
                border: '1px solid #0077B5', 
                color: '#0077B5' 
              }}
            >
              Atualizar método de pagamento
            </Button>
          </ButtonGroup>
          
          <SectionTitle>Histórico de Faturas</SectionTitle>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '0.9rem'
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <th style={{ textAlign: 'left', padding: '0.8rem', color: '#666' }}>Data</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem', color: '#666' }}>Descrição</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem', color: '#666' }}>Valor</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem', color: '#666' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem', color: '#666' }}></th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.8rem' }}>15/05/2023</td>
                  <td style={{ padding: '0.8rem' }}>Plano Pro - Mensal</td>
                  <td style={{ padding: '0.8rem' }}>R$ 49,90</td>
                  <td style={{ padding: '0.8rem' }}>
                    <span style={{ 
                      backgroundColor: '#d4edda', 
                      color: '#155724',
                      padding: '0.3rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}>
                      Pago
                    </span>
                  </td>
                  <td style={{ padding: '0.8rem' }}>
                    <a href="#" style={{ color: '#0077B5', textDecoration: 'none' }}>
                      Ver recibo
                    </a>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.8rem' }}>15/04/2023</td>
                  <td style={{ padding: '0.8rem' }}>Plano Pro - Mensal</td>
                  <td style={{ padding: '0.8rem' }}>R$ 49,90</td>
                  <td style={{ padding: '0.8rem' }}>
                    <span style={{ 
                      backgroundColor: '#d4edda', 
                      color: '#155724',
                      padding: '0.3rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}>
                      Pago
                    </span>
                  </td>
                  <td style={{ padding: '0.8rem' }}>
                    <a href="#" style={{ color: '#0077B5', textDecoration: 'none' }}>
                      Ver recibo
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.8rem' }}>15/03/2023</td>
                  <td style={{ padding: '0.8rem' }}>Plano Pro - Mensal</td>
                  <td style={{ padding: '0.8rem' }}>R$ 49,90</td>
                  <td style={{ padding: '0.8rem' }}>
                    <span style={{ 
                      backgroundColor: '#d4edda', 
                      color: '#155724',
                      padding: '0.3rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}>
                      Pago
                    </span>
                  </td>
                  <td style={{ padding: '0.8rem' }}>
                    <a href="#" style={{ color: '#0077B5', textDecoration: 'none' }}>
                      Ver recibo
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </SettingsContainer>
  );
};

export default Settings;
