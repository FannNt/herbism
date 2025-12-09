import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    Timestamp
} from "firebase/firestore";

export type SavedRecipe = {
    id?: string;
    userId: string;
    title: string;
    ingredients: string[];
    steps: string[];
    purpose: string; // "kesimpulan obatnya untuk apa" / cure
    createdAt?: Date;
};

// Save a recipe
export const saveRecipe = async (recipeData: Omit<SavedRecipe, "id" | "createdAt">) => {
    try {
        const docRef = await addDoc(collection(db, "saved_recipes"), {
            ...recipeData,
            createdAt: Timestamp.now(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error saving recipe:", error);
        throw error;
    }
};

// Get saved recipes for a user
export const getUserRecipes = async (userId: string): Promise<SavedRecipe[]> => {
    try {
        const q = query(
            collection(db, "saved_recipes"),
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);

        const recipes: SavedRecipe[] = [];
        querySnapshot.forEach((doc) => {
            recipes.push({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
            } as SavedRecipe);
        });

        return recipes;
    } catch (error) {
        console.error("Error fetching recipes:", error);
        throw error;
    }
};

// Delete a saved recipe
export const deleteRecipe = async (recipeId: string) => {
    try {
        await deleteDoc(doc(db, "saved_recipes", recipeId));
    } catch (error) {
        console.error("Error deleting recipe:", error);
        throw error;
    }
};
