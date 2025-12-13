"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Upload, X, Loader2, Info, CheckCircle2, AlertTriangle, Droplets, Sun } from "lucide-react"
import Navbar from "../components/Navbar"
import { useTheme } from "../context/ThemeContext"

export default function DiagnosaPage() {
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()
  
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [diagnosis, setDiagnosis] = useState<any | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setImage(imageUrl)
      setImageFile(file)
      setDiagnosis(null)
    }
  }

  /* Helper to compress image before sending */
  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image(); // Use window.Image to avoid conflict with next/image
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          
          // Limit max dimension to 1024px to reduce size
          const MAX_SIZE = 1024; 
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 0.7 quality
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          resolve(compressedBase64);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleAnalyze = async () => {
    if (!imageFile) return

    setIsAnalyzing(true)
    try {
      // 1. Compress image to avoid 400/413 errors
      const base64Image = await compressImage(imageFile);
        
      // 2. Call local API route
      const response = await fetch("/api/scan-penyakit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Gagal menganalisis gambar. Coba gunakan gambar yang lebih kecil.")
      }

      if (data.result) {
        setDiagnosis(data.result)
      } else {
        throw new Error("Format respons tidak valid")
      }

    } catch (error: any) {
      console.error("API call error:", error)
      alert(`Gagal: ${error.message || "Terjadi kesalahan sistem"}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const clearImage = () => {
    setImage(null)
    setImageFile(null)
    setDiagnosis(null)
  }

  return (
    <main className="min-h-screen bg-slate-50 overflow-x-hidden">
      <Navbar />
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Diagnosa Penyakit <span style={{ color: themeColors.primary }}>Tanaman</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Unggah foto tanaman Anda, dan biarkan Erbis membantu mendeteksi penyakit serta memberikan solusi perawatannya.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">        
          {/* Mascot Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden"
          >
           <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-50 to-transparent" />         
            <div className="relative z-10 w-48 h-48 md:w-56 md:h-56 mb-4 mt-4">
              <div className="absolute inset-0 bg-emerald-100 rounded-full blur-3xl opacity-30 animate-pulse" />
              <Image
                src="/Erbis.png"
                alt="Erbis Mascot"
                fill
                className="object-cover rounded-full border-4 border-white shadow-lg"
              />
            </div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Halo, Saya Erbis! 👋</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                "Jangan khawatir jika tanamanmu sakit. Tunjukkan fotonya padaku, aku akan menganalisanya dengan teknologi AI canggih untukmu!"
              </p>
            </div>
          </motion.div>

          {/* Upload section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-8 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100"
          >
            {!image ? (
              <div className="h-full flex flex-col justify-center">
                <label 
                  htmlFor="dropzone-file" 
                  className="flex flex-col items-center justify-center w-full h-64 md:h-80 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-slate-50 transition-all duration-300 group relative overflow-hidden"
                  style={{ borderColor: `${themeColors.primary}40` }}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300"
                      style={{ background: `${themeColors.primary}10` }}
                    >
                      <Upload className="w-8 h-8" style={{ color: themeColors.primary }} />
                    </div>
                    <p className="mb-2 text-sm text-slate-700 font-medium">Klik untuk unggah foto</p>
                    <p className="text-xs text-slate-500">atau drag and drop (Max. 5MB)</p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  
                  {/* Decorative */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </label>
              </div>
            ) : (
              <div className="relative h-full flex flex-col">
                 <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-6 shadow-md group">
                    <Image src={image} alt="Uploaded plant" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <button 
                      onClick={clearImage}
                      className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
                    >
                      <X size={20} />
                    </button>
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center flex-col text-white">
                         <Loader2 className="w-10 h-10 animate-spin mb-3 text-emerald-400" />
                         <p className="font-medium tracking-wide animate-pulse">Sedang Menganalisa...</p>
                      </div>
                    )}
                 </div>
                 {!diagnosis && !isAnalyzing && (
                   <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAnalyze}
                    className="w-full py-4 rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                    style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` }}
                   >
                     Analisa Penyakit
                   </motion.button>
                 )}
              </div>
            )}
          </motion.div>

          {/* hasil penyakit */}
          <AnimatePresence>
            {diagnosis && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="md:col-span-12"
              >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* penyakit tanaman*/}
                      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 md:col-span-1 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-[4rem] -z-0" />
                          <div className="relative z-10">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-semibold mb-4">
                                <AlertTriangle size={14} />
                                Terdeteksi
                            </span>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">{diagnosis.name}</h2>
                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">{diagnosis.description}</p>       
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                        <Droplets size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Penyiraman</p>
                                        <p className="text-sm font-medium text-slate-800">{diagnosis.care.water}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                        <Sun size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Pencahayaan</p>
                                        <p className="text-sm font-medium text-slate-800">{diagnosis.care.sun}</p>
                                    </div>
                                </div>
                            </div>
                          </div>
                      </div>

                      {/* solusi dan pengobatan */}
                      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 md:col-span-2 flex flex-col justify-center">
                          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                              <CheckCircle2 className="text-emerald-500" />
                              Solusi & Pengobatan
                          </h3>
                          <ul className="space-y-4">
                              {diagnosis.solutions.map((sol: string, idx: number) => (
                                  <motion.li 
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * idx }}
                                    className="flex items-start gap-3 p-4 rounded-xl hover:bg-emerald-50/50 transition-colors border border-transparent hover:border-emerald-100"
                                  >
                                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold mt-0.5">
                                          {idx + 1}
                                      </span>
                                      <span className="text-slate-700 text-sm md:text-base leading-relaxed">{sol}</span>
                                  </motion.li>
                              ))}
                          </ul>
                      </div>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  )
}
