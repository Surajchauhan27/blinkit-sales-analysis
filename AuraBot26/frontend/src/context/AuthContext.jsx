import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('aurabot_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const u = { ...userData, id: userData.id || Date.now().toString() };
    setUser(u);
    localStorage.setItem('aurabot_user', JSON.stringify(u));
    localStorage.setItem('aurabot_token', userData.token || 'demo-token');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aurabot_user');
    localStorage.removeItem('aurabot_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
