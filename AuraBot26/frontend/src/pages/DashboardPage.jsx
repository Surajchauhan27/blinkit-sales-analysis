import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2, MessageSquare, TrendingUp, Clock, Zap,
  Code, BookOpen, PenTool, User, LogOut, Settings,
  ChevronRight, Activity
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

const WEEKLY_DATA = [
  { day: 'Mon', messages: 12, queries: 8 },
  { day: 'Tue', messages: 24, queries: 18 },
  { day: 'Wed', messages: 8, queries: 5 },
  { day: 'Thu', messages: 31, queries: 22 },
  { day: 'Fri', messages: 19, queries: 14 },
  { day: 'Sat', messages: 42, queries: 30 },
  { day: 'Sun', messages: 15, queries: 11 },
];

const CATEGORY_DATA = [
  { name: 'Coding', value: 35, color: '#6366f1' },
  { name: 'Research', value: 25, color: '#8b5cf6' },
  { name: 'Writing', value: 20, color: '#06b6d4' },
  { name: 'Analytics', value: 15, color: '#10b981' },
  { name: 'General', value: 5, color: '#f59e0b' },
];

const TOP_PROMPTS = [
  { prompt: 'Write Python code for...', count: 28, icon: '🐍' },
  { prompt: 'Explain machine learning...', count: 19, icon: '🤖' },
  { prompt: 'Analyze this data...', count: 15, icon: '📊' },
  { prompt: 'Write a report on...', count: 12, icon: '📝' },
  { prompt: 'Debug this error...', count: 9, icon: '🔧' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-xl text-xs"
        style={{ background: '#1e1e2e', border: '1px solid #2a2a3a', color: '#f0f0ff' }}>
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ icon: Icon, label, value, change, color }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="p-5 rounded-2xl card-hover"
    style={{ background: '#111118', border: '1px solid #1e1e2e' }}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
        <Icon size={18} color={color} />
      </div>
      <span className="text-xs font-medium px-2 py-1 rounded-lg"
        style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
        {change}
      </span>
    </div>
    <p className="text-2xl font-bold mb-1" style={{ color: '#f0f0ff' }}>{value}</p>
    <p className="text-xs" style={{ color: '#9090b0' }}>{label}</p>
  </motion.div>
);

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { chats } = useChat();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  const totalMessages = chats.reduce((s, c) => s + c.messages.length, 0);
  const stats = [
    { icon: MessageSquare, label: 'Total Conversations', value: chats.length, change: '+12%', color: '#6366f1' },
    { icon: Activity, label: 'Messages Sent', value: totalMessages + 151, change: '+8%', color: '#8b5cf6' },
    { icon: Zap, label: 'Avg Response Time', value: '1.2s', change: '-5%', color: '#06b6d4' },
    { icon: TrendingUp, label: 'Queries This Week', value: 108, change: '+23%', color: '#10b981' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      {/* Top Nav */}
      <div className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1e1e2e' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold gradient-text">AuraBot Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/chat')}
            className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
          >
            <MessageSquare size={14} />
            Open Chat
          </motion.button>
          <button onClick={logout} className="p-2 rounded-xl transition-all"
            style={{ background: '#111118', border: '1px solid #2a2a3a', color: '#9090b0' }}>
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: '#f0f0ff' }}>
              Welcome back, <span className="gradient-text">{user?.name || 'User'}</span> 👋
            </h1>
            <p className="text-sm" style={{ color: '#9090b0' }}>
              Here's your AI usage overview for this week
            </p>
          </div>
          <a href="https://github.com/Surajchauhan27" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all hover:scale-105 self-start md:self-auto"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc', textDecoration: 'none' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>SC</div>
            <div>
              <p className="text-xs font-semibold" style={{ color: '#f0f0ff' }}>Suraj Chauhan</p>
              <p className="text-xs" style={{ color: '#8b5cf6' }}>Creator &amp; Developer ⭐</p>
            </div>
          </a>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-2 p-6 rounded-2xl"
            style={{ background: '#111118', border: '1px solid #1e1e2e' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold" style={{ color: '#f0f0ff' }}>Weekly Activity</h3>
                <p className="text-xs" style={{ color: '#9090b0' }}>Messages and queries over 7 days</p>
              </div>
              <BarChart2 size={18} color="#6366f1" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={WEEKLY_DATA}>
                <defs>
                  <linearGradient id="msgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="qryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                <XAxis dataKey="day" tick={{ fill: '#666680', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#666680', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="messages" name="Messages" stroke="#6366f1" fill="url(#msgGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="queries" name="Queries" stroke="#06b6d4" fill="url(#qryGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl"
            style={{ background: '#111118', border: '1px solid #1e1e2e' }}
          >
            <div className="mb-4">
              <h3 className="font-semibold" style={{ color: '#f0f0ff' }}>Query Categories</h3>
              <p className="text-xs" style={{ color: '#9090b0' }}>Breakdown by type</p>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
                  dataKey="value" stroke="none">
                  {CATEGORY_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#1e1e2e', border: '1px solid #2a2a3a', borderRadius: 8, color: '#f0f0ff', fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {CATEGORY_DATA.map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                    <span className="text-xs" style={{ color: '#9090b0' }}>{cat.name}</span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: '#f0f0ff' }}>{cat.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Prompts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl"
            style={{ background: '#111118', border: '1px solid #1e1e2e' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: '#f0f0ff' }}>Most Used Prompts</h3>
              <Zap size={16} color="#f59e0b" />
            </div>
            <div className="space-y-3">
              {TOP_PROMPTS.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-lg">{p.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: '#c0c0d0' }}>{p.prompt}</p>
                    <div className="h-1.5 rounded-full mt-1 overflow-hidden" style={{ background: '#1e1e2e' }}>
                      <div className="h-full rounded-full"
                        style={{ width: `${(p.count / 30) * 100}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
                    </div>
                  </div>
                  <span className="text-xs font-bold flex-shrink-0" style={{ color: '#666680' }}>{p.count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Conversations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="p-6 rounded-2xl"
            style={{ background: '#111118', border: '1px solid #1e1e2e' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: '#f0f0ff' }}>Recent Conversations</h3>
              <Clock size={16} color="#06b6d4" />
            </div>
            <div className="space-y-3">
              {chats.slice(0, 5).map((chat, i) => (
                <div key={i}
                  onClick={() => navigate('/chat')}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                  style={{ background: '#0d0d15', border: '1px solid #1e1e2e' }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>
                    <MessageSquare size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: '#c0c0d0' }}>{chat.title}</p>
                    <p className="text-xs" style={{ color: '#666680' }}>{chat.messages.length} messages</p>
                  </div>
                  <ChevronRight size={14} color="#666680" />
                </div>
              ))}
              {chats.length === 0 && (
                <div className="text-center py-6" style={{ color: '#666680' }}>
                  <MessageSquare size={24} className="mx-auto mb-2 opacity-30" />
                  <p className="text-xs">No conversations yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
