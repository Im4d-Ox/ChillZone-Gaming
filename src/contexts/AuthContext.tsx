"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset
} from "firebase/auth";
import { auth, isFirebaseInitialized } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseInitialized) {
      console.warn("Firebase not initialized. Auth features will be disabled.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isFirebaseInitialized) {
      throw new Error("Firebase is not initialized. Please check your environment variables.");
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    if (!isFirebaseInitialized) {
      throw new Error("Firebase is not initialized. Please check your environment variables.");
    }
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    if (!isFirebaseInitialized) {
      return;
    }
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    if (!isFirebaseInitialized) {
      throw new Error("Firebase is not initialized. Please check your environment variables.");
    }
    await sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/reset-password`,
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
