"use client"
import { motion } from "framer-motion"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import { useState, useEffect, Suspense } from "react"
import { CreditCard, Wallet, Building2, CheckCircle, ArrowLeft, Shield, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import Navbar from "../../components/Navbar"
import { db } from "@/lib/firebase"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"

interface PaymentMethod {
  id: string
  name: string
  icon: any
  description: string
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "credit_card",
    name: "Kartu Kredit/Debit",
    icon: CreditCard,
    description: "Visa, Mastercard, JCB"
  },
  {
    id: "ewallet",
    name: "E-Wallet",
    icon: Wallet,
    description: "GoPay, OVO, Dana, ShopeePay"
  },
  {
    id: "bank_transfer",
    name: "Transfer Bank",
    icon: Building2,
    description: "BCA, Mandiri, BNI, BRI"
  }
]

function CheckoutContent() {
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  
  const [selectedPayment, setSelectedPayment] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [planterName, setPlanterName] = useState("")

  // Get order details from URL params
  const planterId = searchParams.get('planterId')
  const plant = searchParams.get('plant')
  const quantity = parseInt(searchParams.get('quantity') || '10')
  const duration = searchParams.get('duration') || '6'
  const pricePerPlant = 15000
  const totalPrice = quantity * pricePerPlant
  const adminFee = 5000
  const grandTotal = totalPrice + adminFee

  // Fetch planter info
  useEffect(() => {
    const fetchPlanterInfo = async () => {
      if (!planterId) return
      try {
        const planterDoc = await getDoc(doc(db, "planterRegistrations", planterId))
        if (planterDoc.exists()) {
          setPlanterName(planterDoc.data().fullName || "Planter")
        }
      } catch (error) {
        console.error("Error fetching planter:", error)
      }
    }
    fetchPlanterInfo()
  }, [planterId])

  const handlePayment = async () => {
    if (!selectedPayment) {
      alert("Pilih metode pembayaran terlebih dahulu")
      return
    }

    if (!user) {
      alert("Silakan login terlebih dahulu")
      router.push("/login")
      return
    }

    setIsProcessing(true)
    
    try {
      const newOrderId = `WP${Date.now()}`
      
      // Save order to Firebase
      await setDoc(doc(db, "userOrders", newOrderId), {
        orderId: newOrderId,
        userId: user.uid,
        userName: user.name || user.username || "User",
        planterId: planterId,
        planterName: planterName,
        planterLocation: "Indonesia", // You can fetch this from planter data
        plantType: plant,
        quantity: quantity,
        duration: parseInt(duration),
        pricePerPlant: pricePerPlant,
        totalPrice: totalPrice,
        adminFee: adminFee,
        grandTotal: grandTotal,
        paymentMethod: selectedPayment,
        status: 'pending',
        progress: 0,
        orderDate: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp(),
        lastUpdate: new Date().toISOString().split('T')[0]
      })

      setOrderId(newOrderId)
      setIsProcessing(false)
      setIsSuccess(true)
      
      // Redirect to orders page after 3 seconds
      setTimeout(() => {
        router.push(`/wirelessplant/orders`)
      }, 3000)
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Gagal membuat pesanan. Silakan coba lagi.")
      setIsProcessing(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center px-4">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-12 shadow-xl text-center max-w-md mt-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <CheckCircle className="w-24 h-24 mx-auto mb-6 text-green-500" />
          </motion.div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Pembayaran Berhasil!</h2>
          <p className="text-slate-600 mb-2">
            Order ID: <strong>{orderId}</strong>
          </p>
          <p className="text-slate-600 mb-6">
            Terima kasih! Pesanan Anda sedang diproses.
          </p>
          <div className="text-sm text-slate-500">
            Mengalihkan ke halaman orderan...
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <Link href={`/wirelessplant/${planterId}`}>
            <motion.button
              whileHover={{ x: -4 }}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali</span>
            </motion.button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-light text-slate-900 mb-4">
              Checkout <span className="font-medium">Pembayaran</span>
            </h1>
            <p className="text-xl text-slate-600">
              Selesaikan pembayaran untuk memulai penanaman
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Detail Pesanan</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-600">Jenis Tanaman</span>
                    <span className="font-semibold text-slate-900">{plant}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-600">Jumlah</span>
                    <span className="font-semibold text-slate-900">{quantity} tanaman</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-600">Durasi</span>
                    <span className="font-semibold text-slate-900">{duration} bulan</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-600">Harga per tanaman</span>
                    <span className="font-semibold text-slate-900">Rp {pricePerPlant.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </motion.div>

              {/* Payment Methods */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Metode Pembayaran</h2>
                
                <div className="space-y-4">
                  {PAYMENT_METHODS.map((method) => (
                    <motion.button
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                        selectedPayment === method.id
                          ? 'shadow-lg'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      style={selectedPayment === method.id ? {
                        borderColor: themeColors.primary,
                        backgroundColor: `${themeColors.primary}10`
                      } : {}}
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${themeColors.primary}20` }}
                        >
                          <method.icon className="w-6 h-6" style={{ color: themeColors.primary }} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">{method.name}</h3>
                          <p className="text-sm text-slate-500">{method.description}</p>
                        </div>
                        {selectedPayment === method.id && (
                          <CheckCircle className="w-6 h-6" style={{ color: themeColors.primary }} />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Security Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-blue-50 border border-blue-200 rounded-2xl p-6"
              >
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Transaksi Aman & Terpercaya</h3>
                    <p className="text-sm text-blue-800">
                      Pembayaran Anda dilindungi dengan enkripsi SSL 256-bit. 
                      Dana akan disimpan dalam escrow hingga tanaman siap panen.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Price Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-3xl p-8 shadow-lg sticky top-24"
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Ringkasan Pembayaran</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium text-slate-900">Rp {totalPrice.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Biaya Admin</span>
                    <span className="font-medium text-slate-900">Rp {adminFee.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex items-center justify-between text-xl font-bold">
                      <span className="text-slate-900">Total</span>
                      <span style={{ color: themeColors.primary }}>Rp {grandTotal.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={!selectedPayment || isProcessing}
                  className={`w-full py-4 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all ${
                    !selectedPayment || isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` }}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Memproses...
                    </span>
                  ) : (
                    'Bayar Sekarang'
                  )}
                </motion.button>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: themeColors.primary }} />
                    <p>Estimasi waktu tanam: 2-3 hari setelah pembayaran</p>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: themeColors.primary }} />
                    <p>Update progress mingguan via dashboard</p>
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
