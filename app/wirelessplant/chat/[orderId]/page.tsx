"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../../../context/ThemeContext"
import { useState, useRef, useEffect } from "react"
import { 
  ArrowLeft, Send, Phone, Video, MoreVertical, 
  Image as ImageIcon, Paperclip, Smile, Check, CheckCheck,
  Sprout, Calendar, MapPin, X, Mic, MicOff, VideoOff
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import Image from "next/image"

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
  type: 'text' | 'image' | 'system'
  isRead: boolean
}

interface OrderInfo {
  id: string
  orderId: string
  plantType: string
  quantity: number
  planterName: string
  planterAvatar: string
  planterLocation: string
  status: 'pending' | 'in_progress' | 'completed'
  progress: number
}

const MOCK_ORDER: OrderInfo = {
  id: "1",
  orderId: "WP1733587200001",
  plantType: "Jahe Merah",
  quantity: 50,
  planterName: "Budi Santoso",
  planterAvatar: "",
  planterLocation: "Bandung, Jawa Barat",
  status: "in_progress",
  progress: 45
}

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    senderId: "system",
    senderName: "System",
    content: "Room chat dibuat. Silakan berkomunikasi dengan planter mengenai pesanan Anda.",
    timestamp: new Date(Date.now() - 86400000 * 2),
    type: "system",
    isRead: true
  },
  {
    id: "2",
    senderId: "planter",
    senderName: "Budi Santoso",
    content: "Halo! Terima kasih sudah memesan. Saya akan segera memulai penanaman jahe merah Anda.",
    timestamp: new Date(Date.now() - 86400000 * 2 + 3600000),
    type: "text",
    isRead: true
  },
  {
    id: "3",
    senderId: "user",
    senderName: "Anda",
    content: "Terima kasih Pak Budi! Kapan kira-kira mulai ditanam?",
    timestamp: new Date(Date.now() - 86400000 * 2 + 7200000),
    type: "text",
    isRead: true
  },
  {
    id: "4",
    senderId: "planter",
    senderName: "Budi Santoso",
    content: "Besok pagi saya mulai ya. Lahan sudah siap dan bibit sudah tersedia.",
    timestamp: new Date(Date.now() - 86400000 * 2 + 7800000),
    type: "text",
    isRead: true
  },
  {
    id: "5",
    senderId: "planter",
    senderName: "Budi Santoso",
    content: "Ini foto bibit yang akan ditanam:",
    timestamp: new Date(Date.now() - 86400000),
    type: "text",
    isRead: true
  },
  {
    id: "6",
    senderId: "planter",
    senderName: "Budi Santoso",
    content: "/Erbis.jpg",
    timestamp: new Date(Date.now() - 86400000 + 1000),
    type: "image",
    isRead: true
  },
  {
    id: "7",
    senderId: "user",
    senderName: "Anda",
    content: "Bagus sekali! Ditunggu updatenya ya pak.",
    timestamp: new Date(Date.now() - 3600000),
    type: "text",
    isRead: true
  }
]

