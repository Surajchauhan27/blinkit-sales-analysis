# 🤖 AuraBot – Smart AI Assistant

> A production-ready, full-stack AI chatbot application built with React, Tailwind CSS, Framer Motion, and Google Gemini API.

![AuraBot Demo](https://img.shields.io/badge/AuraBot-AI%20Assistant-6366f1?style=for-the-badge&logo=openai&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)
![Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?style=for-the-badge&logo=google)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎨 **Modern Dark UI** | Glassmorphism, neon accents, smooth animations |
| 🤖 **Gemini AI** | Powered by Google's Gemini 2.0 Flash model |
| 💬 **ChatGPT-style Interface** | Message bubbles, typing animation, auto-scroll |
| 📁 **Chat Management** | Create, search, categorize, delete conversations |
| 🎙️ **Voice Input** | Web Speech API for hands-free messaging |
| 📄 **PDF Export** | Export conversations as styled PDF |
| 📊 **Dashboard** | Analytics cards, charts, activity tracking |
| 🔐 **Auth System** | JWT-based login/signup with glassmorphism UI |
| 📱 **Fully Responsive** | Mobile-first, works on all devices |
| ⚡ **Framer Motion** | Smooth page transitions and micro-animations |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone & Setup

```bash
# Navigate to project
cd AuraBot26

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Configure API Key

```bash
# In backend/.env, add your Gemini API key:
GEMINI_API_KEY=your_actual_api_key_here
```

> Get a free API key at: https://aistudio.google.com/

### 3. Start Development Servers

**Terminal 1 – Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 – Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### 4. Open in Browser

Visit **http://localhost:3000** 🎉

---

## 🎮 Demo Mode

No API key? No problem! Click **"Try Demo"** on the login page to explore the interface with sample data.

**Demo credentials:**
- Email: `demo@aurabot.ai`
- Password: `demo123`

---

## 📁 Project Structure

```
AuraBot26/
├── frontend/                  # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx   # Main chat UI
│   │   │   ├── MessageBubble.jsx   # Message rendering + markdown
│   │   │   ├── Sidebar.jsx         # Chat list with search/filter
│   │   │   ├── TypingIndicator.jsx # AI thinking animation
│   │   │   └── ProtectedRoute.jsx  # Auth guard
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx     # Hero + features + testimonials
│   │   │   ├── LoginPage.jsx       # Auth with demo login
│   │   │   ├── SignupPage.jsx      # Registration with password strength
│   │   │   ├── ChatPage.jsx        # Chat wrapper
│   │   │   └── DashboardPage.jsx   # Analytics + charts
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Auth state management
│   │   │   └── ChatContext.jsx     # Chat state + API calls
│   │   └── utils/
│   │       └── pdfExport.js        # jsPDF chat export
│   ├── index.html
│   └── vite.config.js
│
└── backend/                   # Node.js + Express
    ├── routes/
    │   ├── auth.js             # JWT auth endpoints
    │   ├── chat.js             # Gemini AI integration
    │   └── chats.js            # Chat history CRUD
    ├── .env                    # Environment variables
    └── server.js               # Express app entry
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register new user |
| `POST` | `/api/auth/login` | User login |
| `GET` | `/api/auth/me` | Get current user |
| `POST` | `/api/chat` | Send message to Gemini AI |
| `GET` | `/api/chats` | Get chat history |
| `POST` | `/api/chats` | Create new chat |
| `DELETE` | `/api/chats/:id` | Delete a chat |
| `GET` | `/api/health` | Health check |

---

## 🌐 Deployment

### Deploy to Vercel (Frontend)

```bash
cd frontend
npm run build
# Deploy the dist/ folder to Vercel
```

Add to `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Deploy Backend to Railway/Render

1. Push backend folder to GitHub
2. Connect to Railway or Render
3. Set environment variables:
   - `GEMINI_API_KEY`
   - `JWT_SECRET`
   - `NODE_ENV=production`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5 |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion 11 |
| **Routing** | React Router DOM v6 |
| **Charts** | Recharts |
| **PDF Export** | jsPDF |
| **HTTP** | Axios |
| **Notifications** | React Hot Toast |
| **Backend** | Node.js, Express 4 |
| **AI** | Google Gemini 2.0 Flash |
| **Auth** | JWT + bcryptjs |

---

## 🎯 Portfolio Use Cases

This project demonstrates:
- ✅ Full-stack React + Node.js architecture
- ✅ Third-party AI API integration (Gemini)
- ✅ Modern UI/UX with animations and dark theme
- ✅ Authentication system with JWT
- ✅ Data visualization with charts
- ✅ State management with React Context
- ✅ RESTful API design
- ✅ Responsive design for all screen sizes

**Perfect for:** Data Analyst, Research Analyst, Software Engineer, and Fresher portfolios.

---

## 📄 License

MIT License – feel free to use this for your portfolio!

---

<div align="center">
  <strong>Built with ❤️ using Google Gemini AI</strong><br/>
  <em>AuraBot – Smart AI Assistant</em>
</div>
