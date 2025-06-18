"use client";

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

const metricas = [
  {
    titulo: "Peso Médio Atual",
    valor: "180g",
    variacao: "+12,5%",
    cor: "text-green-600",
    descricao: "desde o último mês",
  },
  {
    titulo: "Consumo de Ração",
    valor: "45kg",
    variacao: "+3,5%",
    cor: "text-green-600",
    descricao: "desde o último mês",
  },
  {
    titulo: "População Total",
    valor: "2.400",
    variacao: "-1,5%",
    cor: "text-red-600",
    descricao: "desde o último mês",
  },
  {
    titulo: "Biomassa Total",
    valor: "1284.5 kg",
    variacao: "+3,5%",
    cor: "text-green-600",
    descricao: "desde o último mês",
  },
];

const evolucaoPeso = [
  { data: "10 de dez.", atual: 60, ideal: 70 },
  { data: "9 de jan.", atual: 62, ideal: 75 },
  { data: "8 de fev.", atual: 65, ideal: 80 },
  { data: "10 de mar.", atual: 70, ideal: 90 },
  { data: "9 de abr.", atual: 80, ideal: 100 },
  { data: "8 de mai.", atual: 90, ideal: 110 },
  { data: "8 de jun.", atual: 100, ideal: 120 },
];

const racaoPorTanque = [
  { tanque: "Tanque 1", usada: 120, projetada: 140 },
  { tanque: "Tanque 2", usada: 150, projetada: 160 },
  { tanque: "Tanque 3", usada: 90, projetada: 110 },
  { tanque: "Tanque 4", usada: 200, projetada: 180 },
  { tanque: "Tanque 5", usada: 170, projetada: 200 },
  { tanque: "Tanque 6", usada: 110, projetada: 130 },
];

export default function Dashboard() {
  return (
    <div className="p-8 min-h-screen bg-[#D9D9D9]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-[#042326] mb-2">Dashboard</h1>
        <p className="text-lg text-[#042326] mb-8">Visão geral da piscicultura e métricas importantes</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {metricas.map((m, i) => (
            <div key={i} className="bg-white rounded-2xl p-7 border border-gray-200 flex flex-col items-center shadow-md hover:shadow-lg transition-shadow duration-300">
              <span className="text-lg text-[#042326] font-semibold mb-1">{m.titulo}</span>
              <span className="text-3xl font-bold text-[#042326] mb-2">{m.valor}</span>
              <span className={`text-sm font-semibold ${m.cor}`}>{m.variacao}</span>
              <span className="text-xs text-gray-500">{m.descricao}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white rounded-2xl p-7 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-bold text-[#042326] mb-4">Evolução do Peso Médio (g)</h2>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolucaoPeso}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="data" stroke="#042326" />
                  <YAxis stroke="#042326" />
                  <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="atual" stroke="#1D7373" strokeWidth={2} dot={{ fill: '#1D7373', strokeWidth: 2 }} name="Peso Atual" />
                  <Line type="monotone" dataKey="ideal" stroke="#042326" strokeWidth={2} dot={{ fill: '#042326', strokeWidth: 2 }} name="Peso Ideal" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-7 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-bold text-[#042326] mb-4">Uso de Ração por Tanque (kg/semana)</h2>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={racaoPorTanque}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="tanque" stroke="#042326" />
                  <YAxis stroke="#042326" />
                  <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                  <Bar dataKey="usada" fill="#1D7373" name="Ração Usada" />
                  <Bar dataKey="projetada" fill="#042326" name="Ração Projetada" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 