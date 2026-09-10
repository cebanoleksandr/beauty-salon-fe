export const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium ${isActive ? 'text-sky-600' : 'text-slate-600 hover:text-sky-600'}`;
