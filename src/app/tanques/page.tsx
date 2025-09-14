"use client";

import { useEffect, useState } from "react";
import { fetchResumoTanques, desalojarTanque } from "@/api/api";
import NovoTanqueModal from "@/components/NovoTanqueModal";
import BiometriaModal from "@/components/BiometriaModal";
import BiometriaSemanalModal from "@/components/BiometriaSemanalModal";
import AlojamentoModal from "@/components/AlojamentoModal";
import { useHotJar } from "@/hooks/useHotJar";

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
  ultimaPh?: number | null;
  mortesSemanais?: number | null;
  fca?: number | null;
  alojado?: boolean;
  alojamentoId?: number | null;
}

function getStatus(valor: number | null | undefined, tipo: string) {
  if (valor === undefined || valor === null || isNaN(valor)) return { texto: 'Indefinido', cor: 'bg-gray-200 text-gray-600' };
  if (tipo === 'fca') {
    if (valor < 1.4) return { texto: 'Excelente', cor: 'bg-green-100 text-green-700' };
    if (valor >= 1.4 && valor <= 1.8) return { texto: 'Regular', cor: 'bg-yellow-100 text-yellow-700' };
    return { texto: 'Ruim', cor: 'bg-red-100 text-red-700' };
  }
  if (tipo === 'oxigenacao') {
    if (valor >= 6 && valor <= 6.5) return { texto: 'Ótimo', cor: 'bg-green-100 text-green-700' };
    if (valor >= 5 && valor < 6) return { texto: 'Adequado', cor: 'bg-blue-100 text-blue-700' };
    if (valor >= 3 && valor < 5) return { texto: 'Atenção', cor: 'bg-yellow-100 text-yellow-700' };
    return { texto: 'Crítico', cor: 'bg-red-100 text-red-700' };
  }
  if (tipo === 'ph') {
    if (valor >= 6 && valor <= 8.5) return { texto: 'Ideal', cor: 'bg-green-100 text-green-700' };
    if ((valor >= 4.5 && valor < 6) || (valor > 8.5 && valor <= 10.5)) return { texto: 'Atenção', cor: 'bg-yellow-100 text-yellow-700' };
    return { texto: 'Crítico', cor: 'bg-red-100 text-red-700' };
  }
  if (tipo === 'peso') {
    console.log(valor, tipo);
    if (valor >= 0.800) return { texto: 'Excelente', cor: 'bg-green-100 text-green-700' };
    if (valor >= 0.500) return { texto: 'Regular', cor: 'bg-yellow-100 text-yellow-700' };
    return { texto: 'Ruim', cor: 'bg-red-100 text-red-700' };
  }
  if (tipo === 'mortes') {
    if (valor <= 2) return { texto: 'Excelente', cor: 'bg-green-100 text-green-700' };
    if (valor <= 5) return { texto: 'Regular', cor: 'bg-yellow-100 text-yellow-700' };
    return { texto: 'Ruim', cor: 'bg-red-100 text-red-700' };
  }
  if (tipo === 'preco') {
    if (valor <= 6) return { texto: 'Excelente', cor: 'bg-green-100 text-green-700' };
    if (valor <= 8) return { texto: 'Regular', cor: 'bg-yellow-100 text-yellow-700' };
    return { texto: 'Ruim', cor: 'bg-red-100 text-red-700' };
  }
  return { texto: 'Indefinido', cor: 'bg-gray-200 text-gray-600' };
}

