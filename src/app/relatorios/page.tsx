export default function Relatorios() {
  return (
    <div className="p-8 min-h-screen bg-[#D9D9D9]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-[#042326] mb-1">Relatórios</h1>
        <p className="text-lg text-[#042326] mb-8">Relatórios e análises do desempenho da produção.</p>
        <h2 className="text-2xl font-bold text-[#042326] mb-2 mt-4">Produção</h2>
        <hr className="mb-6 border-[#042326]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-white border border-gray-200 rounded-2xl p-7 flex flex-col justify-between min-h-[160px] shadow-md hover:shadow-lg transition-shadow duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#042326] mb-1">Biomassa por Tanque</h3>
              <p className="text-sm text-[#042326] mb-4">Relatório detalhado da biomassa total em cada tanque</p>
            </div>
            <button className="bg-[#1D7373] text-white px-6 py-2 rounded font-semibold w-24 self-end hover:bg-[#155959] transition-colors">PDF</button>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-7 flex flex-col justify-between min-h-[160px] shadow-md hover:shadow-lg transition-shadow duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#042326] mb-1">Crescimento dos Peixes</h3>
              <p className="text-sm text-[#042326] mb-4">Análise do crescimento, comparando com as curvas ideais de crescimento.</p>
            </div>
            <button className="bg-[#1D7373] text-white px-6 py-2 rounded font-semibold w-24 self-end hover:bg-[#155959] transition-colors">PDF</button>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-7 flex flex-col justify-between min-h-[160px] shadow-md hover:shadow-lg transition-shadow duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#042326] mb-1">Relatório Geral</h3>
              <p className="text-sm text-[#042326] mb-4">Relatório de todas as informações da biometria semanal.</p>
            </div>
            <button className="bg-[#1D7373] text-white px-6 py-2 rounded font-semibold w-24 self-end hover:bg-[#155959] transition-colors">PDF</button>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-[#042326] mb-2 mt-4">Alimentação</h2>
        <hr className="mb-6 border-[#042326]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white border border-gray-200 rounded-2xl p-7 flex flex-col justify-between min-h-[160px] shadow-md hover:shadow-lg transition-shadow duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#042326] mb-1">Consumo de Ração</h3>
              <p className="text-sm text-[#042326] mb-4">Detalhamento do consumo de ração, tanque e período do mês.</p>
            </div>
            <button className="bg-[#1D7373] text-white px-6 py-2 rounded font-semibold w-24 self-end hover:bg-[#155959] transition-colors">PDF</button>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-7 flex flex-col justify-between min-h-[160px] shadow-md hover:shadow-lg transition-shadow duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#042326] mb-1">Taxa de Conversão Alimentar</h3>
              <p className="text-sm text-[#042326] mb-4">Análise da eficiência na conversão de ração em ganho de peso por tanque e espécie.</p>
            </div>
            <button className="bg-[#1D7373] text-white px-6 py-2 rounded font-semibold w-24 self-end hover:bg-[#155959] transition-colors">PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
} 