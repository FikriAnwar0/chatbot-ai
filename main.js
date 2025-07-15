// ========== MathJax Configuration ========== //
window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']]
    },
    svg: { fontCache: 'global' }
};

// ========== Load MathJax Script Dynamically ========== //
const mathjaxScript = document.createElement('script');
mathjaxScript.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
mathjaxScript.async = true;
document.head.appendChild(mathjaxScript);

// ========== Sidebar Toggle (Burger) ========== //
const burgerBtn = document.getElementById('burger-btn');
const sidebarWrapper = document.getElementById('sidebar-wrapper');

burgerBtn?.addEventListener('click', () => {
    sidebarWrapper.classList.toggle('active');
    burgerBtn.classList.toggle('active');
});


// ========== History & Session Logic ========== //
let historySessions = JSON.parse(localStorage.getItem('chatHistorySessions') || '[]');
let currentSession = null;

function startNewSession(userMessage) {
    const session = {
        id: Date.now(),
        title: generateTitle(userMessage),
        messages: [{ role: 'user', content: userMessage }]
    };
    historySessions.unshift(session);
    currentSession = session;
    saveSessions();
    renderHistorySidebar();
    return session;
}

function getCurrentSession() {
    return currentSession;
}

function addMessageToSession(role, content) {
    if (currentSession) {
        currentSession.messages.push({ role, content });
        saveSessions();
        renderHistorySidebar();
    }
}

function getAllSessions() {
    return historySessions;
}

function switchToSession(sessionId) {
    const session = historySessions.find(s => s.id === sessionId);
    if (session) {
        currentSession = session;
        renderSessionMessages(session);
    }
}

function deleteSession(sessionId) {
    historySessions = historySessions.filter(s => s.id !== sessionId);
    if (currentSession?.id === sessionId) currentSession = null;
    saveSessions();
    renderHistorySidebar();
    document.getElementById('chat-messages').innerHTML = '';
}

function saveSessions() {
    localStorage.setItem('chatHistorySessions', JSON.stringify(historySessions));
}

function generateTitle(text) {
    const cleaned = text.replace(/\s+/g, ' ').trim();
    return cleaned.length > 30 ? cleaned.slice(0, 30) + '…' : cleaned;
}

function applyRename(sessionId, newTitle) {
    const session = historySessions.find(s => s.id === sessionId);
    if (!session) return;
    const cleaned = newTitle.trim();
    if (cleaned && cleaned !== session.title) {
        session.title = generateTitle(cleaned);
        saveSessions();
    }
    renderHistorySidebar();
}

function renderHistorySidebar() {
    const sidebar = document.getElementById('chat-history');
    if (!sidebar) return;

    sidebar.innerHTML = '';
    historySessions.forEach(session => {
        const item = document.createElement('div');
        item.className = 'history-item' + (session === currentSession ? ' active' : '');

        const title = document.createElement('div');
        title.className = 'history-title';
        title.textContent = session.title;
        title.onclick = () => switchToSession(session.id);

        const renameInput = document.createElement('input');
        renameInput.className = 'rename-input hidden';
        renameInput.type = 'text';
        renameInput.value = session.title;

        title.ondblclick = (e) => {
            e.stopPropagation();
            title.classList.add('hidden');
            renameInput.classList.remove('hidden');
            renameInput.focus();
            renameInput.select();
        };

        renameInput.addEventListener('blur', () => {
            applyRename(session.id, renameInput.value);
        });

        renameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                applyRename(session.id, renameInput.value);
                renameInput.blur();
            } else if (e.key === 'Escape') {
                renameInput.value = session.title;
                renameInput.classList.add('hidden');
                title.classList.remove('hidden');
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'history-delete-btn';
        deleteBtn.innerHTML = '✕';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            openDeleteModal(session);
        };

        item.appendChild(title);
        item.appendChild(renameInput);
        item.appendChild(deleteBtn);
        sidebar.appendChild(item);
    });
}

// ========== Delete Chat ========== //

const modal = document.getElementById('confirm-modal');
const modalTitle = document.getElementById('modal-chat-title');
const confirmBtn = document.getElementById('confirm-delete-btn');
const cancelBtn = document.getElementById('cancel-delete-btn');

let sessionToDelete = null;

function openDeleteModal(session) {
    modalTitle.textContent = session.title;
    modal.classList.remove('hidden');
    sessionToDelete = session;
}

function closeDeleteModal() {
    modal.classList.add('hidden');
    sessionToDelete = null;
}

confirmBtn.addEventListener('click', () => {
    if (sessionToDelete) deleteSession(sessionToDelete.id);
    closeDeleteModal();
});

cancelBtn.addEventListener('click', () => {
    closeDeleteModal();
});


