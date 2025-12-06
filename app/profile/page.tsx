"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { ChevronLeft, AlertTriangle, Heart, CheckCircle2, User, BookOpen, Plus, LogOut } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

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
        
        {/* Back */}
        <div className="mb-6 flex items-center gap-4">
          <button 
            onClick={() => router.push("/home")}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Profil</h1>
            <p className="text-sm text-slate-500">Kelola informasi pribadi Anda</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-start gap-6">              
              {/* Info */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  {user.name || "Nama Belum Diisi"}
                </h2>
                <p className="text-sm font-medium mb-2" style={{ color: themeColors.primary }}>
                  @{user.username || "username"}
                </p>
                <p className="text-sm text-slate-500">
                  {user.email}
                </p>
                
                {/* Level */}
                <div className="flex gap-4 mt-4">
                  <div>
                    <p className="text-xs text-slate-500">Tingkat</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {user.experienceLevel === "expert" ? "Ahli" : 
                       user.experienceLevel === "intermediate" ? "Menengah" : "Pemula"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Umur</p>
                    <p className="text-sm font-semibold text-slate-700">{user.age || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Lokasi</p>
                    <p className="text-sm font-semibold text-slate-700">{user.region || "-"}</p>
                  </div>
                </div>
              </div>

              <button 
                className="px-4 py-2 text-white text-sm rounded-xl font-medium transition-colors"
                style={{ backgroundColor: themeColors.primary }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeColors.accent}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = themeColors.primary}
              >
                Edit
              </button>
            </div>
          </div>

          {/* Alergiu */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-sm font-semibold text-slate-900">Alergi & Pantangan</p>
            </div>
            <p className="text-sm text-slate-600">
              {user.allergies || "Tidak ada alergi"}
            </p>
          </div>

          {/* konsdisi*/}
          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-sm font-semibold text-slate-900">Kondisi Kesehatan</p>
            </div>
            <p className="text-sm text-slate-600">
              {user.healthCondition || "Belum diisi"}
            </p>
          </div>

          {/* tujuan */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-sm font-semibold text-slate-900">Tujuan Kesehatan</p>
            </div>
            <p className="text-sm text-slate-600">
              {user.healthGoals || "Belum diisi"}
            </p>
          </div>

          {/* gender */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-sm font-semibold text-slate-900">Jenis Kelamin</p>
            </div>
            <p className="text-sm text-slate-600">
              {user.gender === "male" ? "Laki-laki" : user.gender === "female" ? "Perempuan" : "Belum diisi"}
            </p>
          </div>

          {/* Tanaman Herbal User */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-slate-900">Tanaman Herbal Saya</p>
              </div>
              <button 
                onClick={() => router.push("/dashboardplant")}
                className="px-3 py-1.5 text-white text-xs rounded-lg font-medium transition-colors flex items-center gap-1"
                style={{ backgroundColor: themeColors.primary }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeColors.accent}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = themeColors.primary}
              >
                <Plus className="w-4 h-4" />
                Tambah
              </button>
            </div>
            
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                <Plus className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-900 mb-1">Belum ada tanaman herbal</p>
              <p className="text-xs text-slate-500 mb-4">Mulai tambahkan tanaman herbal favorit Anda</p>
              <button className="px-4 py-2 bg-slate-100 text-slate-700 text-sm rounded-lg font-medium hover:bg-slate-200 transition-colors">
                Tambah Tanaman Pertama
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <p className="text-sm font-semibold text-slate-900 mb-3">Aksi Cepat</p>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors text-left flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}