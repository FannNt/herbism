"use client"

import { motion, Variants } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import Image from "next/image"

export default function PlantCareSection() {
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


      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto w-full relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Header Card */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-12 bg-white/100 rounded-[2.5rem] p-8 md:p-12 shadow-lg text-white relative overflow-hidden"
          >
            <div className=" text-center">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 64 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="h-1 mb-6 rounded-full mx-auto"
                style={{ background: themeColors.primary }}
              />
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-slate-900 leading-[1.1] tracking-tight mb-6">
                Rawat
                <br /> <span className="font-medium">Tanamanmu</span>
              </h2>
              <p className="text-lg text-slate-800 font-light leading-relaxed">
                Asisten AI pintar yang membantu merawat tanaman herbal Anda dengan sempurna. Dapatkan panduan perawatan yang dipersonalisasi.
              </p>
            </div>
          </motion.div>

          {/* Mascot Card */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-12 lg:col-span-5 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 relative overflow-hidden group flex items-center justify-center min-h-[400px]"
          >
            <div className="absolute inset-0 opacity-50" style={{ 
              background: `radial-gradient(circle at center, ${themeColors.primary}10, transparent 70%)` 
            }} />
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div 
                className="w-56 h-56 md:w-72 md:h-72 rounded-full flex items-center justify-center shadow-2xl border-8 border-white relative overflow-hidden group-hover:scale-105 transition-transform duration-500"
                style={{ 
                  background: `linear-gradient(135deg, ${themeColors.primary}30, ${themeColors.secondary}30)` 
                }}
              >
                <Image
                  src="/Erbis.jpg"
                  alt="Erbis - Maskot Herbism"
                  width={280}
                  height={280}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Feature Cards Grid */}
          <div className="md:col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 cursor-pointer transition-all duration-300 hover:shadow-lg group"
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${themeColors.primary}20` }}
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ color: themeColors.primary }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-2">Jadwal Penyiraman</h3>
              <p className="text-slate-600 text-sm font-light leading-relaxed">
                Rekomendasi waktu penyiraman otomatis berdasarkan jenis tanaman
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 cursor-pointer transition-all duration-300 hover:shadow-lg group"
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${themeColors.primary}20` }}
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ color: themeColors.primary }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-2">Saran Pupuk</h3>
              <p className="text-slate-600 text-sm font-light leading-relaxed">
                Rekomendasi jenis pupuk yang tepat untuk pertumbuhan optimal
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 cursor-pointer transition-all duration-300 hover:shadow-lg group"
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${themeColors.primary}20` }}
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ color: themeColors.primary }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-2">Analisis Foto</h3>
              <p className="text-slate-600 text-sm font-light leading-relaxed">
                AI menganalisis kondisi tanaman dari foto lingkungan
              </p>
            </motion.div>

            {/* CTA Card */}
            <motion.div
              variants={itemVariants}
              className="rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden group flex flex-col justify-between"
              style={{ 
                background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` 
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-medium text-white mb-3">Siap Mencoba?</h3>
                <p className="text-white/90 text-sm font-light mb-6">
                  Mulai rawat tanamanmu dengan teknologi AI
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-full font-medium shadow-lg hover:shadow-xl transition-all group/btn"
                >
                  <span>Cobain Sekarang</span>
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>

          </div>

        </div>
      </motion.div>
    </section>
  )
}