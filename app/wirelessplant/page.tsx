"use client"
import { motion } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import { MapPin, Sprout, Users, Filter, Search, ArrowRight, ShoppingCart } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import Navbar from "../components/Navbar"

interface Planter {
  id: string
  name: string
  avatar: string
  location: string
  region: string
  specialization: string[]
  available: boolean
  pricePerPlant: number
}

const MOCK_PLANTERS: Planter[] = [
  {
    id: "1",
    name: "Budi Santoso",
    avatar: "/api/placeholder/100/100",
    location: "Bandung",
    region: "Jawa Barat",
    specialization: ["Jahe", "Kunyit", "Temulawak"],
    available: true,
    pricePerPlant: 15000
  },
  {
    id: "2",
    name: "Siti Nurhaliza",
    avatar: "/api/placeholder/100/100",
    location: "Yogyakarta",
    region: "DI Yogyakarta",
    specialization: ["Lengkuas", "Kencur", "Lemongrass"],
    available: true,
    pricePerPlant: 12000
  },
  {
    id: "3",
    name: "Ahmad Hidayat",
    avatar: "/api/placeholder/100/100",
    location: "Bogor",
    region: "Jawa Barat",
    specialization: ["Sereh", "Daun Salam", "Pandan"],
    available: false,
    pricePerPlant: 10000
  },
]

const REGIONS = ["Semua Daerah", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "DI Yogyakarta"]

export default function WirelessPlantPage() {
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("Semua Daerah")
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)

  const filteredPlanters = MOCK_PLANTERS.filter(planter => {
    const matchesSearch = planter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         planter.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         planter.specialization.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesRegion = selectedRegion === "Semua Daerah" || planter.region === selectedRegion
    const matchesAvailability = !showAvailableOnly || planter.available
    
    return matchesSearch && matchesRegion && matchesAvailability
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 text-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 relative overflow-hidden">
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

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-light text-slate-900 mb-6">
              Wireless <span className="font-medium">Plant</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Temukan petani ahli terpercaya untuk menanam tanaman herbal Anda dengan sistem bagi hasil yang menguntungkan
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/wirelessplant/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all text-white"
                  style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` }}
                >
                  <Users className="w-5 h-5" />
                  <span>Daftar Jadi Planter</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              
              <Link href="/wirelessplant/orders">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative inline-flex items-center gap-3 px-6 py-4 rounded-full font-medium border-2 hover:bg-white/50 transition-all"
                  style={{ borderColor: themeColors.primary, color: themeColors.primary }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Orderan Saya</span>
                  <span 
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ backgroundColor: themeColors.primary }}
                  >
                    2
                  </span>
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Search & Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-6 shadow-lg mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari planter atau tanaman..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all"

                />
              </div>

              {/* Region Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all appearance-none bg-white"
>
                  {REGIONS.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              {/* Availability Toggle */}
              <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={showAvailableOnly}
                  onChange={(e) => setShowAvailableOnly(e.target.checked)}
                  className="w-5 h-5 rounded accent-green-600"
                />
                <span className="text-slate-700">Hanya yang tersedia</span>
              </label>
            </div>
          </motion.div>
          {/* Planters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlanters.map((planter, index) => (
              <motion.div
                key={planter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <div 
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl font-bold" style={{ color: themeColors.primary }}>
                      {planter.name.charAt(0)}
                    </div>
                  </div>
                  {planter.available ? (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                      Tersedia
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-slate-500 text-white text-sm rounded-full">
                      Penuh
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{planter.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{planter.location}, {planter.region}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {planter.specialization.map(spec => (
                      <span
                        key={spec}
                        className="px-3 py-1 rounded-full text-sm text-white"
                        style={{ backgroundColor: themeColors.primary }}
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="mb-4 p-3 bg-slate-50 rounded-xl">
                    <div className="text-sm text-slate-500 mb-1">Mulai dari</div>
                    <div className="text-2xl font-bold" style={{ color: themeColors.primary }}>
                      Rp {planter.pricePerPlant.toLocaleString('id-ID')}
                      <span className="text-sm font-normal text-slate-500">/tanaman</span>
                    </div>
                  </div>
                  <Link href={`/wirelessplant/${planter.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!planter.available}
                      className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                        planter.available 
                          ? 'text-white shadow-lg hover:shadow-xl' 
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                      style={planter.available ? { 
                        background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` 
                      } : {}}
                    >
                      {planter.available ? (
                        <>
                          <span>Pesan Sekarang</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      ) : (
                        <span>Tidak Tersedia</span>
                      )}
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredPlanters.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Sprout className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-2xl font-medium text-slate-900 mb-2">Tidak ada planter ditemukan</h3>
              <p className="text-slate-600">Coba ubah filter pencarian Anda</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
