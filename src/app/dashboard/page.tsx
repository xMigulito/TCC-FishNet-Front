"use client";

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import PageLoading from '@/components/PageLoading';
import { useHotJar } from '@/hooks/useHotJar';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/hooks/useCache';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Fish, Thermometer, Droplets, Zap, Eye } from 'lucide-react';

interface DadosTanque {
  mes: string;
  biomassa: number;
  fca: number;
  mortalidade: number;
  projecao: number;
  percentualRenovacaoAgua?: number;
  nitrito?: number;
  amonia?: number;
  transparencia?: number;
  quantidadeAlimentacoes?: number;
}

interface Tanque {
  id: number;
  nome: string;
  dados: DadosTanque[];
}

interface Metrica {
  titulo: string;
  valor: string;
  variacao: string;
  cor: string;
  descricao: string;
}

function calcularMetricas(data: Tanque[]): Metrica[] {
  const dadosUltimoMes = data.map(tanque => {
    const dadosTanque = tanque.dados;
    return dadosTanque[dadosTanque.length - 1];
  }).filter(dado => dado !== undefined);

  const dadosPenultimoMes = data.map(tanque => {
    const dadosTanque = tanque.dados;
    return dadosTanque.length >= 2 ? dadosTanque[dadosTanque.length - 2] : null;
  }).filter(dado => dado !== null);

  const biomassaTotal = dadosUltimoMes.reduce((acc, curr) => acc + curr.biomassa, 0);
  const biomassaTotalAnterior = dadosPenultimoMes.length > 0 
    ? dadosPenultimoMes.reduce((acc, curr) => acc + curr.biomassa, 0)
    : biomassaTotal;
  const variacaoBiomassa = dadosPenultimoMes.length > 0 
    ? ((biomassaTotal - biomassaTotalAnterior) / biomassaTotalAnterior) * 100
    : 0;

  const fcaMedio = dadosUltimoMes.length > 0 
    ? dadosUltimoMes.reduce((acc, curr) => acc + curr.fca, 0) / dadosUltimoMes.length
    : 0;
  const fcaMedioAnterior = dadosPenultimoMes.length > 0 
    ? dadosPenultimoMes.reduce((acc, curr) => acc + curr.fca, 0) / dadosPenultimoMes.length
    : fcaMedio;
  const variacaoFca = dadosPenultimoMes.length > 0 
    ? ((fcaMedio - fcaMedioAnterior) / fcaMedioAnterior) * 100
    : 0;

  // Novas métricas
  const percentualRenovacaoMedio = dadosUltimoMes.length > 0 
    ? dadosUltimoMes.reduce((acc, curr) => acc + (curr.percentualRenovacaoAgua || 0), 0) / dadosUltimoMes.length
    : 0;

  const nitritoMedio = dadosUltimoMes.length > 0 
    ? dadosUltimoMes.reduce((acc, curr) => acc + (curr.nitrito || 0), 0) / dadosUltimoMes.length
    : 0;

  const transparenciaMedia = dadosUltimoMes.length > 0 
    ? dadosUltimoMes.reduce((acc, curr) => acc + (curr.transparencia || 0), 0) / dadosUltimoMes.length
    : 0;

  const alimentacoesMedio = dadosUltimoMes.length > 0 
    ? dadosUltimoMes.reduce((acc, curr) => acc + (curr.quantidadeAlimentacoes || 0), 0) / dadosUltimoMes.length
    : 0;

  return [
    {
      titulo: "Biomassa Total",
      valor: `${biomassaTotal.toFixed(1)} kg`,
      variacao: `${variacaoBiomassa >= 0 ? '+' : ''}${variacaoBiomassa.toFixed(1)}%`,
      cor: variacaoBiomassa >= 0 ? "text-green-600" : "text-red-600",
      descricao: "desde o último mês",
    },
    {
      titulo: "FCA Médio",
      valor: fcaMedio.toFixed(2),
      variacao: `${variacaoFca >= 0 ? '+' : ''}${variacaoFca.toFixed(1)}%`,
      cor: variacaoFca <= 0 ? "text-green-600" : "text-red-600",
      descricao: "desde o último mês",
    },
    {
      titulo: "Renovação de Água",
      valor: `${percentualRenovacaoMedio.toFixed(1)}%`,
      variacao: percentualRenovacaoMedio >= 15 ? "Ótimo" : percentualRenovacaoMedio >= 10 ? "Bom" : "Atenção",
      cor: percentualRenovacaoMedio >= 15 ? "text-green-600" : percentualRenovacaoMedio >= 10 ? "text-yellow-600" : "text-red-600",
      descricao: "média dos tanques",
    },
    {
      titulo: "Qualidade da Água",
      valor: `${nitritoMedio.toFixed(3)} mg/L`,
      variacao: nitritoMedio <= 0.05 ? "Ótima" : nitritoMedio <= 0.1 ? "Boa" : "Atenção",
      cor: nitritoMedio <= 0.05 ? "text-green-600" : nitritoMedio <= 0.1 ? "text-yellow-600" : "text-red-600",
      descricao: "nitrito médio",
    },
    {
      titulo: "Alimentações",
      valor: `${alimentacoesMedio.toFixed(1)}x`,
      variacao: alimentacoesMedio >= 3 ? "Ideal" : alimentacoesMedio >= 2 ? "Bom" : "Pouco",
      cor: alimentacoesMedio >= 3 ? "text-green-600" : alimentacoesMedio >= 2 ? "text-yellow-600" : "text-red-600",
      descricao: "por dia (média)",
    },
    {
      titulo: "Transparência",
      valor: `${transparenciaMedia.toFixed(1)} cm`,
      variacao: transparenciaMedia >= 20 ? "Ótima" : transparenciaMedia >= 15 ? "Boa" : "Baixa",
      cor: transparenciaMedia >= 20 ? "text-green-600" : transparenciaMedia >= 15 ? "text-yellow-600" : "text-red-600",
      descricao: "média dos tanques",
    },
  ];
}

