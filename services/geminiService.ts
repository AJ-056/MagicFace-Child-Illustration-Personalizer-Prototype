
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

function parseDataUrl(dataUrl: string) {
  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
    return { mimeType: 'image/png', data: dataUrl };
  }
  return { mimeType: matches[1], data: matches[2] };
}

export async function personalizeIllustration(
  userPhotoBase64: string, 
  baseIllustrationInput: string,
  modelName: 'gemini-2.5-flash-image' | 'gemini-3-pro-image-preview' = 'gemini-2.5-flash-image'
): Promise<string> {
  // Always initialize with the latest key from process.env (updated by the key selector)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const userPhotoParsed = parseDataUrl(userPhotoBase64);
  let baseImgData: string;
  let baseImgMime: string;

  if (baseIllustrationInput.startsWith('data:')) {
    const parsed = parseDataUrl(baseIllustrationInput);
    baseImgData = parsed.data;
    baseImgMime = parsed.mimeType;
  } else {
    baseImgData = baseIllustrationInput;
    baseImgMime = 'image/png';
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          { text: "STYLE REFERENCE IMAGE:" },
          { inlineData: { data: baseImgData, mimeType: baseImgMime } },
          { text: "IDENTITY PHOTO:" },
          { inlineData: { data: userPhotoParsed.data, mimeType: userPhotoParsed.mimeType } },
          { text: SYSTEM_PROMPT }
        ]
      },
      config: {
        imageConfig: { 
          aspectRatio: "1:1",
          ...(modelName === 'gemini-3-pro-image-preview' ? { imageSize: "1K" } : {})
        }
      }
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    
    if (imagePart && imagePart.inlineData) {
      return `data:image/png;base64,${imagePart.inlineData.data}`;
    }

    throw new Error("The AI model did not return an image. It might have been blocked by safety filters.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Check for the specific "Limit 0" error which indicates Free Tier restrictions
    if (error.message?.includes('limit: 0') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error("QUOTA_LIMIT_ZERO");
    }
    
    throw error;
  }
}
