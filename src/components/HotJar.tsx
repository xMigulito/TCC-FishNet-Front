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
    // Verificar se o HotJar ID está presente
    if (!hotjarId || hotjarId === '1234567') {
      console.warn('HotJar ID não configurado ou usando ID de teste. Configure NEXT_PUBLIC_HOTJAR_ID com seu ID real do HotJar.');
      return;
    }

    // Verificar se já foi carregado
    if (window.hj) {
      console.log('HotJar já está carregado');
      return;
    }

    console.log('🚀 Inicializando HotJar com ID:', hotjarId);
    console.log('🔧 Variável de ambiente NEXT_PUBLIC_HOTJAR_ID:', process.env.NEXT_PUBLIC_HOTJAR_ID);

    // Configurações do HotJar
    window._hjSettings = {
      hjid: parseInt(hotjarId),
      hjsv: snippetVersion,
    };

    console.log('⚙️ Configurações do HotJar:', window._hjSettings);

    // Função para carregar o script do HotJar
    const loadHotJar = () => {
      // Verificar se o script já existe
      const existingScript = document.querySelector(`script[src*="hotjar-${hotjarId}"]`);
      if (existingScript) {
        console.log('Script do HotJar já existe');
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://static.hotjar.com/c/hotjar-${hotjarId}.js?sv=${snippetVersion}`;
      
      // Adicionar event listeners para debug
      script.onload = () => {
        console.log('✅ Script do HotJar carregado com sucesso');
        console.log('🔗 URL do script:', script.src);
      };
      
      script.onerror = (error) => {
        console.error('❌ Erro ao carregar script do HotJar:', error);
        console.error('🔗 URL que falhou:', script.src);
      };

      document.head.appendChild(script);
    };

    // Função para verificar se o HotJar está disponível
    const checkHotJar = () => {
      if (window.hj) {
        console.log('🎉 HotJar está disponível:', window.hj);
        
        // Testar se o HotJar está funcionando
        try {
          window.hj('identify', {
            // Dados de teste para verificar se está funcionando
            testUser: true,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
          });
          console.log('✅ HotJar identificação de teste enviada com sucesso');
          
          // Enviar um evento de teste
          window.hj('event', 'hotjar_initialized', {
            timestamp: new Date().toISOString(),
            hotjarId: hotjarId,
          });
          console.log('✅ Evento de teste enviado para o HotJar');
          
        } catch (error) {
          console.error('❌ Erro ao enviar identificação de teste para o HotJar:', error);
        }
        
        return true;
      }
      return false;
    };

    // Carregar o script
    loadHotJar();
    
    // Verificar periodicamente se o HotJar carregou
    const checkInterval = setInterval(() => {
      if (checkHotJar()) {
        clearInterval(checkInterval);
      }
    }, 100);

    // Timeout de segurança
    setTimeout(() => {
      clearInterval(checkInterval);
      if (!window.hj) {
        console.error('❌ HotJar não carregou dentro do tempo limite de 10 segundos');
        console.log('🔍 Verifique se:');
        console.log('1. O ID do HotJar está correto (atual:', hotjarId, ')');
        console.log('2. A variável NEXT_PUBLIC_HOTJAR_ID está configurada no Vercel');
        console.log('3. Não há bloqueadores de anúncios ativos');
        console.log('4. A conexão com a internet está funcionando');
        console.log('5. O domínio está autorizado no Hotjar');
        console.log('🔗 URL esperada:', `https://static.hotjar.com/c/hotjar-${hotjarId}.js?sv=${snippetVersion}`);
      }
    }, 10000);

    // Cleanup
    return () => {
      clearInterval(checkInterval);
      // Não remover o script no cleanup para evitar problemas
    };
  }, [hotjarId, snippetVersion]);

  // Componente não renderiza nada visualmente
  return null;
}
