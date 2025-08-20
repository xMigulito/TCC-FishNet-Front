# Instruções de Instalação - Frontend FishNet

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Backend FishNet rodando (ver INSTALACAO.md do backend)

## Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar API

O frontend está configurado para se conectar ao backend na porta 3001. Se necessário, altere a URL da API no arquivo `src/api/api.ts`:

```typescript
const EXTERNAL_API_URL = 'http://localhost:3001/dashboard';
const TANQUES_API_URL = 'http://localhost:3001/tanque';
const TANQUES_RESUMO_API_URL = 'http://localhost:3001/tanque/resumo';
```

## Execução

### Desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:3000`

### Produção

```bash
npm run build
npm run start
```

## Funcionalidades Implementadas

### 1. Página de Tanques (`/tanques`)
- **Visualização**: Cards com informações dos tanques
- **Métricas**: FCA, oxigenação, pH, mortes semanais, peso médio
- **Ações**:
  - Cadastrar novo tanque
  - Criar alojamento
  - Inserir biometria diária
  - Inserir biometria semanal

### 2. Componentes Criados

#### NovoTanqueModal
- Modal para cadastrar novos tanques
- Campos: Local, Largura, Comprimento
- Validação automática de campos obrigatórios

#### AlojamentoModal
- Modal para criar alojamentos
- Campos: Data, Total de Peixes, Peso Médio Inicial, Biomassa Inicial
- Integração com tanque selecionado

#### BiometriaModal
- Modal para inserir biometrias diárias
- Seleção automática de alojamentos ativos
- Campos: Data, Ração, Temperatura da Água, pH, Temperatura Ambiente, Oxigenação

#### BiometriaSemanalModal
- Modal para inserir biometrias semanais
- Seleção automática de alojamentos ativos
- Campos: Período, Peixes Mortos, Peixes Capturados, Peso, Biomassa Total

### 3. Integração com API

#### Endpoints Utilizados
- `GET /tanque/resumo` - Dados dos tanques com métricas
- `POST /tanque` - Criar tanque
- `POST /tanque-alojamento` - Criar alojamento
- `GET /tanque-alojamento/tanque/:id` - Buscar alojamentos por tanque
- `POST /biometria-diaria` - Inserir biometria diária
- `POST /biometria-semanal` - Inserir biometria semanal

## Estrutura do Projeto

```
src/
├── app/                    # Páginas Next.js 13+
│   ├── tanques/           # Página de tanques
│   ├── dashboard/         # Página do dashboard
│   ├── graficos/          # Página de gráficos
│   ├── relatorios/        # Página de relatórios
│   └── configuracoes/     # Página de configurações
├── components/            # Componentes reutilizáveis
│   ├── NovoTanqueModal.tsx
│   ├── AlojamentoModal.tsx
│   ├── BiometriaModal.tsx
│   ├── BiometriaSemanalModal.tsx
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   └── ui/               # Componentes de UI
├── api/                  # Configuração da API
│   └── api.ts
└── contexts/            # Contextos React
    └── ThemeProvider.tsx
```

## Estilização

### CSS Variables
O projeto utiliza variáveis CSS para manter consistência visual:

```css
:root {
  --primary: #003c3c;      /* Verde petróleo */
  --secondary: #2ec4b6;    /* Verde água */
  --accent: #1a9082;       /* Verde accent */
  --grid: #d1d5db;         /* Cinza grid */
}
```

### Tailwind CSS
- Framework CSS utilitário
- Classes responsivas
- Sistema de cores personalizado

## Fluxo de Uso

### 1. Primeiro Acesso
1. Acesse `http://localhost:3000`
2. Navegue para "Tanques"
3. Clique em "+ Novo Tanque" para criar o primeiro tanque

### 2. Configuração de Alojamento
1. Após criar o tanque, clique em "+ Alojamento"
2. Preencha os dados do alojamento
3. Clique em "Cadastrar"

### 3. Inserção de Biometrias
1. Com alojamento ativo, clique em "+ Biometria" para dados diários
2. Ou clique em "+ Biometria Semanal" para dados semanais
3. Preencha os dados e clique em "Inserir"

## Solução de Problemas

### Erro de Conexão com API
- Verifique se o backend está rodando na porta 3001
- Confirme se o CORS está habilitado no backend
- Verifique o console do navegador para erros

### Erro de Build
- Verifique se todas as dependências estão instaladas
- Execute: `npm install` novamente
- Limpe o cache: `npm run build -- --clean`

### Erro de TypeScript
- Verifique se os tipos estão corretos
- Execute: `npm run lint` para verificar erros
- Verifique se o arquivo `tsconfig.json` está configurado

## Desenvolvimento

### Adicionando Novos Componentes
1. Crie o arquivo em `src/components/`
2. Use TypeScript para tipagem
3. Siga o padrão de nomenclatura PascalCase
4. Adicione estilos com Tailwind CSS

### Adicionando Novas Páginas
1. Crie a pasta em `src/app/`
2. Adicione o arquivo `page.tsx`
3. Atualize o `Sidebar.tsx` se necessário
4. Use o layout padrão do projeto

### Modificando a API
1. Atualize o arquivo `src/api/api.ts`
2. Adicione novos endpoints conforme necessário
3. Mantenha a consistência de nomenclatura

## Deploy

### Vercel (Recomendado)
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas
1. Execute `npm run build`
2. Use a pasta `out/` ou `dist/`
3. Configure o servidor para servir arquivos estáticos

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Siga os padrões de código
4. Teste suas mudanças
5. Abra um Pull Request



