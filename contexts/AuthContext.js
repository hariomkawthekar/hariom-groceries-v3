import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial Supabase or local session
    const getInitialSession = async () => {
      try {
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setCurrentUser({
              uid: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0]
            });
          }
        } else {
          const savedUser = localStorage.getItem('mockUser');
          if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
          }
        }
      } catch (err) {
        console.error("Auth session error:", err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes if Supabase configured
    let subscription = null;
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setCurrentUser({
            uid: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0]
          });
        } else {
          setCurrentUser(null);
        }
      });
      subscription = data.subscription;
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const signup = async (email, password, name) => {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      if (error) throw error;
      const user = { uid: data.user?.id, email, name };
      setCurrentUser(user);
      return user;
    }

    // Fallback local auth
    const user = { uid: Date.now().toString(), email, name };
    localStorage.setItem('mockUser', JSON.stringify(user));
    localStorage.setItem('userName', name);
    setCurrentUser(user);
    return user;
  };

  const login = async (email, password) => {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      const user = { uid: data.user?.id, email: data.user?.email };
      setCurrentUser(user);
      return { user };
    }

    // Fallback local login
    const user = { uid: Date.now().toString(), email };
    localStorage.setItem('mockUser', JSON.stringify(user));
    setCurrentUser(user);
    return { user };
  };

  const logout = async () => {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await supabase.auth.signOut();
    }
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


