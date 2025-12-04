const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// 👉 MUY IMPORTANTE: esto permite leer JSON del cuerpo
app.use(express.json());

// ====== CONVERSACIONES para el panel ======

const STORAGE_FILE = path.join(__dirname, "conversaciones.json");

function loadConversations() {
  try {
    if (!fs.existsSync(STORAGE_FILE)) return [];
    const txt = fs.readFileSync(STORAGE_FILE, "utf8");
    if (!txt.trim()) return [];
    return JSON.parse(txt);
  } catch (err) {
    console.error("Error leyendo conversaciones:", err);
    return [];
  }
}

function saveConversations(data) {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error guardando conversaciones:", err);
  }
}

// 👉 Endpoint que llama Make
app.post("/chat-event", (req, res) => {
  try {
    console.log("BODY RECIBIDO EN /chat-event:", req.body);

    const data = req.body || {};

    const record = {
  session_id:
    data.session_id ||
    (data.chat_id ? `telegram:${data.chat_id}` : "unknown"),
  channel: data.origen || data.channel || "telegram",
  chat_id: data.chat_id || "",
  customer_message: data.customer_message || "",
  assistant_message: data.assistant_message || "",
  nombre: data.nombre || "",
  telefono: data.telefono || "",
  matricula: data.matricula || "",
  servicio: data.servicio || "",
  timestamp: data.timestamp || new Date().toISOString(),
};

    const conversations = loadConversations();
    conversations.push(record);
    saveConversations(conversations);

    res.json({ status: "ok" });
  } catch (err) {
    console.error("Error en /chat-event:", err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// 👉 Endpoint que usa el panel para pintar la lista
app.get("/conversations", (req, res) => {
  res.json(loadConversations());
});

// ====== PANEL WEB estático ======

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Salud
app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log("Servidor iniciado en puerto " + PORT);
});
