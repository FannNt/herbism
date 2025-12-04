import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
export type User = {
  email: string;
  name?: string;
  username?: string;
  city?: string;
  isOnboardingComplete?: boolean;
  // Data bagian onboarding
  age?: number;
  gender?: "male" | "female";
  region?: string;
  healthCondition?: string;
  healthGoals?: string;
  allergies?: string;
  experienceLevel?: "beginner" | "intermediate" | "expert";
};

// user profil baru
export const createProfile = async (uid: string, email: string) => {
  await setDoc(doc(db, "profiles", uid), {
    email,
    isOnboardingComplete: false,
  });
};

// nyari user dari UID
export const findUser = async (uid: string) => {
  const userRef = doc(db, "profiles", uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) return null;

  return snap.data() as User;
};

// update data profil
export const updateProfile = async (uid: string, data: Partial<User>) => {
  const userRef = doc(db, "profiles", uid);
  await updateDoc(userRef, data);
};

// selesaikan onboarding user
export const completeOnboarding = async (uid: string, onboardingData: Partial<User>) => {
  const userRef = doc(db, "profiles", uid);
  await updateDoc(userRef, {
    ...onboardingData,
    isOnboardingComplete: true,
  });
};
