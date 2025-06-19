export default function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center space-y-3">
        <div className="relative">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <p className="text-sm text-primary animate-pulse">Carregando...</p>
      </div>
    </div>
  );
} 