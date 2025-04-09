import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const RegisterContainer = styled.div`
  max-width: 450px;
  width: 100%;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0077B5;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
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

const Button = styled.button`
  background: linear-gradient(135deg, #0077B5, #00A0DC);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 119, 181, 0.3);
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const LoginLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  
  a {
    color: #0077B5;
    font-weight: 600;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const PlanInfo = styled.div`
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 3px solid #0077B5;
`;

const PlanTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #0077B5;
`;

const PlanDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
`;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedPlan = queryParams.get('plan');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.name || !formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Aqui seria implementada a chamada à API para registro
      // const response = await api.post('/auth/register', formData);
      
      // Simulando um registro bem-sucedido
      setTimeout(() => {
        setLoading(false);
        // Redirecionar para o dashboard após registro bem-sucedido
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError('Ocorreu um erro ao registrar. Por favor, tente novamente.');
    }
  };

  const getPlanDetails = () => {
    switch (selectedPlan) {
      case 'pro':
        return {
          title: 'Plano Pro',
          description: 'Você está se registrando para o plano Pro com recursos avançados para profissionais.'
        };
      case 'business':
        return {
          title: 'Plano Business',
          description: 'Você está se registrando para o plano Business com recursos completos para empresas.'
        };
      default:
        return null;
    }
  };

  const planDetails = getPlanDetails();

  return (
    <RegisterContainer>
      <Title>Criar Conta</Title>
      
      {planDetails && (
        <PlanInfo>
          <PlanTitle>{planDetails.title}</PlanTitle>
          <PlanDescription>{planDetails.description}</PlanDescription>
        </PlanInfo>
      )}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Nome completo</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Digite seu nome completo"
            required
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
            placeholder="Digite seu e-mail"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">Senha</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Digite sua senha"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirme sua senha"
            required
          />
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Criar conta'}
        </Button>
      </Form>
      
      <LoginLink>
        Já tem uma conta? <Link to="/auth/login">Entrar</Link>
      </LoginLink>
    </RegisterContainer>
  );
};

export default Register;
