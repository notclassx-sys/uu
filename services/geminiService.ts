
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client with the environment variable API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStudyBuddyAdvice = async (taskDescription: string) => {
  try {
    // Using gemini-3-flash-preview for basic study assistance task as recommended
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a helpful study buddy for isneha. She is working on: "${taskDescription}". Give her 3 quick, effective study tips or a brief explanation of this topic to help her master it. Keep it encouraging and concise.`,
    });
    // The .text property is a getter that directly returns the generated string
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm here to help you crush your exams! Try breaking this topic into smaller chunks and reviewing the key formulas.";
  }
};
