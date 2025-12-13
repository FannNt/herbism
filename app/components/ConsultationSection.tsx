"use client"

import { motion, Variants } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import Link from "next/link"

export default function ConsultationSection() {
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 py-16 md:py-24 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl mix-blend-multiply" style={{ backgroundColor: `${themeColors.primary}20` }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl mix-blend-multiply" style={{ backgroundColor: `${themeColors.secondary}20` }} />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 relative z-10"
      >
        {/* Main Hero Card */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-8 md:row-span-2 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 relative overflow-hidden group flex flex-col justify-between min-h-[400px] md:min-h-[500px]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-transparent to-slate-50 rounded-bl-[10rem] opacity-50 transition-transform duration-700 group-hover:scale-110" />
          
          <div className="relative z-10">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 60 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-1.5 mb-8 rounded-full"
              style={{ background: themeColors.primary }}
            />
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-slate-900 leading-[1.1] tracking-tight mb-6">
              Konsultasi <br />
              <span className="font-medium relative inline-block">
                Penyakitmu
                <span className="absolute bottom-2 left-0 w-full h-3 -z-10 opacity-20" style={{ backgroundColor: themeColors.primary }}></span>
              </span>
              <br />
              Bersama Erbis!
            </h2>
          </div>

          <div className="relative z-10 mt-8">
            <button
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group/btn"
              style={{ backgroundColor: themeColors.primary }}
            >
              <Link href="/consultation">
              <span className="text-lg font-medium tracking-wide">Mulai Konsultasi</span>
              </Link>
              <div className="bg-white/20 rounded-full p-1 group-hover/btn:translate-x-1 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="md:col-span-4 bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-center hover:bg-white transition-colors duration-300"
        >
          <div className="w-12 h-12 rounded-2xl mb-6 flex items-center justify-center" style={{ backgroundColor: `${themeColors.primary}15`, color: themeColors.primary }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <p className="text-slate-600 text-lg leading-relaxed font-light">
            Dapatkan rekomendasi racikan herbal alami yang <span className="font-medium text-slate-800">dipersonalisasi</span> melalui kecerdasan buatan.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="md:col-span-4 bg-slate-900 rounded-[2.5rem] p-8 shadow-sm text-white relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity group-hover:opacity-75" />
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium text-slate-300 uppercase tracking-wider">AI Virtual</span>
              </div>
              <h3 className="text-2xl font-light mb-2">Erbis</h3>
              <p className="text-slate-400 font-light text-sm leading-relaxed">
                Asisten kesehatan cerdas yang siap membantu Anda 24/7.
              </p>
            </div>
            
          </div>
        </motion.div>

      </motion.div>
    </section>
  )
}
