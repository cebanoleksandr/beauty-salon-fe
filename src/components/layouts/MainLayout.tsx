import { Outlet } from 'react-router-dom';
import CustomAlert from '../ui/CustomAlert';
import LanguageSwitcher from '../LanguageSwitcher';
import MainNav from './MainNav';

export default function MainLayout() {
  return (
    <div className="h-screen flex flex-col bg-slate-100">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-6 shrink-0">
        <span className="text-lg font-semibold text-sky-600 shrink-0">Beauty Salon</span>
        <MainNav />
        <LanguageSwitcher />
      </header>
      <main className="flex-1 overflow-auto">
        <Outlet />
        <CustomAlert />
      </main>
    </div>
  );
}
