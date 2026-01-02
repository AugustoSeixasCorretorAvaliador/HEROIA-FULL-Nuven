// HERO.IA unified extension (Draft + Copiloto) for WhatsApp Web
// Endpoints: /whatsapp/draft (rascunho) and /whatsapp/copilot (análise + sugestão)

const API_BASE = "http://localhost:3002";
const BTN_ID_DRAFT = "heroia-draft-btn";
const BTN_ID_COPILOT = "heroia-copilot-btn";
const PANEL_ID = "heroia-analysis-panel";
const TOOLBAR_ID = "heroia-toolbar";

const state = { loadingDraft: false, loadingCopilot: false };

function getComposer() {
  return document.querySelector('footer [contenteditable="true"][role="textbox"]')
    || document.querySelector('div[contenteditable="true"][role="textbox"]');
}

function createButton(id, label, className, onClick) {
  const btn = document.createElement("button");
  btn.id = id;
  btn.className = className;
  btn.textContent = label;
  btn.addEventListener("click", onClick);
  return btn;
}

function getChatRoot() {
  return document.querySelector('div[role="application"]')
    || document.querySelector('div[role="main"]')
    || document.body;
}

function parseAuthor(attr = "") {
  const lower = attr.toLowerCase();
  if (lower.includes("você:")) return "corretor";
  return "cliente";
}

function collectCopilotMessages(limit = 16) {
  const root = getChatRoot();
  const nodes = Array.from(root.querySelectorAll("[data-pre-plain-text]"));
  const msgs = nodes.map((node) => {
    const meta = node.getAttribute("data-pre-plain-text") || "";
    const text = (node.innerText || node.textContent || "").trim();
    if (!text) return null;
    return { author: parseAuthor(meta), text };
  }).filter(Boolean);
  return msgs.slice(-limit);
}

function extractInboundMessages(limit = 3) {
  const root = getChatRoot();
  const dataElements = Array.from(root.querySelectorAll("[data-pre-plain-text]"));

  const BOT_MARKERS = [
    "spin vendas",
    "creci-rj",
    "augusto seixas",
    "compra • venda",
    "compra • venda • aluguel",
    "augustoseixascorretor.com.br"
  ];

  const isBotText = (text = "") => {
    const t = text.toLowerCase();
    return BOT_MARKERS.some((m) => t.includes(m));
  };

  const messages = dataElements.map((el) => {
    const text = (el.innerText || el.textContent || "").trim();
    const attr = el.getAttribute("data-pre-plain-text") || "";
    const match = attr.match(/\]\s*([^:]+):/);
    const author = match?.[1]?.trim() || "";
    const isSelf = /^(v(o|ó|ô|ò)ce|vc|you)$/i.test(author);
    return { text, isSelf };
  }).filter((m) => m.text && !isBotText(m.text));

  const inbound = messages.filter((m) => !m.isSelf);
  if (!inbound.length) return [];
  return inbound.slice(-limit).map((m) => m.text);
}

function insertTextInComposer(text) {
  const editor = getComposer();
  if (!editor) return false;
  editor.focus();
  editor.innerText = "";
  const lines = (text || "").split("\n");
  for (let i = 0; i < lines.length; i++) {
    document.execCommand("insertText", false, lines[i]);
    if (i < lines.length - 1) {
      const evt = new KeyboardEvent("keydown", {
        key: "Enter", code: "Enter", keyCode: 13, which: 13, shiftKey: true, bubbles: true, cancelable: true,
      });
      editor.dispatchEvent(evt);
      document.execCommand("insertLineBreak");
    }
  }
  editor.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
}

async function callBackend(path, payload) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

function createPanel() {
  if (document.getElementById(PANEL_ID)) return;
  const panel = document.createElement("div");
  panel.id = PANEL_ID;
  panel.innerHTML = `
    <button class="dismiss" aria-label="Fechar" title="Fechar">✕</button>
    <h3>🧠 HERO.IA Análise</h3>
    <p id="heroia-analysis-text"></p>
  `;
  panel.querySelector(".dismiss").onclick = () => { panel.style.display = "none"; };
  document.body.appendChild(panel);
}