function renderSessionMessages(session) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    container.innerHTML = '';
    session.messages.forEach(msg => addMessageToUI(msg.role, msg.content));

    // Tambahkan ini:
    attachCopyListeners();

    container.scrollTop = container.scrollHeight;
}

// ========== Clear All Chat History ========== //
const clearAllBtn = document.getElementById('clear-all-btn');
const modalClearAll = document.getElementById('confirm-clear-all-modal');
const cancelClearAll = document.getElementById('cancel-clear-all');
const confirmClearAll = document.getElementById('confirm-clear-all');

clearAllBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    modalClearAll.classList.remove('hidden');
});

cancelClearAll?.addEventListener('click', () => {
    modalClearAll.classList.add('hidden');
});

confirmClearAll?.addEventListener('click', () => {
    // 🔥 PERUBAHAN PENTING: Kosongkan variabel global dan simpan ulang
    historySessions = [];
    currentSession = null;
    saveSessions(); // <-- ini penting agar localStorage juga dihapus

    // Bersihkan UI
    const chatHistory = document.getElementById('chat-history');
    if (chatHistory) chatHistory.innerHTML = '';
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) chatMessages.innerHTML = '';
    modalClearAll.classList.add('hidden');
});


// ========== Main Chat Logic ========== //
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const stopBtn = document.getElementById('stop-btn');

let isStreaming = false;
let controller;

const API_KEY = "";
const MODEL_NAME = "";

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = chatInput.scrollHeight + 'px';
    const maxHeight = 200;
    chatInput.style.height = Math.min(chatInput.scrollHeight, maxHeight) + 'px';
});

stopBtn.addEventListener('click', () => {
    isStreaming = false;
    if (controller) controller.abort();
    toggleSendStop(false);
});

function toggleSendStop(isSending) {
    if (isSending) {
        sendBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
    } else {
        sendBtn.classList.remove('hidden');
        stopBtn.classList.add('hidden');
    }
}

