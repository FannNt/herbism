"use client"
import { motion } from "framer-motion"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import { useState, useEffect } from "react"
import { 
  Upload, User, MapPin, Phone, Mail, IdCard, Sprout, Camera, 
  CheckCircle, ArrowLeft, ChevronDown, Loader2, X, Plus 
} from "lucide-react"
import Link from "next/link"
import Navbar from "../../components/Navbar"
import { useRouter } from "next/navigation"
import { submitPlanterRegistration } from "@/services/planterService"

interface Province {
  id: string
  name: string
}

interface Regency {
  id: string
  province_id: string
  name: string
}

interface FormData {
  fullName: string
  email: string
  phone: string
  idNumber: string
  address: string
  city: string
  province: string
  experience: string
  specialization: string[]
  customPlants: string[]
  landSize: string
  certifications: string
  bio: string
  idCardPhoto: File | null
  profilePhoto: File | null
}

const COMMON_PLANTS = [
  "Jahe", "Kunyit", "Temulawak", "Lengkuas", "Kencur", "Lemongrass",
  "Sereh", "Daun Salam", "Pandan", "Lidah Buaya", "Kumis Kucing", 
  "Sambiloto", "Daun Mint", "Basil", "Rosemary"
]

const EXPERIENCE_OPTIONS = [
  { value: "1-2", label: "1-2 Tahun" },
  { value: "3-5", label: "3-5 Tahun" },
  { value: "5-10", label: "5-10 Tahun" },
  { value: "10+", label: "Lebih dari 10 Tahun" },
]

const LAND_SIZE_OPTIONS = [
  { value: "small", label: "< 500 m²" },
  { value: "medium", label: "500 - 2000 m²" },
  { value: "large", label: "2000 - 5000 m²" },
  { value: "xlarge", label: "> 5000 m²" },
]

