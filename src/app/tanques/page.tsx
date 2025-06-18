"use client";

const tanques = [
  { id: 1, nome: "Tanque 01", populacao: 240, capacidade: 300, peso: "180g", racao: "7.2kg", temperatura: "26.5°C", oxigenio: "7.2mg/L" },
  { id: 2, nome: "Tanque 02", populacao: 240, capacidade: 300, peso: "180g", racao: "7.2kg", temperatura: "26.5°C", oxigenio: "7.2mg/L" },
  { id: 3, nome: "Tanque 03", populacao: 240, capacidade: 300, peso: "180g", racao: "7.2kg", temperatura: "26.5°C", oxigenio: "7.2mg/L" },
  { id: 4, nome: "Tanque 04", populacao: 240, capacidade: 300, peso: "180g", racao: "7.2kg", temperatura: "26.5°C", oxigenio: "7.2mg/L" },
  { id: 5, nome: "Tanque 05", populacao: 240, capacidade: 300, peso: "180g", racao: "7.2kg", temperatura: "26.5°C", oxigenio: "7.2mg/L" },
  { id: 6, nome: "Tanque 06", populacao: 240, capacidade: 300, peso: "180g", racao: "7.2kg", temperatura: "26.5°C", oxigenio: "7.2mg/L" },
];

export default function Tanques() {
  return (
    <div className="p-8 min-h-screen bg-[#D9D9D9]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-extrabold text-[#042326]">Tanques</h1>
            <p className="text-lg text-[#042326] mt-1">Visão geral da piscicultura e métricas importantes</p>
          </div>
          <button className="bg-[#1D7373] text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-[#155959] transition-colors">+ Novo Tanque</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {tanques.map((tanque) => (
            <div key={tanque.id} className="bg-white border border-gray-200 rounded-2xl p-7 flex flex-col justify-between min-h-[220px] shadow-md hover:shadow-lg transition-shadow duration-300">
              <div>
                <h2 className="text-xl font-bold text-[#042326] mb-1">{tanque.nome}</h2>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[#042326]">População</span>
                  <span className="text-[#1D7373] font-semibold">{tanque.populacao} <span className="text-gray-500 font-normal">/ {tanque.capacidade}</span></span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mb-3">
                  <div
                    className="h-2 rounded-full"
                    style={{ width: `${(tanque.populacao / tanque.capacidade) * 100}%`, background: 'linear-gradient(90deg, #1D7373 70%, #42e695 100%)' }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-[#042326]">
                  <div>Peso Médio<br /><span className="font-bold">{tanque.peso}</span></div>
                  <div>Ração Diária<br /><span className="font-bold">{tanque.racao}</span></div>
                  <div>Temperatura<br /><span className="font-bold">{tanque.temperatura}</span></div>
                  <div>Oxigênio<br /><span className="font-bold">{tanque.oxigenio}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 