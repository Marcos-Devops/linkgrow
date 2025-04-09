import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2>Bem-vindo, {user?.name}!</h2>
      
      <div style={{ marginTop: '24px' }}>
        <div className="row" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div className="card" style={{ flex: '1', minWidth: '300px', padding: '24px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
            <h3>Editor Multimídia</h3>
            <p style={{ margin: '16px 0' }}>Crie e edite posts com nosso editor avançado, com suporte a rich text, imagens, vídeos e muito mais.</p>
            <Link to="/dashboard/posts/new" className="btn btn-primary">Criar Novo Post</Link>
          </div>
          
          <div className="card" style={{ flex: '1', minWidth: '300px', padding: '24px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
            <h3>Meus Posts</h3>
            <p style={{ margin: '16px 0' }}>Gerencie seus posts existentes, veja métricas e agende publicações.</p>
            <Link to="/dashboard/posts" className="btn btn-primary">Ver Posts</Link>
          </div>
        </div>
        
        <div className="row" style={{ display: 'flex', gap: '24px', marginTop: '24px', flexWrap: 'wrap' }}>
          <div className="card" style={{ flex: '1', minWidth: '300px', padding: '24px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
            <h3>LinkedIn</h3>
            <p style={{ margin: '16px 0' }}>Conecte sua conta do LinkedIn para publicar diretamente na plataforma.</p>
            <Link to="/dashboard/linkedin/connect" className="btn btn-primary">Conectar LinkedIn</Link>
          </div>
          
          <div className="card" style={{ flex: '1', minWidth: '300px', padding: '24px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
            <h3>Suporte da IA</h3>
            <p style={{ margin: '16px 0' }}>Use nossa IA para gerar sugestões de conteúdo, melhorar textos e otimizar suas publicações.</p>
            <Link to="/dashboard/posts/new" className="btn btn-primary">Experimentar IA</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