async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    const isFirst = !getCurrentSession();
    if (isFirst) startNewSession(text);
    else addMessageToSession('user', text);

    addMessageToUI('user', text);
    chatInput.value = '';
    chatInput.style.height = 'auto';

    const wrapper = document.createElement('div');
    wrapper.classList.add('message', 'bot');
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    wrapper.appendChild(bubble);
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    toggleSendStop(true);
    isStreaming = true;

    const session = getCurrentSession();
    const messages = [...session.messages];
    let buffer = '';

    try {
        await streamAIResponse(messages, chunk => {
            if (!isStreaming) return;
            buffer += chunk;
            bubble.innerHTML = formatTextAsHTML(buffer);
            attachCopyListeners();
            Prism.highlightAll();
            renderMath();
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
        addMessageToSession('assistant', buffer);
    } catch (err) {
        if (!buffer) {
            bubble.textContent = 'Invalid Request, Please Try Again.';
        } else {
            bubble.innerHTML = formatTextAsHTML(buffer);
        }
    } finally {
        isStreaming = false;
        toggleSendStop(false);
        Prism.highlightAll();
        renderMath();
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

}

function addMessageToUI(sender, text) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message', sender);
    if (text) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.innerHTML = formatTextAsHTML(text);
        wrapper.appendChild(bubble);
    }
    chatMessages.appendChild(wrapper);

    // Tambahkan ini:
    attachCopyListeners();
    
    Prism.highlightAll();
    renderMath();
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatTextAsHTML(text) {
  const escapeHTML = str =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Tangkap dan simpan LaTeX block agar tidak di-escape
  const mathBlocks = [];
  text = text.replace(/\$\$(.*?)\$\$/gs, (match, expr) => {
    mathBlocks.push({ type: 'block', content: expr.trim() });
    return `__MATH_BLOCK_${mathBlocks.length - 1}__`;
  });

  text = text.replace(/\$(.*?)\$/g, (match, expr) => {
    mathBlocks.push({ type: 'inline', content: expr.trim() });
    return `__MATH_INLINE_${mathBlocks.length - 1}__`;
  });

  // Simpan blok kode agar tidak ikut di-escape
  const codeBlocks = [];
  text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    codeBlocks.push({ lang: lang || "text", code });
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  // Heading placeholders
    text = text
    .replace(/^######\s+(.*)$/gm, "__H6__$1__ENDH6__")
    .replace(/^#####\s+(.*)$/gm, "__H5__$1__ENDH5__")
    .replace(/^####\s+(.*)$/gm, "__H4__$1__ENDH4__")
    .replace(/^###\s+(.*)$/gm, "__H3__$1__ENDH3__")
    .replace(/^##\s+(.*)$/gm, "__H2__$1__ENDH2__")
    .replace(/^#\s+(.*)$/gm, "__H1__$1__ENDH1__");

  // Escape HTML
  let html = escapeHTML(text);

  // Replace headings
    html = html
    .replace(/__H6__(.*?)__ENDH6__/g, "<h6>$1</h6>")
    .replace(/__H5__(.*?)__ENDH5__/g, "<h5>$1</h5>")
    .replace(/__H4__(.*?)__ENDH4__/g, "<h4>$1</h4>")
    .replace(/__H3__(.*?)__ENDH3__/g, "<h3>$1</h3>")
    .replace(/__H2__(.*?)__ENDH2__/g, "<h2>$1</h2>")
    .replace(/__H1__(.*?)__ENDH1__/g, "<h1>$1</h1>");

  // Markdown table
  const tableRegex = /((?:\|[^\n]*)\|(?:\s*\n)?)+/g;
  html = html.replace(tableRegex, rawTable => {
    const rows = rawTable.trim().split("\n").filter(row => row.includes("|"));
    if (rows.length < 2) return rawTable;

    const header = rows[0].split("|").slice(1, -1).map(cell => `<th>${cell.trim()}</th>`).join("");
    const separator = rows[1];
    if (!/^\s*\|?\s*-+/.test(separator)) return rawTable;

    const bodyRows = rows.slice(2).filter(row => row.trim().length > 0);
    const body = bodyRows.map(row => {
      const cells = row.split("|").slice(1, -1).map(cell => `<td>${cell.trim()}</td>`).join("");
      return `<tr>${cells}</tr>`;
    }).join("");

    return `<div class="table-wrapper"><table class="markdown-table"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table></div>`;
  });

  // Markdown styling
  html = html
    .replace(/^\*\s+(.*)$/gm, "<li>$1</li>")
    .replace(/(<li>.*?<\/li>)/gs, "<ul>$1</ul>")
    .replace(/---/g, "<hr />")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/~~(.*?)~~/g, "<s>$1</s>")
    .replace(/`([^`\n]+)`/g, '<span class="inline-code">$1</span>');

  // Link Markdown & auto-link
  html = html.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  html = html.replace(/(?<!["'>])\b(https?:\/\/[^\s<>()]+)\b/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

  // Replace code blocks
  codeBlocks.forEach((block, i) => {
    const safeCode = escapeHTML(block.code);
    html = html.replace(
      `__CODE_BLOCK_${i}__`,
      `<div class="code-wrapper"><button class="copy-btn">Copy</button><pre class="code-block"><code class="language-${block.lang}">${safeCode}</code></pre></div>`
    );
  });

  // Replace math blocks
  mathBlocks.forEach((block, i) => {
    const wrapper = block.type === 'block'
      ? `<div class="math-block">\\[${block.content}\\]</div>`
      : `<span class="math-inline">\\(${block.content}\\)</span>`;
    html = html.replace(`__MATH_${block.type.toUpperCase()}_${i}__`, wrapper);
  });

  return `<div class="markdown-text">${html}</div>`;
}

function attachCopyListeners() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.onclick = () => {
            const codeElement = btn.parentElement.querySelector('code');
            const text = codeElement?.textContent || '';
            navigator.clipboard.writeText(text).then(() => {
                btn.textContent = 'Copied!';
                setTimeout(() => btn.textContent = 'Copy', 2000);
            });
        };
    });
}

function renderMath() {
    if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
        MathJax.typesetPromise();
    }
}

async function streamAIResponse(messages, onChunk) {
    controller = new AbortController();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: MODEL_NAME,
            messages: messages,
            stream: true
        }),
    });

    if (!response.ok) throw new Error("Gagal koneksi ke OpenRouter");

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (isStreaming) {
        const { value, done } = await reader.read();
        if (done) break;


        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
            if (line.trim().startsWith("data:")) {
                const jsonStr = line.replace(/^data:\s*/, '');
                if (jsonStr === "[DONE]") return;
                const parsed = JSON.parse(jsonStr);
                const chunk = parsed.choices?.[0]?.delta?.content;
                if (chunk) onChunk(chunk);
            }
        }
    }
}

// ========== Tombol "Obrolan Baru" ========== //
const newChatBtn = document.getElementById('new-chat-btn');
if (newChatBtn) {
    newChatBtn.addEventListener('click', () => {
        const session = {
            id: Date.now(),
            title: 'Obrolan baru',
            messages: []
        };
        historySessions.unshift(session);
        currentSession = session;
        saveSessions();
        renderHistorySidebar();

        const container = document.getElementById('chat-messages');
        if (container) container.innerHTML = '';
        chatInput.focus();
    });
}


renderHistorySidebar();