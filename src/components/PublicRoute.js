import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children }) => {
  const token = useSelector((state) => state.authReducer.login_access_token);

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;
