import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DetectedItem } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const detectObjectsInImage = async (base64Image: string, mimeType: string): Promise<DetectedItem[]> => {
  // Use gemini-3-flash-preview for multimodal analysis with structured output
  const model = "gemini-3-flash-preview";

  const schema: Schema = {
    type: Type.ARRAY,
    description: "List of detected items with their bounding boxes.",
    items: {
      type: Type.OBJECT,
      properties: {
        label: {
          type: Type.STRING,
          description: "A short label for the object (e.g., 'House Stamp', 'Star Stamp').",
        },
        box_2d: {
          type: Type.ARRAY,
          description: "Bounding box coordinates [ymin, xmin, ymax, xmax] on a scale of 0 to 1000.",
          items: { type: Type.NUMBER },
        },
      },
      required: ["label", "box_2d"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: `Analyze this image and identify all individual distinct items (such as stamps, cards, coins, or photos) arranged in it.
            
            Return a JSON array.
            For each item:
            1. Provide a short 'label'.
            2. Provide the 'box_2d' bounding box as [ymin, xmin, ymax, xmax] using a 0-1000 scale relative to the image dimensions.
            
            Strictly follow the JSON schema. Ensure bounding boxes are accurate and do not unnecessarily overlap.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.1, // Low temperature for consistency
      },
    });

    let text = response.text;
    if (!text) {
        console.warn("Gemini returned empty text response");
        return [];
    }
    
    // Clean up potential markdown formatting (e.g. ```json ... ```)
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(text);
    
    // Add unique IDs
    return data.map((item: any, index: number) => ({
      ...item,
      id: `item-${index}-${Date.now()}`,
    }));

  } catch (error) {
    console.error("Gemini Detection Error:", error);
    throw new Error("Failed to detect objects. The AI model could not process the image.");
  }
};