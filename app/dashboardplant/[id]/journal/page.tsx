"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useTheme } from "../../../context/ThemeContext"
import { useAuth } from "../../../context/AuthContext"
import { ChevronLeft, ChevronRight, Calendar, Plus, BookOpen, Pencil, X, Upload, Save, Image as ImageIcon, MessageCircle, Send, Sparkles, Bot } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    createJournalEntry, 
    getPlantJournalEntries, 
    canCreateEntry, 
    JournalEntry as ServiceEntry 
} from "@/services/journalService"

// UI Interface
interface UIJournalEntry {
  id?: string;
  week: number;
  date: string;
  note: string;
  image: string;
  aiFeedback?: string;
}

export default function JournalPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()
  
  const plantId = params?.id as string

  const [journals, setJournals] = useState<UIJournalEntry[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loadingFeedback, setLoadingFeedback] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Constraint Sate
  const [canAdd, setCanAdd] = useState(false)
  const [nextUnlockDate, setNextUnlockDate] = useState<Date | null>(null)
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    note: ""
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'ai', message: string}>>([
    { role: 'ai', message: 'Halo aku Erbis, saya siap membantu merawat tanaman. Ada yang bisa saya bantu?' }
  ])
  const [chatInput, setChatInput] = useState("")

  useEffect(() => {
    if (user && plantId) {
        fetchData()
    }
  }, [user, plantId])

  const fetchData = async () => {
    setIsLoading(true)
    try {
        if (!user?.uid || !plantId) return 

        // 1. Fetch entries (Desc)
        const entries = await getPlantJournalEntries(user.uid, plantId)
        
        // 2. Convert to UI Format and Sort Ascending (Week 1, Week 2...)
        // Firestore returns Descending (Newest first). so we reverse it to be Chronological.
        const chronEntries = entries.slice().reverse().map((entry, index) => ({
            id: entry.id,
            week: index + 1,
            date: entry.createdAt ? entry.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : "",
            note: entry.content,
            image: entry.imageUrl || "/plants/journal-default.jpg",
            aiFeedback: entry.aiFeedback
        }))
        setJournals(chronEntries)

        // 3. Check constraint
        const check = await canCreateEntry(user.uid, plantId)
        setCanAdd(check.allowed)
        if (check.nextDate) {
            setNextUnlockDate(check.nextDate)
        }

        // Set to last page if new entries
        if (chronEntries.length > 0) {
            const pages = Math.ceil(chronEntries.length / 2)
            setCurrentPage(pages - 1)
        }

    } catch (err) {
        console.error(err)
    } finally {
        setIsLoading(false)
    }
}

  const handleOpenModal = () => {
      if (canAdd) {
          setIsModalOpen(true)
      } else {
          // Show alert if not allowed
          const dateStr = nextUnlockDate?.toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})
          alert(`Anda belum bisa mengisi jurnal hari ini. Silakan kembali pada ${dateStr} untuk mengisi jurnal minggu berikutnya.`)
      }
  }

  const handleSaveJournal = async () => {
    if (!user?.uid || !plantId) return
    
    // Optimistic UI update or wait? Let's wait.
    try {
        await createJournalEntry({
            userId: user.uid,
            plantId: plantId,
            content: formData.note,
            imageUrl: imagePreview || undefined,
            mood: "Happy", // Default mood for now as specific UI absent in modal
            // Date is handled by server timestamp
        })
        
        setIsModalOpen(false)
        setFormData({ date: new Date().toISOString().split('T')[0], note: "" })
        setImagePreview(null)
        
        await fetchData() // Refresh data and constraints
    } catch (error: any) {
        alert(error.message || "Gagal menyimpan jurnal")
    }
  }

  const handleRequestFeedback = (index: number) => {
    setLoadingFeedback(index)
    
    // Simulate AI processing (Real implementation would call Gemini API)
    setTimeout(() => {
      const updatedJournals = [...journals]
      updatedJournals[index] = {
        ...updatedJournals[index],
        aiFeedback: "Berdasarkan catatan Anda, perkembangan tanaman terlihat sangat positif! Perawatan yang Anda lakukan sudah tepat. Sarankan untuk tetap menjaga konsistensi penyiraman dan mulai perhatikan nutrisi tambahan jika diperlukan."
      }
      setJournals(updatedJournals)
      setLoadingFeedback(null)
    }, 2000)
  }
  
  const totalPages = Math.ceil(journals.length / 2) || 1

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }
  
  const handleSendMessage = () => {
    if (!chatInput.trim()) return
    
    setChatMessages(prev => [...prev, { role: 'user', message: chatInput }])
    
    setTimeout(() => {
      const aiResponse = "Terima kasih atas pertanyaannya! Saya akan membantu Anda dengan perawatan tanaman. Berdasarkan informasi yang Anda berikan, saya sarankan untuk..."
      setChatMessages(prev => [...prev, { role: 'ai', message: aiResponse }])
    }, 1000)
    
    setChatInput("")
  }

  const leftEntryIndex = currentPage * 2
  const rightEntryIndex = currentPage * 2 + 1
  const leftEntry = journals[leftEntryIndex]
  const rightEntry = journals[rightEntryIndex]

  if (isLoading) {
      return (
        <div className="min-h-screen bg-amber-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-amber-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center hover:bg-amber-100 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-amber-700" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Jurnal Tanaman
              </h1>
              <p className="text-xs sm:text-sm text-amber-600">Catatan perkembangan minggu ke minggu</p>
            </div>
          </div>
          <button
            onClick={handleOpenModal}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium transition-all shadow-sm active:scale-95 text-sm ${
                canAdd ? "hover:opacity-90" : "opacity-50 cursor-not-allowed grayscale"
            }`}
            style={{ backgroundColor: canAdd ? themeColors.primary : '#9ca3af' }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">
                {canAdd ? "Tulis Jurnal" : "Jurnal Terkunci"}
            </span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Book container */}
        <div className="relative">
          {/* Book */}
          <div className="absolute inset-x-4 bottom-0 h-8 bg-gradient-to-t from-amber-200/50 to-transparent rounded-b-3xl blur-xl" />   
          {/* isi buku */}
          <div className="relative bg-amber-800 rounded-2xl p-2 shadow-2xl">         
            <div className="flex flex-col md:flex-row bg-amber-50 rounded-xl overflow-hidden min-h-[500px] md:min-h-[600px] relative">
              
              {/* Left page */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`left-${currentPage}`}
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: 90, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex-1 p-6 md:p-10 border-b md:border-b-0 md:border-r border-amber-200 relative"
                  style={{ 
                    background: 'linear-gradient(to right, #fef3c7 0%, #fffbeb 100%)',
                    boxShadow: 'inset -10px 0 20px -10px rgba(180, 83, 9, 0.1)'
                  }}
                >
                  {/* garus kertas */}
                  <div className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #d97706 28px)',
                      backgroundSize: '100% 28px'
                    }}
                  />
                  
                  {leftEntry ? (
                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
                            style={{ backgroundColor: themeColors.primary }}
                          >
                            {leftEntry.week}
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-amber-900">Minggu ke-{leftEntry.week}</h2>
                            <div className="flex items-center gap-1.5 text-amber-600 text-sm">
                              <Calendar className="w-3.5 h-3.5" />
                              {leftEntry.date}
                            </div>
                          </div>
                        </div>
                        {/* <button className="p-2 hover:bg-amber-100 rounded-lg transition-colors text-amber-600">
                          <Pencil className="w-4 h-4" />
                        </button> */}
                      </div>

                      {/* Photo header */}
                      {leftEntry.image && (
                          <div className="w-full h-40 md:h-48 bg-amber-100 rounded-xl mb-6 flex items-center justify-center border-2 border-dashed border-amber-300 overflow-hidden relative">
                            {/* If real image exists */}
                             {leftEntry.image.startsWith('/') || leftEntry.image.startsWith('data') || leftEntry.image.startsWith('http') ? (
                                <img src={leftEntry.image} alt="Journal" className="w-full h-full object-cover" />
                             ) : (
                                <div className="text-center text-amber-400">
                                    <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                    <p className="text-xs">Foto Tanaman</p>
                                </div>
                             )}
                          </div>
                      )}


                      {/* Notes */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wide">Catatan:</h3>
                        <p className="text-amber-800 leading-relaxed font-serif text-base md:text-lg whitespace-pre-line">
                          "{leftEntry.note}"
                        </p>
                      </div>

                      {/* AI Feedback Section */}
                      <div className="mt-6">
                        {leftEntry.aiFeedback ? (
                          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border-2 border-purple-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="w-4 h-4 text-purple-600" />
                              <h4 className="text-sm font-bold text-purple-900">Feedback dari Erbis</h4>
                            </div>
                            <p className="text-sm text-purple-800 leading-relaxed">
                              {leftEntry.aiFeedback}
                            </p>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRequestFeedback(leftEntryIndex)}
                            disabled={loadingFeedback === leftEntryIndex}
                            className="w-full py-3 px-4 rounded-xl border-2 border-purple-200 border-dashed hover:border-purple-400 bg-purple-50 hover:bg-purple-100 flex items-center justify-center gap-2 text-purple-700 font-medium transition-all group"
                          >
                            {loadingFeedback === leftEntryIndex ? (
                              <>
                                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                                <span>Menganalisis...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>Minta Masukan Erbis</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-amber-300">
                      <p className="text-lg font-serif italic">Belum ada catatan minggu ini</p>
                    </div>
                  )}

                  {/* Page nomor */}
                  <div className="absolute bottom-4 left-6 text-amber-400 text-sm font-serif">
                    {currentPage * 2 + 1}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Right Page */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`right-${currentPage}`}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex-1 p-6 md:p-10 relative"
                  style={{ 
                    background: 'linear-gradient(to left, #fef3c7 0%, #fffbeb 100%)',
                    boxShadow: 'inset 10px 0 20px -10px rgba(180, 83, 9, 0.1)'
                  }}
                >
                  {/* Paper  */}
                  <div className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #d97706 28px)',
                      backgroundSize: '100% 28px'
                    }}
                  />
                  
                  {rightEntry ? (
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
                            style={{ backgroundColor: themeColors.primary }}
                          >
                            {rightEntry.week}
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-amber-900">Minggu ke-{rightEntry.week}</h2>
                            <div className="flex items-center gap-1.5 text-amber-600 text-sm">
                              <Calendar className="w-3.5 h-3.5" />
                              {rightEntry.date}
                            </div>
                          </div>
                        </div>
                        {/* <button className="p-2 hover:bg-amber-100 rounded-lg transition-colors text-amber-600">
                          <Pencil className="w-4 h-4" />
                        </button> */}
                      </div>

                      {/* Photo tanaman */}
                      {rightEntry.image && (
                          <div className="w-full h-40 md:h-48 bg-amber-100 rounded-xl mb-6 flex items-center justify-center border-2 border-dashed border-amber-300 overflow-hidden relative">
                             {rightEntry.image.startsWith('/') || rightEntry.image.startsWith('data') || rightEntry.image.startsWith('http') ? (
                                <img src={rightEntry.image} alt="Journal" className="w-full h-full object-cover" />
                             ) : (
                                <div className="text-center text-amber-400">
                                    <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                    <p className="text-xs">Foto Tanaman</p>
                                </div>
                             )}
                          </div>
                      )}

                      {/* Notes tanaman */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wide">Catatan:</h3>
                        <p className="text-amber-800 leading-relaxed font-serif text-base md:text-lg whitespace-pre-line">
                          "{rightEntry.note}"
                        </p>
                      </div>

                      {/* AI Feedback Section */}
                      <div className="mt-6">
                        {rightEntry.aiFeedback ? (
                          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border-2 border-purple-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="w-4 h-4 text-purple-600" />
                              <h4 className="text-sm font-bold text-purple-900">Feedback dari Erbis</h4>
                            </div>
                            <p className="text-sm text-purple-800 leading-relaxed">
                              {rightEntry.aiFeedback}
                            </p>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRequestFeedback(rightEntryIndex)}
                            disabled={loadingFeedback === rightEntryIndex}
                            className="w-full py-3 px-4 rounded-xl border-2 border-purple-200 border-dashed hover:border-purple-400 bg-purple-50 hover:bg-purple-100 flex items-center justify-center gap-2 text-purple-700 font-medium transition-all group"
                          >
                            {loadingFeedback === rightEntryIndex ? (
                              <>
                                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                                <span>Menganalisis...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>Minta Masukan Erbis</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-amber-300">
                      <p className="text-lg font-serif italic">Halaman berikutnya...</p>
                    </div>
                  )}

                  {/* nomer page */}
                  <div className="absolute bottom-4 right-6 text-amber-400 text-sm font-serif">
                    {currentPage * 2 + 2}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* arrow */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button 
              onClick={prevPage}
              disabled={currentPage === 0}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-amber-700 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-2">
                {/* Only show up to 5 dots to avoid overflow if many pages */}
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentPage === i 
                      ? 'bg-amber-600 scale-125' 
                      : 'bg-amber-300 hover:bg-amber-400'
                  }`}
                />
              ))}
            </div>

            <button 
              onClick={nextPage}
              disabled={currentPage >= totalPages - 1} // FIX: Logic for disabling next button
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-amber-700 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <p className="text-center text-amber-600 text-sm mt-4 font-serif">
            Halaman {currentPage + 1} dari {totalPages}
          </p>
        </div>
      </main>

      {/* Add Journal Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 m-auto z-50 w-full max-w-2xl h-fit max-h-[90vh] overflow-y-auto bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-2xl text-slate-900"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-amber-100/90 backdrop-blur-md border-b border-amber-200 p-6 flex items-center justify-between rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-amber-900">Tulis Jurnal Baru</h2>
                    <p className="text-sm text-amber-600">Catat perkembangan tanamanmu</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-amber-200 flex items-center justify-center transition-colors text-amber-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal */}
              <div className="p-6 space-y-6">
                {/* Week Number (Auto calculated) */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-amber-800">Minggu Ke-</label>
                  <input
                    type="number"
                    value={journals.length + 1}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 bg-amber-50 text-amber-900 opacity-70 cursor-not-allowed"
                  />
                  <p className="text-xs text-amber-600">Terisi otomatis sesuai urutan jurnal.</p>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Tanggal (Hari Ini)
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    disabled // Disable date to enforce 'today' or current period
                    className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 bg-amber-50 text-amber-900 opacity-70 cursor-not-allowed"
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Foto Tanaman (Opsional)
                  </label>
                  <div className={`relative w-full h-48 rounded-xl border-2 border-dashed transition-all overflow-hidden group ${
                    imagePreview ? 'border-amber-500 bg-amber-50' : 'border-amber-300 hover:border-amber-500 hover:bg-amber-50/50'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => setImagePreview(reader.result as string)
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                    />
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                          <p className="text-white font-medium flex items-center gap-2">
                            <Upload className="w-5 h-5" />
                            Ganti Foto
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            setImagePreview(null)
                          }}
                          className="absolute top-2 right-2 z-30 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-amber-500">
                        <Upload className="w-10 h-10 mb-2" />
                        <p className="font-medium">Klik untuk upload foto</p>
                        <p className="text-xs mt-1 text-amber-400">JPG, PNG (Max 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-amber-800">Catatan Perkembangan</label>
                  <textarea
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Tuliskan perkembangan tanaman minggu ini..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:outline-none bg-white text-amber-900 resize-none font-serif"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setIsModalOpen(false)
                      setFormData({ date: new Date().toISOString().split('T')[0], note: "" })
                      setImagePreview(null)
                    }}
                    className="flex-1 py-3 rounded-xl bg-amber-200 text-amber-800 font-semibold hover:bg-amber-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveJournal}
                    disabled={!formData.note}
                    style={{ backgroundColor: themeColors.primary }}
                    className="flex-[2] py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    Simpan Jurnal
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}