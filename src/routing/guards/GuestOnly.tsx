import { Navigate, Outlet } from 'react-router-dom';

export default function GuestOnly() {
  const token = localStorage.getItem('beauty_access_token');

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
