import { db } from "@/lib/firebase";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    orderBy,
    onSnapshot,
    serverTimestamp,
    Timestamp
} from "firebase/firestore";

// Types for Planter Registration
export interface PlanterRegistration {
    id?: string;
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    idNumber: string;
    address: string;
    city: string;
    province: string;
    experience: string;
    specialization: string[];
    customPlants: string[]; // Plants they can grow (custom input)
    landSize: string;
    certifications: string;
    bio: string;
    idCardPhotoUrl?: string;
    profilePhotoUrl?: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: Timestamp;
    reviewedAt?: Timestamp;
    reviewedBy?: string;
    reviewNote?: string;
}

// Types for Planter Product (Sales)
export interface PlanterProduct {
    id?: string;
    planterId: string;
    planterName: string;
    planterLocation: string;
    plantName: string;
    description: string;
    pricePerUnit: number;
    unit: string; // gram, kg, pcs, etc
    stock: number;
    imageUrl?: string;
    category: string;
    isAvailable: boolean;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
}

// Types for Orders
export interface PlanterOrder {
    id?: string;
    orderId: string;
    productId: string;
    planterId: string;
    buyerId: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    buyerAddress: string;
    productName: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed';
    createdAt: Timestamp;
    updatedAt?: Timestamp;
    notes?: string;
}

// Submit Planter Registration
export const submitPlanterRegistration = async (
    userId: string,
    data: Omit<PlanterRegistration, 'id' | 'userId' | 'status' | 'submittedAt'>
): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, "planterRegistrations"), {
            ...data,
            userId,
            status: 'pending',
            submittedAt: serverTimestamp(),
        });
        console.log("Planter registration submitted:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error submitting planter registration:", error);
        throw error;
    }
};

// Get All Pending Registrations (for Admin)
export const getPendingRegistrations = async (): Promise<PlanterRegistration[]> => {
    try {
        const q = query(
            collection(db, "planterRegistrations"),
            where("status", "==", "pending"),
            orderBy("submittedAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as PlanterRegistration[];
    } catch (error) {
        console.error("Error fetching pending registrations:", error);
        return [];
    }
};

// Get All Registrations (for Admin)
export const getAllRegistrations = async (): Promise<PlanterRegistration[]> => {
    try {
        const q = query(
            collection(db, "planterRegistrations"),
            orderBy("submittedAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as PlanterRegistration[];
    } catch (error) {
        console.error("Error fetching all registrations:", error);
        return [];
    }
};

// Get All approved Registrations (for public WirelessPlant page)
export const getApprovedPlanters = async (): Promise<PlanterRegistration[]> => {
    try {
        const q = query(
            collection(db, "planterRegistrations"),
            where("status", "==", "approved"),
            orderBy("reviewedAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as PlanterRegistration[];
    } catch (error) {
        console.error("Error fetching approved planters:", error);
        return [];
    }
};

// Approve Planter Registration (Admin)
export const approvePlanterRegistration = async (
    registrationId: string,
    adminId: string,
    userId: string
): Promise<void> => {
    try {
        // Update registration status
        await updateDoc(doc(db, "planterRegistrations", registrationId), {
            status: 'approved',
            reviewedAt: serverTimestamp(),
            reviewedBy: adminId,
        });

        // Update user role to planter
        await updateDoc(doc(db, "profiles", userId), {
            role: 'planter',
        });

        console.log("Planter registration approved:", registrationId);
    } catch (error) {
        console.error("Error approving planter registration:", error);
        throw error;
    }
};

// Reject Planter Registration (Admin)
export const rejectPlanterRegistration = async (
    registrationId: string,
    adminId: string,
    reviewNote: string
): Promise<void> => {
    try {
        await updateDoc(doc(db, "planterRegistrations", registrationId), {
            status: 'rejected',
            reviewedAt: serverTimestamp(),
            reviewedBy: adminId,
            reviewNote,
        });
        console.log("Planter registration rejected:", registrationId);
    } catch (error) {
        console.error("Error rejecting planter registration:", error);
        throw error;
    }
};

// Add Product (Planter)
export const addPlanterProduct = async (
    data: Omit<PlanterProduct, 'id' | 'createdAt'>
): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, "planterProducts"), {
            ...data,
            createdAt: serverTimestamp(),
        });
        console.log("Product added:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
};

// Get Planter Products
export const getPlanterProducts = async (planterId: string): Promise<PlanterProduct[]> => {
    try {
        const q = query(
            collection(db, "planterProducts"),
            where("planterId", "==", planterId),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as PlanterProduct[];
    } catch (error) {
        console.error("Error fetching planter products:", error);
        return [];
    }
};

// Get All Available Products (for Wireless Plant page)
export const getAllAvailableProducts = async (): Promise<PlanterProduct[]> => {
    try {
        const q = query(
            collection(db, "planterProducts"),
            where("isAvailable", "==", true),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as PlanterProduct[];
    } catch (error) {
        console.error("Error fetching all products:", error);
        return [];
    }
};

// Get Planter Orders
export const getPlanterOrders = async (planterId: string): Promise<PlanterOrder[]> => {
    try {
        const q = query(
            collection(db, "planterOrders"),
            where("planterId", "==", planterId),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as PlanterOrder[];
    } catch (error) {
        console.error("Error fetching planter orders:", error);
        return [];
    }
};

// Update Order Status (Planter)
export const updateOrderStatus = async (
    orderId: string,
    status: PlanterOrder['status']
): Promise<void> => {
    try {
        await updateDoc(doc(db, "planterOrders", orderId), {
            status,
            updatedAt: serverTimestamp(),
        });
        console.log("Order status updated:", orderId);
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
};

// Listen to Orders in Real-time (for Planter Dashboard)
export const listenToPlanterOrders = (
    planterId: string,
    callback: (orders: PlanterOrder[]) => void
) => {
    const q = query(
        collection(db, "planterOrders"),
        where("planterId", "==", planterId),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as PlanterOrder[];
        callback(orders);
    });
};

// Get User Registration Status
export const getUserRegistrationStatus = async (userId: string): Promise<PlanterRegistration | null> => {
    try {
        const q = query(
            collection(db, "planterRegistrations"),
            where("userId", "==", userId)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data()
        } as PlanterRegistration;
    } catch (error) {
        console.error("Error fetching registration status:", error);
        return null;
    }
};
// Types for Planter Chat
export interface PlanterChat {
    id: string; // roomId
    userId: string; // buyerId
    userName: string;
    userEmail: string;
    planterId: string;
    planterName: string;
    lastMessageAt: Timestamp;
    createdAt: Timestamp;
}

// Get Planter Chats
export const getPlanterChats = async (planterId: string): Promise<PlanterChat[]> => {
    try {
        const q = query(
            collection(db, "planterChats"),
            where("planterId", "==", planterId),
            orderBy("lastMessageAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as PlanterChat[];
    } catch (error) {
        console.error("Error fetching planter chats:", error);
        return [];
    }
};
