"use client"
import { motion } from "framer-motion"
import { useTheme } from "../../../context/ThemeContext"
import { useState } from "react"
import { 
  ArrowLeft, MapPin, Calendar, Sprout, User, Phone, Mail, 
  MessageCircle, Camera, TrendingUp, Droplet, Sun, ThermometerSun,
  CheckCircle, Package, Truck, Home, Video
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import Navbar from "../../../components/Navbar"

interface OrderDetail {
  id: string
  orderId: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  orderDate: string
  startDate?: string
  estimatedHarvest?: string
  actualHarvest?: string
  
  // Plant Info
  plantType: string
  quantity: number
  duration: number
  
  // Planter Info
  planterName: string
  planterPhone: string
  planterEmail: string
  planterLocation: string
  planterRegion: string
  
  // Financial
  pricePerPlant: number
  totalPrice: number
  profitShare: number
  estimatedProfit: number
  
  // Progress
  progress: number
  currentPhase: string
  
  // Updates
  updates: Array<{
    id: string
    date: string
    title: string
    description: string
    images?: string[]
    metrics?: {
      height?: number
      health?: number
      moisture?: number
      temperature?: number
    }
  }>
}

const MOCK_ORDER: OrderDetail = {
  id: "1",
  orderId: "WP1733587200001",
  status: 'in_progress',
  orderDate: "2024-11-01",
  startDate: "2024-11-05",
  estimatedHarvest: "2025-05-05",
  
  plantType: "Jahe Merah",
  quantity: 50,
  duration: 6,
  
  planterName: "Budi Santoso",
  planterPhone: "+62 812-3456-7890",
  planterEmail: "budi.santoso@email.com",
  planterLocation: "Bandung",
  planterRegion: "Jawa Barat",
  
  pricePerPlant: 15000,
  totalPrice: 755000,
  profitShare: 25,
  estimatedProfit: 188750,
  
  progress: 45,
  currentPhase: "Fase Pertumbuhan",
  
  updates: [
    {
      id: "1",
      date: "2024-12-05",
      title: "Update Mingguan - Minggu ke-4",
      description: "Tanaman jahe merah tumbuh dengan baik. Tinggi rata-rata sudah mencapai 25cm. Kondisi daun sehat dan tidak ada tanda-tanda hama.",
      images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
      metrics: {
        height: 25,
        health: 95,
        moisture: 75,
        temperature: 28
      }
    },
    {
      id: "2",
      date: "2024-11-28",
      title: "Update Mingguan - Minggu ke-3",
      description: "Pertumbuhan konsisten. Dilakukan pemupukan organik dan penyiraman rutin. Semua tanaman dalam kondisi prima.",
      images: ["/api/placeholder/400/300"],
      metrics: {
        height: 18,
        health: 92,
        moisture: 70,
        temperature: 27
      }
    },
    {
      id: "3",
      date: "2024-11-21",
      title: "Update Mingguan - Minggu ke-2",
      description: "Tunas mulai muncul dengan baik. Sistem irigasi berfungsi optimal. Cuaca mendukung pertumbuhan.",
      images: ["/api/placeholder/400/300"],
      metrics: {
        height: 12,
        health: 90,
        moisture: 68,
        temperature: 26
      }
    },
    {
      id: "4",
      date: "2024-11-05",
      title: "Penanaman Dimulai",
      description: "Proses penanaman 50 bibit jahe merah telah selesai dilakukan. Lahan sudah disiapkan dengan pupuk organik dan sistem irigasi terpasang.",
      images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
      metrics: {
        height: 0,
        health: 100,
        moisture: 80,
        temperature: 25
      }
    }
  ]
}

const TIMELINE_STEPS = [
  { icon: Package, label: 'Order Dibuat', key: 'ordered' },
  { icon: CheckCircle, label: 'Pembayaran', key: 'paid' },
  { icon: Sprout, label: 'Penanaman', key: 'planted' },
  { icon: TrendingUp, label: 'Pertumbuhan', key: 'growing' },
  { icon: Home, label: 'Panen', key: 'harvested' },
  { icon: Truck, label: 'Distribusi', key: 'distributed' }
]

export default function OrderDetailPage() {
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()
  const params = useParams()
  const [activeTab, setActiveTab] = useState<'updates' | 'info'>('updates')
  
  const order = MOCK_ORDER
  
  const getCurrentStep = () => {
    if (order.status === 'completed') return 5
    if (order.status === 'in_progress') return 3
    if (order.status === 'pending') return 1
    return 0
  }
  
  const currentStep = getCurrentStep()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link href="/wirelessplant/orders">
            <motion.button
              whileHover={{ x: -4 }}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali ke Daftar Order</span>
            </motion.button>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-lg mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Order #{order.orderId}</h1>
                <p className="text-slate-600">
                  Dipesan pada {new Date(order.orderDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="text-sm text-slate-500 mb-1">Total Investasi</div>
                <div className="text-3xl font-bold" style={{ color: themeColors.primary }}>
                  Rp {order.totalPrice.toLocaleString('id-ID')}
                </div>
                <div className="text-sm text-green-600 mt-1">
                  Est. Profit: Rp {order.estimatedProfit.toLocaleString('id-ID')} ({order.profitShare}%)
                </div>
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-8 shadow-lg mb-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Progress Timeline</h2>
            <div className="relative">
              <div className="flex items-center justify-between">
                {TIMELINE_STEPS.map((step, index) => {
                  const StepIcon = step.icon
                  const isCompleted = index <= currentStep
                  const isCurrent = index === currentStep
                  
                  return (
                    <div key={step.key} className="flex flex-col items-center flex-1 relative">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          isCompleted ? 'text-white' : 'bg-slate-200 text-slate-400'
                        }`}
                        style={isCompleted ? { backgroundColor: themeColors.primary } : {}}
                      >
                        <StepIcon className="w-6 h-6" />
                      </motion.div>
                      <div className={`text-xs md:text-sm text-center ${isCurrent ? 'font-semibold' : ''}`} style={isCurrent ? { color: themeColors.primary } : {}}>
                        {step.label}
                      </div>
                      
                      {index < TIMELINE_STEPS.length - 1 && (
                        <div className="absolute top-6 left-1/2 w-full h-1 bg-slate-200" style={{ zIndex: -1 }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: isCompleted ? '100%' : '0%' }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                            className="h-full"
                            style={{ backgroundColor: themeColors.primary }}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-2 shadow-lg"
              >
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      activeTab === 'info' ? 'text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                    style={activeTab === 'info' ? { background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` } : {}}
                  >
                    Info Detail
                  </button>
                </div>
              </motion.div>
              {/* Info Tab */}
              {activeTab === 'info' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-3xl p-8 shadow-lg"
                >
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">Detail Pesanan</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Informasi Tanaman</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">Jenis Tanaman</span>
                          <span className="font-medium text-slate-900">{order.plantType}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">Jumlah</span>
                          <span className="font-medium text-slate-900">{order.quantity} tanaman</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">Durasi</span>
                          <span className="font-medium text-slate-900">{order.duration} bulan</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">Fase Saat Ini</span>
                          <span className="font-medium text-slate-900">{order.currentPhase}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Informasi Keuangan</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">Harga per Tanaman</span>
                          <span className="font-medium text-slate-900">Rp {order.pricePerPlant.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">Total Investasi</span>
                          <span className="font-medium text-slate-900">Rp {order.totalPrice.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">Bagi Hasil</span>
                          <span className="font-medium text-slate-900">{order.profitShare}%</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-slate-600">Estimasi Profit</span>
                          <span className="font-medium text-green-600">Rp {order.estimatedProfit.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Timeline</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">Tanggal Order</span>
                          <span className="font-medium text-slate-900">{new Date(order.orderDate).toLocaleDateString('id-ID')}</span>
                        </div>
                        {order.startDate && (
                          <div className="flex items-center justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-600">Mulai Tanam</span>
                            <span className="font-medium text-slate-900">{new Date(order.startDate).toLocaleDateString('id-ID')}</span>
                          </div>
                        )}
                        {order.estimatedHarvest && (
                          <div className="flex items-center justify-between py-2">
                            <span className="text-slate-600">Estimasi Panen</span>
                            <span className="font-medium text-slate-900">{new Date(order.estimatedHarvest).toLocaleDateString('id-ID')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Progress Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-6 shadow-lg sticky top-24"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-4">Progress Keseluruhan</h3>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Kemajuan</span>
                    <span className="text-2xl font-bold text-slate-900">{order.progress}%</span>
                  </div>
                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${order.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.secondary})` }}
                    />
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Sprout className="w-5 h-5" style={{ color: themeColors.primary }} />
                    <div>
                      <div className="text-sm text-slate-500">Fase Saat Ini</div>
                      <div className="font-semibold text-slate-900">{order.currentPhase}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" style={{ color: themeColors.primary }} />
                    <div>
                      <div className="text-sm text-slate-500">Estimasi Panen</div>
                      <div className="font-semibold text-slate-900">
                        {order.estimatedHarvest && new Date(order.estimatedHarvest).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 mb-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Informasi Planter</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-700">{order.planterName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-700">{order.planterLocation}, {order.planterRegion}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-700">{order.planterPhone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-700 text-sm">{order.planterEmail}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href={`/wirelessplant/chat/${order.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                      style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` }}
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Buka Chat Room</span>
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
