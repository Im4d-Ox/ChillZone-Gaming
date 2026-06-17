"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/sections/Footer";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [validCode, setValidCode] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  useEffect(() => {
    if (!oobCode) {
      setError("Invalid password reset link. Please request a new one.");
      setLoading(false);
      return;
    }

    // Verify the reset code
    verifyPasswordResetCode(auth, oobCode)
      .then(() => {
        setValidCode(true);
        setLoading(false);
      })
      .catch((err) => {
        setError("Invalid or expired reset link. Please request a new one.");
        setLoading(false);
      });
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode!, password);
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mb-4"></div>
            <p className="text-zinc-400">Verifying reset link...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-lg max-w-md w-full mx-4">
          {!validCode ? (
            <>
              <h2 className="text-4xl font-bold mb-2 text-red-400">Invalid Link</h2>
              <p className="text-zinc-400 mb-6">
                {error || "This password reset link is invalid or has expired."}
              </p>
              <button
                onClick={() => router.push("/auth")}
                className="w-full px-6 py-3 bg-accent hover:bg-accent/90 text-black font-semibold rounded-lg transition-colors"
              >
                Request New Reset Link
              </button>
            </>
          ) : success ? (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-4xl font-bold mb-2">Password Reset!</h2>
                <p className="text-zinc-400">
                  Your password has been successfully reset. Redirecting to sign in...
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold mb-2">Reset Password</h2>
              <p className="text-zinc-400 mb-6">
                Enter your new password below to complete the reset process.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-accent transition-colors"
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-accent transition-colors"
                    required
                    minLength={6}
                    placeholder="Re-enter your password"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-accent hover:bg-accent/90 text-black font-semibold rounded-lg transition-colors"
                >
                  Reset Password
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => router.push("/auth")}
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  ← Back to Sign In
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
