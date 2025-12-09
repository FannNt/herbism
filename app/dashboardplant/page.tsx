"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { ChevronLeft, Plus, Droplets, Sun, Sprout, Calendar, Leaf, Trash2, Pencil, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { getUserPlants, deletePlant, Plant } from "@/services/plantService"
import { auth } from "@/lib/firebase"

export default function DashboardPlantPage() {
  const router = useRouter()
  const { getThemeColors } = useTheme()
  const { user } = useAuth()
  const themeColors = getThemeColors()

  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [plantToDelete, setPlantToDelete] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlants = async () => {
      const currentUser = auth.currentUser
      if (!currentUser) return

      try {
        const userPlants = await getUserPlants(currentUser.uid)
        setPlants(userPlants)
      } catch (error) {
        console.error("Error fetching plants:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlants()
  }, [user])

  const handleDeleteClick = (id: string) => {
    setPlantToDelete(id)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (plantToDelete) {
      try {
        await deletePlant(plantToDelete)
        setPlants(plants.filter(p => p.id !== plantToDelete))
        setDeleteModalOpen(false)
        setPlantToDelete(null)
      } catch (error) {
        console.error("Error deleting plant:", error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/profile")}
              className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Dashboard Tanaman</h1>
              <p className="text-xs sm:text-sm text-slate-500">Kelola kondisi dan pertumbuhan tanamanmu</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/dashboardplant/add')}
            style={{ backgroundColor: themeColors.primary }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium hover:opacity-90 transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Tambah Tanaman</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-600">Memuat tanaman...</p>
          </div>
        ) : plants.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Belum ada tanaman</h2>
            <p className="text-slate-500 mb-6">Mulai tambahkan tanaman pertamamu!</p>
            <button
              onClick={() => router.push('/dashboardplant/add')}
              style={{ backgroundColor: themeColors.primary }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium hover:opacity-90 transition-all shadow-md"
            >
              <Plus className="w-5 h-5" />
              Tambah Tanaman
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map((plant, index) => (
              <motion.div
                key={plant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                <div className="h-56 bg-slate-100 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                  {plant.imageUrl ? (
                    <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 bg-slate-50">
                      <Leaf className="w-16 h-16 opacity-20" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md shadow-sm border border-slate-100"
                      style={{ color: themeColors.primary }}>
                      {plant.kind}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteClick(plant.id!)}
                        className="p-2 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{plant.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Sprout className="w-3 h-3" />
                      {plant.kind}
                    </p>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                          <Sun className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-medium">Media Tanam</p>
                          <p className="text-sm font-semibold text-slate-700">{plant.soilType}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                          <Droplets className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-medium">Jadwal Siram</p>
                          <p className="text-sm font-semibold text-slate-700">{plant.wateringSchedule}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(plant.plantedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <Link href={`/dashboardplant/${plant.id}`} className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
        {deleteModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 m-auto z-50 w-full max-w-md h-fit bg-white rounded-3xl shadow-2xl overflow-hidden p-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Hapus Tanaman?</h2>
                <p className="text-slate-500 text-sm mb-6">
                  Tindakan ini tidak dapat dibatalkan. Data tanaman dan semua jurnalnya akan dihapus secara permanen.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                  >
                    Ya, Hapus
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
