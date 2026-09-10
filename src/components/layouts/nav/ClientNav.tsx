import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { navLinkClass } from './navLinkClass';

export default function ClientNav() {
  const { t } = useTranslation();

  return (
    <nav className="flex items-center gap-5">
      <NavLink to="/" className={navLinkClass} end>
        {t('nav.home')}
      </NavLink>
      <NavLink to="/salons" className={navLinkClass}>
        {t('nav.salons')}
      </NavLink>
      <NavLink to="/bookings/my" className={navLinkClass}>
        {t('nav.myBookings')}
      </NavLink>
      <NavLink to="/notifications" className={navLinkClass}>
        {t('nav.notifications')}
      </NavLink>
      <NavLink to="/profile" className={navLinkClass}>
        {t('nav.profile')}
      </NavLink>
    </nav>
  );
}
