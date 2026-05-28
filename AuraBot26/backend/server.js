const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/chats', require('./routes/chats'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', model: 'gemini-2.0-flash' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 AuraBot Backend running on http://localhost:${PORT}`);
  console.log(`📡 Gemini API: ${process.env.GEMINI_API_KEY ? '✅ Connected' : '⚠️  No API key – set GEMINI_API_KEY in .env'}`);
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? '✅ Set' : '⚠️  Using default (change in production)'}\n`);
});
