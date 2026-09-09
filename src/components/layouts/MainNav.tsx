import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../../network/hooks/useAuth';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium ${isActive ? 'text-sky-600' : 'text-slate-600 hover:text-sky-600'}`;

export default function MainNav() {
  const { t } = useTranslation();
  const { data: user } = useProfile();

  return (
    <nav className="flex items-center gap-5">
      <NavLink to="/" className={linkClass} end>
        {t('nav.home')}
      </NavLink>
      <NavLink to="/salons" className={linkClass}>
        {t('nav.salons')}
      </NavLink>
      <NavLink to="/bookings/my" className={linkClass}>
        {t('nav.myBookings')}
      </NavLink>

      {user?.role === 'SALON_OWNER' && (
        <NavLink to="/join-requests" className={linkClass}>
          {t('pages.joinRequests')}
        </NavLink>
      )}

      {user?.role === 'MASTER' && (
        <>
          <NavLink to="/master/dashboard" className={linkClass}>
            {t('pages.masterDashboard')}
          </NavLink>
          <NavLink to="/master/working-hours" className={linkClass}>
            {t('pages.workingHours')}
          </NavLink>
        </>
      )}

      <NavLink to="/notifications" className={linkClass}>
        {t('nav.notifications')}
      </NavLink>
      <NavLink to="/profile" className={linkClass}>
        {t('nav.profile')}
      </NavLink>
    </nav>
  );
}
