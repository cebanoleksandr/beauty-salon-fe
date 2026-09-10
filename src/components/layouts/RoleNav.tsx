import { useProfile } from '../../network/hooks/useAuth';
import ClientNav from './nav/ClientNav';
import MasterNav from './nav/MasterNav';
import SalonOwnerNav from './nav/SalonOwnerNav';
import AdminNav from './nav/AdminNav';

export default function RoleNav() {
  const { data: user } = useProfile();

  switch (user?.role) {
    case 'MASTER':
      return <MasterNav />;
    case 'SALON_OWNER':
      return <SalonOwnerNav />;
    case 'ADMIN':
      return <AdminNav />;
    case 'CLIENT':
    default:
      return <ClientNav />;
  }
}
