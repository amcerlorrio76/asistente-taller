import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();

// Render uses PORT provided by environment
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Storage file
const STORAGE_FILE = './conversaciones.json';

// Load conversations
function loadConversations() {
  if (!fs.existsSync(STORAGE_FILE)) return [];
  try {
    const raw = fs.readFileSync(STORAGE_FILE, 'utf8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// Save conversations
function saveConversations(convs) {
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(convs, null, 2), 'utf8');
}

// Endpoint for Make Webhook
app.post('/chat-event', (req, res) => {
  const data = req.body || {};

  const channel          = data.channel || 'unknown';
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