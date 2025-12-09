"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  BookOpen,
  Leaf,
  Clock,
  ChevronDown,
  ChevronUp,
  Trash2,
  Share2
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// Mock data for saved recipes
const mockRecipes = [
  {
    id: "1",
    title: "Racikan Jahe Merah Obat Alami",
    purpose: "Mengobati batuk kering dan flu",
    ingredients: [
      "3 ruas Jahe Merah",
      "2 gelas air",
      "Madu secukupnya",
      "Sedikit perasan jeruk nipis",
      "1 batang serai (opsional)"
    ],
    steps: [
      "Cuci bersih Jahe Merah dan geprek hingga memar.",
      "Rebus air hingga mendidih.",
      "Masukkan Jahe Merah ke dalam air mendidih.",
      "Tunggu hingga air menyusut menjadi 1 gelas.",
      "Saring air rebusan ke dalam gelas.",
      "Tambahkan madu dan jeruk nipis selagi hangat."
    ],
    savedDate: "2025-12-05",
    plantUsed: "Jahe Merah"
  },
  {
    id: "2",
    title: "Wedang Kunyit Hangat",
    purpose: "Meredakan sakit kepala dan migrain",
    ingredients: [
      "2 rimpang Kunyit",
      "Air panas 250ml",
      "Gula aren secukupnya",
      "1 batang kayu manis"
    ],
    steps: [
      "Bakar sebentar Kunyit lalu memarkan.",
      "Seduh dengan air panas.",
      "Tambahkan gula aren dan kayu manis.",
      "Aduk hingga rata dan minum selagi hangat."
    ],
    savedDate: "2025-12-04",
    plantUsed: "Kunyit"
  },
  {
    id: "3",
    title: "Rebusan Daun Sirih untuk Batuk",
    purpose: "Meredakan batuk berdahak",
    ingredients: [
      "7 lembar Daun Sirih",
      "3 gelas air",
      "2 sdm madu",
      "1 ruas jahe"
    ],
    steps: [
      "Cuci bersih daun sirih.",
      "Rebus dengan air dan jahe hingga mendidih.",
      "Tunggu hingga air menyusut menjadi 1 gelas.",
      "Saring dan tambahkan madu.",
      "Minum 2x sehari selagi hangat."
    ],
    savedDate: "2025-12-03",
    plantUsed: "Daun Sirih"
  },
  {
    id: "4",
    title: "Jamu Temulawak Stamina",
    purpose: "Meningkatkan stamina dan daya tahan tubuh",
    ingredients: [
      "3 ruas Temulawak",
      "2 gelas air",
      "Madu murni",
      "Perasan jeruk nipis"
    ],
    steps: [
      "Kupas dan cuci bersih temulawak.",
      "Parut atau blender temulawak.",
      "Rebus dengan air hingga mendidih.",
      "Saring dan tambahkan madu serta jeruk nipis.",
      "Minum rutin setiap pagi."
    ],
    savedDate: "2025-12-02",
    plantUsed: "Temulawak"
  }
];

export default function SavedRecipesPage() {
  const router = useRouter();
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();
  
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  const toggleRecipe = (id: string) => {
    setExpandedRecipe(expandedRecipe === id ? null : id);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus racikan ini?")) {
      // Mock delete
      console.log("Deleting recipe:", id);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/profile")}
              className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Racikan Tersimpan</h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {mockRecipes.length} racikan herbal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Isian */}
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {mockRecipes.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Belum Ada Racikan Tersimpan
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                Mulai konsultasi untuk mendapatkan rekomendasi racikan herbal
              </p>
              <button
                onClick={() => router.push("/consultation")}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
              >
                Mulai Konsultasi
              </button>
            </div>
          ) : (
            mockRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                {/* Recipe */}
                <div
                  onClick={() => toggleRecipe(recipe.id)}
                  className="p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-amber-600" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">
                          {recipe.title}
                        </h3>
                      </div>
                      <p className="text-sm text-amber-600 font-medium mb-2">
                        {recipe.purpose}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Leaf className="w-3 h-3" />
                          {recipe.plantUsed}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(recipe.savedDate).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                    </div>
                    <button className="ml-4 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      {expandedRecipe === recipe.id ? (
                        <ChevronUp className="w-5 h-5 text-slate-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-600" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{recipe.ingredients.length} bahan</span>
                    <span>•</span>
                    <span>{recipe.steps.length} langkah</span>
                  </div>
                </div>

                {/* Details */}
                <AnimatePresence>
                  {expandedRecipe === recipe.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-slate-200"
                    >
                      <div className="p-5 space-y-6">
                        {/* Ingredients */}
                        <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100">
                          <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Leaf className="w-3 h-3" /> Bahan-bahan
                          </h4>
                          <ul className="space-y-2">
                            {recipe.ingredients.map((ingredient, idx) => (
                              <li
                                key={idx}
                                className="flex items-center gap-2 text-sm text-slate-700"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                {ingredient}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Step */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                            Cara Membuat
                          </h4>
                          <div className="space-y-4">
                            {recipe.steps.map((step, idx) => (
                              <div key={idx} className="flex gap-4 text-sm text-slate-700">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs border border-slate-200">
                                  {idx + 1}
                                </span>
                                <p className="pt-0.5 leading-relaxed">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-3 pt-4 border-t border-slate-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(recipe.id);
                            }}
                            className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Hapus
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
