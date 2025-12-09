"use client"
import { motion } from "framer-motion"
import { useTheme } from "../../context/ThemeContext"
import { useState } from "react"
import { Upload, User, MapPin, Phone, Mail, IdCard, Sprout, Camera, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Navbar from "../../components/Navbar"
import { useRouter } from "next/navigation"

interface FormData {
  fullName: string
  email: string
  phone: string
  idNumber: string
  address: string
  city: string
  region: string
  experience: string
  specialization: string[]
  landSize: string
  certifications: string
  bio: string
  idCardPhoto: File | null
  profilePhoto: File | null
}

const REGIONS = ["Jawa Barat", "Jawa Tengah", "Jawa Timur", "DI Yogyakarta", "Banten", "DKI Jakarta"]
const SPECIALIZATIONS = [
  "Jahe", "Kunyit", "Temulawak", "Lengkuas", "Kencur", "Lemongrass",
  "Sereh", "Daun Salam", "Pandan", "Lidah Buaya", "Kumis Kucing", 
  "Sambiloto", "Daun Mint", "Basil", "Rosemary"
]

export default function RegisterPlanterPage() {
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    idNumber: "",
    address: "",
    city: "",
    region: "",
    experience: "",
    specialization: [],
    landSize: "",
    certifications: "",
    bio: "",
    idCardPhoto: null,
    profilePhoto: null
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSpecializationToggle = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(spec)
        ? prev.specialization.filter(s => s !== spec)
        : [...prev.specialization, spec]
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'idCardPhoto' | 'profilePhoto') => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, [field]: file }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate submission
    setIsSubmitted(true)
    setTimeout(() => {
      router.push('/wirelessplant')
    }, 3000)
  }

  const totalSteps = 3

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-12 shadow-xl text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <CheckCircle className="w-24 h-24 mx-auto mb-6 text-green-500" />
          </motion.div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Pendaftaran Berhasil!</h2>
          <p className="text-slate-600 mb-6">
            Terima kasih telah mendaftar sebagai planter. Tim kami akan meninjau aplikasi Anda dalam 1-3 hari kerja.
          </p>
          <div className="text-sm text-slate-500">
            Mengalihkan ke halaman utama...
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 text-slate-900">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Link href="/wirelessplant">
              <motion.button
                whileHover={{ x: -4 }}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Kembali</span>
              </motion.button>
            </Link>
            <h1 className="text-5xl md:text-6xl font-light text-slate-900 mb-4">
              Daftar <span className="font-medium">Planter</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Bergabunglah dengan komunitas petani herbal profesional kami
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <motion.div
                      animate={{
                        scale: currentStep === step ? 1.1 : 1,
                        backgroundColor: currentStep >= step ? themeColors.primary : '#e2e8f0'
                      }}
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mb-2"
                    >
                      {step}
                    </motion.div>
                    <div className="text-sm text-slate-600 text-center">
                      {step === 1 && "Data Pribadi"}
                      {step === 2 && "Keahlian"}
                      {step === 3 && "Dokumen"}
                    </div>
                  </div>
                  {step < totalSteps && (
                    <div className="flex-1 h-1 mx-4 rounded-full bg-slate-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: currentStep > step ? '100%' : '0%' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: themeColors.primary }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-8 shadow-lg"
          >
            {/* Step 1: Personal Data */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Data Pribadi</h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all"
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Nomor Telepon *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <IdCard className="w-4 h-4 inline mr-2" />
                    Nomor KTP *
                  </label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    required
                    maxLength={16}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all"
                    placeholder="16 digit nomor KTP"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Alamat Lengkap *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all"
                    placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Kota/Kabupaten *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all"
                      placeholder="Contoh: Bandung"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Provinsi *
                    </label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all appearance-none bg-white"
                    >
                      <option value="">Pilih Provinsi</option>
                      {REGIONS.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Expertise */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Keahlian & Pengalaman</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    <Sprout className="w-4 h-4 inline mr-2" />
                    Spesialisasi Tanaman * (Pilih minimal 1)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {SPECIALIZATIONS.map(spec => (
                      <motion.button
                        key={spec}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSpecializationToggle(spec)}
                        className={`px-4 py-2 rounded-xl border-2 transition-all ${
                          formData.specialization.includes(spec)
                            ? 'text-white shadow-lg'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                        style={formData.specialization.includes(spec) ? {
                          backgroundColor: themeColors.primary,
                          borderColor: themeColors.primary
                        } : {}}
                      >
                        {spec}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bio / Deskripsi Diri *
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all"
                    placeholder="Ceritakan tentang pengalaman dan keahlian Anda dalam bertani..."
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Documents */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Dokumen & Foto</h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    <IdCard className="w-4 h-4 inline mr-2" />
                    Foto KTP *
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-slate-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'idCardPhoto')}
                      className="hidden"
                      id="idCardPhoto"
                      required
                    />
                    <label htmlFor="idCardPhoto" className="cursor-pointer">
                      {formData.idCardPhoto ? (
                        <div className="text-green-600">
                          <CheckCircle className="w-12 h-12 mx-auto mb-3" />
                          <p className="font-medium">{formData.idCardPhoto.name}</p>
                          <p className="text-sm text-slate-500 mt-1">Klik untuk mengganti</p>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                          <p className="font-medium text-slate-700">Upload Foto KTP</p>
                          <p className="text-sm text-slate-500 mt-1">PNG, JPG hingga 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    <Camera className="w-4 h-4 inline mr-2" />
                    Foto Profil *
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-slate-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'profilePhoto')}
                      className="hidden"
                      id="profilePhoto"
                      required
                    />
                    <label htmlFor="profilePhoto" className="cursor-pointer">
                      {formData.profilePhoto ? (
                        <div className="text-green-600">
                          <CheckCircle className="w-12 h-12 mx-auto mb-3" />
                          <p className="font-medium">{formData.profilePhoto.name}</p>
                          <p className="text-sm text-slate-500 mt-1">Klik untuk mengganti</p>
                        </div>
                      ) : (
                        <div>
                          <Camera className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                          <p className="font-medium text-slate-700">Upload Foto Profil</p>
                          <p className="text-sm text-slate-500 mt-1">PNG, JPG hingga 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Catatan:</strong> Pastikan foto KTP jelas dan dapat dibaca. Foto profil akan ditampilkan di halaman planter Anda.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
              {currentStep > 1 && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-6 py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-all"
                >
                  Kembali
                </motion.button>
              )}

              <div className="flex-1" />

              {currentStep < totalSteps ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="px-6 py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all"
                  style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` }}
                >
                  Lanjut
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all"
                  style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` }}
                >
                  Kirim Pendaftaran
                </motion.button>
              )}
            </div>
          </motion.form>
        </div>
      </section>
    </div>
  )
}
