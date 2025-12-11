"use client"
import { motion } from "framer-motion"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import { useState, useEffect } from "react"
import { Package, Clock, CheckCircle, XCircle, Eye, MessageCircle, MapPin, Calendar, Sprout, ArrowLeft, Loader2, DollarSign } from "lucide-react"
import Link from "next/link"
import Navbar from "../../components/Navbar"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore"

interface Order {
  id: string
  orderId: string
  productId: string
  planterId: string
  buyerId: string
  buyerName: string
  productName: string
  quantity: number
  pricePerUnit: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed'
  createdAt: any
  notes?: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  pending: {
    label: 'Menunggu Konfirmasi',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    icon: Clock
  },
  confirmed: {
    label: 'Dikonfirmasi',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: CheckCircle
  },
  processing: {
    label: 'Sedang Diproses',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    icon: Sprout
  },
  shipped: {
    label: 'Dikirim',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: Package
  },
  delivered: {
    label: 'Selesai',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: CheckCircle
  },
  cancelled: {
    label: 'Dibatalkan',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: XCircle
  }
}

export default function OrdersPage() {
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()
  const { user } = useAuth()
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch orders from Firebase planterOrders collection
  useEffect(() => {
    if (!user) {
      setIsLoading(false)
      return
    }

    const q = query(
      collection(db, "planterOrders"),
      where("buyerId", "==", user.uid),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders: Order[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[]
      
      setOrders(fetchedOrders)
      setIsLoading(false)
    }, (error) => {
      console.error("Error fetching orders:", error)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus)

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'confirmed' || o.status === 'processing').length,
    delivered: orders.filter(o => o.status === 'delivered').length
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: themeColors.primary }} />
            <p className="text-slate-600">Memuat orderan...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
          <Link href="/wirelessplant">
              <motion.button
                whileHover={{ x: -4 }}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Kembali</span>
              </motion.button>
            </Link>
            <h1 className="text-5xl md:text-6xl font-light text-slate-900 mb-4">
              Orderan <span className="font-medium">Saya</span>
            </h1>
            <p className="text-xl text-slate-600">
              Kelola dan pantau semua pesanan penanaman Anda
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <Package className="w-8 h-8 mx-auto mb-2" style={{ color: themeColors.primary }} />
              <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-sm text-slate-600">Total Order</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <div className="text-3xl font-bold text-slate-900">{stats.pending}</div>
              <div className="text-sm text-slate-600">Menunggu</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <Sprout className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-3xl font-bold text-slate-900">{stats.processing}</div>
              <div className="text-sm text-slate-600">Diproses</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-3xl font-bold text-slate-900">{stats.delivered}</div>
              <div className="text-sm text-slate-600">Selesai</div>
            </div>
          </motion.div>

          {/* Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 shadow-sm mb-8"
          >
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'all', label: 'Semua' },
                { value: 'pending', label: 'Menunggu' },
                { value: 'processing', label: 'Diproses' },
                { value: 'delivered', label: 'Selesai' },
                { value: 'cancelled', label: 'Dibatalkan' }
              ].map((filter) => (
                <motion.button
                  key={filter.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterStatus(filter.value)}
                  className={`px-6 py-2 rounded-xl font-medium transition-all ${
                    filterStatus === filter.value
                      ? 'text-white shadow-lg'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  style={filterStatus === filter.value ? {
                    background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
                  } : {}}
                >
                  {filter.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Orders List */}
          <div className="space-y-6">
            {filteredOrders.map((order, index) => {
              const statusConfig = STATUS_CONFIG[order.status]
              const StatusIcon = statusConfig.icon

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6 md:p-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-slate-900">Order #{order.orderId}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color} flex items-center gap-1`}>
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="text-slate-500">Dipesan pada {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</p>
                      </div>
                      <div className="mt-4 md:mt-0 text-right">
                        <div className="text-sm text-slate-500 mb-1">Total Pembayaran</div>
                        <div className="text-2xl font-bold" style={{ color: themeColors.primary }}>
                          Rp {order.totalPrice?.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Detail Pesanan</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Sprout className="w-4 h-4" />
                            <span>{order.productName} - {order.quantity} unit</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <DollarSign className="w-4 h-4" />
                            <span>Harga: Rp {order.pricePerUnit?.toLocaleString('id-ID')} / unit</span>
                          </div>
                          {order.notes && (
                            <div className="flex items-start gap-2 text-slate-600">
                              <MessageCircle className="w-4 h-4 mt-0.5" />
                              <span>Catatan: {order.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {order.status === 'processing' && (
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Status Pesanan</h4>
                          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                            <Sprout className="w-6 h-6 text-indigo-600 mb-2" />
                            <p className="text-sm text-indigo-800">
                              Pesanan Anda sedang diproses oleh planter. Anda akan mendapat notifikasi ketika pesanan siap dikirim.
                            </p>
                          </div>
                        </div>
                      )}

                      {order.status === 'delivered' && (
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Status Pesanan</h4>
                          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                            <p className="text-sm text-green-800">
                              Pesanan telah selesai! Terima kasih telah menggunakan layanan WirelessPlant.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100">
                      <Link href={`/wirelessplant/orders/${order.id}`} className="flex-1 min-w-[200px]">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full px-6 py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                          style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` }}
                        >
                          <Eye className="w-5 h-5" />
                          <span>Lihat Detail</span>
                        </motion.button>
                      </Link>
                      
                      {(order.status === 'processing' || order.status === 'confirmed' || order.status === 'delivered') && (
                        <Link href={`/wirelessplant/chat-planter/${order.planterId}`} className="flex-1 min-w-[200px]">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full px-6 py-3 rounded-xl font-medium border-2 transition-all flex items-center justify-center gap-2"
                            style={{ borderColor: themeColors.primary, color: themeColors.primary }}
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span>Chat Planter</span>
                          </motion.button>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {filteredOrders.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-2xl font-medium text-slate-900 mb-2">Tidak ada orderan</h3>
              <p className="text-slate-600 mb-6">Belum ada orderan dengan status ini</p>
              <Link href="/wirelessplant">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all"
                  style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` }}
                >
                  Mulai Pesan
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
