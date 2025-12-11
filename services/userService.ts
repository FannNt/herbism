import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
export type UserRole = "user" | "admin" | "planter";

export type User = {
  uid?: string;
  email: string;
  name?: string;
  username?: string;
  city?: string;
  isOnboardingComplete?: boolean;
  role?: UserRole;
  // Data bagian onboarding
  age?: number;
  gender?: "male" | "female";
  region?: string;
  healthCondition?: string[];
  healthGoals?: string[];
  allergies?: string[];
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

  return { uid: snap.id, ...snap.data() } as User;
};

// update data profil
export const updateProfile = async (uid: string, data: Partial<User>) => {
  const userRef = doc(db, "profiles", uid);
  await updateDoc(userRef, data);
};

// selesaikan onboarding user
export const completeOnboarding = async (
  uid: string,
  onboardingData: Partial<User>
) => {
  try {
    const userRef = doc(db, "profiles", uid);
    await updateDoc(userRef, {
      ...onboardingData,
      isOnboardingComplete: true,
    });
    console.log("Onboarding completed and saved to Firestore for:", uid);
  } catch (error) {
    console.error("Error saving onboarding data to Firestore:", error);
    throw error;
  }
};

// dengerin perubahan user realtime
export const listenToUser = (
  uid: string,
  callback: (user: User | null) => void
) => {
  const userRef = doc(db, "profiles", uid);
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      callback({ uid: doc.id, ...doc.data() } as User);
    } else {
      callback(null);
    }
  });
};
