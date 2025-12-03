const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// 1) Servir la carpeta "public" como estática
app.use(express.static(path.join(__dirname, "public")));

// 2) (Opcional) Ruta de prueba para ver que el servidor responde
app.get("/health", (req, res) => {
  res.send("OK");
});

// 3) Arrancar servidor
app.listen(PORT, () => {
  console.log("Servidor iniciado en puerto " + PORT);
});  const channel          = data.channel || 'unknown';
  const chatId           = data.chat_id || 'unknown';
  const customerMessage  = data.customer_message || '';
  const assistantMessage = data.assistant_message || '';
  const timestamp        = data.timestamp || new Date().toISOString();
  const sessionId        = (data.meta?.session_id) || `${channel}:${chatId}`;

  const conversations = loadConversations();

  conversations.push({
    session_id: sessionId,
    channel,
    chat_id: chatId,
    customer_message: customerMessage,
    assistant_message: assistantMessage,
    timestamp
  });

  saveConversations(conversations);

  res.json({ status: 'ok' });
});

// Endpoint for the panel
app.get('/conversations', (req, res) => {
  res.json(loadConversations());
});

// Serve panel files
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
