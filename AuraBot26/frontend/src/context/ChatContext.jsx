import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ChatContext = createContext(null);
export const useChat = () => useContext(ChatContext);

const DEMO_CHATS = [
  {
    id: 'chat-1',
    title: 'Python Data Analysis',
    category: 'coding',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    messages: [
      { id: 'm1', role: 'user', content: 'How do I analyze data with pandas?', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: 'm2', role: 'assistant', content: 'Pandas is a powerful library for data analysis in Python. Here are the key concepts:\n\n```python\nimport pandas as pd\n\n# Load data\ndf = pd.read_csv("data.csv")\n\n# Explore data\nprint(df.head())\nprint(df.describe())\nprint(df.info())\n\n# Filter rows\nfiltered = df[df["column"] > 100]\n\n# Group and aggregate\ngrouped = df.groupby("category").agg({"value": "mean"})\n```\n\nWould you like me to explain any of these in more detail?', timestamp: new Date(Date.now() - 86400000 * 2 + 1000).toISOString() },
    ]
  },
  {
    id: 'chat-2',
    title: 'Market Research Report',
    category: 'research',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    messages: [
      { id: 'm3', role: 'user', content: 'Write a brief market research report on AI chatbots.', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { id: 'm4', role: 'assistant', content: '# AI Chatbot Market Research Report\n\n## Market Overview\nThe global AI chatbot market was valued at $5.1 billion in 2023 and is projected to grow at a CAGR of 23.5% through 2030.\n\n## Key Players\n- **OpenAI** (ChatGPT) – 60%+ market awareness\n- **Google** (Gemini) – Strong enterprise adoption\n- **Anthropic** (Claude) – Trusted for accuracy\n\n## Trends\n1. Multimodal capabilities\n2. Enterprise integration\n3. Personalization at scale\n\n## Conclusion\nThe market is rapidly evolving with significant investment in foundation models.', timestamp: new Date(Date.now() - 86400000 + 2000).toISOString() },
    ]
  },
];

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState(DEMO_CHATS);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeModel, setActiveModel] = useState('Pollinations · GPT-4o');

  const activeChat = chats.find(c => c.id === activeChatId) || null;

  const createNewChat = useCallback(() => {
    const id = `chat-${uuidv4()}`;
    const newChat = {
      id,
      title: 'New Conversation',
      category: 'general',
      createdAt: new Date().toISOString(),
      messages: [],
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(id);
    return id;
  }, []);

  const sendMessage = useCallback(async (content, chatId) => {
    const cid = chatId || activeChatId;
    if (!cid) return;

    const userMsg = { id: uuidv4(), role: 'user', content, timestamp: new Date().toISOString() };
    setChats(prev => prev.map(c =>
      c.id === cid
        ? { ...c, messages: [...c.messages, userMsg], title: c.messages.length === 0 ? content.slice(0, 40) : c.title }
        : c
    ));
    setIsLoading(true);

    try {
      const token = localStorage.getItem('aurabot_token') || 'demo';
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: content, chatId: cid, history: [] }),
      });
      const data = await res.json();
      if (data.model) setActiveModel(data.model);
      const aiMsg = {
        id: uuidv4(),
        role: 'assistant',
        content: data.reply || data.error || 'Something went wrong.',
        model: data.model || 'AI',
        timestamp: new Date().toISOString(),
      };
      setChats(prev => prev.map(c =>
        c.id === cid ? { ...c, messages: [...c.messages, aiMsg] } : c
      ));
    } catch (err) {
      const errMsg = {
        id: uuidv4(),
        role: 'assistant',
        content: '⚠️ Unable to connect to the server. Make sure the backend is running on port 5000.',
        timestamp: new Date().toISOString(),
      };
      setChats(prev => prev.map(c =>
        c.id === cid ? { ...c, messages: [...c.messages, errMsg] } : c
      ));
    } finally {
      setIsLoading(false);
    }
  }, [activeChatId]);

  const deleteChat = useCallback((id) => {
    setChats(prev => prev.filter(c => c.id !== id));
    if (activeChatId === id) setActiveChatId(null);
  }, [activeChatId]);

  const clearChat = useCallback((id) => {
    setChats(prev => prev.map(c => c.id === id ? { ...c, messages: [] } : c));
  }, []);

  const updateChatCategory = useCallback((id, category) => {
    setChats(prev => prev.map(c => c.id === id ? { ...c, category } : c));
  }, []);

  const filteredChats = chats.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = activeCategory === 'all' || c.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <ChatContext.Provider value={{
      chats, filteredChats, activeChat, activeChatId, isLoading,
      activeModel,
      searchQuery, setSearchQuery, activeCategory, setActiveCategory,
      createNewChat, sendMessage, deleteChat, clearChat, updateChatCategory,
      setActiveChatId,
    }}>
      {children}
    </ChatContext.Provider>
  );
};
