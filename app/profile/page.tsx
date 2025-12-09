"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { updateProfile } from "@/services/userService";
import { auth } from "@/lib/firebase";
import {
  ChevronLeft,
  AlertTriangle,
  Heart,
  CheckCircle2,
  User,
  BookOpen,
  Plus,
  LogOut,
  X,
  MessageCircle,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    age: "" as number | "",
    gender: "" as "male" | "female" | "",
    region: "",
    healthCondition: [] as string[],
    healthGoals: [] as string[],
    allergies: [] as string[],
    experienceLevel: "" as "beginner" | "intermediate" | "expert" | "",
  });

  // Custom input states for tags
  const [customHealthCondition, setCustomHealthCondition] = useState("");
  const [customHealthGoal, setCustomHealthGoal] = useState("");
  const [customAllergy, setCustomAllergy] = useState("");

  // Health options (same as onboarding)
  const healthConditions = [
    "Diabetes", "Hipertensi", "Asma", "Alergi", "Jantung",
    "Kolesterol", "Asam Urat", "Maag", "Tidak Ada"
  ];
  const healthGoalsList = [
    "Menurunkan Berat Badan", "Meningkatkan Imunitas", "Detoksifikasi",
    "Mengurangi Stress", "Meningkatkan Energi", "Tidur Lebih Baik",
    "Kesehatan Pencernaan", "Kesehatan Jantung"
  ];
  const allergiesList = [
    "Kacang", "Susu", "Telur", "Seafood", "Gluten",
    "Kedelai", "Gandum", "Tidak Ada Alergi"
  ];

  // Initialize form data when modal opens
  useEffect(() => {
    if (isEditModalOpen && user) {
      setFormData({
        username: user.username || "",
        name: user.name || "",
        age: user.age || "",
        gender: user.gender || "",
        region: user.region || "",
        healthCondition: user.healthCondition || [],
        healthGoals: user.healthGoals || [],
        allergies: user.allergies || [],
        experienceLevel: user.experienceLevel || "",
      });
    }
  }, [isEditModalOpen, user]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Anda harus login terlebih dahulu");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile(currentUser.uid, {
        username: formData.username,
        name: formData.name,
        age: typeof formData.age === 'number' ? formData.age : undefined,
        gender: formData.gender || undefined,
        region: formData.region,
        healthCondition: formData.healthCondition.length > 0 ? formData.healthCondition : undefined,
        healthGoals: formData.healthGoals.length > 0 ? formData.healthGoals : undefined,
        allergies: formData.allergies.length > 0 ? formData.allergies : undefined,
        experienceLevel: formData.experienceLevel || undefined,
      });

      setIsEditModalOpen(false);
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Gagal memperbarui profil. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-500 text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Logout */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Profil</h1>
              <p className="text-sm text-slate-500">
                Kelola informasi pribadi Anda
              </p>
            </div>
          </div>

          {/* Consultation Button */}
          <button
            onClick={() => router.push("/consultation")}
            className="hidden sm:flex px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors items-center gap-2 mr-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Konsultasi Kesehatan</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={async () => {
              const { logout } = await import("@/services/authService");
              await logout();
              router.push("/");
            }}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Profile Info */}
              <div className="flex-1 w-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">
                      {user.name || "Nama Belum Diisi"}
                    </h2>
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: themeColors.primary }}
                    >
                      @{user.username || "username"}
                    </p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-4 py-2 text-white text-sm rounded-xl font-medium transition-all hover:shadow-lg"
                    style={{ backgroundColor: themeColors.primary }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = themeColors.accent)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = themeColors.primary)
                    }
                  >
                    Edit
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
                  <div className="text-center">
                    <p className="text-xs text-slate-600 mb-1">Tingkat</p>
                    <p className="text-sm font-bold text-slate-900">
                      {user.experienceLevel === "expert"
                        ? "Ahli"
                        : user.experienceLevel === "intermediate"
                          ? "Menengah"
                          : "Pemula"}
                    </p>
                  </div>
                  <div className="text-center sm:border-l sm:border-r border-emerald-200">
                    <p className="text-xs text-slate-600 mb-1">Umur</p>
                    <p className="text-sm font-bold text-slate-900">
                      {user.age || "-"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-600 mb-1">Lokasi</p>
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {user.region || "-"}
                    </p>
                  </div>
                  <div className="text-center sm:border-l border-emerald-200">
                    <p className="text-xs text-slate-600 mb-1">Gender</p>
                    <p className="text-sm font-bold text-slate-900">
                      {user.gender === "male"
                        ? "Laki-laki"
                        : user.gender === "female"
                          ? "Perempuan"
                          : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Health Condition */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-sm font-semibold text-slate-900">
                Kondisi Kesehatan
              </p>
            </div>
            {user.healthCondition && user.healthCondition.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.healthCondition.map((condition, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-full border border-red-200"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600">Belum diisi</p>
            )}
          </div>

          {/* Health Goals */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-sm font-semibold text-slate-900">
                Tujuan Kesehatan
              </p>
            </div>
            {user.healthGoals && user.healthGoals.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.healthGoals.map((goal, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600">Belum diisi</p>
            )}
          </div>

          {/* Allergies */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-sm font-semibold text-slate-900">
                Alergi & Pantangan
              </p>
            </div>
            {user.allergies && user.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600">Tidak ada alergi</p>
            )}
          </div>

          {/* Saved Recipes from Consultation */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Racikan Tersimpan
                  </p>
                  <p className="text-xs text-slate-500">
                    Dari konsultasi kesehatan
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push('/consultation')}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200 flex items-center gap-1"
              >
                <MessageCircle className="w-3 h-3" />
                Konsultasi
              </button>
            </div>
            
            {/* Mock Saved Recipes */}
            <div className="space-y-3">
              {/* Recipe 1 */}
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-900">Racikan Jahe Merah Obat Alami</h4>
                  <span className="text-xs text-amber-600 font-medium">Tersimpan</span>
                </div>
                <p className="text-xs text-slate-600 mb-2">Mengobati batuk kering dan flu</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>5 bahan</span>
                  <span>•</span>
                  <span>6 langkah</span>
                </div>
              </div>
            </div>

            {/* View All Button */}
            <button
              onClick={() => router.push('/saved-recipes')}
              className="w-full mt-4 px-4 py-2.5 bg-slate-50 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors border border-slate-200 flex items-center justify-center gap-2"
            >
              Lihat Semua Racikan
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>

          {/* Tanaman Herbal Section - Full Width */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">
                    Tanaman Herbal Saya
                  </p>
                  <p className="text-xs text-slate-500">
                    Kelola koleksi tanaman herbal Anda
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => router.push("/dashboardplant")}
                  className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 text-slate-700 text-sm rounded-xl font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Lihat Semua</span>
                </button>
                <button
                  onClick={() => router.push("/dashboardplant/add")}
                  className="flex-1 sm:flex-none px-4 py-2 text-white text-sm rounded-xl font-medium transition-all hover:shadow-lg flex items-center justify-center gap-2"
                  style={{ backgroundColor: themeColors.primary }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = themeColors.accent)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = themeColors.primary)
                  }
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Baru</span>
                </button>
              </div>
            </div>

            {/* Plants Grid - Placeholder for now, will be populated with Firebase data */}
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-base font-semibold text-slate-900 mb-2">
                Belum ada tanaman herbal
              </p>
              <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                Mulai tambahkan tanaman herbal favorit Anda dan kelola informasi lengkapnya
              </p>
              <button
                onClick={() => router.push("/dashboardplant/add")}
                className="px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                style={{ backgroundColor: themeColors.primary }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = themeColors.accent)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = themeColors.primary)
                }
              >
                Tambah Tanaman Pertama
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsEditModalOpen(false)}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
                  <h2 className="text-2xl font-bold text-slate-900">Edit Profil</h2>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                {/* Modal Content - Scrollable */}
                <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)]">
                  <div className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900 text-lg">Informasi Dasar</h3>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-900"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-900"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Umur</label>
                          <input
                            type="number"
                            min="1"
                            max="120"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || "" })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-900"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Jenis Kelamin</label>
                          <select
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value as "male" | "female" })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-900"
                            required
                          >
                            <option value="">Pilih</option>
                            <option value="male">Laki-laki</option>
                            <option value="female">Perempuan</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Wilayah/Kota</label>
                        <input
                          type="text"
                          value={formData.region}
                          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-900"
                          required
                        />
                      </div>
                    </div>

                    {/* Health Condition */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-slate-900 text-lg">Kondisi Kesehatan</h3>

                      {formData.healthCondition.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-4 bg-emerald-50 rounded-xl">
                          {formData.healthCondition.map((condition) => (
                            <span
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
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-2">
                        {healthConditions.map((condition) => (
                          <button
                            key={condition}
                            type="button"
                            onClick={() => {
                              if (formData.healthCondition.includes(condition)) {
                                setFormData({
                                  ...formData,
                                  healthCondition: formData.healthCondition.filter(c => c !== condition)
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  healthCondition: [...formData.healthCondition, condition]
                                });
                              }
                            }}
                            className={`px-3 py-2 rounded-xl border-2 transition-all text-xs font-medium ${formData.healthCondition.includes(condition)
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                              }`}
                          >
                            {condition}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customHealthCondition}
                          onChange={(e) => setCustomHealthCondition(e.target.value)}
                          placeholder="Tambah kondisi lainnya"
                          className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (customHealthCondition.trim() && !formData.healthCondition.includes(customHealthCondition.trim())) {
                                setFormData({
                                  ...formData,
                                  healthCondition: [...formData.healthCondition, customHealthCondition.trim()]
                                });
                                setCustomHealthCondition("");
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
                              });
                              setCustomHealthCondition("");
                            }
                          }}
                          className="px-4 py-2 rounded-xl text-white text-sm font-medium"
                          style={{ backgroundColor: themeColors.primary }}
                        >
                          Tambah
                        </button>
                      </div>
                    </div>

                    {/* Health Goals */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-slate-900 text-lg">Tujuan Kesehatan</h3>

                      {formData.healthGoals.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-4 bg-emerald-50 rounded-xl">
                          {formData.healthGoals.map((goal) => (
                            <span
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
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        {healthGoalsList.map((goal) => (
                          <button
                            key={goal}
                            type="button"
                            onClick={() => {
                              if (formData.healthGoals.includes(goal)) {
                                setFormData({
                                  ...formData,
                                  healthGoals: formData.healthGoals.filter(g => g !== goal)
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  healthGoals: [...formData.healthGoals, goal]
                                });
                              }
                            }}
                            className={`px-3 py-2 rounded-xl border-2 transition-all text-xs font-medium text-left ${formData.healthGoals.includes(goal)
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                              }`}
                          >
                            {goal}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customHealthGoal}
                          onChange={(e) => setCustomHealthGoal(e.target.value)}
                          placeholder="Tambah tujuan lainnya"
                          className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (customHealthGoal.trim() && !formData.healthGoals.includes(customHealthGoal.trim())) {
                                setFormData({
                                  ...formData,
                                  healthGoals: [...formData.healthGoals, customHealthGoal.trim()]
                                });
                                setCustomHealthGoal("");
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
                              });
                              setCustomHealthGoal("");
                            }
                          }}
                          className="px-4 py-2 rounded-xl text-white text-sm font-medium"
                          style={{ backgroundColor: themeColors.primary }}
                        >
                          Tambah
                        </button>
                      </div>
                    </div>

                    {/* Allergies */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-slate-900 text-lg">Alergi</h3>

                      {formData.allergies.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-4 bg-emerald-50 rounded-xl">
                          {formData.allergies.map((allergy) => (
                            <span
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
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-2">
                        {allergiesList.map((allergy) => (
                          <button
                            key={allergy}
                            type="button"
                            onClick={() => {
                              if (formData.allergies.includes(allergy)) {
                                setFormData({
                                  ...formData,
                                  allergies: formData.allergies.filter(a => a !== allergy)
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  allergies: [...formData.allergies, allergy]
                                });
                              }
                            }}
                            className={`px-3 py-2 rounded-xl border-2 transition-all text-xs font-medium ${formData.allergies.includes(allergy)
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                              }`}
                          >
                            {allergy}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customAllergy}
                          onChange={(e) => setCustomAllergy(e.target.value)}
                          placeholder="Tambah alergi lainnya"
                          className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (customAllergy.trim() && !formData.allergies.includes(customAllergy.trim())) {
                                setFormData({
                                  ...formData,
                                  allergies: [...formData.allergies, customAllergy.trim()]
                                });
                                setCustomAllergy("");
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
                              });
                              setCustomAllergy("");
                            }
                          }}
                          className="px-4 py-2 rounded-xl text-white text-sm font-medium"
                          style={{ backgroundColor: themeColors.primary }}
                        >
                          Tambah
                        </button>
                      </div>
                    </div>

                    {/* Experience Level */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-slate-900 text-lg">Tingkat Pengalaman</h3>
                      <div className="space-y-2">
                        {[
                          { value: "beginner", label: "Pemula", desc: "Baru mengenal tanaman herbal" },
                          { value: "intermediate", label: "Menengah", desc: "Sudah pernah menggunakan beberapa herbal" },
                          { value: "expert", label: "Ahli", desc: "Sangat berpengalaman dengan tanaman herbal" }
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, experienceLevel: option.value as "beginner" | "intermediate" | "expert" })}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all text-left ${formData.experienceLevel === option.value
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

                  {/* Modal Footer */}
                  <div className="p-6 border-t border-slate-200 bg-slate-50 sticky bottom-0">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-medium hover:bg-white transition-all"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                        style={{ backgroundColor: themeColors.primary }}
                      >
                        {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
