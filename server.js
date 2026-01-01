import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

// Get directory path for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '200kb' }));

// Initialize OpenAI
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
    
    const aiResponse = completion.choices[0].message.content;
    
    // Try to parse JSON response
    let result;
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback if AI doesn't return JSON
        result = {
          analysis: 'Cliente demonstrou interesse nos empreendimentos.',
          suggestion: 'Destaque os diferenciais e benefícios dos imóveis disponíveis.',
          draft: aiResponse
        };
      }
    } catch (parseError) {
      // Fallback structure
      result = {
        analysis: 'Cliente demonstrou interesse. Análise detalhada em andamento.',
        suggestion: 'Responda de forma clara e objetiva, destacando os benefícios.',
        draft: aiResponse
      };
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
