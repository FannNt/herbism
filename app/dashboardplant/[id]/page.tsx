"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useTheme } from "../../context/ThemeContext"
import {
  ChevronLeft,
  Calendar,
  Droplets,
  Sprout,
  Sun,
  Leaf,
  BookOpen,
  Sparkles,
  Edit,
  Trash2,
  AlertCircle,
  Bot,
  Send,
  MessageSquare
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { getPlantById, Plant } from "@/services/plantService"

export default function PlantProfilePage() {
  const router = useRouter()
  const params = useParams()
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()

  const [plant, setPlant] = useState<Plant | null>(null)
  const [loading, setLoading] = useState(true)


  const [questionInput, setQuestionInput] = useState("")
  const [isConsulting, setIsConsulting] = useState(false)
  const [faqList, setFaqList] = useState<Array<{q: string, a: string}>>([])

  const handleConsultation = async () => {
    if (!questionInput.trim() || !plant) return
    
    const currentQ = questionInput
    setQuestionInput("") // Clear input immediately
    setIsConsulting(true)

    try {
      // Call AI Service
      
      // Add to FAQ List (Newest on top)
      setFaqList(prev => [{ q: currentQ, a: "" }, ...prev])
    } catch (error) {
      console.error(error)
      alert("Maaf, Erbis sedang sibuk. Coba lagi nanti.")
    } finally {
      setIsConsulting(false)
    }
  }

  useEffect(() => {
    const fetchPlant = async () => {
      if (!params.id || typeof params.id !== 'string') return

      try {
        const plantData = await getPlantById(params.id)
        setPlant(plantData)
      } catch (error) {
        console.error("Error fetching plant:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlant()
  }, [params.id])

  // Calculate plant age
  const calculateAge = (plantDate: string) => {
    const planted = new Date(plantDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - planted.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(diffDays / 7)
    const days = diffDays % 7

    if (weeks > 0) {
      return `${weeks} minggu ${days > 0 ? `${days} hari` : ''}`
    }
    return `${days} hari`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-emerald-700">Memuat data tanaman...</p>
        </div>
      </div>
    )
  }

  if (!plant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Tanaman Tidak Ditemukan</h2>
          <p className="text-slate-500 mb-6">Data tanaman tidak ada atau telah dihapus</p>
          <button
            onClick={() => router.push('/dashboardplant')}
            style={{ backgroundColor: themeColors.primary }}
            className="px-6 py-3 rounded-xl text-white font-medium hover:opacity-90 transition-all"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 flex items-center justify-center hover:bg-emerald-100 rounded-xl transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-emerald-700" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-emerald-900">Profil Tanaman</h1>
                <p className="text-xs sm:text-sm text-emerald-600">Detail lengkap tanaman herbal</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="p-2.5 hover:bg-red-100 rounded-xl transition-colors text-red-600"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Hero Card  */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl overflow-hidden shadow-lg border border-emerald-100"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Image */}
            <div className="relative h-64 md:h-full min-h-[300px] bg-gradient-to-br from-emerald-100 to-teal-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-emerald-300">
                  <Leaf className="w-20 h-20 mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-medium">Foto Tanaman</p>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-emerald-900 mb-2">{plant.name}</h2>
                <div className="flex flex-wrap gap-2">
                  <span
                    className="px-3 py-1.5 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: themeColors.primary }}
                  >
                    {plant.kind}
                  </span>
                  <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    Umur: {calculateAge(plant.plantedDate)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <p className="text-xs font-medium text-emerald-700">Tanggal Tanam</p>
                  </div>
                  <p className="text-sm font-bold text-emerald-900">
                    {new Date(plant.plantedDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Sun className="w-4 h-4 text-amber-600" />
                    <p className="text-xs font-medium text-amber-700">Media Tanam</p>
                  </div>
                  <p className="text-sm font-bold text-amber-900">{plant.soilType}</p>
                </div>
              </div>

              {/* Journal Button */}
              <button
                onClick={() => router.push(`/dashboardplant/${params.id}/journal`)}
                className="mt-6 w-full py-3 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: themeColors.primary }}
              >
                <BookOpen className="w-5 h-5" />
                Lihat Jurnal Tanaman
              </button>
            </div>
          </div>
        </motion.div>

        {/*Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Watering Schedule */}
          <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Droplets className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Jadwal Penyiraman</h3>
                <p className="text-xs text-slate-500">Rutinitas penyiraman</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
              <p className="text-blue-900 font-medium">{plant.wateringSchedule}</p>
            </div>
          </div>

          {/* Fertilize Schedule */}
          <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Sprout className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Jadwal Pemupukan</h3>
                <p className="text-xs text-slate-500">Ganti pupuk berkala</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
              <p className="text-green-900 font-medium">{plant.fertilizerSchedule}</p>
            </div>
          </div>
        </motion.div>

        {/* Erbis Special Treatment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 rounded-2xl p-6 border border-purple-200 shadow-lg"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-purple-900 text-lg">Perawatan Khusus dari Erbis</h3>
              </div>
              <p className="text-sm text-purple-600">Rekomendasi perawatan yang dipersonalisasi untuk tanaman Anda</p>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-purple-100">
            {plant.specialCare && plant.specialCare.length > 0 ? (
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <ul className="space-y-2 flex-1">
                  {plant.specialCare.map((care, index) => (
                    <li key={index} className="flex items-start gap-2 text-purple-900 leading-relaxed text-sm md:text-base">
                      <span className="text-purple-500 mt-0.5">•</span>
                      <span>{care}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-purple-600 text-sm">Belum ada perawatan khusus yang dihasilkan untuk tanaman ini</p>
                <p className="text-purple-400 text-xs mt-1">Silakan regenerate jadwal perawatan saat mengedit tanaman</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-purple-600">
            <Sparkles className="w-4 h-4" />
            <p>Tips ini dibuat khusus berdasarkan jenis tanaman dan kondisi perawatan Anda</p>
          </div>
        </motion.div>

        {/* FAQ Style Chatbot Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
           {/* Header & Input Section */}
           <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-900">Tanya Erbis</h3>
                  <p className="text-slate-500 text-sm">Asisten ahli tanaman pribadi Anda</p>
                </div>
              </div>

              <div className="relative">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={questionInput}
                    onChange={(e) => setQuestionInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleConsultation()}
                    placeholder={`Tanya apapun tentang ${plant.name}...`}
                    className="flex-1 px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-inner"
                  />
                  <button
                    onClick={handleConsultation}
                    disabled={!questionInput.trim() || isConsulting}
                    className="w-14 h-auto rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-lg shadow-emerald-200 active:scale-95 transition-all"
                  >
                    {isConsulting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                       <Send className="w-6 h-6" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-2 ml-1">
                  *Jawaban dihasilkan oleh AI dan dirancang untuk memberikan edukasi mendalam.
                </p>
              </div>
           </div>

           {/* FAQ Results List */}
           <div className="space-y-4">
              <AnimatePresence>
                {faqList.map((item, idx) => (
                  <motion.div
                    key={`${idx}-${item.q.substring(0, 10)}`}
                    initial={{ opacity: 0, y: 20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Question Header */}
                    <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex items-start gap-3">
                      <div className="bg-emerald-100 p-1.5 rounded-lg mt-0.5">
                        <MessageSquare className="w-4 h-4 text-emerald-700" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-lg leading-snug">{item.q}</h4>
                    </div>
                    
                    {/* Answer Body */}
                    <div className="p-6 bg-white">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                           <Bot className="w-6 h-6 text-emerald-600 mt-1" />
                        </div>
                        <div className="flex-1 prose prose-emerald prose-sm max-w-none">
                           <p className="text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                             {item.a}
                           </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {faqList.length === 0 && !isConsulting && (
                <div className="text-center py-10 opacity-50">
                  <Bot className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-slate-500 font-medium">Belum ada pertanyaan diajukan.</p>
                </div>
              )}
           </div>
        </motion.div>
      </main>
    </div>
  )
}
