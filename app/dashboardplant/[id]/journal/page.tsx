"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useTheme } from "../../../context/ThemeContext"
import { ChevronLeft, ChevronRight, Calendar, Plus, BookOpen, Pencil, X, Upload, Save, Image as ImageIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Mock
const mockJournals = [
  {
    week: 1,
    date: "10 Okt 2025",
    note: "Tanaman baru saja ditanam. Kondisi tanah gembur dan lembab. Cuaca cerah mendukung pertumbuhan awal.",
    image: "/plants/journal-1.jpg"
  },
  {
    week: 2,
    date: "17 Okt 2025",
    note: "Tunas mulai muncul. Tinggi sekitar 2cm. Penyiraman rutin setiap pagi. Tidak ada tanda hama.",
    image: "/plants/journal-2.jpg"
  },
  {
    week: 3,
    date: "24 Okt 2025",
    note: "Daun pertama mulai mekar. Pertumbuhan sangat baik. Diberi pupuk organik sedikit untuk mempercepat pertumbuhan.",
    image: "/plants/journal-3.jpg"
  },
]

export default function JournalPage() {
  const router = useRouter()
  const params = useParams()
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()
  const [currentPage, setCurrentPage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    week: mockJournals.length + 1,
    date: "",
    note: ""
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const totalPages = Math.ceil(mockJournals.length / 2)
  
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

  const leftEntry = mockJournals[currentPage * 2]
  const rightEntry = mockJournals[currentPage * 2 + 1]

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
            onClick={() => setIsModalOpen(true)}
            style={{ backgroundColor: themeColors.primary }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium hover:opacity-90 transition-all shadow-sm active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tulis Jurnal</span>
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
                        <button className="p-2 hover:bg-amber-100 rounded-lg transition-colors text-amber-600">
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Photo header */}
                      <div className="w-full h-40 md:h-48 bg-amber-100 rounded-xl mb-6 flex items-center justify-center border-2 border-dashed border-amber-300 overflow-hidden">
                        <div className="text-center text-amber-400">
                          <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
                          <p className="text-xs">Foto Tanaman</p>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wide">Catatan:</h3>
                        <p className="text-amber-800 leading-relaxed font-serif text-base md:text-lg">
                          "{leftEntry.note}"
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-amber-300">
                      <p className="text-lg font-serif italic">Halaman kosong</p>
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
                        <button className="p-2 hover:bg-amber-100 rounded-lg transition-colors text-amber-600">
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Photo tanaman */}
                      <div className="w-full h-40 md:h-48 bg-amber-100 rounded-xl mb-6 flex items-center justify-center border-2 border-dashed border-amber-300 overflow-hidden">
                        <div className="text-center text-amber-400">
                          <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
                          <p className="text-xs">Foto Tanaman</p>
                        </div>
                      </div>

                      {/* Notes tanaman */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wide">Catatan:</h3>
                        <p className="text-amber-800 leading-relaxed font-serif text-base md:text-lg">
                          "{rightEntry.note}"
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-amber-300">
                      <p className="text-lg font-serif italic">Tulis jurnal baru...</p>
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
              {Array.from({ length: totalPages }).map((_, i) => (
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
              disabled={currentPage === totalPages - 1}
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
              className="fixed inset-0 m-auto z-50 w-full max-w-2xl h-fit max-h-[90vh] overflow-y-auto bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-2xl"
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

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Week Number */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-amber-800">Minggu Ke-</label>
                  <input
                    type="number"
                    value={formData.week}
                    onChange={(e) => setFormData({ ...formData, week: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:outline-none bg-white text-amber-900"
                    min="1"
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:outline-none bg-white text-amber-900"
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

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setIsModalOpen(false)
                      setFormData({ week: mockJournals.length + 1, date: "", note: "" })
                      setImagePreview(null)
                    }}
                    className="flex-1 py-3 rounded-xl bg-amber-200 text-amber-800 font-semibold hover:bg-amber-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Save journal entry
                      console.log("Saving journal:", { ...formData, image: imagePreview })
                      setIsModalOpen(false)
                      setFormData({ week: mockJournals.length + 1, date: "", note: "" })
                      setImagePreview(null)
                    }}
                    style={{ backgroundColor: themeColors.primary }}
                    className="flex-[2] py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
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
