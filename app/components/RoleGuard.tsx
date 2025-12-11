"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { UserRole } from "@/services/userService";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

export default function RoleGuard({ 
  children, 
  allowedRoles, 
  fallbackPath = "/" 
}: RoleGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If not logged in, redirect to login
      if (!user) {
        router.push("/login");
        return;
      }

      // Check if user has required role
      const userRole = user.role || "user";
      
      // Admin can access everything
      if (userRole === "admin") {
        return;
      }

      // Check if user's role is in allowed roles
      if (!allowedRoles.includes(userRole)) {
        router.push(fallbackPath);
      }
    }
  }, [user, loading, allowedRoles, router, fallbackPath]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-500 text-sm">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  // If not logged in, show nothing (will redirect)
  if (!user) {
    return null;
  }

  // Check role access
  const userRole = user.role || "user";
  
  // Admin can access everything
  if (userRole === "admin") {
    return <>{children}</>;
  }

  // Check if user's role is in allowed roles
  if (!allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-12 shadow-xl text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center"
          >
            <Lock className="w-12 h-12 text-red-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Akses Ditolak</h2>
          <p className="text-slate-600 mb-6">
            Anda tidak memiliki izin untuk mengakses halaman ini.
            {allowedRoles.includes("admin") && (
              <span className="block mt-2 text-sm text-slate-500">
                Halaman ini hanya untuk Admin.
              </span>
            )}
            {allowedRoles.includes("planter") && !allowedRoles.includes("admin") && (
              <span className="block mt-2 text-sm text-slate-500">
                Halaman ini hanya untuk Planter.
              </span>
            )}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium shadow-lg hover:bg-emerald-600 transition-colors"
          >
            Kembali ke Beranda
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}

// Specific guard components for easier use
export function AdminGuard({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["admin"]} fallbackPath="/">
      {children}
    </RoleGuard>
  );
}

export function PlanterGuard({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["planter", "admin"]} fallbackPath="/">
      {children}
    </RoleGuard>
  );
}

export function AuthGuard({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["user", "planter", "admin"]} fallbackPath="/login">
      {children}
    </RoleGuard>
  );
}
