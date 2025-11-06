// ProtectedRoute.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotFound from './Components/404NotFound';


const ProtectedRoute = ({ element: Component, allowedRoles }) => {
  // Safely read role from localStorage. If parsing fails or value missing, treat as unauthenticated.
  let userRole = null;
  try {
    const stored = localStorage.getItem('userInfo');
    const parsed = stored ? JSON.parse(stored) : null;
    userRole = parsed?.role || null;
  } catch (err) {
    console.warn('Failed to parse userInfo from localStorage', err);
    userRole = null;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    // If user is not authorized, show NotFound (or redirect to login in future)
    return <NotFound />;
  }

  return <Component />;
};

export default ProtectedRoute;