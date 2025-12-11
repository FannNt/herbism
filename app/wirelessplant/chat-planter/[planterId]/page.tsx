"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../../../context/ThemeContext"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "../../../context/AuthContext"
import { 
  ArrowLeft, Send, Sprout, X, Loader2, Package, MessageCircle, Check, CheckCheck, Video
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Navbar from "../../../components/Navbar"
import { db } from "@/lib/firebase"
import { 
  doc, getDoc, setDoc, collection, addDoc, query, orderBy, 
  onSnapshot, serverTimestamp, Timestamp, where, getDocs 
} from "firebase/firestore"

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Timestamp | Date
  type: 'text' | 'system'
  isRead: boolean
}

interface PlanterInfo {
  id: string
  fullName: string
  city: string
  province: string
  specialization: string[]
  customPlants: string[]
  userId?: string
}

export default function ChatPlanterPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()
  
  const [planterInfo, setPlanterInfo] = useState<PlanterInfo | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [chatRoomId, setChatRoomId] = useState<string>("")
  const [chatRoomData, setChatRoomData] = useState<any>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch planter info and setup chat room
  useEffect(() => {
    if (!params.planterId || !user) return
    
    const setupChat = async () => {
      try {
        let planterData: PlanterInfo | null = null
        let planterUserId = params.planterId as string

        // First try to find by document ID
        const planterDoc = await getDoc(doc(db, "planterRegistrations", params.planterId as string))
        if (planterDoc.exists()) {
          const data = planterDoc.data()
          planterData = { id: planterDoc.id, ...data } as PlanterInfo
          planterUserId = data.userId || planterDoc.id
        } else {
          // If not found by document ID, try to find by userId
          const q = query(
            collection(db, "planterRegistrations"),
            where("userId", "==", params.planterId)
          )
          const snapshot = await getDocs(q)
          if (!snapshot.empty) {
            const doc = snapshot.docs[0]
            const data = doc.data()
            planterData = { id: doc.id, ...data } as PlanterInfo
            planterUserId = data.userId || doc.id
          }
        }

        if (planterData) {
          setPlanterInfo(planterData)
        }

        // Determine Room ID
        // If logged in user is the planter, we need buyerId from params
        let roomId = ""
        const isPlanterView = user.uid === planterUserId
        const buyerId = searchParams.get('buyerId')

        if (isPlanterView) {
          if (!buyerId) {
            console.error("Planter needs buyerId to chat")
            setIsLoading(false)
            return 
          }
           roomId = [buyerId, planterUserId].sort().join("_")
        } else {
           roomId = [user.uid, planterUserId].sort().join("_")
        }

        setChatRoomId(roomId)

        // Initialize chat room if not exists (only if Buyer initiates)
        const chatRoomRef = doc(db, "planterChats", roomId)
        const chatRoomSnap = await getDoc(chatRoomRef)
        
        if (!chatRoomSnap.exists() && !isPlanterView) {
          const newRoomData = {
            userId: user.uid,
            userName: user.name,
            userEmail: user.email,
            planterId: planterUserId,
            planterName: planterData?.fullName || "Planter",
            createdAt: serverTimestamp(),
            lastMessageAt: serverTimestamp()
          }
          await setDoc(chatRoomRef, newRoomData)
          setChatRoomData(newRoomData)
        
          // Add initial system message
          await addDoc(collection(db, "planterChats", roomId, "messages"), {
            senderId: "system",
            senderName: "System",
            content: "Chat dimulai. Silakan tanyakan hal yang ingin Anda ketahui tentang jasa planter ini.",
            timestamp: serverTimestamp(),
            type: 'system',
            isRead: false
          })
        } else if (chatRoomSnap.exists()) {
          setChatRoomData(chatRoomSnap.data())
        }
      } catch (error) {
        console.error("Error setting up chat:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    setupChat()
  }, [params.planterId, user])

  // Listen to messages real-time
  useEffect(() => {
    if (!chatRoomId) return

    const q = query(
      collection(db, "planterChats", chatRoomId, "messages"),
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
  }, [chatRoomId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !user || !chatRoomId) return

    setIsSending(true)
    try {
      await addDoc(
        collection(db, "planterChats", chatRoomId, "messages"), 
        {
          senderId: user.uid,
          senderName: user.name,
          content: messageInput.trim(),
          timestamp: serverTimestamp(),
          type: 'text',
          isRead: false
        }
      )
      
      // Update last message time in chat room
      await setDoc(doc(db, "planterChats", chatRoomId), {
        lastMessageAt: serverTimestamp()
      }, { merge: true })

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
    
    if (diff < 86400000) {
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
    if (diff < 604800000) {
      return date.toLocaleDateString('id-ID', { weekday: 'short', hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
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

  if (!planterInfo && !chatRoomId) {
    return (
      <div className="min-h-screen bg-slate-50 ">
        <Navbar />
        <div className="pt-32 text-center px-4">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Planter tidak ditemukan</h1>
          <p className="text-slate-500 mb-4">Data planter tidak tersedia atau sudah dihapus.</p>
          <Link href="/wirelessplant" className="text-emerald-600 hover:underline">
            Kembali ke beranda
          </Link>
        </div>
      </div>
    )
  }

  // Determine view logic
  // If user is planter, show Buyer Name. If user is buyer, show Planter Name.
  // Note: params.planterId is the ID of the PLANTER we are chatting with (or OUR ID if we are planter)
  
  // Checking if current user corresponds to the planter of this chat
  // We use chatRoomData.planterId if avail, or params logic
  const isPlanterView = user?.uid === (chatRoomData?.planterId || planterInfo?.userId || params.planterId)
  
  const displayName = isPlanterView 
    ? (chatRoomData?.userName || "Buyer") 
    : (planterInfo?.fullName || chatRoomData?.planterName || "Planter")
    
  // Only show location if viewing Planter profile (Buyer View)
  const displayCity = !isPlanterView ? (planterInfo?.city || "") : ""
  const displayProvince = !isPlanterView ? (planterInfo?.province || "") : ""
  const displaySkills = !isPlanterView ? [...(planterInfo?.specialization || []), ...(planterInfo?.customPlants || [])] : []

  const isPlanter = user?.uid === params.planterId

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Navbar />
      
      <section className="pt-20 pb-0 h-screen flex flex-col">
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 flex-1 flex flex-col">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-t-3xl p-4 shadow-sm border border-slate-200 border-b-0 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Link href="/wirelessplant">
                <button className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-emerald-700">
                    {displayName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{displayName}</h3>
                  {(displayCity || displayProvince) && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Sprout className="w-3 h-3" />
                      <span>{displayCity}{displayCity && displayProvince ? ', ' : ''}{displayProvince}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Video Call Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alert("Fitur video call akan segera hadir!")}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-slate-100"
                style={{ color: themeColors.primary }}
              >
                <Video className="w-5 h-5" />
              </motion.button>

              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                Inquiry
              </span>
            </div>
          </motion.div>

          {/* Planter Skills Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-emerald-50 border border-emerald-100 border-t-0 p-4"
          >
            {displaySkills.length > 0 && (
              <>
                <p className="text-xs font-semibold text-emerald-700 mb-2">SPESIALISASI:</p>
                <div className="flex flex-wrap gap-2">
                  {displaySkills.slice(0, 5).map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </>
            )}
            {displaySkills.length === 0 && (
              <p className="text-xs text-emerald-600">Chat dengan planter untuk konsultasi jasa tanam.</p>
            )}
          </motion.div>

          {/* Messages Container */}
          <div 
            className="flex-1 bg-white overflow-y-auto p-6 space-y-4"
            style={{ maxHeight: 'calc(100vh - 340px)' }}
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
              placeholder="Tanyakan seputar jasa planter..."
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
  )
}
