// ============================================================================
// AIMATES EXTENSION - "DEEP ONYX" (Updated: Toggle on Header Click)
// ============================================================================

const API_URL = "http://localhost:3000";

const STYLES = `
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap");

:root {
  /* Palette - Dark Mode Luxury */
  --am-bg-overlay: rgba(10, 10, 10, 0.85);
  --am-bg-surface: rgba(255, 255, 255, 0.04);
  
  /* Borders */
  --am-border-subtle: rgba(255, 255, 255, 0.08);
  --am-border-highlight: rgba(255, 255, 255, 0.15);
  
  /* Accents */
  --am-accent-gradient: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  --am-accent-glow: rgba(59, 130, 246, 0.5);
  
  /* Text */
  --am-text-primary: #ffffff;
  --am-text-secondary: #a1a1aa;
  --am-text-tertiary: #52525b;

  /* Dimensions & Font */
  --am-radius-xl: 20px;
  --am-radius-lg: 12px;
  --am-font: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  
  /* Shadows */
  --am-shadow-floating: 
    0 0 0 1px rgba(255,255,255,0.08) inset,
    0 24px 48px -12px rgba(0, 0, 0, 0.9);
}

/* --- Base --- */
#aimates-floating-panel * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }

#aimates-floating-panel {
  position: fixed;
  top: 96px;
  right: 32px;
  width: 360px;
  height: calc(100vh - 140px);
  max-height: 700px;
  z-index: 2147483647;
  display: flex;
  flex-direction: column;

  background: var(--am-bg-overlay);
  backdrop-filter: blur(40px) saturate(160%);
  -webkit-backdrop-filter: blur(40px) saturate(160%);
  
  border-radius: var(--am-radius-xl);
  box-shadow: var(--am-shadow-floating);
  
  font-family: var(--am-font);
  color: var(--am-text-primary);
  
  /* Animation */
  opacity: 0;
  transform: translateY(10px) scale(0.98);
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  overflow: hidden;
}

#aimates-floating-panel.visible { opacity: 1; transform: translateY(0) scale(1); }

/* --- Minimized State --- */
#aimates-floating-panel.minimized {
  height: 68px; /* Altura fixa da header */
  overflow: hidden;
  border-radius: 34px; /* Pill shape total */
  width: 280px; /* Mais estreito quando minimizado */
  cursor: pointer; /* Indica que o card todo é clicável quando fechado */
}

#aimates-floating-panel.minimized .aimates-feed-body,
#aimates-floating-panel.minimized .aimates-footer {
  opacity: 0;
  pointer-events: none;
  display: none;
}

#aimates-floating-panel.minimized .aimates-header {
  border-bottom: none;
  height: 100%;
}

/* --- Header --- */
.aimates-header {
  padding: 0 20px;
  height: 68px;
  border-bottom: 1px solid var(--am-border-subtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to bottom, rgba(255,255,255,0.03), transparent);
  transition: all 0.3s ease;
  cursor: pointer; /* <--- NOVA: A header é sempre clicável para minimizar/expandir */
}

.aimates-brand { display: flex; align-items: center; gap: 12px; }

.aimates-brand-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--am-accent-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px var(--am-accent-glow);
}
.aimates-brand-icon svg { width: 16px; height: 16px; stroke: #fff; }

.aimates-header-info { display: flex; flex-direction: column; gap: 2px; }

.aimates-header-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--am-text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Badge de Contagem (Estilo Glass Pill) */
.aimates-count-badge {
  font-size: 10px;
  font-weight: 600;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 2px 8px;
  border-radius: 10px;
  color: var(--am-text-secondary);
  transition: all 0.3s;
}
#aimates-floating-panel:not(.minimized) .aimates-count-badge {
    background: var(--am-accent-gradient);
    color: white;
    border-color: transparent;
}

.aimates-header-subtitle {
  font-size: 11px;
  color: var(--am-text-secondary);
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.aimates-controls { display: flex; gap: 4px; }

.aimates-icon-btn {
  background: transparent;
  border: none;
  color: var(--am-text-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.aimates-icon-btn:hover { background: var(--am-bg-surface); color: white; }

/* --- Feed --- */
.aimates-feed-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.aimates-feed-body::-webkit-scrollbar { width: 0px; }

.aimates-feed-item {
  animation: slideIn 0.3s ease-out forwards;
}
@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.aimates-post-bubble {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--am-border-subtle);
  border-radius: 12px;
  padding: 12px;
  position: relative;
}

.aimates-post-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 11px;
}
.aimates-author { font-weight: 600; color: var(--am-text-primary); }
.aimates-time { color: var(--am-text-tertiary); }
.aimates-text { font-size: 13px; line-height: 1.5; color: var(--am-text-secondary); }

/* --- Footer & Updated Form (The "Stack") --- */
.aimates-footer {
  padding: 16px;
  background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
}

.aimates-input-stack {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--am-border-subtle);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;
}

.aimates-input-stack:focus-within {
  background: rgba(0, 0, 0, 0.5);
  border-color: rgba(255,255,255,0.2);
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}

/* Input de Nome (Top) */
.aimates-input-name {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--am-border-subtle);
  color: var(--am-text-primary);
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 500;
  outline: none;
  font-family: inherit;
}
.aimates-input-name::placeholder { color: var(--am-text-tertiary); }

/* Container flex para o insight e botão */
.aimates-input-row {
  display: flex;
  align-items: center;
  padding: 4px;
}

/* Input de Texto (Bottom) */
.aimates-input-text {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  padding: 10px; /* Padding menor pois está dentro da row */
  font-size: 13px;
  outline: none;
  font-family: inherit;
  resize: none;
  height: 40px;
}

.aimates-send-btn {
  width: 32px;
  height: 32px;
  border-radius: 10px; /* Squircle */
  border: none;
  background: var(--am-accent-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 4px;
}
.aimates-send-btn:hover { filter: brightness(1.1); transform: scale(1.05); }
.aimates-send-btn:disabled { opacity: 0.3; cursor: not-allowed; filter: grayscale(1); transform: none; }

/* Empty State */
.aimates-empty {
  text-align: center; color: var(--am-text-tertiary); padding: 40px 0;
}
`;

