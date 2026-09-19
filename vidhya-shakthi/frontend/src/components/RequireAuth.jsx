import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { readStoredAuth, getHomePathForRole } from '../lib/auth';

export default function RequireAuth({ children, roles }) {
  const location = useLocation();
  const session = readStoredAuth();

  if (!session?.token || !session?.user?.role) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const role = session.user.role;
  if (roles?.length && !roles.includes(role)) {
    return <Navigate to={getHomePathForRole(role)} replace />;
  }

  return children;
}
