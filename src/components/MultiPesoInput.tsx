"use client";

import { useState, useEffect } from "react";

interface PesoMedicao {
  id: string;
  descricao: string;
  peso: string;
  peixesCapturados: string;
}

interface MultiPesoInputProps {
  onPesoCalculado: (pesoMedio: number, totalPeixes: number) => void;
  initialMedicoes?: PesoMedicao[];
}

export default function MultiPesoInput({ onPesoCalculado, initialMedicoes = [] }: MultiPesoInputProps) {
  const [medicoes, setMedicoes] = useState<PesoMedicao[]>(() => {
    if (initialMedicoes.length > 0) {
      return initialMedicoes;
    }
    // Inicializar com uma medição padrão
    return [
      {
        id: "1",
        descricao: "Início",
        peso: "",
        peixesCapturados: ""
      }
    ];
  });

  // Calcular média automaticamente sempre que as medições mudarem
  useEffect(() => {
    const medicoesValidas = medicoes.filter(m => 
      m.peso && m.peixesCapturados && 
      parseFloat(m.peso) > 0 && parseFloat(m.peixesCapturados) > 0
    );

    if (medicoesValidas.length > 0) {
      // Calcular peso médio ponderado pelo número de peixes
      let pesoTotal = 0;
      let totalPeixes = 0;

      medicoesValidas.forEach(medicao => {
        const peso = parseFloat(medicao.peso);
        const peixes = parseFloat(medicao.peixesCapturados);
        pesoTotal += peso * peixes;
        totalPeixes += peixes;
      });

      const pesoMedio = totalPeixes > 0 ? pesoTotal / totalPeixes : 0;
      onPesoCalculado(pesoMedio, totalPeixes);
    } else {
      onPesoCalculado(0, 0);
    }
  }, [medicoes, onPesoCalculado]);

  const adicionarMedicao = () => {
    const novaMedicao: PesoMedicao = {
      id: Date.now().toString(),
      descricao: `Medição ${medicoes.length + 1}`,
      peso: "",
      peixesCapturados: ""
    };
    setMedicoes([...medicoes, novaMedicao]);
  };

  const removerMedicao = (id: string) => {
    if (medicoes.length > 1) {
      setMedicoes(medicoes.filter(m => m.id !== id));
    }
  };

  const atualizarMedicao = (id: string, campo: keyof PesoMedicao, valor: string) => {
    setMedicoes(medicoes.map(m => 
      m.id === id ? { ...m, [campo]: valor } : m
    ));
  };

  const calcularPesoMedio = () => {
    const medicoesValidas = medicoes.filter(m => 
      m.peso && m.peixesCapturados && 
      parseFloat(m.peso) > 0 && parseFloat(m.peixesCapturados) > 0
    );

    if (medicoesValidas.length === 0) return 0;

    let pesoTotal = 0;
    let totalPeixes = 0;

    medicoesValidas.forEach(medicao => {
      const peso = parseFloat(medicao.peso);
      const peixes = parseFloat(medicao.peixesCapturados);
      pesoTotal += peso * peixes;
      totalPeixes += peixes;
    });

    return totalPeixes > 0 ? pesoTotal / totalPeixes : 0;
  };

  const calcularTotalPeixes = () => {
    return medicoes.reduce((total, m) => {
      const peixes = parseFloat(m.peixesCapturados) || 0;
      return total + peixes;
    }, 0);
  };

  const pesoMedio = calcularPesoMedio();
  const totalPeixes = calcularTotalPeixes();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary">Medições de Peso</h3>
        <button
          type="button"
          onClick={adicionarMedicao}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
        >
          + Adicionar Medição
        </button>
      </div>

      <div className="space-y-3">
        {medicoes.map((medicao, index) => (
          <div key={medicao.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-700">
                {medicao.descricao}
              </h4>
              {medicoes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removerMedicao(medicao.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remover
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  value={medicao.descricao}
                  onChange={(e) => atualizarMedicao(medicao.id, 'descricao', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                  placeholder="Ex: Início, Meio, Fim"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (g)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={medicao.peso}
                  onChange={(e) => atualizarMedicao(medicao.id, 'peso', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                  placeholder="Ex: 150.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peixes Capturados
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={medicao.peixesCapturados}
                  onChange={(e) => atualizarMedicao(medicao.id, 'peixesCapturados', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                  placeholder="Ex: 10"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumo dos cálculos */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">Resumo dos Cálculos</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700 font-medium">Total de Peixes:</span>
            <span className="ml-2 text-blue-900">{totalPeixes.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Peso Médio:</span>
            <span className="ml-2 text-blue-900">{pesoMedio.toFixed(2)} g</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-blue-600">
          * O peso médio é calculado considerando o número de peixes em cada medição
        </div>
      </div>
    </div>
  );
}
