# 🏢 Funcionalidade: Adicionar Empreendimentos

## Visão Geral

Foi adicionada uma nova funcionalidade ao painel administrativo do HERO.IA que permite adicionar novos empreendimentos ao sistema através de uma interface visual amigável.

## Arquivos Criados/Modificados

### Novos Arquivos:
- `adicionar-empreendimento.html` - Interface para adicionar novos empreendimentos

### Arquivos Modificados:
- `index.html` - Adicionado link para a página de adicionar empreendimentos
- `../backend/server.js` - Adicionado endpoint POST `/admin/empreendimento`

## Funcionalidades Implementadas

### ✅ 1. Interface de Adição de Empreendimentos

A interface permite preencher os seguintes campos:

#### Campos Obrigatórios:
- **Nome do Empreendimento**: Nome único do empreendimento
- **Bairro**: Localização do empreendimento
- **Tipologia**: Seleção múltipla via checkboxes com as seguintes opções:
  - Studio
  - 1 Quarto
  - 2 Quartos
  - 3 Quartos
  - 4 Quartos
  - Cobertura
  - Duplex
  - Loft
  
- **Perfil**: Seleção múltipla via checkboxes (pré-marcados por padrão):
  - ✅ Moradia (marcado por padrão)
  - ✅ Investimento (marcado por padrão)
  
- **Descrição e Endereço**: Campo de texto grande para incluir:
  - Descrição do empreendimento
  - Endereço completo
  - Outras informações relevantes

#### Campos Opcionais:
- **Entrega**: 
  - Campo de texto para ano de entrega (ex: 2026)
  - Checkbox "Já entregue" que:
    - Quando marcado, define automaticamente como "Entregue"
    - Desabilita o campo de ano
    - Permite rápida marcação de empreendimentos já entregues

### ✅ 2. Validações

#### Validação de Nome Único:
- O sistema verifica se já existe um empreendimento com o mesmo nome
- Comparação case-insensitive (ignora maiúsculas/minúsculas)
- Previne duplicação de dados

#### Validações de Formulário:
- Todos os campos obrigatórios devem ser preenchidos
- Pelo menos uma tipologia deve ser selecionada
- Pelo menos um perfil deve ser selecionado

### ✅ 3. Normalização de Dados

- **Nome**: Normalizado com trim() e comparado em lowercase
- **Entrega**: Automaticamente definido como:
  - "Entregue" quando checkbox marcado
  - Ano fornecido pelo usuário
  - "A confirmar" se nenhum valor for fornecido

### ✅ 4. Integração com Backend

#### Endpoint Criado:
```
POST /admin/empreendimento
```

#### Headers:
```json
{
  "Content-Type": "application/json"
}
```

#### Body:
```json
{
  "nome": "Nome do Empreendimento",
  "bairro": "Nome do Bairro",
  "tipologia": ["1q", "2q"],
  "perfil": ["moradia", "investimento"],
  "descricao": "Descrição completa | Endereço | Outras informações",
  "entrega": "2026",
  "token": "heroia_app_admin"
}
```

#### Respostas:

**Sucesso (200):**
```json
{
  "ok": true,
  "message": "Empreendimento adicionado com sucesso",
  "empreendimento": { /* dados do empreendimento */ }
}
```

**Erro - Nome Duplicado (409):**
```json
{
  "error": "Já existe um empreendimento com este nome"
}
```

**Erro - Acesso Negado (403):**
```json
{
  "error": "Acesso negado"
}
```

**Erro - Campos Faltando (400):**
```json
{
  "error": "Campos obrigatórios faltando"
}
```

### ✅ 5. Persistência de Dados

- Os dados são salvos no arquivo `backend/data/empreendimentos.json`
- O arquivo é atualizado automaticamente quando um novo empreendimento é adicionado
- Formato JSON com indentação de 2 espaços para melhor legibilidade

### ✅ 6. Configuração de Backend

- Campo de URL do Backend na interface
- Permite configurar endpoint personalizado
- Valor padrão: `https://heroia-full-nuven-1.onrender.com`
- Salvo no localStorage para persistência entre sessões

## Como Usar

### 1. Acessar a Interface

Na página principal do admin (`index.html`), clique no botão:
```
➕ Adicionar Empreendimento
```

### 2. Preencher o Formulário

1. **Configure a URL do Backend** (opcional, se diferente do padrão)
2. **Nome**: Digite o nome único do empreendimento
3. **Bairro**: Digite o bairro onde está localizado
4. **Tipologia**: Marque uma ou mais tipologias disponíveis
5. **Perfil**: Os checkboxes "Moradia" e "Investimento" já vêm marcados por padrão
6. **Descrição e Endereço**: Digite a descrição completa e o endereço
7. **Entrega**: 
   - Digite o ano de entrega OU
   - Marque "Já entregue" para empreendimentos entregues

### 3. Salvar

Clique em **"Adicionar Empreendimento"**

O sistema irá:
- Validar todos os campos
- Verificar se o nome já existe
- Enviar os dados para o backend
- Salvar no arquivo JSON
- Mostrar mensagem de sucesso/erro
- Limpar o formulário automaticamente (após 2 segundos, se sucesso)

### 4. Voltar

Clique em **"Voltar"** para retornar à página principal do admin

## Estrutura de Dados

Cada empreendimento é salvo com a seguinte estrutura:

```json
{
  "nome": "Conviva Camboinhas",
  "bairro": "Camboinhas",
  "tipologia": ["1q", "2q"],
  "perfil": ["moradia", "investimento"],
  "descricao": "Conviva | Av. Prof. Florestan Fernandes, 574 | Entrega: 2026",
  "entrega": "2026"
}
```

## Tipologias Disponíveis

Baseado no JSON atual, as seguintes tipologias estão disponíveis:
- `studio` - Studio
- `1q` - 1 Quarto
- `2q` - 2 Quartos
- `3q` - 3 Quartos
- `4q` - 4 Quartos
- `cobertura` - Cobertura
- `duplex` - Duplex
- `loft` - Loft

## Segurança

- Endpoint protegido por token de administrador
- Token padrão: `heroia_app_admin`
- Validação de campos obrigatórios no backend
- Verificação de duplicatas antes de salvar

## Mensagens de Feedback

A interface mostra mensagens visuais para:
- ✅ **Sucesso**: Fundo verde, empreendimento adicionado
- ⚠️ **Aviso**: Fundo amarelo, nome duplicado ou campo faltando
- ❌ **Erro**: Fundo vermelho, erro ao comunicar com backend

## Melhorias Futuras Sugeridas

1. Adicionar funcionalidade de edição de empreendimentos
2. Adicionar funcionalidade de exclusão de empreendimentos
3. Listar todos os empreendimentos existentes
4. Upload de imagens dos empreendimentos
5. Campos adicionais (preço, metragem, etc.)
6. Filtros e busca na listagem
7. Validação de formato de endereço
8. Histórico de alterações
