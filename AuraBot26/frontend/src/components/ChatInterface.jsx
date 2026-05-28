import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Mic, MicOff, Trash2, Download, Menu, X,
  Sparkles, ChevronRight
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import Sidebar from './Sidebar';
import { exportChatAsPDF } from '../utils/pdfExport';

const SUGGESTED_PROMPTS = [
  { icon: '🐍', text: 'Write a Python script for data analysis', category: 'coding' },
  { icon: '📊', text: 'Explain machine learning concepts', category: 'analytics' },
  { icon: '✍️', text: 'Write a professional cover letter', category: 'writing' },
  { icon: '🔍', text: 'Research trends in AI industry 2025', category: 'research' },
  { icon: '⚙️', text: 'Debug this JavaScript code', category: 'coding' },
  { icon: '📈', text: 'Analyze this dataset and find insights', category: 'analytics' },
];

const ChatInterface = () => {
  const { user, logout } = useAuth();
  const {
    activeChat, activeChatId, isLoading, sendMessage, createNewChat, clearChat, activeModel,
  } = useChat();

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeChatId]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    let chatId = activeChatId;
    if (!chatId) chatId = createNewChat();
    const msg = input.trim();
    setInput('');
    await sendMessage(msg, chatId);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
    };
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  };

  const handleExportPDF = () => {
    if (!activeChat) return;
    exportChatAsPDF(activeChat);
  };

  const handleSuggestedPrompt = (prompt) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const messages = activeChat?.messages || [];
  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-full z-50 md:hidden"
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid #1e1e2e', background: '#0d0d15' }}>
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setSidebarOpen(true)}>
              <Menu size={20} color="#9090b0" />
            </button>
            <div>
              <h2 className="text-sm font-semibold" style={{ color: '#f0f0ff' }}>
                {activeChat?.title || 'AuraBot AI Assistant'}
              </h2>
              <p className="text-xs flex items-center gap-1.5" style={{ color: '#666680' }}>
                {isLoading ? (
                  <span style={{ color: '#6366f1' }}>⚡ Generating response...</span>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{ boxShadow: '0 0 6px #4ade80' }} />
                    Online &middot; <span style={{ color: '#8b5cf6' }}>{activeModel}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeChat && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleExportPDF}
                  className="p-2 rounded-lg text-xs flex items-center gap-1 transition-all"
                  style={{ background: '#111118', border: '1px solid #2a2a3a', color: '#9090b0' }}
                  title="Export as PDF"
                >
                  <Download size={14} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => clearChat(activeChatId)}
                  className="p-2 rounded-lg transition-all"
                  style={{ background: '#111118', border: '1px solid #2a2a3a', color: '#9090b0' }}
                  title="Clear chat"
                >
                  <Trash2 size={14} />
                </motion.button>
              </>
            )}
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #6366f1)', color: 'white' }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4">
          {isEmpty ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full px-6 text-center"
            >
              <div className="w-20 h-20 rounded-3xl mb-6 flex items-center justify-center float-animation"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 20px 60px rgba(99,102,241,0.4)' }}>
                <Sparkles size={36} color="white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 gradient-text">How can I help you today?</h3>
              <p className="mb-8 text-sm max-w-md" style={{ color: '#9090b0' }}>
                Ask me anything – coding, research, writing, analytics, or just have a conversation.
              </p>

              {/* Suggested Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-2xl">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSuggestedPrompt(prompt.text)}
                    className="flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                    style={{
                      background: '#111118',
                      border: '1px solid #2a2a3a',
                      color: '#c0c0d0',
                    }}
                  >
                    <span className="text-lg flex-shrink-0">{prompt.icon}</span>
                    <span className="text-xs leading-relaxed">{prompt.text}</span>
                    <ChevronRight size={12} className="ml-auto flex-shrink-0" style={{ color: '#666680' }} />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <>
              {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <AnimatePresence>
                {isLoading && <TypingIndicator />}
              </AnimatePresence>
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="px-4 py-4 flex-shrink-0" style={{ borderTop: '1px solid #1e1e2e', background: '#0d0d15' }}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-2 p-3 rounded-2xl"
              style={{ background: '#111118', border: '1px solid #2a2a3a' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message AuraBot... (Enter to send, Shift+Enter for new line)"
                rows={1}
                className="flex-1 resize-none outline-none bg-transparent text-sm leading-relaxed"
                style={{ color: '#f0f0ff', minHeight: 24, maxHeight: 120 }}
                onInput={e => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
              />

              <div className="flex items-center gap-2 flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={handleVoice}
                  className="p-2 rounded-xl transition-all"
                  style={{
                    background: isListening ? 'rgba(239,68,68,0.2)' : 'transparent',
                    color: isListening ? '#ef4444' : '#666680',
                  }}
                  title="Voice input"
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-2 rounded-xl transition-all"
                  style={{
                    background: input.trim() && !isLoading ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#1e1e2e',
                    color: input.trim() && !isLoading ? 'white' : '#666680',
                    cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  }}
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </div>
            <p className="text-center text-xs mt-2" style={{ color: '#444460' }}>
              AuraBot can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
