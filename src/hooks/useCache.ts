import { useState, useEffect, useCallback } from 'react';
import { cache, createCacheConfig, CACHE_KEYS } from '../utils/cache';

interface UseCacheOptions {
  key: string;
  fetchFunction: () => Promise<any>;
  ttl?: number;
  autoFetch?: boolean;
}

interface UseCacheReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  clearCache: () => void;
  isFromCache: boolean;
}

export function useCache<T = any>({
  key,
  fetchFunction,
  ttl,
  autoFetch = true
}: UseCacheOptions): UseCacheReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const fetchData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    setIsFromCache(false);

    try {
      // Verificar cache primeiro (se não for refresh forçado)
      if (!forceRefresh) {
        const cachedData = cache.get<T>(createCacheConfig(key, ttl));
        if (cachedData !== null && cachedData !== undefined) {
          console.log(`📦 Dados de ${key} carregados do cache`);
          setData(cachedData as T);
          setIsFromCache(true);
          setLoading(false);
          return;
        }
      }

      console.log(`🌐 Buscando dados de ${key} da API...`);
      const result = await fetchFunction();
      
      // Salvar no cache
      cache.set(createCacheConfig(key, ttl), result);
      setData(result);
      setIsFromCache(false);
    } catch (err) {
      setError(err as Error);
      console.error(`Erro ao buscar dados de ${key}:`, err);
    } finally {
      setLoading(false);
    }
  }, [key, fetchFunction, ttl]);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  const clearCache = useCallback(() => {
    cache.remove(key);
    setData(null);
    setIsFromCache(false);
  }, [key]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return {
    data,
    loading,
    error,
    refresh,
    clearCache,
    isFromCache
  };
}

// Hooks específicos para cada tipo de dados
export function useDashboard() {
  const fetchFunction = useCallback(async () => {
    const { fetchDashBoardInfo } = await import('../api/api');
    return fetchDashBoardInfo(false);
  }, []);

  return useCache({
    key: CACHE_KEYS.DASHBOARD,
    fetchFunction
  });
}

export function useTanques() {
  const fetchFunction = useCallback(async () => {
    const { fetchTanques } = await import('../api/api');
    return fetchTanques(false);
  }, []);

  return useCache({
    key: CACHE_KEYS.TANQUES,
    fetchFunction
  });
}

export function useResumoTanques() {
  const fetchFunction = useCallback(async () => {
    const { fetchResumoTanques } = await import('../api/api');
    return fetchResumoTanques(false);
  }, []);

  return useCache({
    key: CACHE_KEYS.TANQUES_RESUMO,
    fetchFunction
  });
}

export function useAlojamentos() {
  const fetchFunction = useCallback(async () => {
    const { fetchAlojamentos } = await import('../api/api');
    return fetchAlojamentos(false);
  }, []);

  return useCache({
    key: CACHE_KEYS.ALOJAMENTOS,
    fetchFunction
  });
}

export function useBiometriasDiarias() {
  const fetchFunction = useCallback(async () => {
    const { fetchBiometriasDiarias } = await import('../api/api');
    return fetchBiometriasDiarias(false);
  }, []);

  return useCache({
    key: CACHE_KEYS.BIOMETRIAS_DIARIAS,
    fetchFunction
  });
}

export function useBiometriasSemanais() {
  const fetchFunction = useCallback(async () => {
    const { fetchBiometriasSemanais } = await import('../api/api');
    return fetchBiometriasSemanais(false);
  }, []);

  return useCache({
    key: CACHE_KEYS.BIOMETRIAS_SEMANAIS,
    fetchFunction
  });
}
