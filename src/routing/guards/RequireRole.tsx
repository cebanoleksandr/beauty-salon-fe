import { Navigate, Outlet } from 'react-router-dom';
import { useProfile } from '../../network/hooks/useAuth';
import type { UserRole } from '../../types/api';

interface RequireRoleProps {
  allow: UserRole[];
}

export default function RequireRole({ allow }: RequireRoleProps) {
  const { data: user, isLoading } = useProfile();

  if (isLoading) {
    return null;
  }

  if (!user || !allow.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
