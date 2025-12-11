"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { 
  ChevronLeft, Package, ShoppingCart, MessageCircle, Plus, 
  DollarSign, TrendingUp, Clock, CheckCircle, Truck, X,
  Sprout, Edit, Trash2, Eye, Loader2, Search
} from "lucide-react"
import Link from "next/link"
import Navbar from "../components/Navbar"
import { PlanterGuard } from "../components/RoleGuard"
import { 
  getPlanterProducts, 
  getPlanterOrders, 
  addPlanterProduct,
  updateOrderStatus,
  PlanterProduct, 
  PlanterOrder,
  PlanterChat,
  getPlanterChats
} from "@/services/planterService"

const PRODUCT_CATEGORIES = [
  "Jasa Penanaman",
  "Perawatan Tanaman",
  "Pembibitan",
  "Sewa Lahan & Tanam",
]

const UNIT_OPTIONS = [
  { value: "lubang", label: "Lubang Tanam" },
  { value: "polybag", label: "Polybag" },
  { value: "pot", label: "Pot" },
  { value: "m2", label: "Meter Persegi" },
  { value: "batang", label: "Batang" },
  { value: "bulan", label: "Bulan" },
]

function PlanterDashboardContent() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()
  
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'chats'>('products')
  const [products, setProducts] = useState<PlanterProduct[]>([])
  const [orders, setOrders] = useState<PlanterOrder[]>([])
  const [chats, setChats] = useState<PlanterChat[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Add Product Form State
  const [productForm, setProductForm] = useState({
    plantName: "",
    description: "",
    pricePerUnit: 0,
    unit: "gram",
    stock: 0,
    category: "",
    isAvailable: true
  })

  // Fetch data
  const fetchData = async () => {
    if (!user?.uid) return
    
    setIsLoadingData(true)
    try {
      const [productsData, ordersData, chatsData] = await Promise.all([
        getPlanterProducts(user.uid),
        getPlanterOrders(user.uid),
        getPlanterChats(user.uid)
      ])
      setProducts(productsData)
      setOrders(ordersData)
      setChats(chatsData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoadingData(false)
    }
  }

  useEffect(() => {
    if (user?.uid) {
      fetchData()
    }
  }, [user?.uid])

  // Handle add product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.uid || !user?.name) return

    setIsSubmitting(true)
    try {
      await addPlanterProduct({
        planterId: user.uid,
        planterName: user.name,
        planterLocation: user.region || "",
        plantName: productForm.plantName,
        description: productForm.description,
        pricePerUnit: productForm.pricePerUnit,
        unit: productForm.unit,
        stock: productForm.stock,
        category: productForm.category,
        isAvailable: productForm.isAvailable
      })
      
      await fetchData()
      setIsAddProductModalOpen(false)
      setProductForm({
        plantName: "",
        description: "",
        pricePerUnit: 0,
        unit: "gram",
        stock: 0,
        category: "",
        isAvailable: true
      })
    } catch (error) {
      console.error("Error adding product:", error)
      alert("Gagal menambahkan produk")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle order status update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: PlanterOrder['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      await fetchData()
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)
  }

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  // Stats
  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalRevenue: orders.filter(o => o.paymentStatus === 'paid').reduce((acc, o) => acc + o.totalPrice, 0),
    totalChats: chats.length
  }

  // Order status badge
  const getOrderStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string, text: string, icon: React.ReactNode }> = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', icon: <Clock className="w-3 h-3" /> },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <CheckCircle className="w-3 h-3" /> },
      processing: { bg: 'bg-purple-100', text: 'text-purple-700', icon: <Package className="w-3 h-3" /> },
      shipped: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: <Truck className="w-3 h-3" /> },
      delivered: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle className="w-3 h-3" /> },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: <X className="w-3 h-3" /> },
    }
    const style = styles[status] || styles.pending
    return (
      <span className={`px-2 py-1 ${style.bg} ${style.text} rounded-full text-xs font-medium flex items-center gap-1`}>
        {style.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-3 text-emerald-500" />
          <p className="text-slate-500 text-sm">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 text-slate-900">
      <Navbar />
      
      <section className="pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-700" />
                </button>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sprout className="w-6 h-6" style={{ color: themeColors.primary }} />
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard Planter</h1>
                  </div>
                  <p className="text-slate-600">Kelola jasa tanam dan pesanan Anda</p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddProductModalOpen(true)}
                className="px-4 py-2 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                style={{ backgroundColor: themeColors.primary }}
              >
                <Plus className="w-5 h-5" />
                Tambah Jasa
              </motion.button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">Produk Aktif</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">{stats.totalProducts}</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">Total Pesanan</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">{stats.totalOrders}</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm col-span-2 md:col-span-1"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">Pesan Masuk</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">{stats.totalChats}</p>
              </motion.div>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 border border-slate-200 w-fit">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'products' 
                    ? 'text-white shadow-lg' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                style={activeTab === 'products' ? { backgroundColor: themeColors.primary } : {}}
              >
                <Package className="w-4 h-4 inline mr-2" />
                Jasa Saya
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'orders' 
                    ? 'text-white shadow-lg' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                style={activeTab === 'orders' ? { backgroundColor: themeColors.primary } : {}}
              >
                <ShoppingCart className="w-4 h-4 inline mr-2" />
                Pesanan
                {stats.pendingOrders > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {stats.pendingOrders}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('chats')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'chats' 
                    ? 'text-white shadow-lg' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                style={activeTab === 'chats' ? { backgroundColor: themeColors.primary } : {}}
              >
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Pesan
              </button>
            </div>
          </motion.div>

          {/* Products Tab */}
          {activeTab === 'products' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {isLoadingData ? (
                <div className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-500" />
                  <p className="text-slate-500">Memuat layanan...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="p-12 text-center">
                  <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-xl font-medium text-slate-900 mb-2">Belum ada layanan jasa</h3>
                  <p className="text-slate-500 mb-6">Tawarkan jasa penanaman pertama Anda untuk mulai menerima pesanan</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAddProductModalOpen(true)}
                    className="px-6 py-3 rounded-xl text-white font-medium shadow-lg"
                    style={{ backgroundColor: themeColors.primary }}
                  >
                    <Plus className="w-5 h-5 inline mr-2" />
                    Tambah Jasa
                  </motion.button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ y: -4 }}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-slate-900">{product.plantName}</h4>
                          <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full">
                            {product.category}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {product.isAvailable ? 'Tersedia' : 'Habis'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold" style={{ color: themeColors.primary }}>
                            {formatPrice(product.pricePerUnit)}
                            <span className="text-sm font-normal text-slate-500">/{product.unit}</span>
                          </p>
                          <p className="text-xs text-slate-500">Kapasitas: {product.stock} {product.unit}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50">
                            <Edit className="w-4 h-4 text-slate-600" />
                          </button>
                          <button className="p-2 rounded-lg bg-white border border-red-200 hover:bg-red-50">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {isLoadingData ? (
                <div className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-500" />
                  <p className="text-slate-500">Memuat pesanan...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-xl font-medium text-slate-900 mb-2">Belum ada pesanan</h3>
                  <p className="text-slate-500">Pesanan akan muncul di sini ketika ada pembeli</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-mono text-slate-500">#{order.orderId}</span>
                            {getOrderStatusBadge(order.status)}
                          </div>
                          <h4 className="font-bold text-slate-900 mb-1">{order.productName}</h4>
                          <p className="text-sm text-slate-600">
                            {order.buyerName} • {order.quantity} item
                          </p>
                          <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-bold" style={{ color: themeColors.primary }}>
                              {formatPrice(order.totalPrice)}
                            </p>
                            <p className={`text-xs font-medium ${
                              order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'
                            }`}>
                              {order.paymentStatus === 'paid' ? 'Sudah Dibayar' : 'Belum Dibayar'}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            {/* Chat Button */}
                            <Link href={`/wirelessplant/chat/${order.id}`}>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200"
                              >
                                <MessageCircle className="w-5 h-5" />
                              </motion.button>
                            </Link>
                            
                            {/* Update Status Dropdown */}
                            {order.status === 'pending' && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleUpdateOrderStatus(order.id!, 'confirmed')}
                                className="px-3 py-2 rounded-xl bg-green-100 text-green-700 text-sm font-medium hover:bg-green-200"
                              >
                                Konfirmasi
                              </motion.button>
                            )}
                            {order.status === 'confirmed' && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleUpdateOrderStatus(order.id!, 'processing')}
                                className="px-3 py-2 rounded-xl bg-purple-100 text-purple-700 text-sm font-medium hover:bg-purple-200"
                              >
                                Proses
                              </motion.button>
                            )}
                            {order.status === 'processing' && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleUpdateOrderStatus(order.id!, 'shipped')}
                                className="px-3 py-2 rounded-xl bg-indigo-100 text-indigo-700 text-sm font-medium hover:bg-indigo-200"
                              >
                                Kirim
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Chats Tab */}
          {activeTab === 'chats' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {isLoadingData ? (
                <div className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-500" />
                  <p className="text-slate-500">Memuat pesan...</p>
                </div>
              ) : chats.length === 0 ? (
                <div className="p-12 text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-xl font-medium text-slate-900 mb-2">Belum ada pesan</h3>
                  <p className="text-slate-500">Pesan dari pelanggan akan muncul di sini</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {chats.map((chat) => (
                    <Link 
                      href={`/wirelessplant/chat-planter/${chat.planterId}?buyerId=${chat.userId}`}
                      key={chat.id}
                      className="block p-6 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                            <span className="text-lg font-bold text-slate-600">
                              {chat.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{chat.userName}</h4>
                            <p className="text-sm text-slate-500">{chat.userEmail}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-400">
                            {formatDate(chat.lastMessageAt)}
                          </span>
                          <div className="mt-1">
                             <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Chat</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddProductModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsAddProductModalOpen(false)}
            />
            
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">Tawarkan Jasa Tanam</h2>
                  <button
                    onClick={() => setIsAddProductModalOpen(false)}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                {/* Modal Content */}
                <form onSubmit={handleAddProduct} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nama Jasa / Tanaman *</label>
                    <input
                      type="text"
                      value={productForm.plantName}
                      onChange={(e) => setProductForm({ ...productForm, plantName: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all"
                      placeholder="Contoh: Jasa Tanam Jahe Merah"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Kategori Layanan *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all appearance-none bg-white"
                    >
                      <option value="">Pilih Kategori</option>
                      {PRODUCT_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi Layanan *</label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      required
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all"
                      placeholder="Jelaskan detail jasa, metode tanam, dan estimasi hasil..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Biaya Jasa *</label>
                      <input
                        type="number"
                        value={productForm.pricePerUnit || ''}
                        onChange={(e) => setProductForm({ ...productForm, pricePerUnit: parseInt(e.target.value) || 0 })}
                        required
                        min={0}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all"
                        placeholder="10000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Satuan *</label>
                      <select
                        value={productForm.unit}
                        onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all appearance-none bg-white"
                      >
                        {UNIT_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Kapasitas / Slot Tersedia *</label>
                    <input
                      type="number"
                      value={productForm.stock || ''}
                      onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                      required
                      min={0}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all"
                      placeholder="100"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isAvailable"
                      checked={productForm.isAvailable}
                      onChange={(e) => setProductForm({ ...productForm, isAvailable: e.target.checked })}
                      className="w-5 h-5 rounded accent-emerald-500"
                    />
                    <label htmlFor="isAvailable" className="text-sm text-slate-700">
                      Jasa aktif dan bisa dipesan
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddProductModalOpen(false)}
                      className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ backgroundColor: themeColors.primary }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          Tambah Jasa
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Export dengan PlanterGuard untuk proteksi akses
export default function PlanterDashboardPage() {
  return (
    <PlanterGuard>
      <PlanterDashboardContent />
    </PlanterGuard>
  )
}
