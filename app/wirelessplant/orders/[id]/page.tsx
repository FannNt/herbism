"use client"
import { motion } from "framer-motion"
import { useTheme } from "../../../context/ThemeContext"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "../../../context/AuthContext"
import { 
  ArrowLeft, Package, MapPin, User, Phone, Mail, 
  Calendar, DollarSign, ShoppingCart, CheckCircle, Loader2, MessageCircle
} from "lucide-react"
import Link from "next/link"
import Navbar from "../../../components/Navbar"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import type { PlanterProduct } from "@/services/planterService"

export default function CheckoutPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()
  
  const [product, setProduct] = useState<PlanterProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [orderData, setOrderData] = useState({
    quantity: 1,
    notes: "",
    buyerPhone: user?.uid || "",
    buyerAddress: ""
  })

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return
      
      try {
        const docRef = doc(db, "planterProducts", params.id as string)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as PlanterProduct)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProduct()
  }, [params.id])

  const calculateTotal = () => {
    if (!product) return 0
    return product.pricePerUnit * orderData.quantity
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product || !user) return

    setIsSubmitting(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Pembayaran Berhasil! Pesanan Anda telah dikirim ke planter.")
      
      // Redirect to chat with planter
      router.push(`/wirelessplant/chat-planter/${product.planterId}`)
    }, 2000)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Navbar />
        <div className="text-center pt-32">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-emerald-500" />
          <p className="text-slate-500">Memuat data jasa...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-32 text-center px-4">
          <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Jasa tidak ditemukan</h1>
          <Link href="/wirelessplant" className="text-emerald-600 hover:underline">
            Kembali ke daftar jasa
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 text-slate-900">
      <Navbar />
      
      <section className="pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link href="/wirelessplant">
            <motion.button
              whileHover={{ x: -4 }}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali</span>
            </motion.button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Detail Pemesanan</h2>
                
                <form onSubmit={handleSubmitOrder} className="space-y-6">
                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Jumlah Pesanan *
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setOrderData(prev => ({ 
                          ...prev, 
                          quantity: Math.max(1, prev.quantity - 1) 
                        }))}
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={orderData.quantity}
                        onChange={(e) => setOrderData(prev => ({ 
                          ...prev, 
                          quantity: Math.max(1, parseInt(e.target.value) || 1) 
                        }))}
                        min="1"
                        max={product.stock}
                        className="w-24 text-center px-4 py-2 rounded-xl border border-slate-200 font-bold text-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setOrderData(prev => ({ 
                          ...prev, 
                          quantity: Math.min(product.stock, prev.quantity + 1) 
                        }))}
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                      <span className="text-sm text-slate-500">
                        Tersedia: {product.stock} {product.unit}
                      </span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nomor Telepon *
                    </label>
                    <input
                      type="tel"
                      value={orderData.buyerPhone}
                      onChange={(e) => setOrderData(prev => ({ ...prev, buyerPhone: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2"
                      placeholder="08123456789"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Alamat Lengkap *
                    </label>
                    <textarea
                      value={orderData.buyerAddress}
                      onChange={(e) => setOrderData(prev => ({ ...prev, buyerAddress: e.target.value }))}
                      required
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2"
                      placeholder="Masukkan alamat lengkap Anda"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Catatan (Opsional)
                    </label>
                    <textarea
                      value={orderData.notes}
                      onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2"
                      placeholder="Tambahkan catatan atau permintaan khusus..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !user}
                    className="w-full py-4 rounded-xl text-white font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ backgroundColor: themeColors.primary }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Pesan Sekarang
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-24"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-4">Ringkasan Pesanan</h3>
                
                {/* Product Info */}
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Package className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{product.plantName}</h4>
                      <p className="text-sm text-slate-500">{product.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User className="w-4 h-4" />
                    <span>{product.planterName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{product.planterLocation}</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Harga per {product.unit}</span>
                    <span className="font-medium">{formatPrice(product.pricePerUnit)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Jumlah</span>
                    <span className="font-medium">{orderData.quantity} {product.unit}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span style={{ color: themeColors.primary }}>
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
