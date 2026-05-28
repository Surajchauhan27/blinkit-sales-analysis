const express = require('express');
const router = express.Router();

// In-memory chat storage per session
const chatStore = {};

// GET /api/chats
router.get('/', (req, res) => {
  const userId = req.headers['x-user-id'] || 'default';
  res.json({ chats: chatStore[userId] || [] });
});

// POST /api/chats
router.post('/', (req, res) => {
  const { title, category, userId = 'default' } = req.body;
  const chat = {
    id: `chat-${Date.now()}`,
    title: title || 'New Conversation',
    category: category || 'general',
    createdAt: new Date().toISOString(),
    messages: [],
  };
  if (!chatStore[userId]) chatStore[userId] = [];
  chatStore[userId].unshift(chat);
  res.status(201).json(chat);
});

// DELETE /api/chats/:id
router.delete('/:id', (req, res) => {
  const userId = req.headers['x-user-id'] || 'default';
  if (chatStore[userId]) {
    chatStore[userId] = chatStore[userId].filter(c => c.id !== req.params.id);
  }
  res.json({ message: 'Chat deleted.' });
});

module.exports = router;
