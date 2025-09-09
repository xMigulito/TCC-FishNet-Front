'use client';

import { useCallback } from 'react';

declare global {
  interface Window {
    hj: any;
    _hjSettings: any;
  }
}

export const useHotJar = () => {
  // Função para verificar se o HotJar está disponível
  const isHotJarAvailable = useCallback(() => {
    const available = !!window.hj;
    console.log('HotJar disponível:', available);
    return available;
  }, []);

  // Função para identificar usuário
  const identifyUser = useCallback((userData: {
    userId?: string | number;
    userEmail?: string;
    userName?: string;
    [key: string]: any;
  }) => {
    if (!window.hj) {
      console.warn('HotJar não está disponível para identificar usuário');
      return false;
    }

    try {
      window.hj('identify', userData);
      console.log('✅ Usuário identificado no HotJar:', userData);
      return true;
    } catch (error) {
      console.error('❌ Erro ao identificar usuário no HotJar:', error);
      return false;
    }
  }, []);

  // Função para rastrear eventos personalizados
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    if (!window.hj) {
      console.warn('HotJar não está disponível para rastrear evento:', eventName);
      return false;
    }

    try {
      window.hj('event', eventName, properties);
      console.log('✅ Evento rastreado no HotJar:', eventName, properties);
      return true;
    } catch (error) {
      console.error('❌ Erro ao rastrear evento no HotJar:', error);
      return false;
    }
  }, []);

  // Função para rastrear conversões
  const trackConversion = useCallback((conversionName: string, value?: number) => {
    if (!window.hj) {
      console.warn('HotJar não está disponível para rastrear conversão:', conversionName);
      return false;
    }

    try {
      window.hj('conversion', conversionName, value);
      console.log('✅ Conversão rastreada no HotJar:', conversionName, value);
      return true;
    } catch (error) {
      console.error('❌ Erro ao rastrear conversão no HotJar:', error);
      return false;
    }
  }, []);

  // Função para rastrear páginas
  const trackPageView = useCallback((pageName: string) => {
    if (!window.hj) {
      console.warn('HotJar não está disponível para rastrear página:', pageName);
      return false;
    }

    try {
      window.hj('stateChange', pageName);
      console.log('✅ Página rastreada no HotJar:', pageName);
      return true;
    } catch (error) {
      console.error('❌ Erro ao rastrear página no HotJar:', error);
      return false;
    }
  }, []);

  // Função para obter informações de debug do HotJar
  const getDebugInfo = useCallback(() => {
    const info = {
      isAvailable: !!window.hj,
      settings: window._hjSettings,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };
    
    console.log('🔍 Debug Info do HotJar:', info);
    return info;
  }, []);

  // Função para testar a conectividade do HotJar
  const testConnection = useCallback(() => {
    if (!window.hj) {
      console.warn('❌ HotJar não está disponível para teste');
      return false;
    }

    try {
      // Enviar um evento de teste
      window.hj('event', 'hotjar_test_connection', {
        timestamp: new Date().toISOString(),
        test: true,
      });
      console.log('✅ Teste de conexão do HotJar enviado com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro no teste de conexão do HotJar:', error);
      return false;
    }
  }, []);

  return {
    identifyUser,
    trackEvent,
    trackConversion,
    trackPageView,
    isHotJarAvailable,
    getDebugInfo,
    testConnection,
  };
};
