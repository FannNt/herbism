"use client"
import { motion } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import { MapPin, Sprout, Filter, Search, ArrowRight, Package, User, MessageCircle, ShoppingCart } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Navbar from "../components/Navbar"

import { getAllAvailableProducts, PlanterProduct } from "@/services/planterService"

const REGIONS = ["Semua Daerah", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "DI Yogyakarta", "DKI Jakarta", "Banten"]
const CATEGORIES = ["Semua Kategori", "Jasa Penanaman", "Perawatan Tanaman", "Pembibitan", "Sewa Lahan & Tanam", "Lainnya"]

export default function WirelessPlantPage() {
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("Semua Daerah")
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori")
  
  const [products, setProducts] = useState<PlanterProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllAvailableProducts()
        setProducts(data)
      } catch (error) {
        console.error("Failed to fetch products", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.plantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.planterName.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Region match (check if planterLocation contains selected region)
    // Note: planterLocation might be just "City", so strict region match might need improvement if data is messy.
    // For now we assume flexible matching.
    const matchesRegion = selectedRegion === "Semua Daerah" || 
                          product.planterLocation.includes(selectedRegion)
    
    const matchesCategory = selectedCategory === "Semua Kategori" || product.category === selectedCategory
    
    return matchesSearch && matchesRegion && matchesCategory
  })

  // Format price helper
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  }

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
              Pilih jasa tanam dan perawatan dari planter ahli di sekitar Anda
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/wirelessplant/register" className="inline-block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full text-white font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                  style={{ backgroundColor: themeColors.primary }}
                >
                  <Package className="w-5 h-5" />
                  Tawarkan Jasa Tanam
                </motion.button>
              </Link>
              
            </div>
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 shadow-xl border border-slate-100 max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari jasa, tanaman, atau planter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all appearance-none bg-white cursor-pointer"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all appearance-none bg-white cursor-pointer"
                >
                  {REGIONS.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services/Products Grid */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Sprout className="w-10 h-10 animate-bounce text-emerald-500 mb-4" />
              <p className="text-slate-500">Mencari jasa tanam tersedia...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-2">Belum ada jasa tersedia</h3>
              <p className="text-slate-500">Coba ubah kata kunci atau kategori pencarian Anda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-xl transition-all group flex flex-col h-full"
                >
                  {/* Category Badge & Planter Info */}
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-2">
                       <span className="text-xs text-slate-500 font-medium truncate max-w-[100px]">
                         {product.planterName}
                       </span>
                       <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold">
                         {product.planterName.charAt(0)}
                       </div>
                    </div>
                  </div>

                  {/* Product/Service Name */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {product.plantName}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                    <MapPin className="w-3 h-3" />
                    <span>{product.planterLocation}</span>
                  </div>

                  {/* Description Preview */}
                  <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-grow">
                    {product.description}
                  </p>

                  {/* Price & Actions */}
                  <div className="pt-4 border-t border-slate-100 mt-auto">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Biaya Jasa</p>
                      <p className="text-lg font-bold" style={{ color: themeColors.primary }}>
                        {formatPrice(product.pricePerUnit)}
                        <span className="text-xs font-normal text-slate-500 ml-1">
                           / {product.unit}
                        </span>
                      </p>
                      <p className="text-xs text-emerald-600 mt-1 font-medium">
                        {product.stock} {product.unit} tersedia
                      </p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-4">
                      {/* Chat Button */}
                      <Link href={`/wirelessplant/chat-planter/${product.planterId}`} className="flex-1">
                        <button
                          className="w-full px-4 py-2.5 rounded-xl border-2 font-medium transition-all hover:bg-slate-50 flex items-center justify-center gap-2"
                          style={{ borderColor: themeColors.primary, color: themeColors.primary }}
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">Chat</span>
                        </button>
                      </Link>
                      
                      {/* Order Button */}
                      <Link href={`/wirelessplant/orders/${product.id}`} className="flex-1">
                        <button
                          className="w-full px-4 py-2.5 rounded-xl text-white font-medium transition-all hover:shadow-lg flex items-center justify-center gap-2"
                          style={{ backgroundColor: themeColors.primary }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span className="text-sm">Pesan</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
