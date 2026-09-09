import { type RouteObject, createBrowserRouter } from 'react-router-dom';
import AuthLayout from '../components/layouts/AuthLayout';
import MainLayout from '../components/layouts/MainLayout';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import HomePage from '../pages/HomePage';
import SalonsListPage from '../pages/salons/SalonsListPage';
import SalonDetailPage from '../pages/salons/SalonDetailPage';
import SalonManagePage from '../pages/salons/SalonManagePage';
import MasterDetailPage from '../pages/masters/MasterDetailPage';
import MasterDashboardPage from '../pages/masters/MasterDashboardPage';
import BookingCreatePage from '../pages/bookings/BookingCreatePage';
import MyBookingsPage from '../pages/bookings/MyBookingsPage';
import ProfilePage from '../pages/profile/ProfilePage';
import NotificationsPage from '../pages/notifications/NotificationsPage';
import JoinRequestsPage from '../pages/join-requests/JoinRequestsPage';
import WorkingHoursPage from '../pages/working-hours/WorkingHoursPage';
import NotFoundPage from '../pages/NotFoundPage';
import RequireAuth from './guards/RequireAuth';
import GuestOnly from './guards/GuestOnly';
import RequireRole from './guards/RequireRole';

export const routes: RouteObject[] = [
  {
    Component: GuestOnly,
    children: [
      {
        Component: AuthLayout,
        children: [
          { path: '/login', Component: LoginPage },
          { path: '/register', Component: RegisterPage },
        ],
      },
    ],
  },
  {
    path: '/',
    Component: RequireAuth,
    children: [
      {
        Component: MainLayout,
        children: [
          { index: true, Component: HomePage },
          { path: 'salons', Component: SalonsListPage },
          { path: 'salons/:salonId', Component: SalonDetailPage },
          { path: 'masters/:masterId', Component: MasterDetailPage },
          { path: 'bookings/new', Component: BookingCreatePage },
          { path: 'bookings/my', Component: MyBookingsPage },
          { path: 'profile', Component: ProfilePage },
          { path: 'notifications', Component: NotificationsPage },
          {
            Component: () => <RequireRole allow={['SALON_OWNER']} />,
            children: [
              { path: 'salons/:salonId/manage', Component: SalonManagePage },
              { path: 'join-requests', Component: JoinRequestsPage },
            ],
          },
          {
            Component: () => <RequireRole allow={['MASTER']} />,
            children: [
              { path: 'master/dashboard', Component: MasterDashboardPage },
              { path: 'master/working-hours', Component: WorkingHoursPage },
            ],
          },
          { path: '*', Component: NotFoundPage },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
