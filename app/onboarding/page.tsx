"use client"

import { motion, Variants } from "framer-motion"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import { completeOnboarding } from "@/services/userService"
import { usePopup } from "../hooks/usePopup"
import CustomPopup from "../components/CustomPopup"
import { auth } from "@/lib/firebase"


type Gender = "male" | "female"
type ExperienceLevel = "beginner" | "intermediate" | "expert"

interface ProfileFormData {
  username: string
  name: string
  age: number | ""
  gender: Gender | ""
  region: string
  healthCondition: string
  healthGoals: string
  allergies: string
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
    healthCondition: "",
    healthGoals: "",
    allergies: "",
    experienceLevel: ""
  })

  // State for custom inputs
  const [customHealthCondition, setCustomHealthCondition] = useState("")
  const [customHealthGoal, setCustomHealthGoal] = useState("")
  const [customAllergy, setCustomAllergy] = useState("")

  // Common health conditions
  const healthConditions = [
    "Diabetes", "Hipertensi", "Asma", "Alergi", "Jantung", 
    "Kolesterol", "Asam Urat", "Maag", "Tidak Ada", "Lainnya (tulis sendiri)"
  ]

  // Health goals
  const healthGoalsList = [
    "Menurunkan Berat Badan", "Meningkatkan Imunitas", "Detoksifikasi",
    "Mengurangi Stress", "Meningkatkan Energi", "Tidur Lebih Baik",
    "Kesehatan Pencernaan", "Kesehatan Jantung", "Lainnya (tulis sendiri)"
  ]

  // Common allergies
  const allergiesList = [
    "Kacang", "Susu", "Telur", "Seafood", "Gluten",
    "Kedelai", "Gandum", "Tidak Ada Alergi", "Lainnya (tulis sendiri)"
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
        healthCondition: formData.healthCondition === "Lainnya (tulis sendiri)" 
          ? customHealthCondition 
          : formData.healthCondition,
        healthGoals: formData.healthGoals === "Lainnya (tulis sendiri)" 
          ? customHealthGoal 
          : formData.healthGoals,
        allergies: formData.allergies === "Lainnya (tulis sendiri)" 
          ? customAllergy 
          : formData.allergies,
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
                className={`flex-1 mx-1 h-2 rounded-full transition-all duration-300 ${
                  s <= step ? 'opacity-100' : 'opacity-30'
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
                        className={`px-4 py-3 rounded-2xl border-2 transition-all font-medium ${
                          formData.gender === option.value
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* wilayah */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Wilayah/Kota
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="Contoh: Jakarta, Bandung, Surabaya"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Kondisi Kesehatan */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-medium text-slate-900 mb-2">Kondisi Kesehatan</h2>
                <p className="text-sm text-slate-600 mb-6">Pilih satu kondisi kesehatan yang Anda miliki</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {healthConditions.map((condition) => (
                    <button
                      key={condition}
                      type="button"
                      onClick={() => setFormData({ ...formData, healthCondition: condition })}
                      className={`px-4 py-3 rounded-2xl border-2 transition-all text-sm font-medium ${
                        formData.healthCondition === condition
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {condition}
                    </button>
                  ))}
                </div>

                {/* input kustom */}
                {formData.healthCondition === "Lainnya (tulis sendiri)" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4"
                  >
                    <input
                      type="text"
                      value={customHealthCondition}
                      onChange={(e) => setCustomHealthCondition(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                      placeholder="Tuliskan kondisi kesehatan Anda"
                      required
                    />
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 3: Tujuan Kesehatan */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-medium text-slate-900 mb-2">Tujuan Kesehatan</h2>
                <p className="text-sm text-slate-600 mb-6">Pilih satu tujuan kesehatan Anda</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {healthGoalsList.map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setFormData({ ...formData, healthGoals: goal })}
                      className={`px-4 py-3 rounded-2xl border-2 transition-all text-sm font-medium text-left ${
                        formData.healthGoals === goal
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>

                {/* input kustom */}
                {formData.healthGoals === "Lainnya (tulis sendiri)" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4"
                  >
                    <input
                      type="text"
                      value={customHealthGoal}
                      onChange={(e) => setCustomHealthGoal(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                      placeholder="Tuliskan tujuan kesehatan Anda"
                      required
                    />
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 4: Alergi & Pengalaman */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-medium text-slate-900 mb-2">Alergi</h2>
                  <p className="text-sm text-slate-600 mb-4">Pilih salah satu alergi yang Anda miliki</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                    {allergiesList.map((allergy) => (
                      <button
                        key={allergy}
                        type="button"
                        onClick={() => setFormData({ ...formData, allergies: allergy })}
                        className={`px-4 py-3 rounded-2xl border-2 transition-all text-sm font-medium ${
                          formData.allergies === allergy
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {allergy}
                      </button>
                    ))}
                  </div>

                  {/* input kustom */}
                  {formData.allergies === "Lainnya (tulis sendiri)" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mb-8"
                    >
                      <input
                        type="text"
                        value={customAllergy}
                        onChange={(e) => setCustomAllergy(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                        placeholder="Tuliskan alergi Anda"
                        required
                      />
                    </motion.div>
                  )}
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
                        className={`w-full px-6 py-4 rounded-2xl border-2 transition-all text-left ${
                          formData.experienceLevel === option.value
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                            formData.experienceLevel === option.value
                              ? 'border-emerald-500 bg-emerald-500'
                              : 'border-slate-300'
                          }`}>
                            {formData.experienceLevel === option.value && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <div>
                            <div className={`font-medium ${
                              formData.experienceLevel === option.value ? 'text-emerald-700' : 'text-slate-900'
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
                    (step === 2 && !formData.healthCondition) ||
                    (step === 2 && formData.healthCondition === "Lainnya (tulis sendiri)" && !customHealthCondition) ||
                    (step === 3 && !formData.healthGoals) ||
                    (step === 3 && formData.healthGoals === "Lainnya (tulis sendiri)" && !customHealthGoal)
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
                    !formData.allergies ||
                    (formData.allergies === "Lainnya (tulis sendiri)" && !customAllergy) ||
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

        {/* Skip button */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-slate-500 hover:text-slate-700 font-light transition-colors"
          >
            Lewati untuk saat ini
          </button>
        </div>
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
