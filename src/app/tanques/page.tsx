"use client";

import { useEffect, useState } from "react";
import { fetchResumoTanques } from "@/api/api";

interface TanqueResumo {
  id: number;
  local?: string;
  capacidade?: number;
  capacidade_peixes?: number;
  populacao?: number | null;
  pesoMedio?: number | null;
  ultimaOxigenacao?: number | null;
  ultimaTemperatura?: number | null;
  ultimaRacao?: number | null;
}

export default function Tanques() {
  const [tanques, setTanques] = useState<TanqueResumo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function loadTanques() {
      try {
        const data = await fetchResumoTanques();
        console.log({
          id: data.id,
          local: data.Local,
          capacidade: data.Capacidade,
          capacidade_peixes: data.Capacidade ? Math.round(data.Capacidade * 7) : null,
          populacao: data.populacao,
          pesoMedio: data.pesoMedio,
          ultimaOxigenacao: data.ultimaOxigenacao,
          ultimaTemperatura: data.ultimaTemperatura,
          ultimaRacao: data.ultimaRacao,
        });
        setTanques(data);
      } catch {
        setErro("Erro ao carregar tanques");
      } finally {
        setIsLoading(false);
      }
    }
    loadTanques();
  }, []);

  if (isLoading) {
    return <div className="p-8">Carregando tanques...</div>;
  }

  if (erro) {
    return <div className="p-8 text-red-600">{erro}</div>;
  }

  return (
    <div className="p-8 min-h-screen bg-page">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-extrabold text-primary">Tanques</h1>
            <p className="text-lg text-primary mt-1">Visão geral da piscicultura e métricas importantes</p>
          </div>
          <button className="bg-secondary text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-secondary/80 transition-colors">+ Novo Tanque</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {tanques.map((tanque) => (
            <div key={tanque.id} className="bg-white border border-gray-200 rounded-2xl p-7 flex flex-col justify-between min-h-[220px] shadow-md hover:shadow-lg transition-shadow duration-300">
              <div>
                <h2 className="text-xl font-bold text-primary mb-1">{tanque.local || `Tanque ${tanque.id}`}</h2>
                {/* Barra de capacidade visual */}
                <div className="w-full h-5 bg-gray-200 rounded-full mb-3 relative overflow-hidden border border-gray-300">
                  <div
                    className="h-5 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      width: tanque.capacidade_peixes && tanque.populacao ? `${Math.min((tanque.populacao / tanque.capacidade_peixes) * 100, 100)}%` : '0%',
                      background: 'linear-gradient(90deg, var(--secondary) 0%, var(--accent) 100%)',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                    }}
                  />
                  <div className="absolute w-full h-full flex items-center justify-center">
                    <span className="font-bold text-white drop-shadow text-sm select-none">
                      {tanque.populacao !== undefined && tanque.populacao !== null
                        ? Number(tanque.populacao).toLocaleString('pt-BR', { maximumFractionDigits: 0 })
                        : "-"}
                      <span className="text-xs font-normal text-gray-100/80">
                        / {tanque.capacidade_peixes !== undefined && tanque.capacidade_peixes !== null
                          ? Number(tanque.capacidade_peixes).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
                          : "-"}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-primary mt-2">
                  <div>Peso Médio<br /><span className="font-bold">{tanque.pesoMedio ? `${tanque.pesoMedio} g` : "-"}</span></div>
                  <div>Ração Diária<br /><span className="font-bold">{tanque.ultimaRacao ? `${tanque.ultimaRacao} kg` : "-"}</span></div>
                  <div>Temperatura<br /><span className="font-bold">{tanque.ultimaTemperatura ? `${tanque.ultimaTemperatura} °C` : "-"}</span></div>
                  <div>Oxigênio<br /><span className="font-bold">{tanque.ultimaOxigenacao ? `${tanque.ultimaOxigenacao} mg/L` : "-"}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 