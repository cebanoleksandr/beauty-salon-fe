import { Outlet } from 'react-router-dom';
import CustomAlert from '../ui/CustomAlert';
import LanguageSwitcher from '../LanguageSwitcher';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-semibold text-sky-600">Beauty Salon</span>
        <LanguageSwitcher />
      </header>
      <main>
        <Outlet />
        <CustomAlert />
      </main>
    </div>
  );
}
