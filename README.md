# FishNet - Sistema de Gestão de Piscicultura

## Descrição

O FishNet é um sistema completo para gestão de piscicultura, permitindo o controle de tanques, alojamentos e biometrias diárias e semanais.

## Funcionalidades

### 1. Gestão de Tanques
- **Cadastro de Tanques**: Crie novos tanques informando local, largura e comprimento
- **Visualização**: Veja todos os tanques com métricas em tempo real
- **Métricas**: Capacidade, população atual, FCA, oxigenação, pH, mortes semanais e peso médio

### 2. Gestão de Alojamentos
- **Novo Alojamento**: Cadastre alojamentos de peixes nos tanques
- **Dados**: Total de peixes, peso médio inicial, biomassa inicial
- **Controle**: Acompanhe alojamentos ativos e finalizados

### 3. Biometrias Diárias
- **Inserção**: Registre dados diários de cada tanque
- **Parâmetros**: Ração, temperatura da água, pH, temperatura ambiente, oxigenação
- **Histórico**: Mantenha histórico completo das medições

### 4. Biometrias Semanais
- **Controle Semanal**: Registre biometrias semanais
- **Dados**: Peixes mortos, peixes capturados, peso, biomassa total
- **Períodos**: Defina períodos de abertura e fechamento

## Como Usar

### 1. Cadastrar um Tanque
1. Acesse a página "Tanques"
2. Clique em "+ Novo Tanque"
3. Preencha:
   - **Local**: Nome ou identificação do tanque
   - **Largura**: Largura em metros
   - **Comprimento**: Comprimento em metros
4. Clique em "Cadastrar"

### 2. Criar um Alojamento
1. Na página "Tanques", clique em "+ Alojamento" no tanque desejado
2. Preencha:
   - **Data de Alojamento**: Data de início
   - **Total de Peixes**: Quantidade de peixes
   - **Peso Médio Inicial**: Peso médio em gramas
   - **Biomassa Inicial**: Biomassa total em kg
   - **Cooperativa ID**: ID da cooperativa (padrão: 1)
3. Clique em "Cadastrar"

### 3. Inserir Biometria Diária
1. Na página "Tanques", clique em "+ Biometria" no tanque desejado
2. Selecione o alojamento ativo
3. Preencha:
   - **Data**: Data da medição
   - **Ração**: Quantidade de ração em kg
   - **Temperatura da Água**: Temperatura em °C
   - **pH**: Valor do pH
   - **Temperatura Ambiente**: Descrição (ex: Quente, Frio, Ameno)
   - **Oxigenação**: Valor em mg/L
4. Clique em "Inserir"

### 4. Inserir Biometria Semanal
1. Na página "Tanques", clique em "+ Biometria Semanal" no tanque desejado
2. Selecione o alojamento ativo
3. Preencha:
   - **Data de Alojamento**: Data de referência
   - **Peixes Mortos**: Quantidade de peixes mortos
   - **Peixes Capturados**: Quantidade capturada
   - **Peso**: Peso médio em gramas
   - **Biomassa Total**: Biomassa total em kg
   - **Data de Abertura**: Início do período
   - **Data de Fechamento**: Fim do período
4. Clique em "Inserir"

## Métricas e Indicadores

### FCA (Fator de Conversão Alimentar)
- **Excelente**: < 1.4
- **Regular**: 1.4 - 1.8
- **Ruim**: > 1.8

### Oxigenação
- **Ótimo**: 6.0 - 6.5 mg/L
- **Adequado**: 5.0 - 6.0 mg/L
- **Atenção**: 3.0 - 5.0 mg/L
- **Crítico**: < 3.0 mg/L

### pH
- **Ideal**: 6.0 - 8.5
- **Atenção**: 4.5 - 6.0 ou 8.5 - 10.5
- **Crítico**: < 4.5 ou > 10.5

### Peso Médio
- **Excelente**: ≥ 800g
- **Regular**: 500 - 800g
- **Ruim**: < 500g

### Mortes Semanais
- **Excelente**: ≤ 2 peixes
- **Regular**: 3 - 5 peixes
- **Ruim**: > 5 peixes

## Tecnologias Utilizadas

### Frontend
- **Next.js 14**: Framework React
- **TypeScript**: Linguagem de programação
- **Tailwind CSS**: Framework CSS
- **Axios**: Cliente HTTP

### Backend
- **NestJS**: Framework Node.js
- **Prisma**: ORM para banco de dados
- **PostgreSQL**: Banco de dados
- **TypeScript**: Linguagem de programação

## Estrutura do Projeto

```
TCC-FishNet-Front/
├── src/
│   ├── app/                 # Páginas da aplicação
│   ├── components/          # Componentes reutilizáveis
│   ├── api/                # Configuração da API
│   └── contexts/           # Contextos React
└── public/                 # Arquivos estáticos

TCC-Fishnet-API/
├── src/
│   ├── tanque/             # Módulo de tanques
│   ├── tanque-alojamento/  # Módulo de alojamentos
│   ├── biometria-diaria/   # Módulo de biometrias diárias
│   ├── biometria-semanal/  # Módulo de biometrias semanais
│   └── dashboard/          # Módulo do dashboard
└── prisma/                 # Schema e migrações do banco
```

## Instalação e Execução

### Backend
```bash
cd TCC-Fishnet-API
npm install
npm run start:dev
```

### Frontend
```bash
cd TCC-FishNet-Front
npm install
npm run dev
```

## Configuração do Banco de Dados

1. Configure a variável `DATABASE_URL` no arquivo `.env`
2. Execute as migrações:
```bash
npx prisma migrate dev
```

## Contribuição

Para contribuir com o projeto:
1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

## Licença

Este projeto é parte de um Trabalho de Conclusão de Curso (TCC).