function showPanel(text) {
  const panel = document.getElementById(PANEL_ID);
  const p = document.getElementById("heroia-analysis-text");
  if (!panel || !p) return;
  const body = text ? `${text}\n\n✍️ FollowUp sugerido GERADO 👉` : "";
  p.textContent = body;
  panel.style.display = text ? "block" : "none";
}

function ensureToolbar() {
  const floatingBar = document.getElementById("heroia-btn-bar");
  if (floatingBar) floatingBar.remove();

  const footer = document.querySelector("footer");
  if (!footer) return;

  let toolbar = footer.querySelector(`#${TOOLBAR_ID}`);
  if (!toolbar) {
    toolbar = document.createElement("div");
    toolbar.id = TOOLBAR_ID;
    footer.appendChild(toolbar);
  }

  let draftBtn = toolbar.querySelector(`#${BTN_ID_DRAFT}`);
  if (!draftBtn) {
    draftBtn = createButton(BTN_ID_DRAFT, "✍️ HERO.IA Gerar Rascunho...", "heroia-btn heroia-btn-draft", handleDraftClick);
    toolbar.appendChild(draftBtn);
  }

  let copilotBtn = toolbar.querySelector(`#${BTN_ID_COPILOT}`);
  if (!copilotBtn) {
    copilotBtn = createButton(BTN_ID_COPILOT, "🧠 HERO.IA Copiloto/Follow-Up", "heroia-btn heroia-btn-copilot", handleCopilotClick);
    toolbar.appendChild(copilotBtn);
  }
}

function setLoading(mode, isLoading) {
  state[mode] = isLoading;
  const btnDraft = document.getElementById(BTN_ID_DRAFT);
  const btnCopilot = document.getElementById(BTN_ID_COPILOT);
  if (mode === "loadingDraft" && btnDraft) btnDraft.disabled = isLoading;
  if (mode === "loadingCopilot" && btnCopilot) btnCopilot.disabled = isLoading;
}

async function handleDraftClick() {
  if (state.loadingDraft) return;
  setLoading("loadingDraft", true);
  try {
    const inbound = extractInboundMessages(3);
    if (!inbound.length) {
      alert("Não encontrei mensagens do cliente. Role o chat e tente de novo.");
      return;
    }
    const res = await callBackend("/whatsapp/draft", { mensagens: inbound });
    const draft = res?.draft?.trim();
    if (draft) {
      navigator.clipboard?.writeText(draft).catch(() => {});
      insertTextInComposer(draft);
    } else {
      alert("Backend não retornou rascunho.");
    }
  } catch (err) {
    console.error("HERO.IA draft error", err);
    alert("Erro ao gerar rascunho.");
  } finally {
    setLoading("loadingDraft", false);
  }
}

async function handleCopilotClick() {
  if (state.loadingCopilot) return;
  setLoading("loadingCopilot", true);
  try {
    const messages = collectCopilotMessages(16);
    if (!messages.length) {
      alert("Não encontrei mensagens da conversa.");
      return;
    }
    const res = await callBackend("/whatsapp/copilot", { messages });
    const analysis = res?.analysis?.trim() || "";
    const suggestion = res?.suggestion?.trim() || res?.draft?.trim();
    showPanel(analysis);
    if (suggestion) {
      navigator.clipboard?.writeText(suggestion).catch(() => {});
      insertTextInComposer(suggestion);
    } else {
      alert("Backend não retornou sugestão.");
    }
  } catch (err) {
    console.error("HERO.IA copiloto error", err);
    alert("Erro ao rodar Copiloto.");
  } finally {
    setLoading("loadingCopilot", false);
  }
}

function init() {
  ensureToolbar();
  createPanel();
}

const observer = new MutationObserver(() => init());
observer.observe(document.documentElement, { childList: true, subtree: true });
init();
