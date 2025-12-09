"use client"
import { motion } from "framer-motion"
import { useTheme } from "../../context/ThemeContext"
import { useState } from "react"
import { MapPin, Star, Sprout, Award, Calendar, TrendingUp, ArrowLeft, ShoppingCart, MessageCircle, Shield } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import Navbar from "../../components/Navbar"

interface Planter {
  id: string
  name: string
  avatar: string
  rating: number
  totalReviews: number
  location: string
  region: string
  specialization: string[]
  available: boolean
  bio: string
  certifications: string[]
  landSize: number
  joinedDate: string
}

interface Review {
  id: string
  userName: string
  rating: number
  comment: string
  date: string
  plantType: string
}

const MOCK_PLANTER: Planter = {
  id: "1",
  name: "Budi Santoso",
  avatar: "/api/placeholder/150/150",
  rating: 4.9,
  totalReviews: 127,
  location: "Bandung",
  region: "Jawa Barat",
  specialization: ["Jahe", "Kunyit", "Temulawak", "Lengkuas"],
  available: true,
  bio: "Petani herbal berpengalaman dengan fokus pada tanaman rimpang. Menggunakan metode organik dan sustainable farming. Telah melayani lebih dari 200 klien dengan tingkat kepuasan tinggi.",
  certifications: ["Sertifikat Organik Indonesia", "GAP (Good Agricultural Practices)", "Sertifikat Benih Unggul"],
  landSize: 2500,
  joinedDate: "2020-03-15"
}


export default function PlanterDetailPage() {
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()
  const params = useParams()
  const router = useRouter()
  const [quantity, setQuantity] = useState(10)
  const [selectedPlant, setSelectedPlant] = useState("")
  const [duration, setDuration] = useState("6")

  const planter = MOCK_PLANTER

  const handleOrder = () => {
    if (!selectedPlant) {
      alert("Pilih jenis tanaman terlebih dahulu")
      return
    }
    router.push(`/wirelessplant/checkout?planterId=${planter.id}&plant=${selectedPlant}&quantity=${quantity}&duration=${duration}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 text-slate-900">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link href="/wirelessplant">
            <motion.button
              whileHover={{ x: -4 }}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali ke Daftar Planter</span>
            </motion.button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Planter Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg"
              >
                <div 
                  className="h-32 relative"
                  style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` }}
                >
                  <div className="absolute -bottom-16 left-8">
                    <div className="w-32 h-32 rounded-full bg-white p-2 shadow-xl">
                      <div 
                        className="w-full h-full rounded-full flex items-center justify-center text-5xl font-bold text-white"
                        style={{ backgroundColor: themeColors.primary }}
                      >
                        {planter.name.charAt(0)}
                      </div>
                    </div>
                  </div>
                  {planter.available && (
                    <div className="absolute top-4 right-4 px-4 py-2 bg-green-500 text-white rounded-full font-medium">
                      Tersedia
                    </div>
                  )}
                </div>

                <div className="pt-20 px-8 pb-8">
                  <h1 className="text-4xl font-bold text-slate-900 mb-2">{planter.name}</h1>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-600">{planter.location}, {planter.region}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-slate-900">{planter.rating}</span>
                      <span className="text-slate-500">({planter.totalReviews} ulasan)</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {planter.specialization.map(spec => (
                      <span
                        key={spec}
                        className="px-4 py-2 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: themeColors.primary }}
                      >
                        {spec}
                      </span>
                    ))}
                  </div>


                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Tentang</h3>
                    <p className="text-slate-600 leading-relaxed">{planter.bio}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Order Form */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl p-8 shadow-lg sticky top-24"
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Pesan Sekarang</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Jenis Tanaman *
                    </label>
                    <select
                      value={selectedPlant}
                      onChange={(e) => setSelectedPlant(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all appearance-none bg-white"
                    >
                      <option value="">Pilih Tanaman</option>
                      {planter.specialization.map(plant => (
                        <option key={plant} value={plant}>{plant}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Jumlah Tanaman
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg border-2 border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="flex-1 text-center px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all"
                        min="1"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-lg border-2 border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleOrder}
                    className="w-full py-4 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` }}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Lanjut ke Pembayaran</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
