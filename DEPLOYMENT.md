# Guia de Deploy no Render

## Passos para Deploy

### 1. Preparação do Repositório ✅
- [x] Código commitado e enviado ao GitHub
- [x] package.json configurado com scripts de start
- [x] server.js inicializa corretamente
- [x] .gitignore configurado

### 2. Configuração no Render

1. Acesse [Render Dashboard](https://dashboard.render.com/)
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub: `HEROIA-FULL-Nuven`
4. Configure:
   - **Name**: heroia-full-backend (ou nome desejado)
   - **Environment**: Node
   - **Region**: Escolha mais próxima (ex: Oregon - US West)
   - **Branch**: copilot/prepare-backend-for-cloud (ou main após merge)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3. Variáveis de Ambiente

No Render, adicione as seguintes variáveis:
- `NODE_ENV`: `production`
- `PORT`: (Render define automaticamente, não precisa configurar)

### 4. Deploy

Clique em "Create Web Service" e aguarde o deploy.

O Render irá:
1. Clonar o repositório
2. Executar `npm install`
3. Executar `npm start`
4. Disponibilizar em uma URL como: `https://heroia-full-backend.onrender.com`

### 5. Verificação

Após o deploy, teste:

```bash
# Health check
curl https://seu-app.onrender.com/

# Testar endpoint draft
curl -X POST https://seu-app.onrender.com/whatsapp/draft \
  -H "Content-Type: application/json" \
  -d '{"propertyData": {"address": "Teste"}, "context": "venda"}'

# Testar endpoint copilot
curl -X POST https://seu-app.onrender.com/whatsapp/copilot \
  -H "Content-Type: application/json" \
  -d '{"propertyData": {"address": "Teste"}, "context": "venda", "prompt": "teste"}'
```

### 6. Integração com Extensão

Atualize a URL da extensão para apontar para:
`https://seu-app.onrender.com`

## Troubleshooting

### Erro: EADDRINUSE
- Render define a variável PORT automaticamente
- Não defina PORT=3000 manualmente no Render

### Logs
- Acesse "Logs" no dashboard do Render para ver os logs em tempo real

### Cold Start
- Planos gratuitos do Render têm "cold start" (15s-30s) após inatividade
- Considere plano pago se precisar de resposta instantânea

## Monitoramento

O Render fornece:
- Métricas de CPU e memória
- Logs em tempo real
- Health checks automáticos
- SSL/HTTPS gratuito

## Próximos Passos

1. Implementar lógica de negócio real nos endpoints
2. Adicionar integração com APIs de IA (se necessário)
3. Configurar banco de dados (se necessário)
4. Implementar autenticação (se necessário)
