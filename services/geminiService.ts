import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export interface PlantAIData {
    isValid: boolean;
    validationMessage?: string;
    wateringSchedule?: string;
    fertilizingSchedule?: string;
    specialCare?: string[];
}

export interface UserContext {
    experienceLevel?: "beginner" | "intermediate" | "expert";
    healthCondition?: string[];
    healthGoals?: string[];
    allergies?: string[];
}

export async function validateAndGeneratePlantData(
    plantName: string,
    plantType: string,
    userContext?: UserContext
): Promise<PlantAIData> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Build user context description
        let userContextDescription = "";
        if (userContext) {
            if (userContext.experienceLevel) {
                const levelMap = {
                    beginner: "pemula yang baru mengenal tanaman herbal",
                    intermediate: "tingkat menengah dengan pengalaman berkebun",
                    expert: "ahli dengan pengalaman luas dalam tanaman herbal"
                };
                userContextDescription += `\nTingkat Pengalaman User: ${levelMap[userContext.experienceLevel]}`;
            }
            if (userContext.healthCondition && userContext.healthCondition.length > 0) {
                userContextDescription += `\nKondisi Kesehatan User: ${userContext.healthCondition.join(", ")}`;
            }
            if (userContext.healthGoals && userContext.healthGoals.length > 0) {
                userContextDescription += `\nTujuan Kesehatan User: ${userContext.healthGoals.join(", ")}`;
            }
            if (userContext.allergies && userContext.allergies.length > 0) {
                userContextDescription += `\nAlergi User: ${userContext.allergies.join(", ")}`;
            }
        }

        const prompt = `Kamu adalah ahli botani dan berkebun. Analisis tanaman berikut:

Nama Tanaman: ${plantName}
Jenis yang Diklaim: ${plantType}
${userContextDescription}

Tugas:
1. Validasi apakah "${plantType}" adalah jenis tanaman yang benar-benar ada (bukan objek palsu seperti batu, besi, dll).
2. Jika valid, berikan rekomendasi perawatan dalam format JSON berikut:

{
  "isValid": true,
  "wateringSchedule": "berapa kali sehari tanaman ini perlu disiram (contoh: '2 kali sehari' atau '1 kali sehari')",
  "fertilizingSchedule": "berapa kali sebulan tanaman ini perlu dipupuk (contoh: '2 kali sebulan' atau '1 kali sebulan')",
  "specialCare": ["array of string berisi 2-3 tips perawatan khusus untuk tanaman ini"]
}

3. Jika TIDAK valid (bukan tanaman), kembalikan:

{
  "isValid": false,
  "validationMessage": "Penjelasan singkat mengapa ini bukan tanaman yang valid"
}

PENTING: 
- Hanya kembalikan JSON murni tanpa markdown atau formatting tambahan
- Pastikan semua nilai dalam bahasa Indonesia
- wateringSchedule dan fertilizingSchedule harus berupa string yang jelas (contoh: "2 kali sehari", "3 kali sebulan")
- specialCare harus array of string dengan 2-3 tips praktis
- SESUAIKAN tingkat detail dan bahasa dengan tingkat pengalaman user:
  * Pemula: Berikan instruksi yang sangat detail dan mudah dipahami
  * Menengah: Berikan instruksi yang cukup detail dengan beberapa tips tambahan
  * Ahli: Berikan instruksi yang ringkas dan fokus pada hal-hal penting
- Jika ada kondisi kesehatan atau tujuan kesehatan user, pertimbangkan dalam memberikan tips perawatan khusus
- Jika ada alergi user, WAJIB peringatkan jika tanaman ini bisa menyebabkan reaksi alergi`;

        // Retry configuration
        const MAX_RETRIES = 3;
        const INITIAL_DELAY = 1000; // 1 second

        let lastError;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                // Clean up the response to extract JSON
                let jsonText = text.trim();

                // Remove markdown code blocks if present
                jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

                // Parse the JSON response
                const aiData: PlantAIData = JSON.parse(jsonText);

                return aiData;
            } catch (error: any) {
                console.warn(`Attempt ${attempt} failed:`, error.message);
                lastError = error;

                // Check if it's a 503 error or overload error
                const isOverloaded = error.message.includes('503') || error.message.includes('overloaded');

                if (isOverloaded && attempt < MAX_RETRIES) {
                    // Exponential backoff
                    const delay = INITIAL_DELAY * Math.pow(2, attempt - 1);
                    console.log(`Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }

                // If it's not a retryable error or we've exhausted retries, break loop
                break;
            }
        }

        // If we get here, all retries failed
        console.error("All retry attempts failed:", lastError);
        throw new Error("Layanan AI sedang sibuk. Mohon tunggu sebentar dan coba lagi.");
    } catch (error: any) {
        console.error("Error calling Gemini AI:", error);
        // Preserve the specific overload error message if that's what we threw above
        if (error.message.includes("Layanan AI sedang sibuk")) {
            throw error;
        }
        throw new Error("Gagal memvalidasi tanaman dengan AI. Silakan coba lagi.");
    }
}