export default function RegisterPlanterPage() {
  const { getThemeColors } = useTheme()
  const { user } = useAuth()
  const themeColors = getThemeColors()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  // Province/City State
  const [provinces, setProvinces] = useState<Province[]>([])
  const [regencies, setRegencies] = useState<Regency[]>([])
  const [selectedProvinceId, setSelectedProvinceId] = useState("")
  const [selectedRegencyId, setSelectedRegencyId] = useState("")
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false)
  const [isLoadingRegencies, setIsLoadingRegencies] = useState(false)
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false)
  const [isRegencyDropdownOpen, setIsRegencyDropdownOpen] = useState(false)
  const [provinceSearch, setProvinceSearch] = useState("")
  const [regencySearch, setRegencySearch] = useState("")

  // Custom Plant Input
  const [customPlantInput, setCustomPlantInput] = useState("")

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    idNumber: "",
    address: "",
    city: "",
    province: "",
    experience: "",
    specialization: [],
    customPlants: [],
    landSize: "",
    certifications: "",
    bio: "",
    idCardPhoto: null,
    profilePhoto: null
  })

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoadingProvinces(true)
      try {
        const response = await fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
        const data = await response.json()
        setProvinces(data)
      } catch (error) {
        console.error("Error fetching provinces:", error)
      } finally {
        setIsLoadingProvinces(false)
      }
    }
    fetchProvinces()
  }, [])

  // Fetch regencies when province changes
  useEffect(() => {
    const fetchRegencies = async () => {
      if (!selectedProvinceId) {
        setRegencies([])
        return
      }
      setIsLoadingRegencies(true)
      try {
        const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvinceId}.json`)
        const data = await response.json()
        setRegencies(data)
      } catch (error) {
        console.error("Error fetching regencies:", error)
      } finally {
        setIsLoadingRegencies(false)
      }
    }
    fetchRegencies()
  }, [selectedProvinceId])

  // Pre-fill email from user
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email }))
    }
    if (user?.name) {
      setFormData(prev => ({ ...prev, fullName: user.name || "" }))
    }
  }, [user])

  // Helper to format name
  const formatName = (name: string) => {
    return name.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleSpecializationToggle = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(spec)
        ? prev.specialization.filter(s => s !== spec)
        : [...prev.specialization, spec]
    }))
  }

  const handleAddCustomPlant = () => {
    const plant = customPlantInput.trim()
    if (plant && !formData.customPlants.includes(plant)) {
      setFormData(prev => ({
        ...prev,
        customPlants: [...prev.customPlants, plant]
      }))
      setCustomPlantInput("")
    }
  }

  const handleRemoveCustomPlant = (plant: string) => {
    setFormData(prev => ({
      ...prev,
      customPlants: prev.customPlants.filter(p => p !== plant)
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'idCardPhoto' | 'profilePhoto') => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, [field]: file }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.fullName.trim()) errors.fullName = "Nama lengkap wajib diisi"
      if (!formData.email.trim()) errors.email = "Email wajib diisi"
      if (!formData.phone.trim()) errors.phone = "Nomor telepon wajib diisi"
      if (!formData.idNumber.trim()) errors.idNumber = "Nomor KTP wajib diisi"
      if (formData.idNumber.length !== 16) errors.idNumber = "Nomor KTP harus 16 digit"
      if (!formData.address.trim()) errors.address = "Alamat wajib diisi"
      if (!formData.city.trim()) errors.city = "Kota/Kabupaten wajib dipilih"
      if (!formData.province.trim()) errors.province = "Provinsi wajib dipilih"
    }

    if (step === 2) {
      // Combined validation: user must select from list OR add custom plants (at least 1 total)
      const totalPlants = formData.specialization.length + formData.customPlants.length
      if (totalPlants === 0) {
        errors.specialization = "Pilih minimal 1 tanaman dari daftar atau tambahkan sendiri"
      }
      if (!formData.bio.trim()) errors.bio = "Bio wajib diisi"
    }

    if (step === 3) {
      if (!formData.idCardPhoto) errors.idCardPhoto = "Foto KTP wajib diupload"
      if (!formData.profilePhoto) errors.profilePhoto = "Foto profil wajib diupload"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(3)) return
    if (!user?.uid) {
      alert("Anda harus login terlebih dahulu")
      router.push("/login")
      return
    }

    setIsSubmitting(true)
    
    try {
      await submitPlanterRegistration(user.uid, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        idNumber: formData.idNumber,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        experience: formData.experience,
        specialization: formData.specialization,
        customPlants: formData.customPlants,
        landSize: formData.landSize,
        certifications: formData.certifications,
        bio: formData.bio,
      })

      setIsSubmitted(true)
      setTimeout(() => {
        router.push('/wirelessplant')
      }, 3000)
    } catch (error) {
      console.error("Error submitting registration:", error)
      alert("Terjadi kesalahan saat mengirim pendaftaran. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
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
                    className={`w-full px-4 py-3 rounded-xl border ${formErrors.fullName ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 transition-all`}
                    placeholder="Masukkan nama lengkap Anda"
                  />
                  {formErrors.fullName && <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>}
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
                      className={`w-full px-4 py-3 rounded-xl border ${formErrors.email ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 transition-all`}
                      placeholder="email@example.com"
                    />
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
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
                      className={`w-full px-4 py-3 rounded-xl border ${formErrors.phone ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 transition-all`}
                      placeholder="08xxxxxxxxxx"
                    />
                    {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
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
                    maxLength={16}
                    className={`w-full px-4 py-3 rounded-xl border ${formErrors.idNumber ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 transition-all`}
                    placeholder="16 digit nomor KTP"
                  />
                  {formErrors.idNumber && <p className="text-red-500 text-sm mt-1">{formErrors.idNumber}</p>}
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
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border ${formErrors.address ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 transition-all`}
                    placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
                  />
                  {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Province Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Provinsi *
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProvinceDropdownOpen(!isProvinceDropdownOpen)
                          setIsRegencyDropdownOpen(false)
                        }}
                        className={`w-full px-4 py-3 rounded-xl border ${formErrors.province ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 transition-all bg-white text-left flex items-center justify-between`}
                      >
                        <span className={formData.province ? "text-slate-900" : "text-slate-400"}>
                          {formData.province || "Pilih Provinsi"}
                        </span>
                        {isLoadingProvinces ? (
                          <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                        ) : (
                          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isProvinceDropdownOpen ? 'rotate-180' : ''}`} />
                        )}
                      </button>
                      
                      {isProvinceDropdownOpen && (
                        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 max-h-64 overflow-hidden">
                          <div className="p-2 border-b border-slate-100">
                            <input
                              type="text"
                              value={provinceSearch}
                              onChange={(e) => setProvinceSearch(e.target.value)}
                              placeholder="Cari provinsi..."
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="overflow-y-auto max-h-48">
                            {provinces
                              .filter(p => p.name.toLowerCase().includes(provinceSearch.toLowerCase()))
                              .map((province) => (
                                <button
                                  key={province.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedProvinceId(province.id)
                                    setSelectedRegencyId("")
                                    setFormData(prev => ({ 
                                      ...prev, 
                                      province: formatName(province.name),
                                      city: ""
                                    }))
                                    setIsProvinceDropdownOpen(false)
                                    setProvinceSearch("")
                                    setFormErrors(prev => ({ ...prev, province: "" }))
                                  }}
                                  className={`w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors text-sm ${
                                    selectedProvinceId === province.id ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-700'
                                  }`}
                                >
                                  {formatName(province.name)}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {formErrors.province && <p className="text-red-500 text-sm mt-1">{formErrors.province}</p>}
                  </div>

                  {/* City/Regency Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Kota/Kabupaten *
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedProvinceId) {
                            setIsRegencyDropdownOpen(!isRegencyDropdownOpen)
                            setIsProvinceDropdownOpen(false)
                          }
                        }}
                        disabled={!selectedProvinceId}
                        className={`w-full px-4 py-3 rounded-xl border ${formErrors.city ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 transition-all bg-white text-left flex items-center justify-between ${
                          !selectedProvinceId ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <span className={formData.city ? "text-slate-900" : "text-slate-400"}>
                          {formData.city || (selectedProvinceId ? "Pilih Kota/Kabupaten" : "Pilih provinsi terlebih dahulu")}
                        </span>
                        {isLoadingRegencies ? (
                          <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                        ) : (
                          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isRegencyDropdownOpen ? 'rotate-180' : ''}`} />
                        )}
                      </button>
                      
                      {isRegencyDropdownOpen && regencies.length > 0 && (
                        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 max-h-64 overflow-hidden">
                          <div className="p-2 border-b border-slate-100">
                            <input
                              type="text"
                              value={regencySearch}
                              onChange={(e) => setRegencySearch(e.target.value)}
                              placeholder="Cari kota/kabupaten..."
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="overflow-y-auto max-h-48">
                            {regencies
                              .filter(r => r.name.toLowerCase().includes(regencySearch.toLowerCase()))
                              .map((regency) => (
                                <button
                                  key={regency.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedRegencyId(regency.id)
                                    setFormData(prev => ({ 
                                      ...prev, 
                                      city: formatName(regency.name)
                                    }))
                                    setIsRegencyDropdownOpen(false)
                                    setRegencySearch("")
                                    setFormErrors(prev => ({ ...prev, city: "" }))
                                  }}
                                  className={`w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors text-sm ${
                                    selectedRegencyId === regency.id ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-700'
                                  }`}
                                >
                                  {formatName(regency.name)}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
                  </div>
                </div>

                {/* Selected Location Display */}
                {formData.city && formData.province && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">{formData.city}, {formData.province}</span>
                    </div>
                  </div>
                )}
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
                
                {/* Specialization - Combined with Custom Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    <Sprout className="w-4 h-4 inline mr-2" />
                    Spesialisasi Tanaman * (Pilih atau tambahkan sendiri)
                  </label>
                  <p className="text-sm text-slate-500 mb-3">
                    Pilih dari daftar di bawah, atau tambahkan tanaman lain yang tidak ada di daftar
                  </p>

                  {/* Predefined Plant Options */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {COMMON_PLANTS.map(spec => (
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

                  {/* Custom Plant Input - For plants not in the list */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      Tanaman tidak ada di daftar? Tambahkan sendiri:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customPlantInput}
                        onChange={(e) => setCustomPlantInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddCustomPlant()
                          }
                        }}
                        placeholder="Ketik nama tanaman lalu tekan Enter atau klik +"
                        className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 transition-all bg-white text-sm"
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddCustomPlant}
                        disabled={!customPlantInput.trim()}
                        className="px-3 py-2 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: themeColors.primary }}
                      >
                        <Plus className="w-5 h-5" />
                      </motion.button>
                    </div>
                    
                    {/* Custom Added Plants Display */}
                    {formData.customPlants.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.customPlants.map((plant) => (
                          <span
                            key={plant}
                            className="px-3 py-1 bg-white rounded-full border-2 text-sm font-medium flex items-center gap-2"
                            style={{ borderColor: themeColors.secondary, color: themeColors.secondary }}
                          >
                            {plant}
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomPlant(plant)}
                              className="hover:bg-slate-100 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Selected Plants Summary */}
                  {(formData.specialization.length > 0 || formData.customPlants.length > 0) && (
                    <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <p className="text-sm font-medium text-emerald-700 mb-2">
                        Total {formData.specialization.length + formData.customPlants.length} tanaman dipilih:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {[...formData.specialization, ...formData.customPlants].map((plant, i) => (
                          <span 
                            key={i}
                            className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium"
                          >
                            {plant}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {formErrors.specialization && <p className="text-red-500 text-sm mt-2">{formErrors.specialization}</p>}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bio / Deskripsi Diri *
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border ${formErrors.bio ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 transition-all`}
                    placeholder="Ceritakan tentang pengalaman dan keahlian Anda dalam bertani..."
                  />
                  {formErrors.bio && <p className="text-red-500 text-sm mt-1">{formErrors.bio}</p>}
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
                  <div className={`border-2 border-dashed ${formErrors.idCardPhoto ? 'border-red-500' : 'border-slate-300'} rounded-xl p-8 text-center hover:border-slate-400 transition-colors`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'idCardPhoto')}
                      className="hidden"
                      id="idCardPhoto"
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
                  {formErrors.idCardPhoto && <p className="text-red-500 text-sm mt-1">{formErrors.idCardPhoto}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    <Camera className="w-4 h-4 inline mr-2" />
                    Foto Profil *
                  </label>
                  <div className={`border-2 border-dashed ${formErrors.profilePhoto ? 'border-red-500' : 'border-slate-300'} rounded-xl p-8 text-center hover:border-slate-400 transition-colors`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'profilePhoto')}
                      className="hidden"
                      id="profilePhoto"
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
                  {formErrors.profilePhoto && <p className="text-red-500 text-sm mt-1">{formErrors.profilePhoto}</p>}
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
                  onClick={handleNextStep}
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
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    "Kirim Pendaftaran"
                  )}
                </motion.button>
              )}
            </div>
          </motion.form>
        </div>
      </section>
    </div>
  )
}
