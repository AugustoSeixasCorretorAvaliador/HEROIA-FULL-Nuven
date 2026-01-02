<<<<<<< HEAD
require('dotenv').config();
const express = require('express');
const cors = require('cors');


=======
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

// Get directory path for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express app
>>>>>>> main
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
<<<<<<< HEAD
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
=======
app.use(express.json({ limit: '200kb' }));

// Initialize OpenAI
if (!process.env.OPENAI_API_KEY) {
  console.error('ERROR: OPENAI_API_KEY environment variable is required');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

// Load data files
let empreendimentos = [];
let licenses = {};

try {
  const empreendimentosData = readFileSync(join(__dirname, 'data', 'empreendimentos.json'), 'utf-8');
  empreendimentos = JSON.parse(empreendimentosData).empreendimentos || [];
} catch (error) {
  console.warn('Could not load empreendimentos.json:', error.message);
}

try {
  const licensesData = readFileSync(join(__dirname, 'data', 'licenses.json'), 'utf-8');
  licenses = JSON.parse(licensesData);
} catch (error) {
  console.warn('Could not load licenses.json:', error.message);
  try {
    if (!existsSync(join(__dirname, 'data'))) {
      console.warn('Data directory not found; skipping licenses.json creation');
    } else {
      writeFileSync(join(__dirname, 'data', 'licenses.json'), '{}', 'utf-8');
      console.info('Created empty data/licenses.json');
    }
  } catch (writeErr) {
    console.warn('Unable to create licenses.json:', writeErr.message);
  }
}

// License validation middleware
const validateLicense = (req, res, next) => {
  const requireLicense = process.env.APP_REQUIRE_LICENSE === 'true';
  
  if (!requireLicense) {
    return next();
  }
  
  const userKey = req.headers['x-user-key'];
  
  if (!userKey) {
    return res.status(401).json({ error: 'Missing x-user-key header' });
  }
  
  if (!licenses[userKey] || licenses[userKey].active !== true) {
    return res.status(403).json({ error: 'Invalid or inactive license' });
  }
  
  next();
};

// Helper function to append signature if configured
const appendSignature = (text) => {
  const shouldAppend = process.env.APPEND_SIGNATURE === 'true';
  const signature = process.env.SIGNATURE || '';
  
  if (shouldAppend && signature) {
    return `${text}\n\n${signature}`;
  }
  
  return text;
};

// POST /whatsapp/draft endpoint
app.post('/whatsapp/draft', validateLicense, async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Create system prompt with empreendimentos context
    const systemPrompt = `Você é um assistente de corretor de imóveis. Ajude a criar respostas para clientes do WhatsApp.
    
Empreendimentos disponíveis:
${JSON.stringify(empreendimentos, null, 2)}

${context ? `Contexto adicional: ${context}` : ''}

Crie uma resposta apropriada e até 3 sugestões de follow-up.`;

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7
    });
    
    if (!completion.choices || !completion.choices[0] || !completion.choices[0].message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }
    
    const aiResponse = completion.choices[0].message.content;
    
    // Parse response to extract draft and followups
    // For simplicity, we'll use the full response as draft and generate simple followups
    const draft = appendSignature(aiResponse);
    const followups = [
      'Gostaria de mais informações sobre algum empreendimento específico?',
      'Posso agendar uma visita para você?',
      'Tem alguma dúvida sobre financiamento?'
    ];
    
    res.json({
      draft,
      followups
    });
    
  } catch (error) {
    console.error('Error in /whatsapp/draft:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// POST /whatsapp/copilot endpoint
app.post('/whatsapp/copilot', validateLicense, async (req, res) => {
  try {
    const { message, context, conversation } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Create system prompt for analysis
    const analysisPrompt = `Você é um assistente especializado em análise de conversas de vendas imobiliárias.
    
Empreendimentos disponíveis:
${JSON.stringify(empreendimentos, null, 2)}

${context ? `Contexto: ${context}` : ''}
${conversation ? `Histórico da conversa: ${JSON.stringify(conversation)}` : ''}

Analise a mensagem do cliente e forneça:
1. Uma análise do interesse e intenção do cliente
2. Uma sugestão de abordagem para o corretor
3. Um rascunho de resposta`;

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: analysisPrompt },
        { role: 'user', content: `Mensagem do cliente: ${message}\n\nPor favor, forneça a análise, sugestão e rascunho em formato JSON com as chaves: analysis, suggestion, draft` }
      ],
      temperature: 0.7
    });
    
    if (!completion.choices || !completion.choices[0] || !completion.choices[0].message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }
    
    const aiResponse = completion.choices[0].message.content;
    
    // Try to parse JSON response
    let result;
    try {
      // First try to parse the entire response as JSON
      result = JSON.parse(aiResponse);
      
      // Validate required fields
      if (!result.analysis || !result.suggestion || !result.draft) {
        throw new Error('Missing required fields');
      }
    } catch (parseError) {
      // Try to extract JSON from markdown code blocks or text
      const jsonMatch = aiResponse.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || 
                       aiResponse.match(/(\{[\s\S]*"analysis"[\s\S]*"suggestion"[\s\S]*"draft"[\s\S]*\})/);
      
      if (jsonMatch && jsonMatch[1]) {
        try {
          result = JSON.parse(jsonMatch[1]);
          
          // Validate required fields
          if (!result.analysis || !result.suggestion || !result.draft) {
            throw new Error('Missing required fields');
          }
        } catch (e) {
          // Final fallback
          result = {
            analysis: 'Cliente demonstrou interesse. Análise detalhada em andamento.',
            suggestion: 'Responda de forma clara e objetiva, destacando os benefícios.',
            draft: aiResponse
          };
        }
      } else {
        // Fallback if no JSON structure found
        result = {
          analysis: 'Cliente demonstrou interesse. Análise detalhada em andamento.',
          suggestion: 'Responda de forma clara e objetiva, destacando os benefícios.',
          draft: aiResponse
        };
      }
    }
    
    // Apply signature to draft
    result.draft = appendSignature(result.draft);
    
    res.json(result);
    
  } catch (error) {
    console.error('Error in /whatsapp/copilot:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', model: OPENAI_MODEL });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`OpenAI Model: ${OPENAI_MODEL}`);
  console.log(`License Required: ${process.env.APP_REQUIRE_LICENSE === 'true'}`);
  console.log(`Append Signature: ${process.env.APPEND_SIGNATURE === 'true'}`);
});
>>>>>>> main
