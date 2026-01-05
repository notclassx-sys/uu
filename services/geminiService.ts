
import { GoogleGenAI } from "@google/genai";

// Safely access process.env to prevent ReferenceErrors during deployment
const getApiKey = () => {
  try {
    return typeof process !== 'undefined' ? process.env?.API_KEY : undefined;
  } catch (e) {
    return undefined;
  }
};

const apiKey = getApiKey();
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getStudyBuddyAdvice = async (taskDescription: string) => {
  if (!ai) {
    return "I'm here to help you crush your exams, isneha! Try breaking this topic into smaller chunks and reviewing the key formulas.";
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a helpful study buddy for isneha. She is working on: "${taskDescription}". Give her 3 quick, effective study tips or a brief explanation of this topic to help her master it. Keep it encouraging and concise.`,
    });
    return response.text || "Focus on the basics and keep practicing! You've got this.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm here to help you master this! Try breaking it down into smaller parts and checking the basics first.";
  }
};
