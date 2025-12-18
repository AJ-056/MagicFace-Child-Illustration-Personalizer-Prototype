
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

/**
 * Extracts the base64 data and the mime type from a data URL
 */
function parseDataUrl(dataUrl: string) {
  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
    return { mimeType: 'image/png', data: dataUrl };
  }
  return { mimeType: matches[1], data: matches[2] };
}

export async function personalizeIllustration(userPhotoBase64: string, baseIllustrationInput: string): Promise<string> {
  // Use casting to satisfy tsc during the build phase; Vite will handle the actual replacement
  const apiKey = (process.env as any).API_KEY;
  const ai = new GoogleGenAI({ apiKey });
  
  // 1. Process Identity Photo
  const userPhotoParsed = parseDataUrl(userPhotoBase64);
  
  // 2. Process Style Reference
  let baseImgData: string;
  let baseImgMime: string;

  // If the input is already a data URL (base64), we don't need to fetch it
  if (baseIllustrationInput.startsWith('data:')) {
    const parsed = parseDataUrl(baseIllustrationInput);
    baseImgData = parsed.data;
    baseImgMime = parsed.mimeType;
  } else if (baseIllustrationInput.startsWith('http')) {
    try {
      const responseBase = await fetch(baseIllustrationInput);
      if (!responseBase.ok) throw new Error(`Status ${responseBase.status}`);
      const blobBase = await responseBase.blob();
      const baseIllustrationBase64 = await blobToBase64(blobBase);
      const parsed = parseDataUrl(baseIllustrationBase64);
      baseImgData = parsed.data;
      baseImgMime = parsed.mimeType;
    } catch (err: any) {
      console.error("Fetch Error:", err);
      throw new Error(`Could not load the style reference: ${err.message}. Try uploading a style image directly.`);
    }
  } else {
    // Fallback if it's just raw base64
    baseImgData = baseIllustrationInput;
    baseImgMime = 'image/png';
  }

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: "STYLE REFERENCE IMAGE (Follow this artistic style, lighting, and texture):" },
          {
            inlineData: {
              data: baseImgData,
              mimeType: baseImgMime
            }
          },
          { text: "IDENTITY PHOTO (Analyze this child's face and gender to personalize the character):" },
          {
            inlineData: {
              data: userPhotoParsed.data,
              mimeType: userPhotoParsed.mimeType
            }
          },
          { text: SYSTEM_PROMPT }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    // Use optional chaining for the find method to satisfy TS
    const imagePart = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    
    if (imagePart && imagePart.inlineData) {
      return `data:image/png;base64,${imagePart.inlineData.data}`;
    }

    throw new Error("The AI model did not return an image. This can happen if the photos are too complex or triggered a safety filter.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes('400')) {
        throw new Error("The AI model couldn't process these specific images. Try using a simpler, clear photo of the child's face.");
    }
    throw error;
  }
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