const injectStyles = () => {
    if (document.getElementById('aimates-styles')) return;
    const styleSheet = document.createElement("style");
    styleSheet.id = 'aimates-styles';
    styleSheet.innerText = STYLES;
    document.head.appendChild(styleSheet);
};

// --- API MOCK (Funcionalidade) ---
const fetchClusterData = async (promptText) => {
    try {
        const response = await fetch(`${API_URL}/api/cluster`, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: promptText })
        });
        return await response.json(); 
    } catch (error) {
        return { clusterId: "mock-1", comments: [] }; 
    }
};

const postComment = async (clusterId, newComment) => {
    try {
        await fetch(`${API_URL}/api/comments`, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clusterId, comment: newComment })
        });
    } catch(e) {}
};

// --- LOGIC ---
let currentTopicText = null;
let currentClusterId = null; 
// REQUIREMENT: Start Minimized
let isPanelMinimized = true; 

const ICONS = {
    brain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
    send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`
};

const hideFloatingPanel = () => {
    const panel = document.getElementById("aimates-floating-panel");
    if (panel) {
        panel.classList.remove("visible");
        setTimeout(() => panel.remove(), 500);
    }
};

const showFloatingPanel = async (topicText) => {
    injectStyles();
    topicText = topicText.trim();
    currentTopicText = topicText;
    
    const oldPanel = document.getElementById("aimates-floating-panel");
    if(oldPanel) oldPanel.remove();

    const panel = document.createElement("div");
    panel.id = "aimates-floating-panel";
    
    // Aplica a classe minimized logo de cara se a flag for true
    if (isPanelMinimized) panel.classList.add('minimized');
    
    // Header Inicial (Skeleton)
    panel.innerHTML = `<div class="aimates-header"><div class="aimates-brand"><div class="aimates-brand-icon">${ICONS.brain}</div></div></div>`;
    document.body.appendChild(panel);
    
    // Trigger animation
    requestAnimationFrame(() => panel.classList.add("visible"));

    const data = await fetchClusterData(topicText);
    currentClusterId = data.clusterId;
    const comments = data.comments || [];

    renderPanelContent(panel, topicText, comments);
};

function renderPanelContent(panel, topic, comments) {
    const safeTopic = topic.length > 30 ? topic.substring(0, 30) + "..." : topic;
    const count = comments.length;

    // Header com Badge de Contagem
    const header = `
    <div class="aimates-header">
        <div class="aimates-brand">
            <div class="aimates-header-info">
                <div class="aimates-header-title">
                    Conversas 
                    <span class="aimates-count-badge">${count}</span>
                </div>
                <span class="aimates-header-subtitle">${safeTopic}</span>
            </div>
        </div>
        <div class="aimates-controls">
            <button class="aimates-icon-btn" data-action="toggle">
                <div style="transform: ${isPanelMinimized ? 'rotate(0deg)' : 'rotate(180deg)'}; transition: transform 0.3s; display:flex;">${ICONS.chevron}</div>
            </button>
            <button class="aimates-icon-btn" data-action="close">${ICONS.close}</button>
        </div>
    </div>`;

    // Feed
    let feedContent = '';
    if (count > 0) {
        comments.slice().reverse().forEach(c => {
            feedContent += `
            <div class="aimates-feed-item">
                <div class="aimates-post-bubble">
                    <div class="aimates-post-header">
                        <span class="aimates-author">${c.author}</span>
                        <span class="aimates-time">agora</span>
                    </div>
                    <div class="aimates-text">${c.text}</div>
                </div>
            </div>`;
        });
    } else {
        feedContent = `<div class="aimates-empty">Seja o primeiro a comentar sobre isso.</div>`;
    }

    // Footer com FORM STACK (Nome + Insight)
    const footer = `
    <div class="aimates-footer">
        <form class="aimates-input-stack">
            <input type="text" class="aimates-input-name" placeholder="Seu nome..." name="author" autocomplete="off">
            
            <div class="aimates-input-row">
                <input type="text" class="aimates-input-text" placeholder="Adicione seu insight..." name="insight" autocomplete="off">
                <button type="submit" class="aimates-send-btn" disabled>
                    ${ICONS.send}
                </button>
            </div>
        </form>
    </div>`;

    panel.innerHTML = `${header}<div class="aimates-feed-body">${feedContent}</div>${footer}`;
    attachEvents(panel, topic);
}

function attachEvents(panel, topic) {
    const form = panel.querySelector('form');
    const nameInput = panel.querySelector('input[name="author"]');
    const textInput = panel.querySelector('input[name="insight"]');
    const sendBtn = panel.querySelector('.aimates-send-btn');
    
    // Validação para habilitar botão
    const validate = () => {
        const hasName = nameInput.value.trim().length > 0;
        const hasText = textInput.value.trim().length > 0;
        sendBtn.disabled = !(hasName && hasText);
    };

    if(form) {
        nameInput.addEventListener('input', validate);
        textInput.addEventListener('input', validate);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            sendBtn.innerHTML = `<div style="width:12px; height:12px; border:2px solid #fff; border-top-color:transparent; border-radius:50%; animation:spin 1s linear infinite"></div>`;
            
            const newComment = { 
                author: nameInput.value.trim(), 
                text: textInput.value.trim(), 
                timestamp: new Date().toISOString() 
            };
            
            await postComment(currentClusterId, newComment);
            showFloatingPanel(topic);
        });
    }

    // --- LÓGICA DE CLIQUE DUPLA (Header e Minimized) ---
    panel.addEventListener('click', (e) => {
        const btn = e.target.closest('button');

        // Função toggle
        const toggleState = () => {
            isPanelMinimized = !isPanelMinimized;
            panel.classList.toggle('minimized', isPanelMinimized);
            
            const chevronContainer = panel.querySelector('button[data-action="toggle"] div');
            if(chevronContainer) chevronContainer.style.transform = isPanelMinimized ? 'rotate(0deg)' : 'rotate(180deg)';
        };

        // 1. Prioridade: Botões (Fechar ou Toggle explícito)
        if (btn) {
            const action = btn.dataset.action;
            if (action === 'close') {
                e.stopPropagation(); 
                hideFloatingPanel();
                return;
            }
            if (action === 'toggle') {
                e.stopPropagation();
                toggleState();
                return;
            }
            return; // Outros botões (submit)
        }

        // 2. Se estiver MINIMIZADO: Clique em qualquer lugar expande
        if (isPanelMinimized) {
            toggleState();
            return;
        }

        // 3. Se estiver EXPANDIDO: Clique SOMENTE na HEADER minimiza
        // (Usamos closest para ver se o alvo do clique está dentro da header)
        if (e.target.closest('.aimates-header')) {
            toggleState();
        }
    });
}

// Global Spin Animation
if (!document.getElementById('aimates-global-spin')) {
    const s = document.createElement('style');
    s.id = 'aimates-global-spin';
    s.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(s);
}

// --- OBSERVERS (Inalterado) ---
window.addEventListener("urlchange", () => { hideFloatingPanel(); currentTopicText = null; });
const observer = new MutationObserver(() => {
    const userPromptSelector = ".query-text, h1"; 
    const allPrompts = document.querySelectorAll(userPromptSelector);
    if (allPrompts.length > 0) {
        const lastPrompt = allPrompts[allPrompts.length - 1];
        const topic = lastPrompt.innerText.trim();
        if (topic && topic !== currentTopicText && topic.length > 5) {
            showFloatingPanel(topic);
        }
    }
});

setTimeout(() => {
    const targetNode = document.body;
    if (targetNode) observer.observe(targetNode, { childList: true, subtree: true });
}, 1000);

(function(){let oldPushState=history.pushState;history.pushState=function pushState(){let ret=oldPushState.apply(this,arguments);window.dispatchEvent(new Event("urlchange"));return ret;};let oldReplaceState=history.replaceState;history.replaceState=function replaceState(){let ret=oldReplaceState.apply(this,arguments);window.dispatchEvent(new Event("urlchange"));return ret;};window.addEventListener("popstate",()=>{window.dispatchEvent(new Event("urlchange"));});})();