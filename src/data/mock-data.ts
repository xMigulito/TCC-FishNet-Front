import dadosJson from './dados.json';

// Interfaces para tipagem dos dados
export interface DadosTanque {
  id: number;
  nome: string;
  populacao: number;
  capacidade: number;
  peso: string;
  racao: string;
  temperatura: string;
  oxigenio: string;
}

export interface DadosGrafico {
  mes: string;
  biomassa: number;
  qualidadeAgua: number;
  mortalidade: number;
  fca: number;
  projecao: number;
  tanqueId: number;
}

export interface Metrica {
  titulo: string;
  valor: string;
  variacao: string;
  cor: string;
  descricao: string;
}

// Função para converter número do Excel para data
function excelDateToJSDate(excelDate: number) {
  const date = new Date((excelDate - 25569) * 86400 * 1000);
  return date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
}

// Função para gerar variação percentual
function gerarVariacao(valor: number, tanqueId: number, min: number, max: number): number {
  // Usa o ID do tanque para gerar uma variação consistente
  const seed = tanqueId * 0.1;
  const variacao = min + (seed * (max - min));
  return Number((valor * (1 + variacao)).toFixed(2));
}

// Função para processar os dados do JSON
function processarDados(): DadosGrafico[] {
  // Filtra apenas as linhas com dados válidos (remove cabeçalhos e linhas vazias)
  const linhasValidas = dadosJson.filter((linha: any) => {
    return typeof linha["CONTROLE DE BIOMETRIA"] === 'number' && 
           linha["__EMPTY_3"] !== undefined &&
           linha["__EMPTY_5"] !== undefined;
  });

  // Processa os dados para o formato dos gráficos
  const dadosProcessados = linhasValidas.flatMap((linha: any) => {
    // Dados base
    const biomassaTotal = Number((linha["__EMPTY_5"]).toFixed(2));
    const mortalidadeBase = linha["__EMPTY"] ? Number((linha["__EMPTY"] / linha["__EMPTY_1"] * 100).toFixed(2)) : 0;
    const fcaBase = linha["__EMPTY_11"] ? Number(linha["__EMPTY_11"].toFixed(2)) : 0;

    // Retorna um array com dados diferentes para cada tanque
    return [1, 2, 3, 4, 5, 6].map(tanqueId => {
      // Gera variações específicas para cada tanque
      const biomassa = gerarVariacao(biomassaTotal / 6, tanqueId, -0.2, 0.2); // Variação de -20% a +20%
      const mortalidade = gerarVariacao(mortalidadeBase, tanqueId, -0.3, 0.3); // Variação de -30% a +30%
      const fca = gerarVariacao(fcaBase, tanqueId, -0.15, 0.15); // Variação de -15% a +15%
      const qualidadeAgua = 7.0 + (tanqueId * 0.2); // Varia de 7.2 a 8.2

      return {
        mes: excelDateToJSDate(linha["CONTROLE DE BIOMETRIA"]),
        biomassa,
        qualidadeAgua,
        mortalidade,
        fca,
        projecao: Number((biomassa * 1.1).toFixed(2)), // Projeção baseada na biomassa específica do tanque
        tanqueId
      };
    });
  });

  return dadosProcessados;
}

// Dados processados para os gráficos
const todosOsDados = processarDados();

// Função para filtrar dados por tanque
export function filtrarDadosPorTanque(tanqueId: number): DadosGrafico[] {
  return todosOsDados.filter(dado => dado.tanqueId === tanqueId);
}

// Dados mockados dos tanques
export const tanques: DadosTanque[] = [
  { id: 1, nome: "Tanque 01", populacao: 240, capacidade: 300, peso: "180g", racao: "7.2kg", temperatura: "26.5°C", oxigenio: "7.2mg/L" },
  { id: 2, nome: "Tanque 02", populacao: 240, capacidade: 300, peso: "180g", racao: "7.2kg", temperatura: "26.5°C", oxigenio: "7.2mg/L" },
  { id: 3, nome: "Tanque 03", populacao: 240, capacidade: 300, peso: "180g", racao: "7.2kg", temperatura: "26.5°C", oxigenio: "7.2mg/L" },
  { id: 4, nome: "Tanque 04", populacao: 240, capacidade: 300, peso: "180g", racao: "7.2kg", temperatura: "26.5°C", oxigenio: "7.2mg/L" },
  { id: 5, nome: "Tanque 05", populacao: 240, capacidade: 300, peso: "180g", racao: "7.2kg", temperatura: "26.5°C", oxigenio: "7.2mg/L" },
  { id: 6, nome: "Tanque 06", populacao: 240, capacidade: 300, peso: "180g", racao: "7.2kg", temperatura: "26.5°C", oxigenio: "7.2mg/L" },
];

// Calcula as métricas com base nos dados mais recentes
const dadosMaisRecentes = todosOsDados[todosOsDados.length - 1];
const dadosAnteriores = todosOsDados[todosOsDados.length - 2];

function calcularVariacao(atual: number, anterior: number): string {
  const variacao = ((atual - anterior) / anterior) * 100;
  return `${variacao >= 0 ? '+' : ''}${variacao.toFixed(1)}%`;
}

export const metricas: Metrica[] = [
  {
    titulo: "Biomassa Total",
    valor: `${dadosMaisRecentes.biomassa.toFixed(1)} kg`,
    variacao: calcularVariacao(dadosMaisRecentes.biomassa, dadosAnteriores.biomassa),
    cor: dadosMaisRecentes.biomassa >= dadosAnteriores.biomassa ? "text-green-600" : "text-red-600",
    descricao: "desde o último mês"
  },
  {
    titulo: "Qualidade da Água",
    valor: `${dadosMaisRecentes.qualidadeAgua.toFixed(1)} pH`,
    variacao: calcularVariacao(dadosMaisRecentes.qualidadeAgua, dadosAnteriores.qualidadeAgua),
    cor: dadosMaisRecentes.qualidadeAgua >= dadosAnteriores.qualidadeAgua ? "text-green-600" : "text-red-600",
    descricao: "desde o último mês"
  },
  {
    titulo: "Taxa de Mortalidade",
    valor: `${dadosMaisRecentes.mortalidade.toFixed(1)}%`,
    variacao: calcularVariacao(dadosMaisRecentes.mortalidade, dadosAnteriores.mortalidade),
    cor: dadosMaisRecentes.mortalidade <= dadosAnteriores.mortalidade ? "text-green-600" : "text-red-600",
    descricao: "desde o último mês"
  },
  {
    titulo: "Conversão Alimentar",
    valor: dadosMaisRecentes.fca.toFixed(2),
    variacao: calcularVariacao(dadosMaisRecentes.fca, dadosAnteriores.fca),
    cor: dadosMaisRecentes.fca <= dadosAnteriores.fca ? "text-green-600" : "text-red-600",
    descricao: "desde o último mês"
  }
];

// Função para carregar dados do JSON
export function carregarDados<T>(nomeArquivo: string): T[] {
  try {
    const dados = require(`./${nomeArquivo}.json`);
    return dados;
  } catch (error) {
    console.error(`Erro ao carregar dados de ${nomeArquivo}:`, error);
    return [];
  }
}

// Exemplo de como usar os dados da planilha:
// export const dadosGraficos = carregarDados<DadosGrafico>('dados-graficos');
// export const tanques = carregarDados<DadosTanque>('dados-tanques');
// export const metricas = carregarDados<Metrica>('dados-metricas'); 