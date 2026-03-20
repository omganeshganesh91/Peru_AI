
const chatBox       = document.getElementById("chatBox");
const userInput     = document.getElementById("userInput");
const sendBtn       = document.getElementById("sendBtn");
const emojiToggle   = document.getElementById("emojiToggle");
const emojiPanel    = document.getElementById("emojiPanel");
const pdfUpload     = document.getElementById("pdfUpload");
const pdfModal      = document.getElementById("pdfModal");
const closeModal    = document.getElementById("closeModal");
const modalBody     = document.getElementById("modalBody");
const sendFileBtn   = document.getElementById("sendFileBtn");
const quickReplies  = document.getElementById("quickReplies");

let pendingFile = null;  

// ── Boot greeting ───────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    addBotBubble(
      "👋 ¡Hola! I'm your <strong>PERU Travel Assistant</strong>. " +
      "Ask me anything about Peru — itineraries, Machu Picchu, food, visas, and more! " +
      "You can also attach a PDF or image for context. ✈️"
    );
  }, 600);
});

// ── Send on Enter ────────────────────────────────────────────
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});

// ── Send button ──────────────────────────────────────────────
sendBtn.addEventListener("click", handleSend);

// ── Emoji toggle ─────────────────────────────────────────────
emojiToggle.addEventListener("click", () => {
  emojiPanel.classList.toggle("open");
});

document.querySelectorAll(".emoji-opt").forEach(btn => {
  btn.addEventListener("click", () => {
    userInput.value += btn.dataset.emoji;
    userInput.focus();
  });
});

// ── Quick reply chips ─────────────────────────────────────────
document.querySelectorAll(".qr-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    userInput.value = btn.dataset.text;
    handleSend();
  });
});

// ── File / PDF upload ─────────────────────────────────────────
pdfUpload.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const isImage = file.type.startsWith("image/");
  const isPdf   = file.type === "application/pdf";

  if (!isImage && !isPdf) {
    alert("Please upload a PDF or image file.");
    return;
  }

  const base64 = await toBase64(file);
  pendingFile = { name: file.name, size: formatSize(file.size), base64, type: file.type };

  // Show preview modal
  if (isImage) {
    modalBody.innerHTML = `<img src="${base64}" style="max-width:100%;border-radius:10px;max-height:220px;object-fit:contain;">
      <p style="margin-top:10px;color:var(--text-muted);font-size:12px;">${file.name} · ${pendingFile.size}</p>`;
  } else {
    modalBody.innerHTML = `
      <div style="font-size:52px">📄</div>
      <div style="font-weight:800;margin-top:8px">${file.name}</div>
      <div style="color:var(--text-muted);font-size:12px;margin-top:4px">${pendingFile.size}</div>`;
  }

  pdfModal.classList.add("open");
  e.target.value = ""; // reset input
});

closeModal.addEventListener("click", () => {
  pdfModal.classList.remove("open");
  pendingFile = null;
});

sendFileBtn.addEventListener("click", () => {
  if (!pendingFile) return;
  pdfModal.classList.remove("open");

  // Show file bubble in chat
  const row = document.createElement("div");
  row.className = "bubble-row user";
  row.innerHTML = `
    <div class="file-bubble">
      <span class="file-icon">${pendingFile.type.startsWith("image/") ? "🖼️" : "📄"}</span>
      <div class="file-info">
        <span class="file-name">${pendingFile.name}</span>
        <span class="file-size">${pendingFile.size}</span>
      </div>
    </div>`;
  chatBox.appendChild(row);
  scrollBottom();

  // Send to backend with file reference
  const question = userInput.value.trim() || `I've attached a file: ${pendingFile.name}. Please help me with this.`;
  userInput.value = "";
  addUserBubble(question);
  callAPI(question, pendingFile);
  pendingFile = null;
});

// ── Core send handler ─────────────────────────────────────────
function handleSend() {
  const msg = userInput.value.trim();
  if (!msg) return;
  userInput.value = "";
  emojiPanel.classList.remove("open");
  addUserBubble(msg);
  callAPI(msg, null);
}

// ── API call ──────────────────────────────────────────────────
function callAPI(message, file) {
  const typingRow = addTypingIndicator();

  const payload = { question: message };
  if (file) payload.file = { name: file.name, type: file.type, data: file.base64 };

  fetch("http://127.0.0.1:8000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    typingRow.remove();
    addBotBubble(data.answer || "I'm not sure about that. Try asking differently!");
  })
  .catch(() => {
    typingRow.remove();
    addBotBubble("⚠️ Couldn't reach the server. Please check your connection and try again.");
  });
}

// ── Bubble helpers ────────────────────────────────────────────
function addUserBubble(text) {
  const row = document.createElement("div");
  row.className = "bubble-row user";
  row.innerHTML = `<div class="bubble">${escHtml(text)}<span class="time">${getTime()} ✓✓</span></div>`;
  chatBox.appendChild(row);
  scrollBottom();
}

function addBotBubble(html) {
  const row = document.createElement("div");
  row.className = "bubble-row bot";
  row.innerHTML = `<div class="bubble">${html}<span class="time">${getTime()}</span></div>`;
  chatBox.appendChild(row);
  scrollBottom();
}

function addTypingIndicator() {
  const row = document.createElement("div");
  row.className = "bubble-row bot";
  row.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
  chatBox.appendChild(row);
  scrollBottom();
  return row;
}

// ── Utilities ─────────────────────────────────────────────────
function scrollBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function escHtml(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
