"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { signIn, signUp, resetPassword } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      if (isForgotPassword) {
        await resetPassword(email);
        setSuccessMessage("Password reset email sent! Check your inbox.");
      } else if (isSignUp) {
        await signUp(email, password);
        onClose();
      } else {
        await signIn(email, password);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    }
  };

  const handleBackToSignIn = () => {
    setIsForgotPassword(false);
    setError("");
    setSuccessMessage("");
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-lg max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold mb-2">
          {isForgotPassword ? "Reset Password" : isSignUp ? "Create Account" : "Sign In"}
        </h2>
        <p className="text-zinc-400 mb-6">
          {isForgotPassword 
            ? "Enter your email to receive a password reset link"
            : isSignUp 
              ? "Join Chillzone to start gaming" 
              : "Welcome back to Chillzone"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-accent transition-colors"
              required
            />
          </div>

          {!isForgotPassword && (
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-accent transition-colors"
                required
                minLength={6}
              />
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {successMessage && (
            <p className="text-green-400 text-sm">{successMessage}</p>
          )}

          <button
            type="submit"
            className="w-full px-6 py-3 bg-accent hover:bg-accent/90 text-black font-semibold rounded-lg transition-colors"
          >
            {isForgotPassword ? "Send Reset Email" : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          {!isForgotPassword && !isSignUp && (
            <button
              onClick={() => {
                setIsForgotPassword(true);
                setError("");
                setSuccessMessage("");
              }}
              className="text-zinc-400 hover:text-white transition-colors text-sm block w-full"
            >
              Forgot your password?
            </button>
          )}
          
          {isForgotPassword ? (
            <button
              onClick={handleBackToSignIn}
              className="text-zinc-400 hover:text-white transition-colors text-sm block w-full"
            >
              Back to Sign In
            </button>
          ) : (
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
                setSuccessMessage("");
              }}
              className="text-zinc-400 hover:text-white transition-colors text-sm block w-full"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
