interface PageStubProps {
  title: string;
}

export default function PageStub({ title }: PageStubProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      <p className="text-slate-500 mt-2">Страница в розробці.</p>
    </div>
  );
}
