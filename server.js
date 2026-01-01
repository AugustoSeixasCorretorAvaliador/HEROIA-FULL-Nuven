require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'HEROIA-FULL Backend API',
    endpoints: {
      draft: 'POST /whatsapp/draft',
      copilot: 'POST /whatsapp/copilot'
    }
  });
});

// Endpoint para Draft - gera mensagem de rascunho
app.post('/whatsapp/draft', (req, res) => {
  try {
    const { propertyData, context } = req.body;
    
    // Log da requisição para debug
    console.log('Draft request received:', { propertyData, context });
    
    // Validação básica
    if (!propertyData) {
      return res.status(400).json({ 
        error: 'propertyData é obrigatório' 
      });
    }

    // Por enquanto, retorna uma resposta de sucesso
    // A lógica de negócio real será implementada posteriormente
    res.json({
      success: true,
      message: 'Draft processado com sucesso',
      data: {
        type: 'draft',
        propertyData,
        context,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erro no endpoint /whatsapp/draft:', error);
    res.status(500).json({ 
      error: 'Erro ao processar draft',
      message: error.message 
    });
  }
});

// Endpoint para Copilot - gera mensagem com assistência IA
app.post('/whatsapp/copilot', (req, res) => {
  try {
    const { propertyData, context, prompt } = req.body;
    
    // Log da requisição para debug
    console.log('Copilot request received:', { propertyData, context, prompt });
    
    // Validação básica
    if (!propertyData) {
      return res.status(400).json({ 
        error: 'propertyData é obrigatório' 
      });
    }

    // Por enquanto, retorna uma resposta de sucesso
    // A lógica de negócio real será implementada posteriormente
    res.json({
      success: true,
      message: 'Copilot processado com sucesso',
      data: {
        type: 'copilot',
        propertyData,
        context,
        prompt,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erro no endpoint /whatsapp/copilot:', error);
    res.status(500).json({ 
      error: 'Erro ao processar copilot',
      message: error.message 
    });
  }
});

// Tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.path 
  });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor HEROIA-FULL rodando na porta ${PORT}`);
  console.log(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 Pronto para receber requisições`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

module.exports = app;
