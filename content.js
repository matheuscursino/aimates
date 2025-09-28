// --- FUNÇÕES DE BANCO DE DADOS (localStorage) ---
const getDb = () => JSON.parse(localStorage.getItem("aimatesDb") || "{}");
const saveDb = (db) => localStorage.setItem("aimatesDb", JSON.stringify(db));
const getCommentsForTopic = (topic) => getDb()[topic] || [];

const addCommentToTopic = (topic, newComment) => {
    const db = getDb();
    if (!db[topic]) db[topic] = [];
    newComment.id = `comment_${Date.now()}`;
    newComment.likes = 0;
    newComment.likedBy = [];
    newComment.replies = [];
    db[topic].push(newComment);
    saveDb(db);
};

const toggleLike = (topic, commentId) => {
    const db = getDb();
    const userId = "currentUser";
    if (!db[topic]) return;
    const comment = db[topic].find((c) => c.id === commentId);
    if (!comment) return;

    if (!comment.likedBy) comment.likedBy = []; 

    if (comment.likedBy.includes(userId)) {
        comment.likes = Math.max(0, comment.likes - 1);
        comment.likedBy = comment.likedBy.filter((id) => id !== userId);
    } else {
        comment.likes++;
        comment.likedBy.push(userId);
    }
    saveDb(db);
};

const addReply = (topic, commentId, reply) => {
    const db = getDb();
    if (!db[topic]) return;
    const comment = db[topic].find((c) => c.id === commentId);
    if (!comment) return;
    reply.id = `reply_${Date.now()}`;
    reply.timestamp = new Date().toISOString();
    if (!comment.replies) comment.replies = [];
    comment.replies.push(reply);
    saveDb(db);
};

const getInitials = (name) => name.charAt(0).toUpperCase();
const timeAgo = (timestamp) => {
    const now = new Date();
    const seconds = Math.floor((now - new Date(timestamp)) / 1000);
    let interval = seconds / 31536000; if (interval > 1) return `${Math.floor(interval)}a`;
    interval = seconds / 2592000; if (interval > 1) return `${Math.floor(interval)}m`;
    interval = seconds / 86400; if (interval > 1) return `${Math.floor(interval)}d`;
    interval = seconds / 3600; if (interval > 1) return `${Math.floor(interval)}h`;
    interval = seconds / 60; if (interval > 1) return `${Math.floor(interval)}min`;
    return `${Math.floor(seconds)}s`;
};


// --- LÓGICA DA INTERFACE ---
let currentTopic = null;
let isPanelMinimized = false;

const hideFloatingPanel = () => {
    const panel = document.getElementById("aimates-floating-panel");
    if (panel) {
        panel.classList.remove("visible");
        setTimeout(() => panel.remove(), 300);
    }
};

const showFloatingPanel = (topic) => {
    topic = topic.trim().toLowerCase();
    
    currentTopic = topic;
    hideFloatingPanel();

    const comments = getCommentsForTopic(topic);
    const panel = document.createElement("div");
    panel.id = "aimates-floating-panel";
    if (isPanelMinimized) {
        panel.classList.add('minimized');
    }

    panel.innerHTML = `
        ${createHeaderHTML(topic, comments.length)}
        ${createFeedBodyHTML(comments, topic)}
        ${createFormHTML(topic)}
    `;

    document.body.appendChild(panel);
    addPanelEventListeners(panel, topic);
    setTimeout(() => panel.classList.add("visible"), 50);
};


