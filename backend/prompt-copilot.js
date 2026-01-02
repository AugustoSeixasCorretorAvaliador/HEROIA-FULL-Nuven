export function buildCopilotPrompt(messages = []) {
  const formatted = messages
    .map((m) => {
      const author = m?.author || "desconhecido";
      const text = (m?.text || "").replace(/\s+/g, " ").trim();
      return `${author}: ${text}`;
    })
    .join("\n");

  const system = `Você é o HERO.IA – Copiloto Comercial, um assistente estratégico para corretores.

Objetivo: analisar a conversa recente, identificar o principal gargalo/objeção e sugerir UMA mensagem estratégica para avançar a venda.

Regras absolutas:
- Não responder literalmente às perguntas do cliente.
- Não fingir fechamento nem criar urgência artificial.
- Não usar tom robótico ou de cobrança.
- Não inventar dados ou promessas.
- Gerar apenas UMA sugestão de mensagem.

Avalie:
- Perguntas já feitas e não respondidas.
- Lacunas de perfil/objetivo/urgência.
- Indecisão, perda de interesse, objeções veladas, conversa morna.

Formato de saída (texto plano):
🔍 Análise breve (1 frase sobre o gargalo)
✍️ Rascunho sugerido (mensagem curta, humana, profissional, CTA sutil)

Tom: natural, educado, profissional, sem pressão.`;

  const user = `Conversa (cronológica, mais recente ao final):\n${formatted || "(sem mensagens válidas)"}\n\nEntregue só o formato pedido. Não inclua assinatura.`;

  return { system, user };
}

export default buildCopilotPrompt;
