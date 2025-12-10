import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { image, type } = await request.json()

        if (!image) {
            return NextResponse.json(
                { error: 'Image is required' },
                { status: 400 }
            )
        }

        const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.GROQ_API_KEY_MAVERICK

        if (!GROQ_API_KEY) {
            console.error('GROQ_API_KEY is not set')
            return NextResponse.json(
                { error: 'GROQ API key is not configured' },
                { status: 500 }
            )
        }

        // Ensure image has proper data URL format
        let imageUrl = image
        if (!image.startsWith('data:')) {
            // If it's just base64 without prefix, add it
            imageUrl = `data:image/jpeg;base64,${image}`
        }

        // Determine the prompt based on the type
        let systemPrompt = ''
        let userPrompt = ''

        if (type === 'disease') {
            systemPrompt = `Kamu adalah ahli tanaman herbal yang berpengalaman. Tugas kamu adalah menganalisis gambar tanaman dan mendeteksi penyakit atau masalah kesehatan pada tanaman tersebut.

Berikan response dalam format JSON yang valid dengan struktur berikut:
{
  "name": "Nama penyakit yang terdeteksi",
  "severity": "Tingkat keparahan (Ringan/Sedang/Parah)",
  "description": "Deskripsi singkat tentang penyakit ini",
  "solutions": ["Solusi 1", "Solusi 2", "Solusi 3", "Solusi 4"],
  "care": {
    "water": "Tips penyiraman yang tepat",
    "sun": "Tips pencahayaan yang tepat"
  }
}

PENTING: Berikan HANYA JSON tanpa markdown code blocks atau penjelasan tambahan.`

            userPrompt = `Analisis gambar tanaman ini dan deteksi penyakit atau masalah yang ada. Berikan diagnosa lengkap dengan solusi perawatannya dalam Bahasa Indonesia.`

        } else if (type === 'benefit') {
            systemPrompt = `Kamu adalah ahli tanaman herbal dan jamu tradisional Indonesia yang berpengalaman. Tugas kamu adalah mengidentifikasi tanaman herbal dari gambar dan memberikan informasi lengkap tentang manfaat kesehatannya.

Berikan response dalam format JSON yang valid dengan struktur berikut:
{
  "name": "Nama tanaman dalam Bahasa Indonesia",
  "scientificName": "Nama ilmiah/latin tanaman",
  "category": "Kategori tanaman (misalnya: Rimpang, Daun, Buah, dll)",
  "description": "Deskripsi lengkap tentang tanaman ini",
  "benefits": [
    {
      "icon": "Shield",
      "title": "Judul manfaat",
      "description": "Deskripsi manfaat",
      "color": "emerald"
    }
  ],
  "usage": [
    {
      "title": "Cara penggunaan 1",
      "description": "Deskripsi cara penggunaan"
    }
  ],
  "nutrition": [
    {
      "name": "Nama nutrisi",
      "value": "Nilai/kadar"
    }
  ],
  "warnings": ["Peringatan 1", "Peringatan 2"]
}

Untuk field "icon", gunakan salah satu dari: Shield, Thermometer, Apple, Zap, Heart, Brain, Leaf, Flower2, Wind, Droplets.
Untuk field "color", gunakan salah satu dari: emerald, orange, green, yellow, red, purple, blue.
Berikan minimal 4-6 manfaat, 3-4 cara penggunaan, 4-6 nutrisi, dan 2-3 peringatan.

PENTING: Berikan HANYA JSON tanpa markdown code blocks atau penjelasan tambahan.`

            userPrompt = `Identifikasi tanaman herbal dalam gambar ini dan berikan informasi lengkap tentang manfaat kesehatan, cara penggunaan, kandungan nutrisi, dan peringatan penggunaannya dalam Bahasa Indonesia.`
        } else {
            return NextResponse.json(
                { error: 'Invalid type. Use "disease" or "benefit"' },
                { status: 400 }
            )
        }

        console.log('Calling GROQ API with model: meta-llama/llama-4-scout-17b-16e-instruct')
        console.log('Image URL prefix:', imageUrl.substring(0, 50) + '...')

        // Call GROQ API with vision capabilities
        // Using Llama 4 Scout - the latest recommended vision model
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-4-scout-17b-16e-instruct',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: `${systemPrompt}\n\n${userPrompt}`
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: imageUrl
                                }
                            }
                        ]
                    }
                ],
                temperature: 0.7,
                max_tokens: 2048,
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('GROQ API Error Status:', response.status)
            console.error('GROQ API Error Response:', errorText)

            let errorMessage = 'Failed to analyze image'
            try {
                const errorJson = JSON.parse(errorText)
                errorMessage = errorJson.error?.message || errorJson.error || errorMessage
            } catch {
                errorMessage = errorText || errorMessage
            }

            return NextResponse.json(
                { error: errorMessage },
                { status: response.status }
            )
        }

        const data = await response.json()
        const content = data.choices?.[0]?.message?.content

        if (!content) {
            return NextResponse.json(
                { error: 'No response from AI' },
                { status: 500 }
            )
        }

        // Parse the JSON response
        try {
            // Clean up the response in case it has markdown code blocks
            let cleanContent = content.trim()
            if (cleanContent.startsWith('```json')) {
                cleanContent = cleanContent.slice(7)
            } else if (cleanContent.startsWith('```')) {
                cleanContent = cleanContent.slice(3)
            }
            if (cleanContent.endsWith('```')) {
                cleanContent = cleanContent.slice(0, -3)
            }
            cleanContent = cleanContent.trim()

            const result = JSON.parse(cleanContent)
            return NextResponse.json({ result })
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError, 'Content:', content)
            return NextResponse.json(
                { error: 'Failed to parse AI response', rawContent: content },
                { status: 500 }
            )
        }

    } catch (error) {
        console.error('Error in plant analysis:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