function createHeaderHTML(topic, commentCount) {
    const topicPreview = topic.length > 50 ? topic.substring(0, 50) + "..." : topic;
    return `
    <div class="aimates-header">
        <div class="aimates-header-content">
            <div class="aimates-topic-info">
                <div class="aimates-topic-icon">💬</div>
                <div class="aimates-topic-details">
                    <h3 class="aimates-topic-title">Discussão</h3>
                    <p class="aimates-topic-preview">${topicPreview}</p>
                </div>
            </div>
            <div class="aimates-stats">
                <div class="aimates-stat">
                    <span class="aimates-stat-number">${commentCount}</span>
                    <span class="aimates-stat-label">insights</span>
                </div>
            </div>
        </div>
        <div class="aimates-header-controls">
            <button class="aimates-toggle-btn" data-action="toggle-panel">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transform: ${isPanelMinimized ? 'rotate(180deg)' : 'rotate(0deg)'}"><polyline points="6,9 12,15 18,9"></polyline></svg>
            </button>
            <button class="aimates-close-btn" data-action="close-panel">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
    </div>`;
}

function createFeedBodyHTML(comments, topic) {
    let commentsHtml = '';
    if (comments.length > 0) {
        comments.slice().reverse().forEach((comment, index) => {
            const isLiked = comment.likedBy && comment.likedBy.includes("currentUser");
            const repliesHtml = comment.replies && comment.replies.length > 0 ? `
                <div class="aimates-replies">${comment.replies.map(reply => `
                    <div class="aimates-reply">
                        <div class="aimates-reply-avatar">${getInitials(reply.author)}</div>
                        <div class="aimates-reply-content">
                            <div class="aimates-reply-header">
                                <span class="aimates-reply-author">${reply.author}</span>
                                <span class="aimates-reply-time">${timeAgo(reply.timestamp)}</span>
                            </div>
                            <p class="aimates-reply-text">${reply.text}</p>
                        </div>
                    </div>`).join('')}
                </div>` : '';

            commentsHtml += `
            <div class="aimates-feed-item" style="animation-delay: ${index * 0.1}s">
                <div class="aimates-avatar">
                    <div class="aimates-avatar-inner">${getInitials(comment.author)}</div>
                </div>
                <div class="aimates-post-content">
                    <div class="aimates-post-header">
                        <span class="aimates-post-author">${comment.author}</span>
                        <span class="aimates-post-time">${timeAgo(comment.timestamp)}</span>
                    </div>
                    <p class="aimates-post-text">${comment.text}</p>
                    <div class="aimates-post-actions">
                        <button class="aimates-action-btn aimates-like-btn ${isLiked ? 'liked' : ''}" data-action="like" data-comment-id="${comment.id}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="${isLiked ? "#ef4444" : "none"}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            <span>${comment.likes || 0}</span>
                        </button>
                        <button class="aimates-action-btn aimates-reply-btn" data-action="toggle-reply" data-comment-id="${comment.id}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            <span>Responder</span>
                        </button>
                    </div>
                    ${repliesHtml}
                    <div class="aimates-reply-form" id="reply-form-${comment.id}" style="display: none;">
                        <div class="aimates-reply-input-group">
                            <input type="text" class="aimates-reply-input" placeholder="Seu nome" required>
                            <textarea class="aimates-reply-textarea" placeholder="Sua resposta..." required rows="2"></textarea>
                            <div class="aimates-reply-actions">
                                <button class="aimates-reply-cancel" data-action="cancel-reply" data-comment-id="${comment.id}">Cancelar</button>
                                <button class="aimates-reply-submit" data-action="submit-reply" data-comment-id="${comment.id}">Responder</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        });
    } else {
        commentsHtml = `<div class="aimates-empty-state"><div class="aimates-empty-icon">💭</div><h4 class="aimates-empty-title">Nenhuma discussão ainda</h4><p class="aimates-empty-description">Seja o primeiro a compartilhar seus insights sobre este tópico!</p></div>`;
    }
    return `<div class="aimates-feed-body">${commentsHtml}</div>`;
}

function createFormHTML(topic) {
    return `
    <form class="aimates-comment-form">
        <div class="aimates-form-header"><h4>Compartilhe seu insight</h4></div>
        <div class="aimates-form-fields">
            <div class="aimates-input-group"><input type="text" class="aimates-input" placeholder="Seu nome de usuário" required><div class="aimates-input-border"></div></div>
            <div class="aimates-textarea-group"><textarea class="aimates-textarea" placeholder="O que você pensa sobre isso?" required rows="3"></textarea><div class="aimates-textarea-border"></div></div>
            <button type="submit" class="aimates-submit-button">
                <span class="aimates-button-text">Publicar Insight</span>
                <svg class="aimates-button-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22,2 15,22 11,13 2,9 22,2"></polygon></svg>
            </button>
        </div>
    </form>`;
}

function addPanelEventListeners(panel, topic) {
    panel.addEventListener('click', (e) => {
        const target = e.target;
        const actionBtn = target.closest('[data-action]');
        if (!actionBtn) return;

        const action = actionBtn.dataset.action;
        const commentId = actionBtn.dataset.commentId;

        switch(action) {
            case 'close-panel':
                hideFloatingPanel();
                break;
            case 'toggle-panel':
                isPanelMinimized = !isPanelMinimized;
                panel.classList.toggle("minimized", isPanelMinimized);
                actionBtn.querySelector("svg").style.transform = isPanelMinimized ? "rotate(180deg)" : "rotate(0deg)";
                break;
            case 'like':
                toggleLike(topic, commentId);
                showFloatingPanel(topic);
                break;
            case 'toggle-reply': {
                const form = document.getElementById(`reply-form-${commentId}`);
                if (form) form.style.display = form.style.display === "none" ? "block" : "none";
                break;
            }
            case 'cancel-reply': {
                const form = document.getElementById(`reply-form-${commentId}`);
                if (form) form.style.display = "none";
                break;
            }
            case 'submit-reply': {
                const form = document.getElementById(`reply-form-${commentId}`);
                const nameInput = form.querySelector(".aimates-reply-input");
                const textInput = form.querySelector(".aimates-reply-textarea");
                if (nameInput.value.trim() && textInput.value.trim()) {
                    addReply(topic, commentId, { author: nameInput.value.trim(), text: textInput.value.trim() });
                    showFloatingPanel(topic);
                }
                break;
            }
        }
    });

    const mainForm = panel.querySelector('.aimates-comment-form');
    mainForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = mainForm.querySelector(".aimates-submit-button");
        submitBtn.classList.add("loading");

        setTimeout(() => {
            const userInput = mainForm.querySelector(".aimates-input").value;
            const commentInput = mainForm.querySelector(".aimates-textarea").value;
            const newComment = { author: userInput, text: commentInput, timestamp: new Date().toISOString() };
            addCommentToTopic(topic, newComment);
            showFloatingPanel(topic);
        }, 500);
    });
}


// --- LÓGICA DE DETECÇÃO ---
window.addEventListener("urlchange", () => { hideFloatingPanel(); currentTopic = null; });
const observer = new MutationObserver(() => {
    const userPromptSelector = ".query-text";
    const allPrompts = document.querySelectorAll(userPromptSelector);
    if (allPrompts.length > 0) {
        const lastPrompt = allPrompts[allPrompts.length - 1];
        const topic = lastPrompt.innerText.trim().toLowerCase();
        if (topic && topic !== currentTopic) {
            showFloatingPanel(topic);
        }
    }
});

setTimeout(() => {
    const targetNode = document.querySelector("main");
    if (targetNode) {
        console.log("Aimates Social Network (v2.4): Correção do glow do avatar.");
        observer.observe(targetNode, { childList: true, subtree: true });
        const allPrompts = document.querySelectorAll(".query-text");
        if (allPrompts.length > 0) showFloatingPanel(allPrompts[allPrompts.length - 1].innerText);
    }
}, 1000);
(function(){let oldPushState=history.pushState;history.pushState=function pushState(){let ret=oldPushState.apply(this,arguments);window.dispatchEvent(new Event("urlchange"));return ret;};let oldReplaceState=history.replaceState;history.replaceState=function replaceState(){let ret=oldReplaceState.apply(this,arguments);window.dispatchEvent(new Event("urlchange"));return ret;};window.addEventListener("popstate",()=>{window.dispatchEvent(new Event("urlchange"));});})();