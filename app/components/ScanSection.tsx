"use client"

import { motion, Variants } from "framer-motion"
import { useTheme } from "../context/ThemeContext"

export default function FeaturesSection() {
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()

  const containerVariants: Variants = { 
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/6 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: `${themeColors.primary}50` }} />
        <div className="absolute bottom-1/3 right-1/6 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: `${themeColors.secondary}50` }} />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto w-full relative z-10"
      >
        {/* Responsive Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Header Card */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-12 bg-white/100 rounded-[2.5rem] p-8 shadow-sm text-white flex flex-col md:flex-row items-center md:items-center gap-6"
          >
            <div className="text-center mx-auto">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 64 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="h-1 mb-6 rounded-full mx-auto"
                style={{ background: themeColors.primary }}
              />
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-slate-900 leading-[1.1] tracking-tight mb-6">
                Scan untuk
                <br />
                <span className="font-medium">Tanaman Herbal</span>
              </h2>
              <p className="text-lg text-slate-600 font-light leading-relaxed">
                Manfaatkan kecerdasan buatan untuk memahami dan merawat tanaman herbal Anda dengan lebih baik.
              </p>
            </div>
        
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-transparent to-slate-50 rounded-bl-[6rem] sm:rounded-bl-[8rem] opacity-50" />
            
            <div className="relative z-10 flex flex-col h-full">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6"
                style={{
                  background: `linear-gradient(135deg, ${themeColors.primary}20, ${themeColors.secondary}20)`
                }}
              >
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: themeColors.primary }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </motion.div>

              <h3 className="text-2xl sm:text-3xl font-light text-slate-900 mb-3 sm:mb-4 leading-tight">
                Scan Manfaat <br />
                <span className="font-medium">Tanaman</span>
              </h3>

              <p className="text-slate-600 mb-4 sm:mb-6 leading-relaxed font-light text-sm sm:text-base">
                Pindai tanaman herbal untuk mengetahui manfaat dan khasiatnya secara detail dan akurat.
              </p>

              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-grow">
                {["Pahami Manfaat Herba", "Informasi Khasiat Akurat", "Rekomendasi Penggunaan Terbaik"].map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 sm:gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0" style={{ backgroundColor: `${themeColors.primary}20` }}>
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: themeColors.primary }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm text-slate-700 font-light">{benefit}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group/btn w-full sm:w-auto"
                style={{
                  background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
                }}
              >
                <span className="font-medium text-sm sm:text-base">Coba Sekarang</span>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.button>
            </div>
          </motion.div>

          {/* Diagnosa Feature*/}
          <motion.div
            variants={itemVariants}
            className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-tr from-transparent to-slate-50 rounded-tr-[6rem] sm:rounded-tr-[8rem] opacity-50" />
            
            <div className="relative z-10 h-full flex flex-col">
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6"
                style={{
                  background: `linear-gradient(135deg, ${themeColors.primary}20, ${themeColors.secondary}20)`
                }}
              >
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: themeColors.primary }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </motion.div>

              <h3 className="text-2xl sm:text-3xl font-light text-slate-900 mb-3 sm:mb-4 leading-tight">
                Diagnosa Penyakit <br />
                <span className="font-medium">Tanaman</span>
              </h3>

              <p className="text-slate-600 mb-4 sm:mb-6 leading-relaxed font-light text-sm sm:text-base">
                Deteksi penyakit tanaman dan dapatkan panduan lengkap perawatan serta penyembuhan.
              </p>

              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-grow">
                {["Deteksi 500+ jenis penyakit", "Solusi perawatan terperinci", "Rekomendasi obat alami"].map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 sm:gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0" style={{ backgroundColor: `${themeColors.primary}20` }}>
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: themeColors.primary }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm text-slate-700 font-light">{benefit}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group/btn w-full sm:w-auto mt-auto"
                style={{
                  background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
                }}
              >
                <span className="font-medium text-sm sm:text-base">Mulai Diagnosa</span>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
