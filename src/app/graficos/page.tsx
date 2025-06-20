'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { filtrarDadosPorTanque, tanques } from '@/data/mock-data';

const chartColors = {
  biomassa: 'var(--primary)',
  qualidadeAgua: 'var(--secondary)',
  mortalidade: 'var(--primary)',
  fca: 'var(--secondary)',
  projecao: 'var(--primary)',
  grid: 'var(--grid)',
  axis: 'var(--primary)',
};

export default function Graficos() {
  const [tanqueSelecionado, setTanqueSelecionado] = useState(tanques[0].id);
  const [dadosGraficos, setDadosGraficos] = useState(filtrarDadosPorTanque(tanques[0].id));

  const handleTanqueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const novoTanque = Number(event.target.value);
    setTanqueSelecionado(novoTanque);
    setDadosGraficos(filtrarDadosPorTanque(novoTanque));
  };

  return (
    <div className="p-8 min-h-screen bg-page">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-primary">Gráficos</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="tanque" className="text-sm font-medium text-primary">
                Selecione o Tanque:
              </label>
              <select
                id="tanque"
                value={tanqueSelecionado}
                onChange={handleTanqueChange}
                className="block w-48 rounded-lg border-secondary py-2 pl-3 pr-10 text-base focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm bg-white shadow-sm"
              >
                {tanques.map((tanque) => (
                  <option key={tanque.id} value={tanque.id}>
                    {tanque.nome}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-sm text-primary">
              Última atualização: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Evolução da Biomassa */}
          <div className="bg-white p-7 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-bold text-primary mb-4">Evolução da Biomassa</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosGraficos}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="mes" stroke={chartColors.axis} />
                  <YAxis stroke={chartColors.axis} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="biomassa" 
                    stroke={chartColors.biomassa}
                    strokeWidth={2}
                    dot={{ fill: chartColors.biomassa, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                    name="Biomassa (kg)" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Qualidade da Água */}
          <div className="bg-white p-7 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-bold text-primary mb-4">Qualidade da Água</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosGraficos}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="mes" stroke={chartColors.axis} />
                  <YAxis stroke={chartColors.axis} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="qualidadeAgua" 
                    stroke={chartColors.qualidadeAgua}
                    strokeWidth={2}
                    dot={{ fill: chartColors.qualidadeAgua, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                    name="Qualidade (pH)" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Taxa de Mortalidade */}
          <div className="bg-white p-7 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-bold text-primary mb-4">Taxa de Mortalidade</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosGraficos}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="mes" stroke={chartColors.axis} />
                  <YAxis stroke={chartColors.axis} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="mortalidade" 
                    stroke={chartColors.mortalidade}
                    strokeWidth={2}
                    dot={{ fill: chartColors.mortalidade, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                    name="Mortalidade (%)" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fator de Conversão Alimentar */}
          <div className="bg-white p-7 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-bold text-primary mb-4">Fator de Conversão Alimentar</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosGraficos}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="mes" stroke={chartColors.axis} />
                  <YAxis stroke={chartColors.axis} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="fca" 
                    stroke={chartColors.fca}
                    strokeWidth={2}
                    dot={{ fill: chartColors.fca, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                    name="FCA" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Projeção de Biomassa */}
          <div className="bg-white p-7 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 md:col-span-2">
            <h2 className="text-xl font-bold text-primary mb-4">Projeção de Biomassa</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosGraficos}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="mes" stroke={chartColors.axis} />
                  <YAxis stroke={chartColors.axis} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="projecao" 
                    stroke={chartColors.projecao}
                    strokeWidth={2}
                    dot={{ fill: chartColors.projecao, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                    name="Projeção (kg)" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 