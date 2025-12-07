"use client"

import { useState } from "react"
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
  AlertCircle
} from "lucide-react"
import { motion } from "framer-motion"

// Mock data
const mockPlantData = {
  id: "1",
  name: "Jahe Merah Organik",
  type: "Rizoma",
  soilType: "Tanah Gembur",
  plantDate: "2024-10-01",
  wateringSchedule: "Setiap pagi dan sore",
  fertilizeSchedule: "Setiap 2 minggu sekali",
  specialTreatment: "Tanaman jahe merah memerlukan perhatian khusus untuk hasil optimal. Pastikan tanah selalu lembab namun tidak tergenang air. Berikan pupuk organik setiap 2 minggu untuk meningkatkan kualitas rimpang. Hindari paparan sinar matahari langsung yang terlalu lama, idealnya 4-6 jam per hari. Lakukan penyiangan gulma secara rutin untuk mencegah kompetisi nutrisi. Perhatikan tanda-tanda hama seperti ulat atau kutu daun, segera lakukan pengendalian organik jika ditemukan.",
  image: "/plants/jahe-merah.jpg"
}

export default function PlantProfilePage() {
  const router = useRouter()
  const params = useParams()
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()
  
  const [plant] = useState(mockPlantData)

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
                    {plant.type}
                  </span>
                  <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    Umur: {calculateAge(plant.plantDate)}
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
                    {new Date(plant.plantDate).toLocaleDateString('id-ID', { 
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
              <p className="text-green-900 font-medium">{plant.fertilizeSchedule}</p>
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
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <p className="text-purple-900 leading-relaxed text-sm md:text-base">
                {plant.specialTreatment}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-purple-600">
            <Sparkles className="w-4 h-4" />
            <p>Tips ini dibuat khusus berdasarkan jenis tanaman dan kondisi perawatan Anda</p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
