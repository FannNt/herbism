"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Package, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { db } from "@/lib/firebase"
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore"

interface Order {
  id: string
  orderId: string
  productName: string
  quantity: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed'
  planterId: string
  totalPrice: number
  createdAt: Date
}

export default function CartIndicator() {
  const { user } = useAuth()
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)

  // Listen to user's active orders from planterOrders collection
  useEffect(() => {
    if (!user) {
      setOrders([])
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

  // Filter only paid orders
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid')
  const paidCount = paidOrders.length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'confirmed': return 'bg-blue-100 text-blue-700'
      case 'processing': return 'bg-indigo-100 text-indigo-700'
      case 'shipped': return 'bg-purple-100 text-purple-700'
      case 'delivered': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu'
      case 'confirmed': return 'Dikonfirmasi'
      case 'processing': return 'Diproses'
      case 'shipped': return 'Dikirim'
      case 'delivered': return 'Selesai'
      case 'cancelled': return 'Batal'
      default: return status
    }
  }

  if (!user) return null

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <Link href="/wirelessplant/orders">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative px-6 py-4 rounded-full border-2 font-medium transition-all flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white"
          style={{ borderColor: themeColors.primary, color: themeColors.primary }}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              <span>Orderan Saya</span>
              {paidCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-1 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                  style={{ backgroundColor: themeColors.primary }}
                >
                  {paidCount > 9 ? '9+' : paidCount}
                </motion.span>
              )}
            </>
          )}
        </motion.button>
      </Link>

      {/* Dropdown Preview */}
      <AnimatePresence>
        {showDropdown && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-3 right-0 w-80 bg-white rounded-2xl shadow-2xl border-2 overflow-hidden z-50"
            style={{ borderColor: `${themeColors.primary}25` }}
          >
            {/* Header */}
            <div 
              className="px-4 py-3 border-b"
              style={{ borderColor: `${themeColors.primary}15`, backgroundColor: `${themeColors.primary}05` }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Orderan Saya</h3>
                {paidCount > 0 && (
                  <span 
                    className="text-xs font-medium px-2 py-1 rounded-full text-white"
                    style={{ backgroundColor: themeColors.primary }}
                  >
                    {paidCount} dibayar
                  </span>
                )}
              </div>
            </div>

            {/* Orders List */}
            <div className="max-h-[300px] overflow-y-auto">
              {paidOrders.length === 0 ? (
                <div className="p-6 text-center">
                  <Package className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                  <p className="text-slate-500 text-sm">Belum ada orderan</p>
                  <Link href="/wirelessplant">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="mt-3 text-sm font-medium px-4 py-2 rounded-xl text-white"
                      style={{ backgroundColor: themeColors.primary }}
                    >
                      Mulai Pesan
                    </motion.button>
                  </Link>
                </div>
              ) : (
                <div className="p-2">
                  {paidOrders.slice(0, 4).map((order, idx) => (
                    <Link key={order.id} href={`/wirelessplant/orders/${order.id}`}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className={`p-3 rounded-xl flex items-center gap-3 transition-all hover:bg-slate-50 ${
                          idx !== paidOrders.slice(0, 4).length - 1 ? 'border-b border-slate-100' : ''
                        }`}
                      >
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${themeColors.primary}15` }}
                        >
                          <Package className="w-5 h-5" style={{ color: themeColors.primary }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-slate-900 text-sm truncate">{order.productName}</span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500 truncate">Qty: {order.quantity}</span>
                            <span className="text-xs text-slate-400">Rp {order.totalPrice?.toLocaleString('id-ID')}</span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {orders.length > 0 && (
              <Link href="/wirelessplant/orders">
                <div 
                  className="px-4 py-3 border-t text-center hover:bg-slate-50 transition-all"
                  style={{ borderColor: `${themeColors.primary}15` }}
                >
                  <span className="text-sm font-medium" style={{ color: themeColors.primary }}>
                    Lihat Semua Orderan →
                  </span>
                </div>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
