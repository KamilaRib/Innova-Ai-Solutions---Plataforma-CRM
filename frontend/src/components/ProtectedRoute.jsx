import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Exige login; se `roles` for passado, também exige que o perfil do usuário esteja na lista.
export default function ProtectedRoute({ children, roles }) {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/app/dashboard" replace />;
  }
  return children;
}
