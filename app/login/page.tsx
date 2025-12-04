"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import { ThemeProvider } from "../context/ThemeContext";
import HerbismLogo from "../components/HerbismLogo";
import CustomPopup from "../components/CustomPopup";
import { usePopup } from "../hooks/usePopup";
import { login, signInWithGoogle } from "@/services/authService";

function LoginContent() {
  const router = useRouter();
  const { popupState, closePopup, showSuccess, showError } = usePopup();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      showSuccess(
        "Login Berhasil!",
        "Selamat datang kembali di Herbism!",
        1500
      );
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      showError(
        "Login Gagal",
        err instanceof Error ? err.message : "Email atau password salah. Silakan coba lagi."
      );
    }
  };

  const handleSignInWithGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signInWithGoogle();
      // Check if new user to determine redirect
      if (result.isNewUser) {
        showSuccess(
          "Selamat Datang!",
          "Akun Google Anda berhasil terhubung. Mari lengkapi profil Anda.",
          2000
        );
        setTimeout(() => {
          router.push("/onboarding");
        }, 2000);
      } else {
        showSuccess(
          "Login Berhasil!",
          "Selamat datang kembali!",
          1500
        );
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (err) {
      showError(
        "Login Google Gagal",
        err instanceof Error ? err.message : "Terjadi kesalahan saat login dengan Google. Silakan coba lagi."
      );
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden">
      <div className="absolute inset-0 bg-white">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${themeColors.primary}, transparent)`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-15 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${themeColors.secondary}, transparent)`,
            animationDelay: "1s",
          }}
        />
        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 sm:p-10">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center p-4"
              style={{
                background: `linear-gradient(135deg, ${themeColors.primary}15, ${themeColors.secondary}15)`,
                boxShadow: `0 10px 40px ${themeColors.primary}20`,
                border: `2px solid ${themeColors.primary}25`,
              }}
            >
              <HerbismLogo
                color={themeColors.primary}
                className="w-full h-auto"
              />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-light text-slate-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-500 font-light">
              Masuk untuk melanjutkan perjalanan herbal Anda
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50/50 border border-slate-200/50 focus:outline-none transition-all duration-300 text-slate-900"
                  onFocus={(e) => {
                    e.target.style.borderColor = themeColors.primary;
                    e.target.style.background = "white";
                    e.target.style.boxShadow = `0 0 0 4px ${themeColors.primary}08`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f080";
                    e.target.style.background = "#f8fafc80";
                    e.target.style.boxShadow = "none";
                  }}
                  placeholder="@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50/50 border border-slate-200/50 focus:outline-none transition-all duration-300 text-slate-900"
                  onFocus={(e) => {
                    e.target.style.borderColor = themeColors.primary;
                    e.target.style.background = "white";
                    e.target.style.boxShadow = `0 0 0 4px ${themeColors.primary}08`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f080";
                    e.target.style.background = "#f8fafc80";
                    e.target.style.boxShadow = "none";
                  }}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full py-4 rounded-xl text-white font-medium transition-all duration-300 relative overflow-hidden group"
              style={{
                background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
                boxShadow: `0 10px 30px ${themeColors.primary}30`,
              }}
            >
              <span className="relative z-10">Sign In</span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{ background: "white" }}
              />
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/50"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white/80 text-slate-400 uppercase tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3.5 px-4 rounded-xl border border-slate-200/50 bg-white/50 hover:bg-white hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span
                onClick={handleSignInWithGoogle}
                className="text-sm font-medium text-slate-700 group-hover:text-slate-900"
              >
                Continue with Google
              </span>
            </motion.button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-slate-500 mt-8">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold hover:underline transition-colors"
              style={{ color: themeColors.primary }}
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <Link href="/Home">
          <motion.div
            whileHover={{ x: -3 }}
            className="flex items-center justify-center gap-2 mt-8 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="text-xs font-medium uppercase tracking-wide">
              Back to Home
            </span>
          </motion.div>
        </Link>
      </motion.div>

      {/* Custom Popup */}
      <CustomPopup
        isOpen={popupState.isOpen}
        onClose={closePopup}
        type={popupState.type}
        title={popupState.title}
        message={popupState.message}
        confirmText={popupState.confirmText}
        cancelText={popupState.cancelText}
        onConfirm={popupState.onConfirm}
        onCancel={popupState.onCancel}
        showCancel={popupState.showCancel}
        autoClose={popupState.autoClose}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <ThemeProvider>
      <LoginContent />
    </ThemeProvider>
  );
}
