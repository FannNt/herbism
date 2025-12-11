"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { 
  ChevronLeft, Users, FileCheck, FileX, Clock, CheckCircle, 
  XCircle, Eye, Search, Filter, RefreshCw, Shield, Sprout,
  MapPin, Phone, Mail, Calendar, Loader2, X
} from "lucide-react"
import Navbar from "../components/Navbar"
import { AdminGuard } from "../components/RoleGuard"
import { 
  getAllRegistrations, 
  approvePlanterRegistration, 
  rejectPlanterRegistration,
  PlanterRegistration 
} from "@/services/planterService"

function AdminDashboardContent() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()
  
  const [registrations, setRegistrations] = useState<PlanterRegistration[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [selectedRegistration, setSelectedRegistration] = useState<PlanterRegistration | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [rejectNote, setRejectNote] = useState("")
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch registrations
  const fetchRegistrations = async () => {
    setIsLoadingData(true)
    try {
      const data = await getAllRegistrations()
      setRegistrations(data)
    } catch (error) {
      console.error("Error fetching registrations:", error)
    } finally {
      setIsLoadingData(false)
    }
  }

  useEffect(() => {
    fetchRegistrations()
  }, [])

  // Filter and search
  const filteredRegistrations = registrations.filter(reg => {
    const matchesStatus = filterStatus === 'all' || reg.status === filterStatus
    const matchesSearch = 
      reg.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.city.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Stats
  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => r.status === 'pending').length,
    approved: registrations.filter(r => r.status === 'approved').length,
    rejected: registrations.filter(r => r.status === 'rejected').length,
  }

  // Handle approve
  const handleApprove = async (registration: PlanterRegistration) => {
    if (!registration.id || !user?.uid) return
    
    setIsProcessing(true)
    try {
      await approvePlanterRegistration(registration.id, user.uid, registration.userId)
      await fetchRegistrations()
      setIsDetailModalOpen(false)
      setSelectedRegistration(null)
    } catch (error) {
      console.error("Error approving registration:", error)
      alert("Gagal menyetujui pendaftaran")
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle reject
  const handleReject = async (registration: PlanterRegistration) => {
    if (!registration.id || !user?.uid) return
    
    setIsProcessing(true)
    try {
      await rejectPlanterRegistration(registration.id, user.uid, rejectNote)
      await fetchRegistrations()
      setShowRejectModal(false)
      setIsDetailModalOpen(false)
      setSelectedRegistration(null)
      setRejectNote("")
    } catch (error) {
      console.error("Error rejecting registration:", error)
      alert("Gagal menolak pendaftaran")
    } finally {
      setIsProcessing(false)
    }
  }

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Menunggu
          </span>
        )
      case 'approved':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Disetujui
          </span>
        )
      case 'rejected':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Ditolak
          </span>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-500 text-sm">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 text-slate-900">
      <Navbar />
      
      <section className="md:pt-28 pt-2 pb-16 px-4 sm:px-6">
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
                    <Shield className="w-6 h-6" style={{ color: themeColors.primary }} />
                    <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                  </div>
                  <p className="text-slate-600">Kelola pendaftaran planter</p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchRegistrations}
                disabled={isLoadingData}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-slate-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">Total</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium text-amber-600">Menunggu</span>
                </div>
                <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-5 border border-green-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-green-600">Disetujui</span>
                </div>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </motion.div>
            </div>

            {/* Search & Filter */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari nama, email, atau kota..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all"
                  />
                </div>
                
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full md:w-48 pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all appearance-none bg-white"
                  >
                    <option value="all">Semua Status</option>
                    <option value="pending">Menunggu</option>
                    <option value="approved">Disetujui</option>
                    <option value="rejected">Ditolak</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Registrations Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {isLoadingData ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-500" />
                <p className="text-slate-500">Memuat data...</p>
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-xl font-medium text-slate-900 mb-2">Tidak ada pendaftaran</h3>
                <p className="text-slate-500">Belum ada pendaftaran planter yang ditemukan</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Nama</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Lokasi</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Tanaman</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Tanggal</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRegistrations.map((registration) => (
                      <tr key={registration.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-slate-900">{registration.fullName}</p>
                            <p className="text-sm text-slate-500">{registration.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-slate-600">
                            <MapPin className="w-4 h-4" />
                            <span>{registration.city}, {registration.province}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {registration.customPlants?.slice(0, 2).map((plant, i) => (
                              <span 
                                key={i} 
                                className="px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{ backgroundColor: `${themeColors.primary}20`, color: themeColors.primary }}
                              >
                                {plant}
                              </span>
                            ))}
                            {registration.customPlants?.length > 2 && (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">
                                +{registration.customPlants.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(registration.submittedAt)}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(registration.status)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedRegistration(registration)
                              setIsDetailModalOpen(true)
                            }}
                            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </motion.button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedRegistration && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsDetailModalOpen(false)}
            />
            
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Detail Pendaftaran</h2>
                    <p className="text-sm text-slate-500">ID: {selectedRegistration.id}</p>
                  </div>
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                  <div className="space-y-6">
                    {/* Status */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <span className="font-medium text-slate-700">Status</span>
                      {getStatusBadge(selectedRegistration.status)}
                    </div>

                    {/* Personal Info */}
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Data Pribadi</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-500">Nama Lengkap</p>
                          <p className="font-medium text-slate-900">{selectedRegistration.fullName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Email</p>
                          <p className="font-medium text-slate-900">{selectedRegistration.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Telepon</p>
                          <p className="font-medium text-slate-900">{selectedRegistration.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">No. KTP</p>
                          <p className="font-medium text-slate-900">{selectedRegistration.idNumber}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-slate-500">Alamat</p>
                        <p className="font-medium text-slate-900">{selectedRegistration.address}</p>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-slate-500">Lokasi</p>
                        <p className="font-medium text-slate-900">{selectedRegistration.city}, {selectedRegistration.province}</p>
                      </div>
                    </div>
                    {/* Submitted Date */}
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>Didaftarkan: {formatDate(selectedRegistration.submittedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Modal Footer - Actions */}
                {selectedRegistration.status === 'pending' && (
                  <div className="p-6 border-t border-slate-200 flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowRejectModal(true)}
                      disabled={isProcessing}
                      className="flex-1 py-3 rounded-xl border-2 border-red-500 text-red-600 font-medium hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Tolak
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleApprove(selectedRegistration)}
                      disabled={isProcessing}
                      className="flex-1 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                      style={{ backgroundColor: themeColors.primary }}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Setujui
                        </>
                      )}
                    </motion.button>
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && selectedRegistration && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
              onClick={() => setShowRejectModal(false)}
            />
            
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-slate-900 mb-4">Tolak Pendaftaran</h3>
                <p className="text-slate-600 mb-4">
                  Berikan alasan penolakan untuk {selectedRegistration.fullName}:
                </p>
                <textarea
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 mb-4"
                  placeholder="Tuliskan alasan penolakan..."
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => handleReject(selectedRegistration)}
                    disabled={isProcessing || !rejectNote.trim()}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Tolak"
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Export dengan AdminGuard untuk proteksi akses
export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  )
}
