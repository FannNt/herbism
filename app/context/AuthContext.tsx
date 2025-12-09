"use client";

import { onUserChanged } from "@/services/authService";
import { findUser, User, listenToUser, createProfile } from "@/services/userService";
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // listen for Firebase auth changes
    const unsubscribe = onUserChanged((firebaseUser) => {
      if (firebaseUser) {
        setIsAuthenticated(true);
        setLoading(true);

        // Subscribe to user profile changes
        const unsubscribeProfile = listenToUser(firebaseUser.uid, async (activeUser) => {
          if (activeUser === null) {
            console.log("Profile missing for user, creating now...");
            // Create profile if it doesn't exist (self-healing)
            await createProfile(firebaseUser.uid, firebaseUser.email || "");
            return;
          }
          console.log("Real-time user update:", activeUser);
          setUser(activeUser);
          setLoading(false);
        });

        return () => unsubscribeProfile();
      } else {
        console.log("User logged out");
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle routing based on auth state
  useEffect(() => {
    if (!loading) {
      const isAuthPage = ['/login', '/register'].some(route => pathname?.startsWith(route));
      const isOnboardingPage = pathname?.startsWith('/onboarding');
      const isDebugPage = pathname?.startsWith('/debug');

      if (user) {
        if (user.isOnboardingComplete) {
          // User is fully active, redirect away from auth/onboarding pages
          if (isOnboardingPage || isAuthPage) {
            console.log("User completed onboarding, redirecting to home...");
            router.push('/profile');
          }
        } else {
          // User needs onboarding, force them to onboarding page
          if (!isOnboardingPage && !isDebugPage) {
            console.log("User needs onboarding, redirecting to /onboarding...");
            router.push('/onboarding');
          }
        }
      } else {
        // No user profile
        if (!isAuthenticated) {
          // Guest user
          if (isOnboardingPage) {
            console.log("Guest user on onboarding page, redirecting to login...");
            router.push('/login');
          }
        }
      }
    }
  }, [user, loading, pathname, router, isAuthenticated]);

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
