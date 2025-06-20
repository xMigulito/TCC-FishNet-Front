export default function Configuracoes() {
  return (
    <div className="p-8 pt-20 min-h-screen bg-page-bg">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-extrabold text-primary mb-2">Configurações</h1>
        <p className="text-lg text-primary mb-8">Gerencie preferências e ajustes do sistema.</p>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 border border-grid">
            <h2 className="text-xl font-bold text-primary mb-4">Outras Configurações</h2>
            <p className="text-gray-600">Aqui você pode adicionar outras configurações do sistema.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 