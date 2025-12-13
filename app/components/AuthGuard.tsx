"use client"

import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Lock, LogIn, Loader2 } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

interface AuthGuardProps {
  children: React.ReactNode
  message?: string
  redirectAfterLogin?: string
}

export default function AuthGuard({ 
  children, 
  message = "Anda harus login untuk mengakses halaman ini",
  redirectAfterLogin
}: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading state
  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 
            className="w-12 h-12 animate-spin" 
            style={{ color: themeColors.primary }} 
          />
          <p className="text-slate-600 font-medium">Memuat...</p>
        </motion.div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 text-center"
        >
          {/* Lock Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${themeColors.primary}20, ${themeColors.secondary}20)` 
            }}
          >
            <Lock 
              className="w-10 h-10" 
              style={{ color: themeColors.primary }} 
            />
          </motion.div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            Akses Terbatas
          </h1>

          {/* Message */}
          <p className="text-slate-600 mb-8 leading-relaxed">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/login')}
              className="w-full py-4 rounded-2xl text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              style={{ 
                background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` 
              }}
            >
              <LogIn className="w-5 h-5" />
              Masuk Sekarang
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/register')}
              className="w-full py-4 rounded-2xl font-semibold transition-all border-2"
              style={{ 
                color: themeColors.primary,
                borderColor: `${themeColors.primary}30`,
                backgroundColor: `${themeColors.primary}08`
              }}
            >
              Daftar Akun Baru
            </motion.button>

            <button
              onClick={() => router.back()}
              className="text-slate-500 hover:text-slate-700 text-sm font-medium mt-2 transition-colors"
            >
              ← Kembali ke halaman sebelumnya
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // User is authenticated, render children
  return <>{children}</>
}