export default function ChatRoomPage() {
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()
  const params = useParams()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES)
  const [newMessage, setNewMessage] = useState("")
  const [showOrderInfo, setShowOrderInfo] = useState(false)
  const [isVideoCall, setIsVideoCall] = useState(false)
  const [isVoiceCall, setIsVoiceCall] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  const order = MOCK_ORDER

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: "user",
      senderName: "Anda",
      content: newMessage,
      timestamp: new Date(),
      type: "text",
      isRead: false
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Simulate planter reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: "planter",
        senderName: "Budi Santoso",
        content: "Terima kasih atas pesannya! Akan saya proses segera.",
        timestamp: new Date(),
        type: "text",
        isRead: false
      }
      setMessages(prev => [...prev, reply])
    }, 2000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return "Hari ini"
    if (date.toDateString() === yesterday.toDateString()) return "Kemarin"
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const groupMessagesByDate = () => {
    const groups: { date: string; messages: Message[] }[] = []
    let currentDate = ""

    messages.forEach(message => {
      const dateStr = formatDate(message.timestamp)
      if (dateStr !== currentDate) {
        currentDate = dateStr
        groups.push({ date: dateStr, messages: [message] })
      } else {
        groups[groups.length - 1].messages.push(message)
      }
    })

    return groups
  }

  // Video Call Modal
  const VideoCallModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex flex-col"
    >
      {/* Remote Video (Full Screen) */}
      <div className="flex-1 relative bg-slate-900 flex items-center justify-center ">
        <div className="text-center text-white">
          <div 
            className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl font-bold"
            style={{ backgroundColor: themeColors.primary }}
          >
            {order.planterName.charAt(0)}
          </div>
          <h3 className="text-2xl font-semibold mb-2">{order.planterName}</h3>
          <p className="text-slate-400">Sedang tersambung...</p>
        </div>

        {/* Local Video (Small) */}
        <div className="absolute bottom-24 right-4 w-32 h-44 bg-slate-800 rounded-2xl overflow-hidden border-2 border-white/20">
          {isVideoOff ? (
            <div className="w-full h-full flex items-center justify-center">
              <VideoOff className="w-8 h-8 text-white/50" />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
              <span className="text-white/50 text-sm">Kamera Anda</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              isMuted ? 'bg-red-500' : 'bg-white/20'
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              isVideoOff ? 'bg-red-500' : 'bg-white/20'
            }`}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsVideoCall(false)}
            className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center"
          >
            <Phone className="w-7 h-7 text-white rotate-[135deg]" />
          </motion.button>
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsVideoCall(false)}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </motion.button>
            <div className="text-white">
              <h4 className="font-semibold">{order.planterName}</h4>
              <p className="text-sm text-white/70">Video Call</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  // Voice Call Modal
  const VoiceCallModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` }}
    >
      <div className="flex-1 flex flex-col items-center justify-center text-white">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-40 h-40 rounded-full bg-white/20 mb-8 flex items-center justify-center text-6xl font-bold"
        >
          {order.planterName.charAt(0)}
        </motion.div>
        <h3 className="text-3xl font-bold mb-2">{order.planterName}</h3>
        <p className="text-white/70">Sedang menghubungi...</p>
      </div>

      <div className="p-8">
        <div className="flex items-center justify-center gap-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMuted(!isMuted)}
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isMuted ? 'bg-red-500' : 'bg-white/20'
            }`}
          >
            {isMuted ? <MicOff className="w-7 h-7 text-white" /> : <Mic className="w-7 h-7 text-white" />}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsVoiceCall(false)}
            className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center"
          >
            <Phone className="w-8 h-8 text-white rotate-[135deg]" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Video/Voice Call Modals */}
      <AnimatePresence>
        {isVideoCall && <VideoCallModal />}
        {isVoiceCall && <VoiceCallModal />}
      </AnimatePresence>

      {/* Chat Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link href="/wirelessplant/orders">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </motion.button>
              </Link>
              
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white"
                style={{ backgroundColor: themeColors.primary }}
              >
                {order.planterName.charAt(0)}
              </div>
              
              <div>
                <h2 className="font-bold text-slate-900">{order.planterName}</h2>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Online
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVoiceCall(true)}
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <Phone className="w-5 h-5 text-slate-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVideoCall(true)}
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <Video className="w-5 h-5 text-slate-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowOrderInfo(!showOrderInfo)}
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-slate-600" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Info Panel */}
      <AnimatePresence>
        {showOrderInfo && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-36 md:top-40 left-0 right-0 z-30 px-4"
          >
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">Info Pesanan</h3>
                  <button onClick={() => setShowOrderInfo(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Sprout className="w-5 h-5" style={{ color: themeColors.primary }} />
                    <div>
                      <p className="text-xs text-slate-500">Tanaman</p>
                      <p className="font-medium text-slate-900">{order.plantType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" style={{ color: themeColors.primary }} />
                    <div>
                      <p className="text-xs text-slate-500">Jumlah</p>
                      <p className="font-medium text-slate-900">{order.quantity} tanaman</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <MapPin className="w-5 h-5" style={{ color: themeColors.primary }} />
                    <div>
                      <p className="text-xs text-slate-500">Lokasi</p>
                      <p className="font-medium text-slate-900">{order.planterLocation}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Progress</span>
                    <span className="text-sm font-semibold" style={{ color: themeColors.primary }}>{order.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${order.progress}%` }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.secondary})` }}
                    />
                  </div>
                </div>
                <Link href={`/wirelessplant/orders/${order.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-4 py-3 rounded-xl font-medium text-white"
                    style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` }}
                  >
                    Lihat Detail Order
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Area */}
      <div className="flex-1 pt-40 md:pt-44 pb-24 px-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {groupMessagesByDate().map((group, groupIndex) => (
            <div key={groupIndex}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-6">
                <span className="px-4 py-1 bg-white rounded-full text-xs text-slate-500 shadow-sm">
                  {group.date}
                </span>
              </div>

              {/* Messages */}
              {group.messages.map((message) => {
                const isUser = message.senderId === "user"
                const isSystem = message.type === "system"

                if (isSystem) {
                  return (
                    <div key={message.id} className="flex justify-center my-4">
                      <span className="px-4 py-2 bg-blue-50 text-blue-600 text-xs rounded-xl text-center max-w-sm">
                        {message.content}
                      </span>
                    </div>
                  )
                }

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[75%] ${isUser ? 'order-2' : 'order-1'}`}>
                      {message.type === "image" ? (
                        <div 
                          className={`rounded-2xl overflow-hidden shadow-sm ${
                            isUser ? 'rounded-tr-md' : 'rounded-tl-md'
                          }`}
                        >
                          <Image
                            src={message.content}
                            alt="Shared image"
                            width={300}
                            height={200}
                            className="object-cover"
                          />
                          <div 
                            className={`px-3 py-1 text-xs flex items-center justify-end gap-1 ${
                              isUser ? 'text-white/80' : 'bg-white text-slate-500'
                            }`}
                            style={isUser ? { backgroundColor: themeColors.primary } : {}}
                          >
                            {formatTime(message.timestamp)}
                            {isUser && (
                              message.isRead ? <CheckCheck className="w-4 h-4" /> : <Check className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      ) : (
                        <div 
                          className={`px-4 py-3 rounded-2xl shadow-sm ${
                            isUser 
                              ? 'text-white rounded-tr-md' 
                              : 'bg-white text-slate-800 rounded-tl-md'
                          }`}
                          style={isUser ? { backgroundColor: themeColors.primary } : {}}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                            isUser ? 'text-white/70' : 'text-slate-400'
                          }`}>
                            {formatTime(message.timestamp)}
                            {isUser && (
                              message.isRead ? <CheckCheck className="w-4 h-4" /> : <Check className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40 text-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <Paperclip className="w-5 h-5 text-slate-500" />
            </motion.button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ketik pesan..."
                className="w-full px-4 py-3 bg-slate-100 rounded-full focus:outline-none focus:ring-2 pr-12 transition-all"
                style={{ '--tw-ring-color': themeColors.primary } as any}
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2">
                <Smile className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${
                !newMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` }}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