export default function Tanques() {
  const [tanques, setTanques] = useState<TanqueResumo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [showNovoTanqueModal, setShowNovoTanqueModal] = useState(false);
  const { trackEvent, trackPageView } = useHotJar();
  const [showBiometriaModal, setShowBiometriaModal] = useState(false);
  const [showBiometriaSemanalModal, setShowBiometriaSemanalModal] = useState(false);
  const [showAlojamentoModal, setShowAlojamentoModal] = useState(false);
  const [selectedTanqueId, setSelectedTanqueId] = useState<number | null>(null);

  useEffect(() => {
    loadTanques();
    trackPageView('Tanques');
  }, [trackPageView]);

  async function loadTanques() {
    try {
      console.log('🔄 Carregando tanques...');
      const data = await fetchResumoTanques();
      console.log('📊 Dados recebidos da API:', data);
      console.log('📊 Tipo dos dados:', typeof data);
      console.log('📊 É array?', Array.isArray(data));
      console.log('📊 Quantidade de tanques:', Array.isArray(data) ? data.length : 'N/A');
      
      setTanques(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Erro ao carregar tanques:', error);
      setErro("Erro ao carregar tanques");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDesalojar(alojamentoId: number) {
    try {
      await desalojarTanque(alojamentoId);
      await loadTanques(); // Recarregar dados
      
      // Rastrear desalojamento
      trackEvent('Tank Unhoused', {
        alojamentoId: alojamentoId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao desalojar:', error);
      setErro("Erro ao desalojar tanque");
      
      // Rastrear erro no desalojamento
      trackEvent('Tank Unhouse Error', {
        alojamentoId: alojamentoId,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

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
          <button 
            onClick={() => {
              trackEvent('New Tank Button Clicked', {
                page: 'tanques',
                timestamp: new Date().toISOString()
              });
              setShowNovoTanqueModal(true);
            }}
            className="bg-secondary text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-secondary/80 transition-colors"
          >
            + Novo Tanque
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {tanques.map((tanque) => {
            const fca = tanque.fca ?? null;
            const oxigenacao = tanque.ultimaOxigenacao ?? null;
            const ph = tanque.ultimaPh ?? null;
            const mortes = tanque.mortesSemanais ?? null;
            const pesoMedio = tanque.pesoMedio ?? null;
            const ultimaAtualizacao = new Date().toLocaleString('pt-BR');

            const statusFCA = getStatus(fca, 'fca');
            const statusOxigenacao = getStatus(oxigenacao, 'oxigenacao');
            const statusPH = getStatus(ph, 'ph');
            const statusMortes = getStatus(mortes, 'mortes');
            const statusPeso = getStatus(pesoMedio, 'peso');

            return (
              <div key={tanque.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md flex flex-col gap-2 min-w-[280px] relative">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-lg text-primary">{tanque.local || `Tanque ${tanque.id}`}</div>
                  {tanque.alojado && (
                    <button
                      onClick={() => tanque.alojamentoId && handleDesalojar(tanque.alojamentoId)}
                      className="bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-800 transition-colors p-2 rounded-full border border-red-300"
                      title="Desalojar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
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
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">🍏 FCA: <span className="font-bold">{fca ?? '-'}</span></span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusFCA.cor}`}>{statusFCA.texto}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">🫧 Oxigenação(mg/L): <span className="font-bold">{oxigenacao ?? '-'}</span></span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusOxigenacao.cor}`}>{statusOxigenacao.texto}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">🧪 pH: <span className="font-bold">{ph ?? '-'}</span></span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusPH.cor}`}>{statusPH.texto}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">💀 Mortes semanais: <span className="font-bold">{mortes ?? '-'} peixes</span></span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusMortes.cor}`}>{statusMortes.texto}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">⚖️ Peso médio: <span className="font-bold">{pesoMedio ? `${Number(pesoMedio).toFixed(1)}g` : '-'}</span></span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusPeso.cor}`}>{statusPeso.texto}</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Última atualização: {ultimaAtualizacao}
                </div>
                <div className="flex gap-2 mt-3 min-h-[40px]">
                  {!tanque.alojado ? (
                    <button
                      onClick={() => {
                        trackEvent('Tank House Button Clicked', {
                          tanqueId: tanque.id,
                          tanqueLocal: tanque.local,
                          timestamp: new Date().toISOString()
                        });
                        setSelectedTanqueId(tanque.id);
                        setShowAlojamentoModal(true);
                      }}
                      className="flex-1 bg-primary text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-primary/80 transition-colors"
                    >
                      + Alojamento
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          trackEvent('Daily Biometry Button Clicked', {
                            tanqueId: tanque.id,
                            tanqueLocal: tanque.local,
                            timestamp: new Date().toISOString()
                          });
                          setSelectedTanqueId(tanque.id);
                          setShowBiometriaModal(true);
                        }}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors relative z-10"
                      >
                        + Biometria Diária
                      </button>
                      <button
                        onClick={() => {
                          trackEvent('Weekly Biometry Button Clicked', {
                            tanqueId: tanque.id,
                            tanqueLocal: tanque.local,
                            timestamp: new Date().toISOString()
                          });
                          setSelectedTanqueId(tanque.id);
                          setShowBiometriaSemanalModal(true);
                        }}
                        className="flex-1 bg-secondary text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-secondary/80 transition-colors relative z-10 border border-secondary/20"
                      >
                        + Biometria Semanal
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <NovoTanqueModal
        isOpen={showNovoTanqueModal}
        onClose={() => setShowNovoTanqueModal(false)}
        onSuccess={loadTanques}
      />

      <BiometriaModal
        isOpen={showBiometriaModal}
        onClose={() => setShowBiometriaModal(false)}
        onSuccess={loadTanques}
        tanqueId={selectedTanqueId || 0}
      />

      <AlojamentoModal
        isOpen={showAlojamentoModal}
        onClose={() => setShowAlojamentoModal(false)}
        onSuccess={loadTanques}
        tanqueId={selectedTanqueId || 0}
      />

      <BiometriaSemanalModal
        isOpen={showBiometriaSemanalModal}
        onClose={() => setShowBiometriaSemanalModal(false)}
        onSuccess={loadTanques}
        tanqueId={selectedTanqueId || 0}
      />
    </div>
  );
} 