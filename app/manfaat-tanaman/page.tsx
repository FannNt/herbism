"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Upload, X, Loader2, Leaf, Heart, Sparkles, Droplets, Sun, Shield, Zap, Apple, Brain, Flower2, Wind, Thermometer, AlertTriangle } from "lucide-react"
import Navbar from "../components/Navbar"
import { useTheme } from "../context/ThemeContext"

interface PlantBenefit {
  name: string
  scientificName: string
  category: string
  description: string
  benefits: {
    icon: string
    title: string
    description: string
    color: string
  }[]
  usage: {
    title: string
    description: string
  }[]
  nutrition: {
    name: string
    value: string
  }[]
  warnings: string[]
}

// Icon mapping for dynamic icons from API
import type { LucideIcon } from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Shield, Thermometer, Apple, Zap, Heart, Brain, Leaf, Flower2, Wind, Droplets
}

export default function ManfaatTanamanPage() {
  const { themeColors } = useTheme()
  
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<PlantBenefit | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setImage(imageUrl)
      setImageFile(file)
      setResult(null)
      setError(null)
    }
  }

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleAnalyze = async () => {
    if (!image || !imageFile) return

    setIsAnalyzing(true)
    setError(null)

    try {
      // Convert image to base64
      const base64Image = await fileToBase64(imageFile)

      // Call API endpoint
      const response = await fetch('/api/scan-manfaat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          image: base64Image,
          type: 'benefit'
        }),
      })

      if (!response.ok) {
        throw new Error('Gagal menganalisis gambar')
      }

      const data = await response.json()
      
      if (data.result) {
        setResult(data.result)
      } else {
        throw new Error('Tidak ada hasil dari analisis')
      }
    } catch (err: any) {
      console.error('Analysis error:', err)
      setError(err.message || 'Terjadi kesalahan saat menganalisis gambar')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const clearImage = () => {
    setImage(null)
    setImageFile(null)
    setResult(null)
    setError(null)
  }

  // Get icon component from string
  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Leaf
  }

  const getBenefitColor = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      emerald: { bg: "bg-emerald-50", text: "text-emerald-700", icon: "text-emerald-500" },
      orange: { bg: "bg-orange-50", text: "text-orange-700", icon: "text-orange-500" },
      green: { bg: "bg-green-50", text: "text-green-700", icon: "text-green-500" },
      yellow: { bg: "bg-amber-50", text: "text-amber-700", icon: "text-amber-500" },
      red: { bg: "bg-red-50", text: "text-red-700", icon: "text-red-500" },
      purple: { bg: "bg-purple-50", text: "text-purple-700", icon: "text-purple-500" },
      blue: { bg: "bg-blue-50", text: "text-blue-700", icon: "text-blue-500" }
    }
    return colors[color] || colors.emerald
  }

  return (
    <main className="min-h-screen bg-slate-50 overflow-x-hidden">
      <Navbar />
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Manfaat <span style={{ color: themeColors.primary }}>Tanaman</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Unggah foto tanaman herbal dan temukan manfaat kesehatan, cara penggunaan, serta kandungan nutrisinya.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">        
          {/* Mascot Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-32" style={{ background: `linear-gradient(to bottom, ${themeColors.primary}10, transparent)` }} />
            <div className="relative z-10 w-48 h-48 md:w-56 md:h-56 mb-4 mt-4">
              <div className="absolute inset-0 rounded-full blur-3xl opacity-30 animate-pulse" style={{ backgroundColor: `${themeColors.primary}30` }} />
              <Image
                src="/Erbis.png"
                alt="Erbis Mascot"
                fill
                className="object-cover rounded-full border-4 border-white shadow-lg"
              />
            </div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Hai! Saya Erbis 🌿</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                "Mau tahu manfaat tanaman herbalmu? Upload fotonya dan biarkan aku menganalisis khasiat dan cara penggunaannya untukmu!"
              </p>
            </div>
          </motion.div>

          {/* Upload section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-8 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100"
          >
            {!image ? (
              <div className="h-full flex flex-col justify-center">
                <label 
                  htmlFor="dropzone-file" 
                  className="flex flex-col items-center justify-center w-full h-64 md:h-80 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-slate-50 transition-all duration-300 group relative overflow-hidden"
                  style={{ borderColor: `${themeColors.primary}40` }}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300"
                      style={{ background: `${themeColors.primary}10` }}
                    >
                      <Leaf className="w-8 h-8" style={{ color: themeColors.primary }} />
                    </div>
                    <p className="mb-2 text-sm text-slate-700 font-medium">Klik untuk unggah foto tanaman</p>
                    <p className="text-xs text-slate-500">atau drag and drop (Max. 5MB)</p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  
                  {/* Decorative */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </label>
              </div>
            ) : (
              <div className="relative h-full flex flex-col">
                <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-6 shadow-md group">
                  <Image src={image} alt="Uploaded plant" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <button 
                    onClick={clearImage}
                    className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
                  >
                    <X size={20} />
                  </button>
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center flex-col text-white">
                      <Loader2 className="w-10 h-10 animate-spin mb-3 text-emerald-400" />
                      <p className="font-medium tracking-wide animate-pulse">Menganalisa Tanaman...</p>
                    </div>
                  )}
                </div>
                {!result && !isAnalyzing && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAnalyze}
                    className="w-full py-4 rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                    style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` }}
                  >
                    Analisa Manfaat
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>

          {/* Results - Bento Box Layout */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="md:col-span-12"
              >
                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                  
                  {/* Header Card - Plant Info */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-12 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 relative overflow-hidden"
                  >
                    <div 
                      className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10"
                      style={{ background: themeColors.primary }}
                    />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                      <div 
                        className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${themeColors.primary}20, ${themeColors.secondary}20)` }}
                      >
                        <Leaf className="w-10 h-10" style={{ color: themeColors.primary }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{result.name}</h2>
                          <span 
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{ backgroundColor: `${themeColors.primary}15`, color: themeColors.primary }}
                          >
                            {result.category}
                          </span>
                        </div>
                        <p className="text-slate-500 italic mb-3">{result.scientificName}</p>
                        <p className="text-slate-600 leading-relaxed">{result.description}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Benefits Grid - 2x3 on desktop */}
                  {result.benefits.map((benefit, idx) => {
                    const colorClasses = getBenefitColor(benefit.color)
                    const BenefitIcon = getIconComponent(benefit.icon)
                    
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + idx * 0.05 }}
                        className={`md:col-span-4 ${colorClasses.bg} rounded-3xl p-6 border border-slate-100 hover:shadow-lg transition-all duration-300 group`}
                      >
                        <div className={`w-12 h-12 rounded-xl ${colorClasses.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <BenefitIcon className={`w-6 h-6 ${colorClasses.icon}`} />
                        </div>
                        <h3 className={`text-lg font-bold ${colorClasses.text} mb-2`}>{benefit.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>
                      </motion.div>
                    )
                  })}

                  {/* Usage Card - Full width on mobile, half on desktop */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="md:col-span-7 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${themeColors.primary}15` }}
                      >
                        <Sparkles className="w-5 h-5" style={{ color: themeColors.primary }} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Cara Penggunaan</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {result.usage.map((use, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.45 + idx * 0.05 }}
                          className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <span 
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                              style={{ backgroundColor: themeColors.primary }}
                            >
                              {idx + 1}
                            </span>
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-1">{use.title}</h4>
                              <p className="text-sm text-slate-600 leading-relaxed">{use.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Nutrition Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="md:col-span-5 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` }}
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-xl" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold">Kandungan Nutrisi</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {result.nutrition.map((nutrient, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.55 + idx * 0.05 }}
                            className="bg-white/15 backdrop-blur-sm rounded-xl p-3"
                          >
                            <p className="text-white/70 text-xs mb-1">{nutrient.name}</p>
                            <p className="font-bold text-lg">{nutrient.value}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Warning Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="md:col-span-12 bg-amber-50 rounded-3xl p-6 border border-amber-100 mb-18 md:mb-0"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-amber-800 mb-3">Perhatian & Peringatan</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {result.warnings.map((warning, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.65 + idx * 0.05 }}
                              className="flex items-start gap-2 p-3 bg-white rounded-xl"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-2" />
                              <p className="text-sm text-amber-800">{warning}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Scan Lagi Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="md:col-span-12 flex justify-center md:mb-0 mb-10"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={clearImage}
                      className="px-8 py-4 rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
                      style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Scan Tanaman Lain
                    </motion.button>
                  </motion.div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  )
}
