"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "../../context/ThemeContext"
import { ChevronLeft, Upload, X, Sprout, Image as ImageIcon, Sun, Calendar } from "lucide-react"

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
  const themeColors = getThemeColors()

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    soil: "",
    plantedDate: ""
  })
  
  const [imagePreview, setImagePreview] = useState<string | null>(null)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Saving plant:", { ...formData, image: imagePreview })
    router.push("/dashboardplant")
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
                                className="w-full h-full object-cover"/>
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
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Contoh: Jahe Merah"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Jenis Tanaman</label>
                        <input 
                            type="text"
                            required
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            placeholder="Contoh: Rizoma"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Media Tanam</label>
                        <div className="relative">
                            <select 
                                required
                                value={formData.soil}
                                onChange={(e) => setFormData({...formData, soil: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none bg-white text-slate-700"
                            >
                                <option value="" disabled>Pilih Media Tanam</option>
                                {soilTypes.map(soil => (
                                    <option key={soil} value={soil}>{soil}</option>
                                ))}
                            </select>
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
                                onChange={(e) => setFormData({...formData, plantedDate: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700"
                            />
                            <Calendar className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
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
                    style={{ backgroundColor: themeColors.primary }}
                    className="flex-[2] py-3.5 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:opacity-95 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    <Upload className="w-5 h-5" />
                    Simpan Tanaman
                </button>
            </div>
        </form>
      </main>
    </div>
  )
}
