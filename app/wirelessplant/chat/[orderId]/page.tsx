"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../../../context/ThemeContext"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "../../../context/AuthContext"
import { 
  ArrowLeft, Send, Phone, Video, MoreVertical, 
  Image as ImageIcon, Paperclip, Smile, Check, CheckCheck,
  Sprout, Calendar, MapPin, X, Loader2, Package
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import Navbar from "../../../components/Navbar"
import AuthGuard from "../../../components/AuthGuard"
import { db } from "@/lib/firebase"
import { 
  doc, getDoc, collection, addDoc, query, orderBy, 
  onSnapshot, serverTimestamp, Timestamp, updateDoc 
} from "firebase/firestore"
import type { PlanterOrder } from "@/services/planterService"

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Timestamp | Date
  type: 'text' | 'system'
  isRead: boolean
}

export default function ChatRoomPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()
  
  const [order, setOrder] = useState<PlanterOrder | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Fetch order data
  useEffect(() => {
    if (!params.orderId) return
    
    const fetchOrder = async () => {
      try {
        const orderDoc = await getDoc(doc(db, "planterOrders", params.orderId as string))
        if (orderDoc.exists()) {
          setOrder({ id: orderDoc.id, ...orderDoc.data() } as PlanterOrder)
        }
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchOrder()
  }, [params.orderId])

  // Listen to messages real-time
  useEffect(() => {
    if (!params.orderId) return

    const q = query(
      collection(db, "planterOrders", params.orderId as string, "messages"),
      orderBy("timestamp", "asc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[]
      
      setMessages(msgs)
      setTimeout(() => scrollToBottom(), 100)
    })

    return () => unsubscribe()
  }, [params.orderId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !user || !params.orderId) return

    setIsSending(true)
    try {
      await addDoc(
        collection(db, "planterOrders", params.orderId as string, "messages"), 
        {
          senderId: user.uid,
          senderName: user.name,
          content: messageInput.trim(),
          timestamp: serverTimestamp(),
          type: 'text',
          isRead: false
        }
      )
      setMessageInput("")
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Gagal mengirim pesan")
    } finally {
      setIsSending(false)
    }
  }

  const formatTimestamp = (timestamp: Timestamp | Date | null) => {
    if (!timestamp) return 'Baru saja'
    
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp
    if (!date) return 'Baru saja'
    
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    // If today, show time
    if (diff < 86400000) {
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
    // If this week, show day
    if (diff < 604800000) {
      return date.toLocaleDateString('id-ID', { weekday: 'short', hour: '2-digit', minute: '2-digit' })
    }
    // Otherwise show date
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(price)
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string, text: string, label: string }> = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Menunggu' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Dikonfirmasi' },
      processing: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Diproses' },
      shipped: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Dikirim' },
      delivered: { bg: 'bg-green-100', text: 'text-green-700', label: 'Selesai' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Dibatalkan' },
    }
    const style = styles[status] || styles.pending
    return (
      <span className={`px-3 py-1 ${style.bg} ${style.text} rounded-full text-xs font-medium`}>
        {style.label}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Navbar />
        <div className="text-center pt-32">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-emerald-500" />
          <p className="text-slate-500">Memuat chat...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-32 text-center px-4">
          <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Pesanan tidak ditemukan</h1>
          <Link href="/wirelessplant" className="text-emerald-600 hover:underline">
            Kembali ke beranda
          </Link>
        </div>
      </div>
    )
  }

  const isPlanter = user?.uid === order.planterId
  const otherPersonName = isPlanter ? order.buyerName : `Planter`

  return (
    <AuthGuard message="Silakan login untuk mengakses chat pesanan">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <Navbar />
      
      <section className="pt-20 pb-0 h-screen flex flex-col">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 flex-1 flex flex-col">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-t-3xl p-4 shadow-sm border border-slate-200 border-b-0 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Link href={isPlanter ? "/planter-dashboard" : "/wirelessplant"}>
                <button className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-emerald-700">
                    {otherPersonName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{otherPersonName}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Sprout className="w-3 h-3" />
                    <span>{order.productName}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {getStatusBadge(order.status)}
            </div>
          </motion.div>

          {/* Order Info Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-blue-50 border border-blue-100 border-t-0 p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700">
                  {order.quantity} item • {formatPrice(order.totalPrice)}
                </span>
              </div>
              <div className="w-px h-4 bg-blue-200" />
              <span className="text-blue-600">ID: {order.orderId}</span>
            </div>
          </motion.div>

          {/* Messages Container */}
          <div 
            ref={chatContainerRef}
            className="flex-1 bg-white overflow-y-auto p-6 space-y-4"
            style={{ maxHeight: 'calc(100vh - 320px)' }}
          >
            <AnimatePresence>
              {messages.map((message, index) => {
                const isOwn = message.senderId === user?.uid
                const isSystem = message.type === 'system'

                if (isSystem) {
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex justify-center my-4"
                    >
                      <div className="px-4 py-2 bg-slate-100 rounded-full text-xs text-slate-600 max-w-md text-center">
                        {message.content}
                      </div>
                    </motion.div>
                  )
                }

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          isOwn 
                            ? 'rounded-br-sm text-white' 
                            : 'bg-slate-100 text-slate-900 rounded-bl-sm'
                        }`}
                        style={isOwn ? { backgroundColor: themeColors.primary } : {}}
                      >
                        <p className="text-sm break-words">{message.content}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 px-2">
                        <span className="text-xs text-slate-400">
                          {formatTimestamp(message.timestamp)}
                        </span>
                        {isOwn && (
                          message.isRead ? 
                            <CheckCheck className="w-3 h-3 text-blue-500" /> :
                            <Check className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSendMessage}
            className="bg-white rounded-b-3xl p-4 shadow-sm border border-slate-200 border-t-0 flex items-center gap-3"
          >
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Ketik pesan..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!messageInput.trim() || isSending}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
              style={{ backgroundColor: themeColors.primary }}
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </motion.form>
        </div>
      </section>
      </div>
    </AuthGuard>
  )
}
