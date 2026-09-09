import { Outlet } from 'react-router-dom';
import CustomAlert from '../ui/CustomAlert';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-sm">
        <Outlet />
        <CustomAlert />
      </div>
    </div>
  );
}
