import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ArrowRight, MessageSquare, Zap, Shield,
  Code, BookOpen, BarChart2, PenTool, Star, ChevronRight,
  GitFork, Link2
} from 'lucide-react';

const FEATURES = [
  { icon: Code, title: 'Code Assistant', desc: 'Debug, write, and explain code in 20+ languages with intelligent suggestions.', color: '#6366f1' },
  { icon: BarChart2, title: 'Data Analytics', desc: 'Analyze datasets, generate insights, and create data narratives instantly.', color: '#8b5cf6' },
  { icon: PenTool, title: 'Content Writing', desc: 'Draft emails, reports, and creative content with professional polish.', color: '#06b6d4' },
  { icon: BookOpen, title: 'Deep Research', desc: 'Synthesize information, summarize papers, and explore complex topics.', color: '#10b981' },
  { icon: Zap, title: 'Instant Answers', desc: 'Get fast, accurate responses to any question with cited explanations.', color: '#f59e0b' },
  { icon: Shield, title: 'Privacy First', desc: 'Your conversations stay private. We never train on your data.', color: '#ef4444' },
];

const TESTIMONIALS = [
  { name: 'Arjun Sharma', role: 'Data Analyst', text: 'AuraBot transformed how I handle data queries. It\'s like having a senior analyst available 24/7.', rating: 5 },
  { name: 'Priya Mehta', role: 'Research Analyst', text: 'The research capabilities are unmatched. I can synthesize complex papers in minutes.', rating: 5 },
  { name: 'Rohan Dev', role: 'Software Engineer', text: 'Best coding assistant I\'ve used. It understands context and provides production-ready code.', rating: 5 },
];

