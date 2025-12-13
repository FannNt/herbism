import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const GROQ_API_KEY = process.env.GROQ_API_KEY_MAVERICK;

const SYSTEM_PROMPT = `
Anda adalah ahli botani dan patologi tanaman berpengalaman. Analisis gambar tanaman yang diberikan dan berikan diagnosa penyakit yang akurat dalam format JSON.

Jika tanaman terlihat SEHAT:
{
  "result": {
    "name": "Tanaman Sehat",
    "severity": "Sehat", 
    "description": "Tanaman terlihat sehat, subur, dan tidak menunjukkan tanda-tanda penyakit yang jelas. Daun tampak segar dengan warna yang normal.",
    "solutions": [
      "Pertahankan jadwal penyiraman yang teratur",
      "Pastikan tanaman mendapat sinar matahari yang cukup",
      "Berikan pupuk organik secara berkala untuk menjaga nutrisi tanah"
    ],
    "care": {
      "water": "Sesuaikan dengan jenis tanaman",
      "sun": "Sesuaikan dengan jenis tanaman"
    }
  }
}

Jika tanaman SAKIT/TERSERANG HAMA:
{
  "result": {
    "name": "Nama Penyakit (Bahasa Indonesia)",
    "severity": "Ringan/Sedang/Berat",
    "description": "Penjelasan detail mengenai penyakit, penyebabnya (jamur/bakteri/virus/hama), dan gejala yang terlihat pada gambar.",
    "solutions": [
      "Langkah penanganan 1 (spesifik & actionable)",
      "Langkah penanganan 2",
      "Langkah pencegahan di masa depan"
    ],
    "care": {
      "water": "Saran penyiraman selama sakit (misal: kurangi kelembaban)",
      "sun": "Saran pencahayaan (misal: isolasi dari tanaman lain)"
    }
  }
}

PENTING:
1. Respon MURNI JSON tanpa markdown formatting
2. Gunakan Bahasa Indonesia yang baik dan benar
3. Berikan solusi yang praktis dan bisa dilakukan di rumah
4. Jika gambar tidak jelas atau bukan tanaman, berikan respon error yang sopan dalam field "error"
`;

export async function POST(req: NextRequest) {
    try {
        const { image } = await req.json();

        if (!image) {
            return NextResponse.json(
                { error: "Image data is required" },
                { status: 400 }
            );
        }

        if (!GROQ_API_KEY) {
            console.error("GROQ_API_KEY_MAVERICK is not set");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "meta-llama/llama-4-maverick-17b-128e-instruct",
                messages: [
                    {
                        role: "system",
                        content: SYSTEM_PROMPT,
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Analisis tanaman di gambar ini untuk mendeteksi penyakit.",
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: image,
                                },
                            },
                        ],
                    },
                ],
                temperature: 0.5,
                max_tokens: 1000,
                response_format: { type: "json_object" },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("GROQ API Error:", errorText);

            let errorMessage = `GROQ API Error: ${response.status} ${response.statusText}`;
            try {
                const errorJson = JSON.parse(errorText);
                if (errorJson.error && errorJson.error.message) {
                    errorMessage = errorJson.error.message;
                }
            } catch (e) {
                // ignore parse error uses raw text
                errorMessage += ` - ${errorText.substring(0, 100)}`;
            }

            return NextResponse.json(
                { error: errorMessage },
                { status: response.status }
            );
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) {
            return NextResponse.json(
                { error: "No analysis result generated" },
                { status: 500 }
            );
        }

        try {
            const parsedResult = JSON.parse(content);
            return NextResponse.json(parsedResult);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError, content);
            return NextResponse.json(
                { error: "Failed to parse API response", raw: content },
                { status: 500 }
            );
        }

    } catch (error: any) {
        console.error("Internal Server Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
