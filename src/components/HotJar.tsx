'use client';

import { useEffect } from 'react';

interface HotJarProps {
  hotjarId: string;
  snippetVersion?: number;
}

declare global {
  interface Window {
    hj: any;
    _hjSettings: any;
  }
}

export default function HotJar({ hotjarId, snippetVersion = 6 }: HotJarProps) {
  useEffect(() => {
    if (!hotjarId) return;

    // Configurações do HotJar
    window._hjSettings = {
      hjid: hotjarId,
      hjsv: snippetVersion,
    };

    // Função para carregar o script do HotJar
    const loadHotJar = () => {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://static.hotjar.com/c/hotjar-${hotjarId}.js?sv=${snippetVersion}`;
      document.head.appendChild(script);
    };

    // Função para inicializar o HotJar
    const initHotJar = () => {
      if (window.hj) {
        // HotJar já carregado
        return;
      }

      // Aguarda o script carregar
      const checkHotJar = setInterval(() => {
        if (window.hj) {
          clearInterval(checkHotJar);
          
          // Configurações adicionais
          window.hj('identify', {
            // Identificar usuário (quando disponível)
            // userId: user?.id,
            // userEmail: user?.email,
            // userName: user?.name,
          });

          console.log('HotJar inicializado com sucesso!');
        }
      }, 100);

      // Timeout de segurança
      setTimeout(() => {
        clearInterval(checkHotJar);
        console.warn('HotJar não carregou dentro do tempo limite');
      }, 10000);
    };

    // Carrega o HotJar
    loadHotJar();
    
    // Inicializa após um pequeno delay
    setTimeout(initHotJar, 500);

    // Cleanup
    return () => {
      // Remove o script se necessário
      const hotjarScript = document.querySelector(`script[src*="hotjar-${hotjarId}"]`);
      if (hotjarScript) {
        hotjarScript.remove();
      }
    };
  }, [hotjarId, snippetVersion]);

  // Componente não renderiza nada visualmente
  return null;
}
