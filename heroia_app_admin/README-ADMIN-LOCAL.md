# 🏢 Como Adicionar Empreendimentos Localmente

## 📋 Instruções

### 1️⃣ Inicie o Servidor Local

No terminal PowerShell, execute:

```bash
cd backend
node server.js
```

Ou simplesmente clique duas vezes em `start-local.bat`

**Aguarde ver a mensagem:**
```
Servidor rodando na porta 3002
```

### 2️⃣ Abra o Painel Admin

Abra o arquivo no navegador:
```
heroia_app_admin/adicionar-empreendimento.html
```

**A URL já estará configurada para:** `http://localhost:3002`

### 3️⃣ Adicione o Empreendimento

- Preencha o formulário
- Clique em "Adicionar Empreendimento"
- Acompanhe o LOG em tempo real
- O arquivo será salvo em `backend/data/empreendimentos.json`

### 4️⃣ Faça o Commit

Após adicionar os empreendimentos, faça o commit:

```bash
git add backend/data/empreendimentos.json
git commit -m "feat: adiciona novo empreendimento [NOME]"
git push
```

### 5️⃣ Deploy Automático

O Render detectará o commit e fará redeploy automaticamente!

---

## 🔄 Fluxo Completo

```
1. Rodar servidor local (localhost:3002)
2. Adicionar empreendimentos via painel admin
3. Arquivo salvo em backend/data/empreendimentos.json
4. Fazer commit no GitHub
5. Render faz deploy automático
6. App usa os novos dados
```

## ⚠️ Importante

- **SEMPRE** rode o servidor localmente ao adicionar empreendimentos
- **NÃO** use a URL do Render no painel admin (alterações não persistem)
- Faça commit logo após adicionar para não perder as mudanças

## 🐛 Troubleshooting

**Erro de porta em uso:**
```bash
# Encerre processos na porta 3002
Get-Process -Id (Get-NetTCPConnection -LocalPort 3002).OwningProcess | Stop-Process
```

**Servidor não inicia:**
```bash
cd backend
npm install
node server.js
```