// Animated bot SVG illustration
const BotIllustration = () => (
  <div className="relative w-64 h-64 mx-auto">
    {/* Orbit rings */}
    <div className="absolute inset-0 rounded-full" style={{ border: '1px dashed rgba(99,102,241,0.3)', animation: 'spin 20s linear infinite' }} />
    <div className="absolute inset-4 rounded-full" style={{ border: '1px dashed rgba(139,92,246,0.2)', animation: 'spin 15s linear infinite reverse' }} />

    {/* Main bot body */}
    <motion.div
      animate={{ y: [-8, 8, -8] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="w-36 h-36 rounded-3xl flex items-center justify-center relative"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          boxShadow: '0 20px 60px rgba(99,102,241,0.5), 0 0 40px rgba(139,92,246,0.3)',
        }}>
        {/* Bot face */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-3">
            <div className="w-4 h-4 rounded-full bg-white/90" style={{ boxShadow: '0 0 10px rgba(255,255,255,0.8)' }} />
            <div className="w-4 h-4 rounded-full bg-white/90" style={{ boxShadow: '0 0 10px rgba(255,255,255,0.8)' }} />
          </div>
          <div className="w-10 h-2 rounded-full bg-white/70" />
        </div>
        {/* Antenna */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-1 h-6 bg-white/50 rounded-full" />
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
          style={{ background: '#06b6d4', boxShadow: '0 0 10px #06b6d4' }} />
      </div>
    </motion.div>

    {/* Floating badges */}
    {[
      { label: 'AI', x: -20, y: 30, color: '#6366f1', delay: 0 },
      { label: '⚡', x: 200, y: 50, color: '#8b5cf6', delay: 0.5 },
      { label: '✨', x: 180, y: 180, color: '#06b6d4', delay: 1 },
      { label: '🔥', x: -10, y: 190, color: '#f59e0b', delay: 1.5 },
    ].map((badge, i) => (
      <motion.div
        key={i}
        animate={{ y: [-5, 5, -5], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, delay: badge.delay }}
        className="absolute w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white"
        style={{ left: badge.x, top: badge.y, background: badge.color, boxShadow: `0 0 15px ${badge.color}66` }}
      >
        {badge.label}
      </motion.div>
    ))}
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-lg gradient-text">AuraBot</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: '#9090b0' }}>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
          <a href="#pricing" className="hover:text-white transition-colors">Use Cases</a>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')}
            className="text-sm px-4 py-2 rounded-xl transition-all hover:text-white"
            style={{ color: '#9090b0' }}>
            Sign In
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/signup')}
            className="btn-primary text-sm px-4 py-2"
          >
            Get Started Free
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl"
            style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto text-center relative z-10"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)' }}>
            <Sparkles size={14} color="#6366f1" />
            <span className="text-xs font-medium" style={{ color: '#6366f1' }}>Powered by Groq · Gemini · GPT-4o — Free Forever</span>
          </motion.div>

          {/* Title */}
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            <span style={{ color: '#f0f0ff' }}>Meet </span>
            <span className="gradient-text neon-text">AuraBot</span>
            <br />
            <span style={{ color: '#f0f0ff' }}>Your </span>
            <span className="gradient-text">Smart AI</span>
            <br />
            <span style={{ color: '#f0f0ff' }}>Assistant</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: '#9090b0' }}>
            Supercharge your productivity with AI-powered conversations. Code smarter, research deeper,
            write better — all in one beautiful interface.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="btn-primary flex items-center gap-2 text-base px-8 py-4 neon-glow"
            >
              <Sparkles size={18} />
              Start Chatting Free
              <ArrowRight size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 text-base px-8 py-4 rounded-xl font-semibold transition-all"
              style={{
                background: 'transparent',
                border: '1px solid #2a2a3a',
                color: '#c0c0d0',
              }}
            >
              <MessageSquare size={18} />
              View Demo
            </motion.button>
          </motion.div>

          {/* Bot Illustration */}
          <motion.div variants={itemVariants}>
            <BotIllustration />
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-8 mt-16 pt-8"
            style={{ borderTop: '1px solid #1e1e2e' }}>
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '1M+', label: 'Messages Sent' },
              { value: '99.9%', label: 'Uptime' },
              { value: '4.9/5', label: 'Rating' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                <p className="text-xs" style={{ color: '#666680' }}>{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <Zap size={12} color="#6366f1" />
              <span className="text-xs font-medium" style={{ color: '#6366f1' }}>CAPABILITIES</span>
            </div>
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#f0f0ff' }}>
              Everything You Need,<br /><span className="gradient-text">All in One Place</span>
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: '#9090b0' }}>
              From complex data analysis to creative writing, AuraBot handles it all with precision and intelligence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="p-6 rounded-2xl card-hover"
                  style={{ background: '#111118', border: '1px solid #1e1e2e' }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${feat.color}20`, border: `1px solid ${feat.color}40` }}>
                    <Icon size={22} color={feat.color} />
                  </div>
                  <h3 className="text-base font-bold mb-2" style={{ color: '#f0f0ff' }}>{feat.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#9090b0' }}>{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6" style={{ background: '#0d0d15' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#f0f0ff' }}>
              Loved by <span className="gradient-text">Professionals</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl"
                style={{ background: '#111118', border: '1px solid #1e1e2e' }}
              >
                <div className="flex gap-1 mb-4">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: '#c0c0d0' }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: '#f0f0ff' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: '#666680' }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))',
              border: '1px solid rgba(99,102,241,0.3)',
            }}
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl"
              style={{ background: '#6366f1' }} />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-20 blur-3xl"
              style={{ background: '#8b5cf6' }} />
            <div className="relative z-10">
              <Sparkles size={36} className="mx-auto mb-4" color="#6366f1" />
              <h2 className="text-4xl font-extrabold mb-4 gradient-text">
                Ready to Get Smarter?
              </h2>
              <p className="mb-8" style={{ color: '#9090b0' }}>
                Join thousands of analysts, developers, and researchers using AuraBot to accelerate their work.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className="btn-primary inline-flex items-center gap-2 text-base px-10 py-4 neon-glow"
              >
                <Sparkles size={18} />
                Start for Free Today
                <ChevronRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Creator Credit Section */}
      <section className="py-16 px-6" style={{ background: '#0d0d15', borderTop: '1px solid #1e1e2e' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl relative overflow-hidden"
            style={{ background: '#111118', border: '1px solid #2a2a3a' }}
          >
            {/* Background glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-15 blur-3xl"
              style={{ background: '#8b5cf6' }} />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-15 blur-3xl"
              style={{ background: '#6366f1' }} />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0 text-center">
                <div className="w-24 h-24 rounded-3xl mx-auto mb-3 flex items-center justify-center text-3xl font-black text-white"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    boxShadow: '0 12px 40px rgba(99,102,241,0.4)',
                  }}>
                  SC
                </div>
                <div className="flex gap-2 justify-center">
                  <a href="https://github.com/Surajchauhan27" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                    style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7' }}>
                    <GitFork size={12} /> GitHub
                  </a>
                  <a href="https://linkedin.com/in/codewithsuraj" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                    style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4' }}>
                    <Link2 size={12} /> LinkedIn
                  </a>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
                  style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)' }}>
                  <Star size={12} fill="#f59e0b" color="#f59e0b" />
                  <span className="text-xs font-semibold" style={{ color: '#a5b4fc' }}>Creator &amp; Developer</span>
                </div>
                <h3 className="text-2xl font-extrabold mb-1" style={{ color: '#f0f0ff' }}>
                  Suraj Chauhan
                </h3>
                <p className="text-sm font-medium mb-3" style={{ color: '#8b5cf6' }}>
                  Data Analyst · Research Analyst · AI Enthusiast · Power BI Developer
                </p>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#9090b0' }}>
                  AuraBot was built by Suraj Chauhan — a BCA graduate passionate about AI, analytics, and
                  business intelligence. He specializes in Python, SQL, Power BI, and modern web technologies
                  to create data-driven applications that solve real-world problems.
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {['Python','SQL','Power BI','Pandas','React.js','Node.js','Data Viz','AI Apps'].map((s,i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-5 text-center" style={{ borderTop: '1px solid #2a2a3a' }}>
              <p className="text-sm italic" style={{ color: '#9090b0' }}>
                "My goal is to build smart, user-friendly, and data-driven applications that solve real-world problems
                while continuously improving my technical and analytical skills."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center" style={{ borderTop: '1px solid #1e1e2e', color: '#666680' }}>
        <p className="text-sm">
          Designed &amp; Developed by{' '}
          <a href="https://github.com/Surajchauhan27" target="_blank" rel="noopener noreferrer"
            className="font-bold gradient-text hover:opacity-80 transition-opacity">Suraj Chauhan</a>
          {' '}·{' '}
          <span className="gradient-text font-semibold">AuraBot AI Assistant</span>
          {' '}© 2026
        </p>
        <p className="text-xs mt-1" style={{ color: '#444460' }}>
          Data Analyst · Research Analyst · AI Enthusiast · Power BI Developer
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
