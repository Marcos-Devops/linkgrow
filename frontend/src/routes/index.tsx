import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';

// Páginas de autenticação
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import ResetPassword from '../pages/Auth/ResetPassword';

// Páginas do dashboard
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';

// Páginas do LinkedIn
import LinkedInConnect from '../pages/LinkedIn/Connect';
import LinkedInStats from '../pages/LinkedIn/Stats';

// Páginas do editor multimídia
import ContentEditor from '../pages/ContentEditor';
import PostsList from '../pages/Posts/PostsList';
import PostDetails from '../pages/Posts/PostDetails';

// Componente de rota protegida
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Rotas de autenticação */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Navigate to="/login" />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* Rotas protegidas do dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          
          {/* Rotas do LinkedIn */}
          <Route path="linkedin">
            <Route path="connect" element={<LinkedInConnect />} />
            <Route path="stats" element={<LinkedInStats />} />
          </Route>
          
          {/* Rotas do editor multimídia */}
          <Route path="posts">
            <Route index element={<PostsList />} />
            <Route path="new" element={<ContentEditor />} />
            <Route path="edit/:postId" element={<ContentEditor isEditing={true} />} />
            <Route path=":postId" element={<PostDetails />} />
          </Route>
        </Route>

        {/* Rota de fallback */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
