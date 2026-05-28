import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, User } from 'lucide-react';

const formatContent = (content) => {
  // Basic markdown-like formatting
  const lines = content.split('\n');
  const elements = [];
  let inCode = false;
  let codeLines = [];
  let codeLang = '';
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('```')) {
      if (!inCode) {
        inCode = true;
        codeLang = line.slice(3).trim();
        codeLines = [];
      } else {
        elements.push(
          <div key={key++} className="my-3 rounded-xl overflow-hidden" style={{ background: '#0d0d1a', border: '1px solid #2a2a3a' }}>
            {codeLang && (
              <div className="px-4 py-2 text-xs font-mono flex justify-between items-center" style={{ background: '#111118', color: '#9090b0', borderBottom: '1px solid #2a2a3a' }}>
                <span>{codeLang}</span>
                <span className="text-xs" style={{ color: '#6366f1' }}>code</span>
              </div>
            )}
            <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed" style={{ color: '#e2e8f0' }}>
              <code>{codeLines.join('\n')}</code>
            </pre>
          </div>
        );
        inCode = false;
        codeLines = [];
        codeLang = '';
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (line.startsWith('# ')) {
      elements.push(<h1 key={key++} className="text-xl font-bold mb-2 mt-3" style={{ color: '#f0f0ff' }}>{line.slice(2)}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className="text-lg font-semibold mb-2 mt-3" style={{ color: '#f0f0ff' }}>{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} className="text-base font-semibold mb-1 mt-2" style={{ color: '#e0e0f0' }}>{line.slice(4)}</h3>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={key++} className="ml-4 mb-1 text-sm" style={{ color: '#d0d0e0', listStyleType: 'disc' }}>
          {formatInline(line.slice(2))}
        </li>
      );
    } else if (/^\d+\.\s/.test(line)) {
      elements.push(
        <li key={key++} className="ml-4 mb-1 text-sm" style={{ color: '#d0d0e0', listStyleType: 'decimal' }}>
          {formatInline(line.replace(/^\d+\.\s/, ''))}
        </li>
      );
    } else if (line.trim() === '') {
      elements.push(<br key={key++} />);
    } else {
      elements.push(
        <p key={key++} className="mb-1 text-sm leading-relaxed" style={{ color: '#d0d0e0' }}>
          {formatInline(line)}
        </p>
      );
    }
  }

  return elements;
};

const formatInline = (text) => {
  // Bold **text** and inline code `code`
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: '#f0f0ff' }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="px-1 rounded text-xs font-mono" style={{ background: '#1e1e2e', color: '#06b6d4' }}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

const MessageBubble = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timeStr = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 px-4 py-2 group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : ''
      }`}
        style={!isUser ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' } : {}}
      >
        {isUser
          ? <User size={14} color="white" />
          : <span className="text-white text-xs font-bold">A</span>
        }
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 ${isUser ? 'message-bubble-user' : 'message-bubble-ai'} ${isUser ? 'slide-in-right' : 'slide-in-left'}`}>
          {isUser ? (
            <p className="text-sm text-white leading-relaxed">{message.content}</p>
          ) : (
            <div className="leading-relaxed">{formatContent(message.content)}</div>
          )}
        </div>

        {/* Timestamp + Copy */}
        <div className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs" style={{ color: '#666680' }}>{timeStr}</span>
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            title="Copy message"
          >
            <AnimatePresence mode="wait">
              {copied
                ? <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check size={12} color="#10b981" />
                  </motion.div>
                : <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Copy size={12} color="#666680" />
                  </motion.div>
              }
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
