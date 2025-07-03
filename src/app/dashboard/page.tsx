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
import { fetchDashBoardInfo } from '@/api/api';

interface DadosTanque {
  mes: string;
  biomassa: number;
  fca: number;
  mortalidade: number;
  projecao: number;
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
  });

  const dadosPenultimoMes = data.map(tanque => {
    const dadosTanque = tanque.dados;
    return dadosTanque[dadosTanque.length - 2];
  });

  const biomassaTotal = dadosUltimoMes.reduce((acc, curr) => acc + curr.biomassa, 0);
  const biomassaTotalAnterior = dadosPenultimoMes.reduce((acc, curr) => acc + curr.biomassa, 0);
  const variacaoBiomassa = ((biomassaTotal - biomassaTotalAnterior) / biomassaTotalAnterior) * 100;

  const fcaMedio = dadosUltimoMes.reduce((acc, curr) => acc + curr.fca, 0) / dadosUltimoMes.length;
  const fcaMedioAnterior = dadosPenultimoMes.reduce((acc, curr) => acc + curr.fca, 0) / dadosPenultimoMes.length;
  const variacaoFca = ((fcaMedio - fcaMedioAnterior) / fcaMedioAnterior) * 100;

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
      titulo: "Qualidade da Água",
      valor: "7.5 pH",
      variacao: "+0.2%",
      cor: "text-green-600",
      descricao: "desde o último mês",
    },
    {
      titulo: "Taxa de Mortalidade",
      valor: `${dadosUltimoMes[0].mortalidade.toFixed(1)}%`,
      variacao: "-0.5%",
      cor: "text-green-600",
      descricao: "desde o último mês",
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
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<Tanque[] | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchDashBoardInfo();
        setDashboardData(data);
      } catch {
        setDashboardData(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return <PageLoading />;
  }

  if (!dashboardData) {
    return <div className="p-8">Erro ao carregar dados do dashboard.</div>;
  }

  const metricas = calcularMetricas(dashboardData);
  const evolucaoPeso = processarEvolucaoPeso(dashboardData).map(d => ({
    ...d,
    data: formatarMesAno(d.data),
  }));
  const racaoPorTanque = processarRacaoPorTanque(dashboardData);

  return (
    <div className="p-8 min-h-screen bg-page">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-primary mb-2">Dashboard</h1>
        <p className="text-lg text-primary mb-8">Visão geral da piscicultura e métricas importantes</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {metricas.map((m, i) => (
            <div key={i} className="bg-white rounded-2xl p-7 border border-gray-200 flex flex-col items-center shadow-md hover:shadow-lg transition-shadow duration-300">
              <span className="text-lg text-primary font-semibold mb-1">{m.titulo}</span>
              <span className="text-3xl font-bold text-primary mb-2">{m.valor}</span>
              <span className={`text-sm font-semibold ${m.cor}`}>{m.variacao}</span>
              <span className="text-xs text-gray-500">{m.descricao}</span>
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