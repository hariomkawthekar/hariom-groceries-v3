import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/utils/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock auth for smooth demo
  useEffect(() => {
    // Simulate auth state
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signup = async (email, password, name) => {
    const user = { uid: Date.now().toString(), email, name };
    localStorage.setItem('mockUser', JSON.stringify(user));
    localStorage.setItem('userName', name);
    setCurrentUser(user);
    return user;
  };

  const login = async (email, password) => {
    // Mock login
    const user = { uid: Date.now().toString(), email };
    localStorage.setItem('mockUser', JSON.stringify(user));
    setCurrentUser(user);
    return { user };
  };

  const logout = async () => {
    localStorage.removeItem('mockUser');
    localStorage.removeItem('userName');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}


