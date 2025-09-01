'use client';

import { useCallback } from 'react';

declare global {
  interface Window {
    hj: any;
  }
}

export const useHotJar = () => {
  // Função para identificar usuário
  const identifyUser = useCallback((userData: {
    userId?: string | number;
    userEmail?: string;
    userName?: string;
    [key: string]: any;
  }) => {
    if (window.hj) {
      window.hj('identify', userData);
      console.log('Usuário identificado no HotJar:', userData);
    } else {
      console.warn('HotJar não está disponível');
    }
  }, []);

  // Função para rastrear eventos personalizados
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    if (window.hj) {
      window.hj('event', eventName, properties);
      console.log('Evento rastreado no HotJar:', eventName, properties);
    } else {
      console.warn('HotJar não está disponível');
    }
  }, []);

  // Função para rastrear conversões
  const trackConversion = useCallback((conversionName: string, value?: number) => {
    if (window.hj) {
      window.hj('conversion', conversionName, value);
      console.log('Conversão rastreada no HotJar:', conversionName, value);
    } else {
      console.warn('HotJar não está disponível');
    }
  }, []);

  // Função para rastrear páginas
  const trackPageView = useCallback((pageName: string) => {
    if (window.hj) {
      window.hj('stateChange', pageName);
      console.log('Página rastreada no HotJar:', pageName);
    } else {
      console.warn('HotJar não está disponível');
    }
  }, []);

  // Função para verificar se o HotJar está disponível
  const isHotJarAvailable = useCallback(() => {
    return !!window.hj;
  }, []);

  return {
    identifyUser,
    trackEvent,
    trackConversion,
    trackPageView,
    isHotJarAvailable,
  };
};
