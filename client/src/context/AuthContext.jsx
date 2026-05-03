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
    if (token && username) {
      setUser({ username, token });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password });
      const { token, username: returnedUsername } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('username', returnedUsername);
      setUser({ username: returnedUsername, token });
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-background text-white">Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
