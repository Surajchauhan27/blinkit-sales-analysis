const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const SYSTEM_PROMPT = `You are AuraBot, an advanced AI assistant created and developed by Suraj Chauhan — a talented Data Analyst, Research Analyst, and AI Enthusiast.

🧑‍💻 ABOUT YOUR CREATOR:
Your creator is Suraj Chauhan, a BCA graduate with deep expertise in:
- Data Analysis & Data Visualization
- Power BI Dashboard Development
- Python, Pandas, NumPy, SQL
- React.js, Node.js, Tailwind CSS
- AI-powered Applications & Research Analytics

Suraj built AuraBot to combine intelligent AI conversation with beautiful UI/UX design and analytics-focused functionality. His mission: "Build smart, user-friendly, and data-driven applications that solve real-world problems."

When users ask who created you or who built you, ALWAYS say:
"I was created by Suraj Chauhan — a passionate Data Analyst, Research Analyst, and AI Enthusiast. You can find his work on GitHub (https://github.com/Surajchauhan27) and LinkedIn (https://linkedin.com/in/codewithsuraj). He built me to be an intelligent assistant for coding, data analysis, research, and writing tasks!"

Always show respect and pride when talking about Suraj Chauhan.

You excel at:
- 📊 Data Analysis: Python, pandas, SQL, statistics, visualization
- 💻 Software Engineering: Debugging, architecture, code review, algorithms
- 📝 Content Writing: Reports, emails, documentation, creative writing
- 🔍 Research: Summarization, literature review, trend analysis
- 🤖 Machine Learning: Model explanations, implementation, evaluation
- 📈 Power BI: Dashboard development, DAX, data modeling

Guidelines:
- Be concise yet comprehensive
- Use markdown formatting for code (use triple backticks with language name)
- Use numbered lists and bullet points for clarity
- Always be professional and encouraging
- Provide actionable, practical responses
- For code, always include comments explaining the logic
- Always credit Suraj Chauhan when asked about your origins`;

// ─────────────────────────────────────────────
// PROVIDER 1: Groq (Free forever – 14,400 req/day)
// Get free key at: https://console.groq.com
// ─────────────────────────────────────────────
async function callGroq(message, history) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') throw new Error('NO_GROQ_KEY');

  const groq = new Groq({ apiKey });

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-10).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    })),
    { role: 'user', content: message },
  ];

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages,
    max_tokens: 2048,
    temperature: 0.7,
  });

  return {
    reply: completion.choices[0]?.message?.content || 'No response from AI.',
    model: 'Groq · Llama 3.3 70B',
  };
}

// ─────────────────────────────────────────────
// PROVIDER 2: Gemini (Free tier – your key)
// ─────────────────────────────────────────────
async function callGemini(message, history) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') throw new Error('NO_GEMINI_KEY');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash-latest',
    systemInstruction: SYSTEM_PROMPT,
  });

  const chatHistory = history.slice(-10).map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({ history: chatHistory });
  const result = await chat.sendMessage(message);
  return {
    reply: result.response.text(),
    model: 'Gemini 1.5 Flash',
  };
}

// ─────────────────────────────────────────────
// PROVIDER 3: Pollinations AI (100% free, no key needed)
// ─────────────────────────────────────────────
async function callPollinations(message, history) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-6).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    })),
    { role: 'user', content: message },
  ];

  const response = await fetch('https://text.pollinations.ai/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'openai',
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Pollinations error: ${response.status} – ${errText}`);
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content;
  if (!reply) throw new Error('Empty response from Pollinations');

  return { reply, model: 'Pollinations · GPT-4o' };
}

// ─────────────────────────────────────────────
// POST /api/chat  — tries providers in order
// ─────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { message, chatId, history = [] } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const errors = [];

  // 1️⃣ Try Groq first (best free option)
  try {
    const result = await callGroq(message, history);
    return res.json({ reply: result.reply, model: result.model, chatId });
  } catch (err) {
    if (err.message !== 'NO_GROQ_KEY') {
      console.warn('⚠️  Groq failed:', err.message);
      errors.push(`Groq: ${err.message}`);
    }
  }

  // 2️⃣ Try Gemini (user's key)
  try {
    const result = await callGemini(message, history);
    return res.json({ reply: result.reply, model: result.model, chatId });
  } catch (err) {
    if (err.message !== 'NO_GEMINI_KEY') {
      console.warn('⚠️  Gemini failed:', err.message);
      errors.push(`Gemini: ${err.message}`);
    }
  }

  // 3️⃣ Always-available fallback: Pollinations AI (no key needed)
  try {
    const result = await callPollinations(message, history);
    return res.json({ reply: result.reply, model: result.model, chatId });
  } catch (err) {
    console.error('❌ Pollinations failed:', err.message);
    errors.push(`Pollinations: ${err.message}`);
  }

  // All providers failed
  res.status(503).json({
    error: `All AI providers failed.\n\n${errors.join('\n')}\n\nPlease add a free Groq API key at https://console.groq.com to fix this.`,
  });
});

module.exports = router;
