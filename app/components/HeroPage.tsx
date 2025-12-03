"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import GrassParallax from "./GrassParallax"
// import CloudParallax from "./CloudParallax"
import { useTheme } from "../context/ThemeContext"

type TherapyMode = "default" | "calm" | "energy" | "balance" | "healing"

const therapyModes = {
  default: {
    name: "Natural",
    bg: "from-emerald-50 to-green-100",
    accent: "text-emerald-600",
    button: "bg-emerald-600 hover:bg-emerald-700",
    description: "Natural ambiance for basic herbs",
  },
  calm: {
    name: "Calm",
    bg: "from-blue-50 to-indigo-100",
    accent: "text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
    description: "Calm space for lavender & chamomile",
  },
  energy: {
    name: "Energy",
    bg: "from-orange-50 to-red-100",
    accent: "text-orange-600",
    button: "bg-orange-600 hover:bg-orange-700",
    description: "Energizing space for ginger & turmeric",
  },
  balance: {
    name: "Balance",
    bg: "from-purple-50 to-pink-100",
    accent: "text-purple-600",
    button: "bg-purple-600 hover:bg-purple-700",
    description: "Balanced space for echinacea & ginseng",
  },
  healing: {
    name: "Healing",
    bg: "from-teal-50 to-cyan-100",
    accent: "text-teal-600",
    button: "bg-teal-600 hover:bg-teal-700",
    description: "Healing space for aloe vera & lemon balm",
  },
}

export default function HeroPage() {
  const { currentMode, setCurrentMode } = useTheme()
  const [isLoaded, setIsLoaded] = useState(false)
  const { scrollY } = useScroll()

  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const currentTheme = therapyModes[currentMode]

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} relative overflow-hidden overflow-x-hidden transition-all duration-1000 ease-in-out pt-16 md:pt-0`}
    >

      <motion.div
        className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6"
        style={{ y, opacity }}
      >
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: isLoaded ? 0 : 50, opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight ${currentTheme.accent} text-balance`}
          >
            HERBISM
          </motion.h1>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: isLoaded ? 0 : 30, opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="space-y-4"
          >
            <p className="text-base sm:text-lg text-gray-700 font-light">Temukan Kekuatan Berkebun Herbal</p>
            <p className="text-sm sm:text-base text-gray-600 font-light max-w-xl mx-auto leading-relaxed">
              Tanam, rawat, dan rasakan manfaat alami herbal langsung dari kebun Anda sendiri.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: isLoaded ? 0 : 30, opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="space-y-4"
          >
            <p className="text-xs sm:text-sm text-gray-600 font-light tracking-wide">Pilih Moodmu Dalam Menanam!</p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {Object.entries(therapyModes).map(([mode, config]) => (
                <button
                  key={mode}
                  onClick={() => setCurrentMode(mode as TherapyMode)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-light transition-all duration-300 ${
                    currentMode === mode
                      ? `${config.button} text-white shadow-lg scale-105`
                      : "bg-white/50 text-gray-700 hover:bg-white/70 hover:scale-105"
                  }`}
                >
                  {config.name}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: isLoaded ? 0 : 30, opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4"
          >
            <button
              className={`${currentTheme.button} text-white px-8 sm:px-10 py-3 sm:py-3 rounded-full text-sm sm:text-base font-light shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
            >
              Mulai Menanam
            </button>
            <button className="bg-white/60 text-gray-700 px-8 sm:px-10 py-3 sm:py-3 rounded-full text-sm sm:text-base font-light shadow-lg hover:shadow-xl hover:bg-white transform hover:scale-105 transition-all duration-300">
              Pelajari Lebih Lanjut
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Grass Parallax Effect */}
      <div className="absolute bottom-0 left-0 w-full z-20">
        <GrassParallax mode={currentMode} />
      </div>
    </div>
  )
}
