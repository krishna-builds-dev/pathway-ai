// components/providers/AuthProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import type {
  User,
  SupabaseClient,
} from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type AuthContextType = {
  user: User | null;
  supabase: SupabaseClient;
  isLoading: boolean;            // ✅ added
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => subscription.unsubscribe();
  }, [supabase]);

  const value = useMemo(
    () => ({
      user,
      supabase,
      isLoading: false,   // ✅ always resolved, no loading
    }),
    [user, supabase]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}