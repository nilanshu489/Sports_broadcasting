import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    if (token && username) {
      setUser({ username, token, role: role || 'user' });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    const { token, username: returnedUsername, role } = res.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('username', returnedUsername);
    localStorage.setItem('role', role);
    setUser({ username: returnedUsername, token, role });
  };

  const signup = async (username, email, password) => {
    const res = await api.post('/auth/signup', { username, email, password });
    const { token, username: returnedUsername, role } = res.data;

    localStorage.setItem('token', token);
    localStorage.setItem('username', returnedUsername);
    localStorage.setItem('role', role);
    setUser({ username: returnedUsername, token, role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUser(null);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-background text-white">Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
