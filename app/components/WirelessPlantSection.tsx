"use client"
import { motion, type Variants } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import { Sprout, MessageCircle, IdCard } from "lucide-react"
import Link from "next/link"

  export default function WirelessPlantSection() {
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

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl mix-blend-multiply"
            style={{ backgroundColor: `${themeColors.primary}20` }}
          />
          <div
            className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl mix-blend-multiply"
            style={{ backgroundColor: `${themeColors.secondary}20` }}
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto w-full relative z-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
            <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-4">
              <div className="text-center md:col-span-12 bg-white/100 rounded-[2.5rem] p-8 md:p-10 shadow-lg text-white relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: 60 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="h-1 mx-auto mb-6 rounded-full"
                  style={{ background: themeColors.primary }}
                />
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-slate-900 leading-[1.1] tracking-tight mb-6">
                  Wireless 
                  <br /> <span className="font-medium">Plant</span>
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
                  Layanan tanam bersama dengan sistem bagi hasil yang menguntungkan dan transparan
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${themeColors.primary}20` }}
                >
                  <Sprout className="text-2xl text-green-900 "/>
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-2">Sistem Bagi Hasil</h3>
                <p className="text-slate-600 text-sm font-light leading-relaxed">
                  Investasi tanaman herbal dengan sistem bagi hasil yang menguntungkan dan transparan
                </p>
              </div>
            </motion.div>

  
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${themeColors.primary}20` }}
                >
                  <MessageCircle className="text-2xl text-green-900"/>
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-2">Komunikasi Chat</h3>
                <p className="text-slate-600 text-sm font-light leading-relaxed">
                  Berkomunikasi dengan petani ahli melalui fitur chat terintegrasi untuk memantau perkembangan tanaman
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${themeColors.primary}20` }}
                >
                  <IdCard className="text-2xl text-green-900"/>
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-2">Cara Daftar</h3>
                <p className="text-slate-600 text-sm font-light leading-relaxed">
                  Siapkan KTP untuk mendaftar menjadi penanam dan mulai perjalananmu
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="col-span-1 md:col-span-2 lg:col-span-4 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden group flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
              }}
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-10 -mt-10" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl mr-10 mb-10" />

              <Link href="/wirelessplant">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full font-medium shadow-lg hover:shadow-xl transition-all group/btn relative z-10"
                >
                  <span>Mulai Sekarang</span>
                  <svg
                    className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    )
  }
