export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white text-xl font-bold">F</span>
          </div>
          <div className="absolute inset-0 w-16 h-16 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-primary mb-1">Carregando...</h3>
          <p className="text-sm text-gray-600">FishNet</p>
        </div>
        
        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-secondary to-primary rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
} 