import { GoogleGenAI, Type } from "@google/genai";
import { BusinessIdea, UserInput } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });

const businessIdeaSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      name: { type: Type.STRING },
      description: { type: Type.STRING },
      imagePrompt: { type: Type.STRING, description: "Prompt for AI image generation, realistic style" },
      potential: { type: Type.NUMBER },
      location: { type: Type.STRING },
      estimatedProfit: { type: Type.STRING },
      executionSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
      targetMarket: { type: Type.STRING },
      sellingStrategy: { type: Type.STRING },
      tips: { type: Type.ARRAY, items: { type: Type.STRING } },
      feasibilityScore: { type: Type.NUMBER },
      sevenDayPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
      profitSimulation: {
        type: Type.OBJECT,
        properties: {
          sellingPrice: { type: Type.NUMBER },
          targetSales: { type: Type.NUMBER },
          estimatedRevenue: { type: Type.NUMBER },
          estimatedProfit: { type: Type.NUMBER }
        },
        required: ["sellingPrice", "targetSales", "estimatedRevenue", "estimatedProfit"]
      },
      badges: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: [
      "id", "name", "description", "imagePrompt", "potential", "location", 
      "estimatedProfit", "executionSteps", "targetMarket", "sellingStrategy", 
      "tips", "feasibilityScore", "sevenDayPlan", "profitSimulation", "badges"
    ]
  }
};

export async function generateBusinessIdeas(input: UserInput | string): Promise<BusinessIdea[]> {
  const prompt = typeof input === "string" 
    ? `Berikan 5-10 ide bisnis realistis untuk pertanyaan: "${input}".`
    : `Berikan 5-10 ide bisnis realistis dengan kondisi: Modal ${input.modal}, Skill ${input.skill}, Lokasi ${input.location}.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: `Anda adalah Senior Business Strategist. 
      Berikan ide bisnis yang praktis, bukan teori. 
      Fokus pada hasil cepat dan modal kecil sesuai input. 
      Gunakan Bahasa Indonesia yang natural dan persuasif.
      Pastikan estimasi profit logis.
      Badge bisa berupa: "Cepat Balik Modal", "Cocok Pemula", "Laris di Kampung", dll.
      PENTING: imagePrompt HARUS dalam Bahasa Inggris yang deskriptif untuk generator gambar AI (contoh: "A professional photo of a small home-based catering business with traditional Indonesian food").`,
      responseMimeType: "application/json",
      responseSchema: businessIdeaSchema,
    },
  });

  const ideas = JSON.parse(response.text || "[]") as BusinessIdea[];
  
  // Generate images for each idea
  const ideasWithImages = await Promise.all(ideas.map(async (idea) => {
    try {
      const imageUrl = await generateImage(idea.imagePrompt);
      return { ...idea, imageUrl };
    } catch (e) {
      console.warn(`Failed to generate image for ${idea.name}:`, e);
      // Use a more reliable fallback with a relevant keyword
      return { ...idea, imageUrl: `https://picsum.photos/seed/${encodeURIComponent(idea.name)}/800/600` };
    }
  }));

  return ideasWithImages;
}

async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: `${prompt}. High quality, professional commercial photography, realistic style.` }],
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates in response");
    }

    const parts = candidates[0].content?.parts;
    if (!parts) {
      throw new Error("No parts in candidate content");
    }

    for (const part of parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
      if (part.text) {
        console.log("Image model returned text instead of image:", part.text);
      }
    }
    
    throw new Error("No image data found in any part of the response");
  } catch (error) {
    throw error;
  }
}
