"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import supabase from "../lib/supabaseClient";
import { User, Session, WeakPassword } from "@supabase/supabase-js";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<
    | {
        user: User;
        session: Session;
        weakPassword?: WeakPassword;
      }
    | undefined
  >;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; session: Session | null } | undefined>;
  signOut: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      await supabase?.auth.getSession();
      supabase?.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      });
    };

    fetchSession();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const response = await supabase?.auth.signUp({
        email,
        password,
      });
      if (response?.error) {
        throw new Error(response.error.message);
      }
      if (response?.data?.user) {
        setUser(response.data.user);
        return response.data;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await supabase?.auth.signInWithPassword({
        email,
        password,
      });
      if (response?.error) {
        throw new Error(response.error.message);
      }
      if (response?.data?.user) {
        setUser(response.data.user);
        return response.data;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const signOut = async () => {
    const response = await supabase?.auth.signOut();
    if (response?.error) {
      throw new Error(response.error.message);
    }
    setUser(null);
  };

  const signInWithGithub = async () => {
    const response = await supabase?.auth.signInWithOAuth({
      provider: "github",
    });
    console.log("signInWithGithub response:", response);
    if (response?.error) {
      throw new Error(response.error.message);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGithub,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