function processarEvolucaoPeso(data: Tanque[]) {
  return data.map((d: Tanque) => ({
    data: d.dados[d.dados.length - 1].mes,
    atual: d.dados[d.dados.length - 1].biomassa,
    ideal: d.dados[d.dados.length - 1].projecao,
  }));
}

function processarRacaoPorTanque(data: Tanque[]) {
  return data.map((tanque: Tanque) => {
    const ultimoDado = tanque.dados[tanque.dados.length - 1];
    return {
      tanque: tanque.nome,
      usada: Number((ultimoDado.biomassa * ultimoDado.fca).toFixed(2)),
      projetada: Number((ultimoDado.projecao * ultimoDado.fca).toFixed(2)),
    };
  });
}

// Função para formatar datas para mês/ano
function formatarMesAno(data: string | Date) {
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' });
}

const chartColors = {
  primary: 'var(--primary)',
  secondary: 'var(--secondary)',
  grid: 'var(--grid)',
};

export default function Dashboard() {
  const { user } = useAuth();
  const { trackEvent, trackPageView, identifyUser } = useHotJar();
  
  // Usar o hook de cache para buscar dados do dashboard
  const { 
    data: dashboardData, 
    loading: isLoading, 
    error, 
    refresh, 
    isFromCache 
  } = useDashboard();

  // Rastrear visualização da página
  useEffect(() => {
    trackPageView('Dashboard');
  }, [trackPageView]);

  if (isLoading) {
    return <PageLoading />;
  }

  if (error) {
    return (
      <div className="p-8 min-h-screen bg-page">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-extrabold text-primary mb-2">Dashboard</h1>
          <p className="text-lg text-primary mb-8">Visão geral da piscicultura e métricas importantes</p>
          
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-md text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Erro ao Carregar Dados
            </h2>
            
            <p className="text-gray-600 mb-6">
              {error.message || 'Erro ao carregar dados. Verifique se a API está rodando na porta 3001.'}
            </p>
            
            <div className="space-y-3">
              <button
                onClick={refresh}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
            
            <div className="mt-8 p-4 bg-gray-50 rounded-lg text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Para resolver:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Verifique se a API backend está rodando na porta 3001</li>
                <li>• Certifique-se de que o banco de dados está conectado</li>
                <li>• Verifique os logs da API para mais detalhes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-8 min-h-screen bg-page">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-extrabold text-primary mb-2">Dashboard</h1>
          <p className="text-lg text-primary mb-8">Visão geral da piscicultura e métricas importantes</p>
          
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-md text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Nenhum Dado Disponível
            </h2>
            <p className="text-gray-600">
              Não há dados para exibir no dashboard. Adicione tanques e dados para começar.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const metricas = calcularMetricas(dashboardData);
  const evolucaoPeso = processarEvolucaoPeso(dashboardData).map(d => ({
    ...d,
    data: formatarMesAno(d.data),
  }));
  const racaoPorTanque = processarRacaoPorTanque(dashboardData);

  const handleMetricClick = (metricName: string) => {
    // Rastrear clique em métrica no HotJar
    trackEvent('Dashboard Metric Clicked', {
      metricName,
      timestamp: new Date().toISOString(),
    });
  };

  const handleChartInteraction = (chartType: string, action: string) => {
    // Rastrear interação com gráficos no HotJar
    trackEvent('Dashboard Chart Interaction', {
      chartType,
      action,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="p-8 min-h-screen bg-page">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-extrabold text-primary mb-2">Dashboard</h1>
            <p className="text-lg text-primary">Visão geral da piscicultura e métricas importantes</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                trackEvent('Dashboard Refresh', { 
                  fromCache: isFromCache,
                  timestamp: new Date().toISOString()
                });
                refresh();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              🔄 Atualizar
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
          {metricas.map((m, i) => (
            <div 
              key={i} 
              className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col items-center shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => {
                trackEvent('Dashboard Metric Clicked', {
                  metricName: m.titulo,
                  metricValue: m.valor,
                  metricVariation: m.variacao,
                  timestamp: new Date().toISOString()
                });
              }}
            >
              <span className="text-sm text-primary font-semibold mb-1 text-center">{m.titulo}</span>
              <span className="text-2xl font-bold text-primary mb-2 text-center">{m.valor}</span>
              <span className={`text-xs font-semibold ${m.cor} text-center`}>{m.variacao}</span>
              <span className="text-xs text-gray-500 text-center">{m.descricao}</span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white rounded-2xl p-7 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-bold text-primary mb-4">Evolução da Biomassa (kg)</h2>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={evolucaoPeso}
                  margin={{ left: 40, right: 20, top: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="data" stroke={chartColors.primary} />
                  <YAxis stroke={chartColors.primary} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="atual" stroke={chartColors.secondary} strokeWidth={2} dot={{ fill: chartColors.secondary, strokeWidth: 2 }} name="Biomassa Atual" />
                  <Line type="monotone" dataKey="ideal" stroke={chartColors.primary} strokeWidth={2} dot={{ fill: chartColors.primary, strokeWidth: 2 }} name="Biomassa Projetada" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-7 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-bold text-primary mb-4">Uso de Ração por Tanque (kg)</h2>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={racaoPorTanque}
                  margin={{ left: 40, right: 20, top: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="tanque" stroke={chartColors.primary} />
                  <YAxis stroke={chartColors.primary} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                  <Bar dataKey="usada" fill={chartColors.secondary} name="Ração Usada" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 