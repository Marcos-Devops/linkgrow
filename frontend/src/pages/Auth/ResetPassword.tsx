import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ResetPasswordContainer = styled.div`
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

const InvalidTokenMessage = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  
  h2 {
    color: #e74c3c;
    margin-bottom: 1rem;
  }
  
  p {
    color: #666;
    margin-bottom: 1.5rem;
  }
`;

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);

  useEffect(() => {
    // Aqui seria implementada a verificação do token
    // Simulando uma verificação de token
    const verifyToken = async () => {
      try {
        // const response = await api.get(`/auth/verify-reset-token/${token}`);
        // Simulando um token válido
        setIsValidToken(true);
      } catch (err) {
        setIsValidToken(false);
      }
    };

    verifyToken();
  }, [token]);

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
    if (!formData.password || !formData.confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Aqui seria implementada a chamada à API para redefinir a senha
      // const response = await api.post(`/auth/reset-password/${token}`, {
      //   password: formData.password
      // });
      
      // Simulando uma redefinição bem-sucedida
      setTimeout(() => {
        setLoading(false);
        setSuccess('Senha redefinida com sucesso!');
        
        // Redirecionar para o login após alguns segundos
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError('Ocorreu um erro ao redefinir sua senha. Por favor, tente novamente.');
    }
  };

  if (!isValidToken) {
    return (
      <ResetPasswordContainer>
        <InvalidTokenMessage>
          <h2>Link inválido ou expirado</h2>
          <p>O link de redefinição de senha é inválido ou expirou. Por favor, solicite um novo link.</p>
          <Button onClick={() => navigate('/auth/forgot-password')}>
            Solicitar novo link
          </Button>
        </InvalidTokenMessage>
      </ResetPasswordContainer>
    );
  }

  return (
    <ResetPasswordContainer>
      <Title>Redefinir Senha</Title>
      <Subtitle>
        Digite sua nova senha abaixo.
      </Subtitle>
      
      {success ? (
        <>
          <SuccessMessage>{success}</SuccessMessage>
          <LoginLink>
            Redirecionando para o login...
          </LoginLink>
        </>
      ) : (
        <>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="password">Nova senha</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Digite sua nova senha"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme sua nova senha"
                required
              />
            </FormGroup>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Redefinindo...' : 'Redefinir senha'}
            </Button>
          </Form>
          
          <LoginLink>
            <Link to="/auth/login">Voltar para o login</Link>
          </LoginLink>
        </>
      )}
    </ResetPasswordContainer>
  );
};

export default ResetPassword;
