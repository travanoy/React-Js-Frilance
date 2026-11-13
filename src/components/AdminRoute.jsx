import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../features/auth/authSlice.js';

export default function AdminRoute({ children }) {
  const auth = useSelector(selectAuth);
  const token = auth.user?.token;
  const role = auth.user?.role || auth.user?.role === 'admin' ? auth.user?.role : null;
  if (!token || role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
