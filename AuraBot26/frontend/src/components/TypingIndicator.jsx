import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="flex items-start gap-3 px-4 py-2"
  >
    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
      <span className="text-white text-xs font-bold">A</span>
    </div>
    <div className="message-bubble-ai px-4 py-3 flex items-center gap-2">
      <span className="text-xs" style={{ color: '#9090b0' }}>AuraBot is thinking</span>
      <div className="flex gap-1">
        <div className="typing-dot" style={{ width: 6, height: 6 }} />
        <div className="typing-dot" style={{ width: 6, height: 6 }} />
        <div className="typing-dot" style={{ width: 6, height: 6 }} />
      </div>
    </div>
  </motion.div>
);

export default TypingIndicator;
