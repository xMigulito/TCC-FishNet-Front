# 🔧 Configuração de Variáveis de Ambiente

## 📋 **Variáveis Necessárias**

### **Para Desenvolvimento Local (.env.local)**
```env
# Configuração da API Backend
NEXT_PUBLIC_API_URL=http://localhost:3001

# Configurações do Next.js
NODE_ENV=development

# Configurações do Tailwind CSS
TAILWIND_MODE=watch
```

### **Para Produção (Vercel)**
```env
# Configuração da API Backend
NEXT_PUBLIC_API_URL=https://seu-backend.railway.app

# Configurações do Next.js
NODE_ENV=production
```

## 🚀 **Como Configurar**

### **1. Desenvolvimento Local**
1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione as variáveis de desenvolvimento
3. Reinicie o servidor de desenvolvimento

### **2. Produção (Vercel)**
1. Acesse o painel do Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione cada variável com seu valor

## ⚠️ **Importante**

- **NEXT_PUBLIC_** prefixa variáveis que devem estar disponíveis no cliente
- **NODE_ENV** é configurado automaticamente pelo Vercel
- **TAILWIND_MODE** é opcional para desenvolvimento

## 🔍 **Verificação**

Após configurar as variáveis:
1. **Desenvolvimento**: `npm run dev`
2. **Produção**: Deploy automático no Vercel
3. **Verificar**: Console do navegador para erros de API
