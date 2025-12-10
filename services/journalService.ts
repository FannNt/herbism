import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp,
    limit
} from "firebase/firestore";

export type JournalEntry = {
    id?: string;
    userId: string;
    plantId: string;
    content: string;
    mood?: string;
    createdAt?: Date;
    plantGrowth?: string;
    imageUrl?: string;
    aiFeedback?: string;
};

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Helper to check if user can create a new entry for a SPECIFIC PLANT
export const canCreateEntry = async (userId: string, plantId: string): Promise<{ allowed: boolean; nextDate?: Date }> => {
    try {
        const q = query(
            collection(db, "journals"),
            where("userId", "==", userId),
            where("plantId", "==", plantId),
            orderBy("createdAt", "desc"),
            limit(1)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return { allowed: true };
        }

        const lastDoc = querySnapshot.docs[0];
        const lastDate = lastDoc.data().createdAt.toDate();
        const now = new Date();
        const diff = now.getTime() - lastDate.getTime();

        if (diff < ONE_WEEK_MS) {
            const nextDate = new Date(lastDate.getTime() + ONE_WEEK_MS);
            return { allowed: false, nextDate };
        }

        return { allowed: true };
    } catch (error) {
        console.error("Error checking journal constraint:", error);
        throw error;
    }
};

// Create a new journal entry
export const createJournalEntry = async (entryData: Omit<JournalEntry, "id" | "createdAt">) => {
    try {
        // Enforce check again on server-side logic equivalent
        const check = await canCreateEntry(entryData.userId, entryData.plantId);
        if (!check.allowed) {
            throw new Error(`Anda baru bisa mengisi jurnal lagi pada ${check.nextDate?.toLocaleDateString("id-ID")}`);
        }

        const docRef = await addDoc(collection(db, "journals"), {
            ...entryData,
            createdAt: Timestamp.now(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating journal entry:", error);
        throw error;
    }
};

// Get all journal entries for a SPECIFIC PLANT
export const getPlantJournalEntries = async (userId: string, plantId: string): Promise<JournalEntry[]> => {
    try {
        const q = query(
            collection(db, "journals"),
            where("userId", "==", userId),
            where("plantId", "==", plantId),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);

        const entries: JournalEntry[] = [];
        querySnapshot.forEach((doc) => {
            entries.push({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
            } as JournalEntry);
        });

        return entries;
    } catch (error) {
        console.error("Error fetching journal entries:", error);
        throw error;
    }
};
