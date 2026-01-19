import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Đang load thì đứng im
  if (isLoading) return <div className="py-20 text-center">Đang kiểm tra...</div>;

  // Chưa login thì đá sang Login, lưu lại vị trí là "checkout"
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Login rồi thì cho qua luôn, không check role gì hết
  return <>{children}</>;
};

export default ProtectedRoute;