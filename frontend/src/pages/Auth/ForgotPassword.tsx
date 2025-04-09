import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ForgotPasswordContainer = styled.div`
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
  margin-bottom: 1rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
  text-align: center;
  line-height: 1.5;
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

const SuccessMessage = styled.div`
  color: #27ae60;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  padding: 1rem;
  background-color: #f0fff4;
  border-radius: 4px;
  text-align: center;
`;

const BackLink = styled.p`
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

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!email) {
      setError('Por favor, informe seu e-mail.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Aqui seria implementada a chamada à API para envio do e-mail de recuperação
      // const response = await api.post('/auth/forgot-password', { email });
      
      // Simulando um envio bem-sucedido
      setTimeout(() => {
        setLoading(false);
        setSuccess('E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.');
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError('Ocorreu um erro ao enviar o e-mail de recuperação. Por favor, tente novamente.');
    }
  };

  return (
    <ForgotPasswordContainer>
      <Title>Recuperar Senha</Title>
      <Subtitle>
        Informe seu e-mail e enviaremos instruções para redefinir sua senha.
      </Subtitle>
      
      {success ? (
        <>
          <SuccessMessage>{success}</SuccessMessage>
          <BackLink>
            <Link to="/auth/login">Voltar para o login</Link>
          </BackLink>
        </>
      ) : (
        <>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="email">E-mail</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Digite seu e-mail"
                required
              />
            </FormGroup>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar instruções'}
            </Button>
          </Form>
          
          <BackLink>
            <Link to="/auth/login">Voltar para o login</Link>
          </BackLink>
        </>
      )}
    </ForgotPasswordContainer>
  );
};

export default ForgotPassword;
