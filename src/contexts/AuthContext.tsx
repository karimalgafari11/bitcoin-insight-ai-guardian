
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthSession, User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  signIn: (user: any) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: () => {},
  signOut: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's an active session on mount
    const getInitialSession = async () => {
      setLoading(true);

      try {
        const { data } = await supabase.auth.getSession();
        
        console.info("Auth state changed: INITIAL_SESSION");
        
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
          console.info("Initial session found:", data.session.user.email);
        } else {
          console.info("No initial session");
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.info("Auth state changed:", event);
        
        if (newSession) {
          setSession(newSession);
          setUser(newSession.user);
          console.info("New session:", newSession.user.email);
        } else {
          setSession(null);
          setUser(null);
          console.info("No session");
        }

        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Simplified signIn for demo purposes
  const signIn = (userData: any) => {
    setUser(userData);
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
