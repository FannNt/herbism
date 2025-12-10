"use client"

import { motion, Variants } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import { completeOnboarding } from "@/services/userService"
import { usePopup } from "../hooks/usePopup"
import CustomPopup from "../components/CustomPopup"
import { auth } from "@/lib/firebase"
import { ChevronDown, MapPin, Loader2 } from "lucide-react"


interface Province {
  id: string
  name: string
}

interface Regency {
  id: string
  province_id: string
  name: string
}


type Gender = "male" | "female"
type ExperienceLevel = "beginner" | "intermediate" | "expert"

interface ProfileFormData {
  username: string
  name: string
  age: number | ""
  gender: Gender | ""
  region: string
  healthCondition: string[]
  healthGoals: string[]
  allergies: string[]
  experienceLevel: ExperienceLevel | ""
}

export default function CompleteProfilePage() {
  const router = useRouter()
  const { popupState, closePopup, showSuccess, showError } = usePopup()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const primaryColor = "#10b981" // 

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<ProfileFormData>({
    username: "",
    name: "",
    age: "",
    gender: "",
    region: "",
    healthCondition: [],
    healthGoals: [],
    allergies: [],
    experienceLevel: ""
  })

  // State for custom inputs
  const [customHealthCondition, setCustomHealthCondition] = useState("")
  const [customHealthGoal, setCustomHealthGoal] = useState("")
  const [customAllergy, setCustomAllergy] = useState("")

  // State for location dropdowns
  const [provinces, setProvinces] = useState<Province[]>([])
  const [regencies, setRegencies] = useState<Regency[]>([])
  const [selectedProvince, setSelectedProvince] = useState<string>("")
  const [selectedRegency, setSelectedRegency] = useState<string>("")
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false)
  const [isLoadingRegencies, setIsLoadingRegencies] = useState(false)
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false)
  const [isRegencyDropdownOpen, setIsRegencyDropdownOpen] = useState(false)
  const [provinceSearch, setProvinceSearch] = useState("")
  const [regencySearch, setRegencySearch] = useState("")

 
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


  useEffect(() => {
    const fetchRegencies = async () => {
      if (!selectedProvince) {
        setRegencies([])
        return
      }
      setIsLoadingRegencies(true)
      try {
        const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince}.json`)
        const data = await response.json()
        setRegencies(data)
      } catch (error) {
        console.error("Error fetching regencies:", error)
      } finally {
        setIsLoadingRegencies(false)
      }
    }
    fetchRegencies()
  }, [selectedProvince])


  const formatName = (name: string) => {
    return name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
  }

  // Common health conditions
  const healthConditions = [
    "Diabetes", "Hipertensi", "Asma", "Alergi", "Jantung",
    "Kolesterol", "Asam Urat", "Maag", "Tidak Ada"
  ]

  // Health goals
  const healthGoalsList = [
    "Menurunkan Berat Badan", "Meningkatkan Imunitas", "Detoksifikasi",
    "Mengurangi Stress", "Meningkatkan Energi", "Tidur Lebih Baik",
    "Kesehatan Pencernaan", "Kesehatan Jantung"
  ]

  // Common allergies
  const allergiesList = [
    "Kacang", "Susu", "Telur", "Seafood", "Gluten",
    "Kedelai", "Gandum", "Tidak Ada Alergi"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        showError("Error", "Anda harus login terlebih dahulu")
        setIsSubmitting(false)
        return
      }

      const finalData = {
        username: formData.username,
        name: formData.name,
        age: typeof formData.age === 'number' ? formData.age : undefined,
        gender: formData.gender || undefined,
        region: formData.region,
        healthCondition: formData.healthCondition.length > 0 ? formData.healthCondition : undefined,
        healthGoals: formData.healthGoals.length > 0 ? formData.healthGoals : undefined,
        allergies: formData.allergies.length > 0 ? formData.allergies : undefined,
        experienceLevel: formData.experienceLevel || undefined
      }

      // Save to Firestore
      await completeOnboarding(currentUser.uid, finalData)

      showSuccess(
        "Profil Lengkap!",
        "Terima kasih! Profil Anda telah berhasil dilengkapi.",
        2000
      )

      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error) {
      console.error("Error saving onboarding:", error)
      showError(
        "Gagal Menyimpan",
        "Terjadi kesalahan saat menyimpan data. Silakan coba lagi."
      )
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (step < 4) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4 py-16 text-slate-900">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 mx-auto mb-6 rounded-full"
            style={{ background: primaryColor }}
          />
          <h1 className="text-3xl sm:text-4xl font-light text-slate-900 mb-2">
            Lengkapi Profil Anda
          </h1>
          <p className="text-slate-600 font-light">
            Bantu kami memberikan rekomendasi terbaik untuk Anda
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 mx-1 h-2 rounded-full transition-all duration-300 ${s <= step ? 'opacity-100' : 'opacity-30'
                  }`}
                style={{
                  backgroundColor: s <= step ? primaryColor : '#e2e8f0'
                }}
              />
            ))}
          </div>
          <p className="text-sm text-slate-500 text-center">
            Langkah {step} dari 4
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100"
        >
          <form onSubmit={handleSubmit}>

            {/* Step 1:*/}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-medium text-slate-900 mb-6">Informasi Dasar</h2>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="Masukkan username Anda"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>

                {/* umur */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Umur
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || "" })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="Masukkan umur Anda"
                  />
                </div>

                {/* kelamin */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Jenis Kelamin
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "male", label: "Laki-laki" },
                      { value: "female", label: "Perempuan" }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: option.value as Gender })}
                        className={`px-4 py-3 rounded-2xl border-2 transition-all font-medium ${formData.gender === option.value
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* wilayah - Province Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Provinsi
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProvinceDropdownOpen(!isProvinceDropdownOpen)
                        setIsRegencyDropdownOpen(false)
                      }}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white text-left flex items-center justify-between"
                    >
                      <span className={selectedProvince ? "text-slate-900" : "text-slate-400"}>
                        {selectedProvince 
                          ? formatName(provinces.find(p => p.id === selectedProvince)?.name || "")
                          : "Pilih Provinsi"}
                      </span>
                      {isLoadingProvinces ? (
                        <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                      ) : (
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isProvinceDropdownOpen ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                    
                    {isProvinceDropdownOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 max-h-64 overflow-hidden">
                        <div className="p-2 border-b border-slate-100">
                          <input
                            type="text"
                            value={provinceSearch}
                            onChange={(e) => setProvinceSearch(e.target.value)}
                            placeholder="Cari provinsi..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
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
                                  setSelectedProvince(province.id)
                                  setSelectedRegency("")
                                  setFormData({ ...formData, region: "" })
                                  setIsProvinceDropdownOpen(false)
                                  setProvinceSearch("")
                                }}
                                className={`w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors text-sm ${
                                  selectedProvince === province.id ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-700'
                                }`}
                              >
                                {formatName(province.name)}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* wilayah - Regency/City Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Kota/Kabupaten
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedProvince) {
                          setIsRegencyDropdownOpen(!isRegencyDropdownOpen)
                          setIsProvinceDropdownOpen(false)
                        }
                      }}
                      disabled={!selectedProvince}
                      className={`w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white text-left flex items-center justify-between ${
                        !selectedProvince ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <span className={selectedRegency ? "text-slate-900" : "text-slate-400"}>
                        {selectedRegency 
                          ? formatName(regencies.find(r => r.id === selectedRegency)?.name || "")
                          : selectedProvince ? "Pilih Kota/Kabupaten" : "Pilih provinsi terlebih dahulu"}
                      </span>
                      {isLoadingRegencies ? (
                        <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                      ) : (
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isRegencyDropdownOpen ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                    
                    {isRegencyDropdownOpen && regencies.length > 0 && (
                      <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 max-h-64 overflow-hidden">
                        <div className="p-2 border-b border-slate-100">
                          <input
                            type="text"
                            value={regencySearch}
                            onChange={(e) => setRegencySearch(e.target.value)}
                            placeholder="Cari kota/kabupaten..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
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
                                  setSelectedRegency(regency.id)
                                  const provinceName = provinces.find(p => p.id === selectedProvince)?.name || ""
                                  const regionValue = `${formatName(regency.name)}, ${formatName(provinceName)}`
                                  setFormData({ ...formData, region: regionValue })
                                  setIsRegencyDropdownOpen(false)
                                  setRegencySearch("")
                                }}
                                className={`w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors text-sm ${
                                  selectedRegency === regency.id ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-700'
                                }`}
                              >
                                {formatName(regency.name)}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Region Display */}
                {formData.region && (
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">{formData.region}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Kondisi Kesehatan */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-medium text-slate-900 mb-2">Kondisi Kesehatan</h2>
                <p className="text-sm text-slate-600 mb-6">Pilih kondisi kesehatan yang Anda miliki (bisa lebih dari satu)</p>

                {/* Selected Tags */}
                {formData.healthCondition.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 p-4 bg-emerald-50 rounded-2xl">
                    {formData.healthCondition.map((condition) => (
                      <div
                        key={condition}
                        className="px-3 py-1.5 bg-white rounded-full border-2 border-emerald-500 text-emerald-700 text-sm font-medium flex items-center gap-2"
                      >
                        {condition}
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            healthCondition: formData.healthCondition.filter(c => c !== condition)
                          })}
                          className="hover:bg-emerald-100 rounded-full p-0.5"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {healthConditions.map((condition) => (
                    <button
                      key={condition}
                      type="button"
                      onClick={() => {
                        if (formData.healthCondition.includes(condition)) {
                          setFormData({
                            ...formData,
                            healthCondition: formData.healthCondition.filter(c => c !== condition)
                          })
                        } else {
                          setFormData({
                            ...formData,
                            healthCondition: [...formData.healthCondition, condition]
                          })
                        }
                      }}
                      className={`px-4 py-3 rounded-2xl border-2 transition-all text-sm font-medium ${formData.healthCondition.includes(condition)
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                    >
                      {condition}
                    </button>
                  ))}
                </div>

                {/* Custom input */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4"
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tambah kondisi lainnya (opsional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customHealthCondition}
                      onChange={(e) => setCustomHealthCondition(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                      placeholder="Tuliskan kondisi kesehatan Anda"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          if (customHealthCondition.trim() && !formData.healthCondition.includes(customHealthCondition.trim())) {
                            setFormData({
                              ...formData,
                              healthCondition: [...formData.healthCondition, customHealthCondition.trim()]
                            })
                            setCustomHealthCondition("")
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customHealthCondition.trim() && !formData.healthCondition.includes(customHealthCondition.trim())) {
                          setFormData({
                            ...formData,
                            healthCondition: [...formData.healthCondition, customHealthCondition.trim()]
                          })
                          setCustomHealthCondition("")
                        }
                      }}
                      className="px-6 py-3 rounded-2xl text-white font-medium shadow-lg hover:shadow-xl transition-all"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Tambah
                    </button>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Step 3: Tujuan Kesehatan */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-medium text-slate-900 mb-2">Tujuan Kesehatan</h2>
                <p className="text-sm text-slate-600 mb-6">Pilih tujuan kesehatan Anda (bisa lebih dari satu)</p>

                {/* Selected Tags */}
                {formData.healthGoals.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 p-4 bg-emerald-50 rounded-2xl">
                    {formData.healthGoals.map((goal) => (
                      <div
                        key={goal}
                        className="px-3 py-1.5 bg-white rounded-full border-2 border-emerald-500 text-emerald-700 text-sm font-medium flex items-center gap-2"
                      >
                        {goal}
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            healthGoals: formData.healthGoals.filter(g => g !== goal)
                          })}
                          className="hover:bg-emerald-100 rounded-full p-0.5"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {healthGoalsList.map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => {
                        if (formData.healthGoals.includes(goal)) {
                          setFormData({
                            ...formData,
                            healthGoals: formData.healthGoals.filter(g => g !== goal)
                          })
                        } else {
                          setFormData({
                            ...formData,
                            healthGoals: [...formData.healthGoals, goal]
                          })
                        }
                      }}
                      className={`px-4 py-3 rounded-2xl border-2 transition-all text-sm font-medium text-left ${formData.healthGoals.includes(goal)
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>

                {/* Custom input */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4"
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tambah tujuan lainnya (opsional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customHealthGoal}
                      onChange={(e) => setCustomHealthGoal(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                      placeholder="Tuliskan tujuan kesehatan Anda"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          if (customHealthGoal.trim() && !formData.healthGoals.includes(customHealthGoal.trim())) {
                            setFormData({
                              ...formData,
                              healthGoals: [...formData.healthGoals, customHealthGoal.trim()]
                            })
                            setCustomHealthGoal("")
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customHealthGoal.trim() && !formData.healthGoals.includes(customHealthGoal.trim())) {
                          setFormData({
                            ...formData,
                            healthGoals: [...formData.healthGoals, customHealthGoal.trim()]
                          })
                          setCustomHealthGoal("")
                        }
                      }}
                      className="px-6 py-3 rounded-2xl text-white font-medium shadow-lg hover:shadow-xl transition-all"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Tambah
                    </button>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Step 4: Alergi & Pengalaman */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-medium text-slate-900 mb-2">Alergi</h2>
                  <p className="text-sm text-slate-600 mb-4">Pilih alergi yang Anda miliki (bisa lebih dari satu)</p>

                  {/* Selected Tags */}
                  {formData.allergies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 p-4 bg-emerald-50 rounded-2xl">
                      {formData.allergies.map((allergy) => (
                        <div
                          key={allergy}
                          className="px-3 py-1.5 bg-white rounded-full border-2 border-emerald-500 text-emerald-700 text-sm font-medium flex items-center gap-2"
                        >
                          {allergy}
                          <button
                            type="button"
                            onClick={() => setFormData({
                              ...formData,
                              allergies: formData.allergies.filter(a => a !== allergy)
                            })}
                            className="hover:bg-emerald-100 rounded-full p-0.5"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {allergiesList.map((allergy) => (
                      <button
                        key={allergy}
                        type="button"
                        onClick={() => {
                          if (formData.allergies.includes(allergy)) {
                            setFormData({
                              ...formData,
                              allergies: formData.allergies.filter(a => a !== allergy)
                            })
                          } else {
                            setFormData({
                              ...formData,
                              allergies: [...formData.allergies, allergy]
                            })
                          }
                        }}
                        className={`px-4 py-3 rounded-2xl border-2 transition-all text-sm font-medium ${formData.allergies.includes(allergy)
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                      >
                        {allergy}
                      </button>
                    ))}
                  </div>

                  {/* Custom input */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-8"
                  >
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tambah alergi lainnya (opsional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customAllergy}
                        onChange={(e) => setCustomAllergy(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                        placeholder="Tuliskan alergi Anda"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            if (customAllergy.trim() && !formData.allergies.includes(customAllergy.trim())) {
                              setFormData({
                                ...formData,
                                allergies: [...formData.allergies, customAllergy.trim()]
                              })
                              setCustomAllergy("")
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customAllergy.trim() && !formData.allergies.includes(customAllergy.trim())) {
                            setFormData({
                              ...formData,
                              allergies: [...formData.allergies, customAllergy.trim()]
                            })
                            setCustomAllergy("")
                          }
                        }}
                        className="px-6 py-3 rounded-2xl text-white font-medium shadow-lg hover:shadow-xl transition-all"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Tambah
                      </button>
                    </div>
                  </motion.div>
                </div>

                <div>
                  <h2 className="text-2xl font-medium text-slate-900 mb-2">Tingkat Pengalaman</h2>
                  <p className="text-sm text-slate-600 mb-4">Seberapa berpengalaman Anda dengan tanaman herbal?</p>

                  <div className="space-y-3">
                    {[
                      { value: "beginner", label: "Pemula", desc: "Baru mengenal tanaman herbal" },
                      { value: "intermediate", label: "Menengah", desc: "Sudah pernah menggunakan beberapa herbal" },
                      { value: "expert", label: "Ahli", desc: "Sangat berpengalaman dengan tanaman herbal" }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, experienceLevel: option.value as ExperienceLevel })}
                        className={`w-full px-6 py-4 rounded-2xl border-2 transition-all text-left ${formData.experienceLevel === option.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${formData.experienceLevel === option.value
                            ? 'border-emerald-500 bg-emerald-500'
                            : 'border-slate-300'
                            }`}>
                            {formData.experienceLevel === option.value && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <div>
                            <div className={`font-medium ${formData.experienceLevel === option.value ? 'text-emerald-700' : 'text-slate-900'
                              }`}>
                              {option.label}
                            </div>
                            <div className="text-sm text-slate-600">{option.desc}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* navigasi balik */}
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 px-6 py-3 rounded-full border-2 border-slate-200 text-slate-700 font-medium hover:border-slate-300 transition-all"
                >
                  Kembali
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (step === 1 && (!formData.username || !formData.name || !formData.age || !formData.gender || !formData.region)) ||
                    (step === 2 && formData.healthCondition.length === 0) ||
                    (step === 3 && formData.healthGoals.length === 0)
                  }
                  className="flex-1 px-6 py-3 rounded-full text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: primaryColor }}
                >
                  Lanjut
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={
                    formData.allergies.length === 0 ||
                    !formData.experienceLevel
                  }
                  className="flex-1 px-6 py-3 rounded-full text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: primaryColor }}
                >
                  Selesai
                </button>
              )}
            </div>
          </form>
        </motion.div>


      </motion.div>

      {/* Custom Popup */}
      <CustomPopup
        isOpen={popupState.isOpen}
        onClose={closePopup}
        type={popupState.type}
        title={popupState.title}
        message={popupState.message}
        confirmText={popupState.confirmText}
        cancelText={popupState.cancelText}
        onConfirm={popupState.onConfirm}
        onCancel={popupState.onCancel}
        showCancel={popupState.showCancel}
        autoClose={popupState.autoClose}
      />
    </div>
  )
}
