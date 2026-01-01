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
  "model": "gpt-4o-mini"
}
```

## Estrutura de Arquivos

- `server.js`: Servidor Express principal
- `data/empreendimentos.json`: Dados dos empreendimentos disponíveis
- `data/licenses.json`: Licenças de usuários (não versionado)
- `.env`: Variáveis de ambiente (não versionado)
- `.env.example`: Exemplo de configuração

## Licenciamento

O sistema suporta validação de licenças via header `x-user-key`. Configure `APP_REQUIRE_LICENSE=true` no `.env` para habilitar.

Formato do `data/licenses.json`:
```json
{
  "license-key-123": {
    "active": true,
    "user": "username",
    "expires": "2025-12-31"
  }
}
```
