import Button from '@mui/material/Button';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold text-sky-600 underline">
        Vite + Tailwind + MUI
      </h1>
      
      {/* Кнопка MUI зі стилями Tailwind поверх неї */}
      <Button 
        variant="contained" 
        className="bg-emerald-600! hover:bg-emerald-700 !px-6 !py-3 !rounded-xl"
      >
        MUI Button з Tailwind
      </Button>
    </div>
  );
}
