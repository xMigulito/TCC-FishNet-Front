interface CacheItem<T> {
  data: T;
  timestamp: number;
  date: string; // YYYY-MM-DD format
}

interface CacheConfig {
  key: string;
  ttl?: number; // Time to live in milliseconds (default: 24 hours)
}

class CacheManager {
  private static instance: CacheManager;
  private cachePrefix = 'fishnet_cache_';

  private constructor() {}

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  private getCacheKey(key: string): string {
    return `${this.cachePrefix}${key}`;
  }

  private isToday(dateString: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  }

  private isExpired(timestamp: number, ttl: number = 24 * 60 * 60 * 1000): boolean {
    return Date.now() - timestamp > ttl;
  }

  set<T>(config: CacheConfig, data: T): void {
    if (typeof window === 'undefined') return;

    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };

    try {
      localStorage.setItem(
        this.getCacheKey(config.key),
        JSON.stringify(cacheItem)
      );
    } catch (error) {
      console.warn('Erro ao salvar no cache:', error);
    }
  }

  get<T>(config: CacheConfig): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const cached = localStorage.getItem(this.getCacheKey(config.key));
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);

      // Verificar se é do dia atual
      if (!this.isToday(cacheItem.date)) {
        this.remove(config.key);
        return null;
      }

      // Verificar se não expirou
      if (this.isExpired(cacheItem.timestamp, config.ttl)) {
        this.remove(config.key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn('Erro ao ler do cache:', error);
      this.remove(config.key);
      return null;
    }
  }

  remove(key: string): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(this.getCacheKey(key));
    } catch (error) {
      console.warn('Erro ao remover do cache:', error);
    }
  }

  clear(): void {
    if (typeof window === 'undefined') return;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.cachePrefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Erro ao limpar cache:', error);
    }
  }

  // Invalidar cache relacionado a inserções
  invalidateOnInsert(type: 'tanque' | 'alojamento' | 'biometria' | 'all'): void {
    const keysToInvalidate: string[] = [];

    switch (type) {
      case 'tanque':
        keysToInvalidate.push('tanques', 'tanques_resumo', 'dashboard');
        break;
      case 'alojamento':
        keysToInvalidate.push('alojamentos', 'dashboard');
        break;
      case 'biometria':
        keysToInvalidate.push('biometrias_diarias', 'biometrias_semanais', 'dashboard');
        break;
      case 'all':
        keysToInvalidate.push('tanques', 'tanques_resumo', 'alojamentos', 'biometrias_diarias', 'biometrias_semanais', 'dashboard');
        break;
    }

    keysToInvalidate.forEach(key => this.remove(key));
  }

  // Verificar se há dados em cache para uma chave específica
  has(key: string): boolean {
    return this.get({ key }) !== null;
  }

  // Obter informações sobre o cache
  getCacheInfo(key: string): { exists: boolean; age?: number; date?: string } {
    if (typeof window === 'undefined') return { exists: false };

    try {
      const cached = localStorage.getItem(this.getCacheKey(key));
      if (!cached) return { exists: false };

      const cacheItem: CacheItem<any> = JSON.parse(cached);
      return {
        exists: true,
        age: Date.now() - cacheItem.timestamp,
        date: cacheItem.date
      };
    } catch (error) {
      return { exists: false };
    }
  }
}

export const cache = CacheManager.getInstance();

// Função helper para criar configuração de cache
export const createCacheConfig = (key: string, ttl?: number): CacheConfig => ({
  key,
  ttl
});

// Chaves de cache padronizadas
export const CACHE_KEYS = {
  TANQUES: 'tanques',
  TANQUES_RESUMO: 'tanques_resumo',
  ALOJAMENTOS: 'alojamentos',
  BIOMETRIAS_DIARIAS: 'biometrias_diarias',
  BIOMETRIAS_SEMANAIS: 'biometrias_semanais',
  DASHBOARD: 'dashboard',
  USER_PROFILE: 'user_profile'
} as const;
