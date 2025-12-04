const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Archivo donde se guardan conversaciones
const STORAGE_FILE = path.join(__dirname, "conversaciones.json");

// Función para cargar
function loadConversations() {
  if (!fs.existsSync(STORAGE_FILE)) return [];
  return JSON.parse(fs.readFileSync(STORAGE_FILE, "utf8") || "[]");
}

// Función para guardar
function saveConversations(data) {
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), "utf8");
}

// 1) Endpoint para Make → Guarda los mensajes
app.post("/chat-event", (req, res) => {
  const data = req.body;

  const record = {
    session_id: data.meta?.session_id || "unknown",
    channel: data.channel || "unknown",
    chat_id: data.chat_id || "unknown",
    customer_message: data.customer_message || "",
    assistant_message: data.assistant_message || "",
    timestamp: data.timestamp || new Date().toISOString(),
  };

  const conversations = loadConversations();
  conversations.push(record);
  saveConversations(conversations);

  res.json({ status: "ok" });
});

// 2) Endpoint para la web → Devuelve todas las conversaciones
app.get("/conversations", (req, res) => {
  res.json(loadConversations());
});

// 3) Servir la web del panel
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log("Servidor iniciado en puerto " + PORT);
});
