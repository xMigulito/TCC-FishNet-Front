'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-page">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-xl text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-white">!</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Algo deu errado!
        </h2>
        
        <p className="text-gray-600 mb-6">
          Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar novamente
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    </div>
  );
}
