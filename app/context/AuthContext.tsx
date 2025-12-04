"use client";

import { onUserChanged } from "@/services/authService";
import { findUser, User } from "@/services/userService";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // listen for Firebase auth changes
    const unsubscribe = onUserChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setLoading(true);

        const activeUser = await findUser(firebaseUser.uid);
        console.log(activeUser);

        setUser(activeUser);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // cek kalo user blom onboarding
  useEffect(() => {
    if (!loading && user) {
      // Routing 
      const publicRoutes = ['/login', '/register'];
      const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route));
      const isOnOnboardingPage = pathname?.startsWith('/onboarding');

      // cek kalo user kelar onboarding routing ke homepage
      if (isOnOnboardingPage && user.isOnboardingComplete === true) {
        console.log("User already completed onboarding, redirecting to home...");
        router.push('/');
        return;
      }


       // cek kalo user blom kelar onboarding
      if (!isPublicRoute && !isOnOnboardingPage && user.isOnboardingComplete !== true) {
        console.log("User hasn't completed onboarding, redirecting...");
        console.log("isOnboardingComplete value:", user.isOnboardingComplete);
        router.push('/onboarding');
      }
    }
  }, [user, loading, pathname, router]);

  useEffect(() => {
    console.log("User updated:", user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
