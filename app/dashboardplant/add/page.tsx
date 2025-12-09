"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import { ChevronLeft, Upload, X, Sprout, Image as ImageIcon, Sun, Calendar, Sparkles, Bot, CheckCircle2, AlertCircle } from "lucide-react"
import { validateAndGeneratePlantData } from "@/services/geminiService"
import { createPlant } from "@/services/plantService"
import { auth } from "@/lib/firebase"

const soilTypes = [
    "Tanah Gembur",
    "Tanah Liat",
    "Pasir Berbatu",
    "Sekam Bakar",
    "Hidroponik",
]

export default function AddPlantPage() {
    const router = useRouter()
    const { getThemeColors } = useTheme()
    const { user } = useAuth()
    const themeColors = getThemeColors()

    const [isGenerating, setIsGenerating] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [validationStatus, setValidationStatus] = useState<"idle" | "success" | "error">("idle")

    const [formData, setFormData] = useState({
        name: "",
        type: "",
        soil: "",
        plantedDate: "",
        wateringSchedule: "",
        fertilizeSchedule: "",
        specialCare: [] as string[]
    })

    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const handleGenerateSchedule = async () => {
        if (!formData.type.trim()) {
            setError("Mohon isi jenis tanaman terlebih dahulu")
            return
        }

        setIsGenerating(true)
        setError(null)
        setValidationStatus("idle")

        try {
            // Build user context from profile
            const userContext = user ? {
                experienceLevel: user.experienceLevel,
                healthCondition: user.healthCondition,
                healthGoals: user.healthGoals,
                allergies: user.allergies
            } : undefined

            const aiData = await validateAndGeneratePlantData(
                formData.name || "Tanaman",
                formData.type,
                userContext
            )

            if (!aiData.isValid) {
                setError(aiData.validationMessage || "Jenis tanaman tidak valid")
                setValidationStatus("error")
                setFormData(prev => ({
                    ...prev,
                    wateringSchedule: "",
                    fertilizeSchedule: "",
                    specialCare: []
                }))
            } else {
                setValidationStatus("success")
                setFormData(prev => ({
                    ...prev,
                    wateringSchedule: aiData.wateringSchedule || "",
                    fertilizeSchedule: aiData.fertilizingSchedule || "",
                    specialCare: aiData.specialCare || []
                }))
            }
        } catch (err) {
            console.error("AI Generation Error:", err)
            setError(err instanceof Error ? err.message : "Gagal menghasilkan jadwal perawatan")
            setValidationStatus("error")
        } finally {
            setIsGenerating(false)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const currentUser = auth.currentUser
        if (!currentUser) {
            setError("Anda harus login terlebih dahulu")
            return
        }

        if (!formData.wateringSchedule) {
            setError("Mohon generate jadwal perawatan terlebih dahulu")
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const plantData: any = {
                userId: currentUser.uid,
                name: formData.name,
                kind: formData.type,
                soilType: formData.soil,
                plantedDate: formData.plantedDate,
                wateringSchedule: formData.wateringSchedule,
                fertilizerSchedule: formData.fertilizeSchedule,
                specialCare: formData.specialCare
            }

            // Only include imageUrl if it exists
            if (imagePreview) {
                plantData.imageUrl = imagePreview
            }

            await createPlant(plantData)

            console.log("Plant saved successfully!")
            router.push("/dashboardplant")
        } catch (err) {
            console.error("Error saving plant:", err)
            setError(err instanceof Error ? err.message : "Gagal menyimpan tanaman")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                    >
                        <ChevronLeft className="w-6 h-6 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Tambah Tanaman Baru</h1>
                        <p className="text-xs sm:text-sm text-slate-500">Lengkapi data tanaman herbalmu</p>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Image*/}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-slate-500" />
                            Foto Tanaman
                        </h2>

                        <div className={`relative w-full h-64 rounded-2xl border-2 border-dashed transition-all overflow-hidden group
                    ${imagePreview ? 'border-emerald-500/50 bg-slate-50' : 'border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/10'}`}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer" />
                            {imagePreview ? (
                                <>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover" />
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
                                        className="absolute top-4 right-4 z-30 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <p className="font-medium text-slate-600">Klik atau tarik foto di sini</p>
                                    <p className="text-xs mt-1">Format: JPG, PNG (Max 5MB)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Plant form */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Sprout className="w-5 h-5 text-slate-500" />
                            Detail Tanaman
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Nama Tanaman</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Contoh: Jahe Merah"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Jenis Tanaman</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={formData.type}
                                        onChange={(e) => {
                                            setFormData({ ...formData, type: e.target.value })
                                            setValidationStatus("idle")
                                            setError(null)
                                        }}
                                        placeholder="Contoh: Lidah Buaya, Jahe, Mint"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                                    />
                                    {validationStatus === "success" && (
                                        <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                                    )}
                                    {validationStatus === "error" && (
                                        <AlertCircle className="w-5 h-5 text-red-500 absolute right-4 top-1/2 -translate-y-1/2" />
                                    )}
                                </div>
                                {validationStatus === "success" && (
                                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Tanaman valid!
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Media Tanam</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={formData.soil}
                                        onChange={(e) => setFormData({ ...formData, soil: e.target.value })}
                                        placeholder="Contoh: Tanah belakang rumah dan campuran pupuk kompos"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                                    />
                                    <Sun className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Tanggal Tanam</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        required
                                        value={formData.plantedDate}
                                        onChange={(e) => setFormData({ ...formData, plantedDate: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700"
                                    />
                                    <Calendar className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Care Schedules (AI Generated) */}
                        <div className="border-t border-slate-100 pt-5 space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-red-900">Error</p>
                                        <p className="text-sm text-red-700 mt-1">{error}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-600" />
                                    Rekomendasi Perawatan
                                </h3>
                                {!formData.wateringSchedule && (
                                    <button
                                        type="button"
                                        onClick={handleGenerateSchedule}
                                        disabled={isGenerating || !formData.type}
                                        className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                                                Validating...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-3 h-3" />
                                                Buat Jadwal
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {formData.wateringSchedule ? (
                                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-slate-700">Jadwal Penyiraman</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={formData.wateringSchedule}
                                                    className="w-full px-4 py-3 rounded-xl border border-purple-200 bg-purple-50/50 text-slate-700 focus:outline-none"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <Sparkles className="w-4 h-4 text-purple-400" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-slate-700">Jadwal Pemupukan</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={formData.fertilizeSchedule}
                                                    className="w-full px-4 py-3 rounded-xl border border-purple-200 bg-purple-50/50 text-slate-700 focus:outline-none"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <Sparkles className="w-4 h-4 text-purple-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {formData.specialCare.length > 0 && (
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-slate-700">Perawatan Khusus</label>
                                            <div className="bg-purple-50/50 border border-purple-200 rounded-xl p-4">
                                                <ul className="space-y-2">
                                                    {formData.specialCare.map((care, index) => (
                                                        <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                                                            <span className="text-purple-500 mt-0.5">•</span>
                                                            <span>{care}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handleGenerateSchedule}
                                            disabled={isGenerating}
                                            className="text-xs text-slate-500 hover:text-purple-600 transition-colors flex items-center gap-1"
                                        >
                                            <Sparkles className="w-3 h-3" />
                                            Regenerate Jadwal
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-slate-50 rounded-xl p-8 text-center border border-dashed border-slate-300">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                        <Bot className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <p className="text-slate-600 font-medium mb-1">Belum ada jadwal perawatan</p>
                                    <p className="text-xs text-slate-400 mb-4 max-w-xs mx-auto">
                                        Biarkan AI membuatkan jadwal penyiraman dan pemupukan yang optimal untuk tanamanmu
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleGenerateSchedule}
                                        disabled={isGenerating || !formData.type}
                                        className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center gap-2 mx-auto"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Membuat Jadwal...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4 text-purple-300" />
                                                Buat Jadwal Otomatis
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="pt-4 flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 py-3.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-all"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !formData.wateringSchedule}
                            style={{ backgroundColor: themeColors.primary }}
                            className="flex-[2] py-3.5 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:opacity-95 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5" />
                                    Simpan Tanaman
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}
