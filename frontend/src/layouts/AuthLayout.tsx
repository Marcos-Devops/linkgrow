import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>LinkGrow</h1>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
