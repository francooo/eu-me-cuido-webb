import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      authApi.me()
        .then(setUser)
        .catch(() => localStorage.removeItem('auth_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login({ email, password });
    localStorage.setItem('auth_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (name, email, password) => {
    const data = await authApi.signup({ name, email, password });
    localStorage.setItem('auth_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setSelectedMember(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      selectedMember, 
      setSelectedMember,
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
