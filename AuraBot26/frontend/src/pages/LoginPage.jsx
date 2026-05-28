import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', form);
      login({ name: data.name, email: form.email, token: data.token });
      toast.success(`Welcome back, ${data.name}!`);
      navigate('/chat');
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Demo login
  const handleDemoLogin = () => {
    login({ name: 'Demo User', email: 'demo@aurabot.ai', token: 'demo-token' });
    toast.success('Welcome to AuraBot! 🎉');
    navigate('/chat');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ background: '#0a0a0f' }}>
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-bold text-xl gradient-text">AuraBot</span>
          </Link>
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: '#f0f0ff' }}>Welcome back</h1>
          <p className="text-sm" style={{ color: '#9090b0' }}>Sign in to continue your AI conversations</p>
        </div>

        {/* Form Card */}
        <div className="glass-strong rounded-3xl p-8">
          {/* Demo button */}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleDemoLogin}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl mb-6 font-semibold text-sm transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
              border: '1px solid rgba(99,102,241,0.4)',
              color: '#a5b4fc',
            }}
          >
            <Sparkles size={16} />
            Try Demo – No Account Needed
          </motion.button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: '#2a2a3a' }} />
            <span className="text-xs" style={{ color: '#666680' }}>or sign in with email</span>
            <div className="flex-1 h-px" style={{ background: '#2a2a3a' }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#9090b0' }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#666680' }} />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl outline-none text-sm transition-all"
                  style={{
                    background: '#111118',
                    border: '1px solid #2a2a3a',
                    color: '#f0f0ff',
                  }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#2a2a3a'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#9090b0' }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#666680' }} />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl outline-none text-sm"
                  style={{
                    background: '#111118',
                    border: '1px solid #2a2a3a',
                    color: '#f0f0ff',
                  }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#2a2a3a'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPass ? <EyeOff size={16} color="#666680" /> : <Eye size={16} color="#666680" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
              >
                <AlertCircle size={14} color="#ef4444" />
                <span className="text-xs" style={{ color: '#ef4444' }}>{error}</span>
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-sm font-semibold"
            >
              {loading ? (
                <div className="flex gap-1">
                  <div className="typing-dot" style={{ width: 6, height: 6 }} />
                  <div className="typing-dot" style={{ width: 6, height: 6 }} />
                  <div className="typing-dot" style={{ width: 6, height: 6 }} />
                </div>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#666680' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold" style={{ color: '#6366f1' }}>
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
