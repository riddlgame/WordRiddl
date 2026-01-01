import { GoogleGenAI } from "@google/genai";

// FIX: Use `process.env.API_KEY` to resolve the TypeScript error and adhere to the coding guidelines.
const apiKey = process.env.API_KEY;

if (!apiKey) {
  // FIX: Update warning message to refer to API_KEY.
  console.warn("API_KEY environment variable not found. AI features will be disabled.");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const suggestWord = async (): Promise<string | null> => {
  if (!ai) {
    // FIX: Update error message to refer to API_KEY.
    throw new Error("Gemini AI client is not initialized. Please set your API_KEY.");
  }

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Generate a single, common English word that is between 4 and 15 letters long. The word should be suitable for a family-friendly puzzle game. Do not use proper nouns, obscure words, or plurals ending in "s". Return only the word itself in lowercase, with no extra formatting or punctuation.',
    });
    
    const text = response.text?.trim().toLowerCase();
    
    // Basic validation to ensure the result is a single word
    if (text && /^[a-z]+$/.test(text)) {
      return text;
    }
    
    console.error("Received an invalid format from Gemini:", response.text);
    return null;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

export const isWordValid = async (word: string): Promise<boolean> => {
    if (!ai) {
        // If AI is not available, fail open (assume the word is valid) to not block the game.
        console.warn("Gemini client not initialized. Skipping word validation.");
        return true;
    }

    // Basic check to avoid API calls for nonsensical input
    if (!word || word.length < 2) return false;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Is the word "${word}" a legitimate, common English word (not a proper noun)? Answer with only "yes" or "no".`,
        });

        const text = response.text?.trim().toLowerCase();
        return text === 'yes';
    } catch (error) {
        console.error("Error validating word with Gemini API:", error);
        // Fail open: if the API call fails, let the user proceed.
        // This prevents an API outage from breaking the game.
        return true;
    }
}
