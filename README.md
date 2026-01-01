# HEROIA-FULL Backend

Backend para o sistema HEROIA-FULL - API para geração de mensagens WhatsApp para corretores de imóveis.

## 📋 Funcionalidades

- ✅ Servidor Express.js inicializado e pronto para Render
- ✅ Endpoint POST `/whatsapp/draft` - Gera rascunhos de mensagens
- ✅ Endpoint POST `/whatsapp/copilot` - Gera mensagens com assistência IA
- ✅ Suporte a variáveis de ambiente via dotenv
- ✅ CORS habilitado para integração com extensão de navegador
- ✅ Tratamento de erros robusto

## 🚀 Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de exemplo de variáveis de ambiente
cp .env.example .env

# Editar .env com suas configurações
```

## ⚙️ Configuração

Edite o arquivo `.env` com suas configurações:

```env
PORT=3000
NODE_ENV=production
```

## 🏃 Executar

```bash
# Modo produção
npm start

# Modo desenvolvimento
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## 📡 Endpoints

### GET /
Health check e informações da API

**Resposta:**
```json
{
  "status": "ok",
  "message": "HEROIA-FULL Backend API",
  "endpoints": {
    "draft": "POST /whatsapp/draft",
    "copilot": "POST /whatsapp/copilot"
  }
}
```

### POST /whatsapp/draft
Gera um rascunho de mensagem WhatsApp

**Body:**
```json
{
  "propertyData": {
    "address": "Rua Exemplo, 123",
    "price": "R$ 500.000"
  },
  "context": "venda"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Draft processado com sucesso",
  "data": {
    "type": "draft",
    "propertyData": { ... },
    "context": "venda",
    "timestamp": "2026-01-01T22:00:00.000Z"
  }
}
```

### POST /whatsapp/copilot
Gera mensagem com assistência de IA

**Body:**
```json
{
  "propertyData": {
    "address": "Av. Principal, 456",
    "price": "R$ 800.000"
  },
  "context": "locacao",
  "prompt": "Criar mensagem persuasiva"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Copilot processado com sucesso",
  "data": {
    "type": "copilot",
    "propertyData": { ... },
    "context": "locacao",
    "prompt": "Criar mensagem persuasiva",
    "timestamp": "2026-01-01T22:00:00.000Z"
  }
}
```

## 🌐 Deploy no Render

1. Conecte seu repositório ao Render
2. Configure as variáveis de ambiente:
   - `PORT` (Render define automaticamente)
   - `NODE_ENV=production`
3. O Render executará automaticamente `npm install` e `npm start`

### Configurações do Render:
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment:** Node
- **Node Version:** 14 ou superior

## 🔧 Integração com Extensão

A extensão de navegador deve fazer requisições POST para os endpoints:

```javascript
// Botão Draft
fetch('https://seu-app.render.com/whatsapp/draft', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ propertyData, context })
});

// Botão Copilot
fetch('https://seu-app.render.com/whatsapp/copilot', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ propertyData, context, prompt })
});
```

## 📦 Dependências

- **express**: Framework web para Node.js
- **dotenv**: Carregamento de variáveis de ambiente
- **cors**: Habilitação de CORS para requisições cross-origin

## 🛡️ Segurança

- Tratamento de erros não capturados
- Validação básica de entrada
- CORS configurado
- Logs de requisições para debug

## 📝 Notas

- A lógica de negócio específica deve ser implementada nos handlers dos endpoints
- Os endpoints atualmente retornam respostas de sucesso para validar a estrutura
- Pronto para integração com serviços de IA (OpenAI, Anthropic, etc.)
