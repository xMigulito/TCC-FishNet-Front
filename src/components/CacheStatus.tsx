'use client';

import { useState, useEffect } from 'react';
import { getCacheStatus, refreshAllData } from '../api/api';

interface CacheStatusProps {
  className?: string;
}

export default function CacheStatus({ className = '' }: CacheStatusProps) {
  const [cacheStatus, setCacheStatus] = useState<Record<string, any>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const updateCacheStatus = () => {
    const status = getCacheStatus();
    setCacheStatus(status);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshAllData();
      setLastRefresh(new Date());
      updateCacheStatus();
    } catch (error) {
      console.error('Erro ao fazer refresh:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatAge = (age?: number) => {
    if (!age) return 'N/A';
    const minutes = Math.floor(age / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const getStatusColor = (exists: boolean, age?: number) => {
    if (!exists) return 'text-gray-500';
    if (!age) return 'text-green-500';
    
    const minutes = Math.floor(age / (1000 * 60));
    if (minutes < 30) return 'text-green-500';
    if (minutes < 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusIcon = (exists: boolean, age?: number) => {
    if (!exists) return '❌';
    if (!age) return '✅';
    
    const minutes = Math.floor(age / (1000 * 60));
    if (minutes < 30) return '✅';
    if (minutes < 60) return '⚠️';
    return '🔄';
  };

  useEffect(() => {
    updateCacheStatus();
  }, []);

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          📦 Status do Cache
        </h3>
        <div className="flex items-center gap-2">
          {lastRefresh && (
            <span className="text-sm text-gray-500">
              Último refresh: {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isRefreshing ? '🔄 Atualizando...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(cacheStatus).map(([key, info]) => (
          <div
            key={key}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {getStatusIcon(info.exists, info.age)}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {key.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="text-right">
              <div className={`text-xs font-medium ${getStatusColor(info.exists, info.age)}`}>
                {info.exists ? formatAge(info.age) : 'Não cacheado'}
              </div>
              {info.date && (
                <div className="text-xs text-gray-500">
                  {info.date}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <div className="text-sm text-blue-800">
          <strong>💡 Como funciona:</strong>
          <ul className="mt-1 ml-4 list-disc">
            <li>Dados são carregados do cache se disponíveis</li>
            <li>Cache é válido por 24 horas ou até o próximo dia</li>
            <li>Cache é invalidado automaticamente em inserções</li>
            <li>Use o botão "Refresh" para forçar atualização</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
