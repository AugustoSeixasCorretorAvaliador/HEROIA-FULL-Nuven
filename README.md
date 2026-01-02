# HEROIA-FULL-Nuven
Node.js Express backend com integração OpenAI para endpoints do WhatsApp.
## Requisitos
- Node.js 16+
- OpenAI API Key
## Instalação
```bash
npm install
```
## Configuração
1. Copie `.env.example` para `.env`:
```bash
cp .env.example .env
```
2. Configure as variáveis de ambiente no arquivo `.env`:
- `OPENAI_API_KEY`: Sua chave da API OpenAI
- `OPENAI_MODEL`: Modelo OpenAI a usar (padrão: gpt-4o-mini)
- `APP_REQUIRE_LICENSE`: Define se validação de licença é obrigatória (true/false)
- `APPEND_SIGNATURE`: Define se deve adicionar assinatura às respostas (true/false)
- `SIGNATURE`: Texto da assinatura a ser adicionado
3. (Opcional) Configure licenças em `data/licenses.json` se `APP_REQUIRE_LICENSE=true`
## Execução
```bash
node server.js
```
O servidor iniciará na porta 3000 (ou `PORT` definida no `.env`).
## Endpoints
### POST /whatsapp/draft
Gera um rascunho de resposta para mensagem do WhatsApp.
**Headers (se APP_REQUIRE_LICENSE=true):**
- `x-user-key`: Chave de licença do usuário
**Body:**
```json
{
  "message": "Mensagem do cliente",
  "context": "Contexto adicional (opcional)"
}
```
**Resposta:**
```json
{
  "draft": "Rascunho de resposta",
  "followups": ["Pergunta 1", "Pergunta 2", "Pergunta 3"]
}
```
### POST /whatsapp/copilot
Analisa mensagem e fornece análise, sugestão e rascunho.
**Headers (se APP_REQUIRE_LICENSE=true):**
- `x-user-key`: Chave de licença do usuário
**Body:**
```json
{
  "message": "Mensagem do cliente",
  "context": "Contexto adicional (opcional)",
  "conversation": "Histórico da conversa (opcional)"
}
```
**Resposta:**
```json
{
  "analysis": "Análise do interesse do cliente",
  "suggestion": "Sugestão de abordagem",
  "draft": "Rascunho de resposta"
}
```
### GET /health
Verifica status do servidor.
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
- **openai**: Cliente OpenAI v4

## 🛡️ Segurança

- Tratamento de erros não capturados
- Validação básica de entrada
- CORS configurado
- Logs de requisições para debug

## Estrutura de Arquivos

- `backend/server.js`: Servidor Express principal
- `backend/data/empreendimentos.json`: Dados dos empreendimentos
- `backend/data/licenses.json`: Licenças (não versionado)
- `.env`: Variáveis de ambiente (não versionado)
- `.env.example`: Exemplo de configuração

## Licenciamento

Validação opcional via header `x-user-key` se `APP_REQUIRE_LICENSE=true`. Exemplo de `data/licenses.json`:

```json
{
  "license-key-123": {
    "active": true,
    "user": "username",
    "expires": "2025-12-31"
  }
}
```
