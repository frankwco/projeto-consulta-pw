import { createContext, useContext, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nexuserp_user')); } catch { return null; }
  });

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const nextUser = { id: data.id, name: data.name, email: data.email, role: data.role };
    localStorage.setItem('nexuserp_token', data.token);
    localStorage.setItem('nexuserp_user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem('nexuserp_token');
    localStorage.removeItem('nexuserp_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout, isAdmin: user?.role === 'ADMIN' }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro de AuthProvider');
  return context;
}
