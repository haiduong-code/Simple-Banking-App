import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

// Chan truy cap khi chua dang nhap -> chuyen ve /login
export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
