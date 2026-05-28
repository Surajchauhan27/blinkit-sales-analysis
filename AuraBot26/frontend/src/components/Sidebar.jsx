import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, MessageSquare, Trash2,
  Code, BookOpen, PenTool, BarChart2, Layers, Hash
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { CreatorBadge } from './CreatorProfile';

const CATEGORIES = [
  { id: 'all', label: 'All Chats', icon: Layers },
  { id: 'coding', label: 'Coding', icon: Code },
  { id: 'research', label: 'Research', icon: BookOpen },
  { id: 'writing', label: 'Writing', icon: PenTool },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'general', label: 'General', icon: Hash },
];

const Sidebar = ({ isOpen, onClose }) => {
  const {
    filteredChats, activeChatId, setActiveChatId, createNewChat,
    deleteChat, searchQuery, setSearchQuery, activeCategory, setActiveCategory,
  } = useChat();

  const [deletingId, setDeletingId] = useState(null);

  const handleNewChat = () => {
    createNewChat();
    onClose?.();
  };

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    onClose?.();
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    setDeletingId(id);
    setTimeout(() => {
      deleteChat(id);
      setDeletingId(null);
    }, 300);
  };

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (d > 0) return `${d}d ago`;
    if (h > 0) return `${h}h ago`;
    return 'Just now';
  };

  const getCategoryIcon = (cat) => {
    const found = CATEGORIES.find(c => c.id === cat);
    const Icon = found?.icon || Hash;
    return <Icon size={12} />;
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: '#0d0d15', borderRight: '1px solid #1e1e2e', width: 280 }}
    >
      {/* Header */}
      <div className="p-4 flex items-center gap-3" style={{ borderBottom: '1px solid #1e1e2e' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <span className="font-bold text-base gradient-text">AuraBot</span>
        <div className="ml-auto">
          <div className="w-2 h-2 rounded-full bg-green-400 pulse-glow" />
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNewChat}
          className="w-full btn-primary flex items-center gap-2 justify-center text-sm py-2.5"
        >
          <Plus size={16} />
          New Conversation
        </motion.button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#666680' }} />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl text-sm outline-none"
            style={{ background: '#111118', border: '1px solid #2a2a3a', color: '#f0f0ff' }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-3 pb-3">
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: activeCategory === cat.id ? 'rgba(99,102,241,0.2)' : '#111118',
                  border: `1px solid ${activeCategory === cat.id ? '#6366f1' : '#2a2a3a'}`,
                  color: activeCategory === cat.id ? '#6366f1' : '#9090b0',
                }}
              >
                <Icon size={10} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        <div className="text-xs font-semibold mb-2 px-2" style={{ color: '#666680', letterSpacing: '0.05em' }}>
          RECENT CONVERSATIONS
        </div>
        <AnimatePresence>
          {filteredChats.length === 0 ? (
            <div className="text-center py-8" style={{ color: '#666680' }}>
              <MessageSquare size={24} className="mx-auto mb-2 opacity-40" />
              <p className="text-xs">No chats found</p>
            </div>
          ) : (
            filteredChats.map(chat => (
              <motion.div
                key={chat.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: deletingId === chat.id ? 0 : 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleSelectChat(chat.id)}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 cursor-pointer transition-all sidebar-item"
                style={{
                  background: activeChatId === chat.id ? 'rgba(99,102,241,0.15)' : 'transparent',
                  border: `1px solid ${activeChatId === chat.id ? 'rgba(99,102,241,0.3)' : 'transparent'}`,
                }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>
                  {getCategoryIcon(chat.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: activeChatId === chat.id ? '#f0f0ff' : '#c0c0d0' }}>
                    {chat.title}
                  </p>
                  <p className="text-xs" style={{ color: '#666680' }}>
                    {chat.messages.length} msgs · {timeAgo(chat.createdAt)}
                  </p>
                </div>
                <button
                  onClick={e => handleDelete(e, chat.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-all"
                >
                  <Trash2 size={12} color="#ef4444" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Creator Badge at the bottom */}
      <div className="p-3 flex-shrink-0" style={{ borderTop: '1px solid #1e1e2e' }}>
        <CreatorBadge />
      </div>
    </div>
  );
};

export default Sidebar;
