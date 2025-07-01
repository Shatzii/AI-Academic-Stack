import Anthropic from "@anthropic-ai/sdk";

// Define language types
type SupportedLanguage = "en" | "es" | "de";

// Define the translation result types
interface TranslationResult {
  translatedContent: string;
  detectedLanguage?: string;
}

interface ExplanationResult {
  explanation: string;
}

// Create the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Helper functions
const getLanguageName = (code: SupportedLanguage): string => {
  const languages: Record<SupportedLanguage, string> = {
    en: "English",
    es: "Spanish",
    de: "German",
  };
  return languages[code];
};

// Language detection patterns
const languagePatterns: Record<string, RegExp[]> = {
  English: [/\b(the|and|is|in|to|a|for|that|this|with|are)\b/gi],
  Spanish: [/\b(el|la|los|las|y|es|en|para|por|que|este|esta|con|son)\b/gi],
  German: [/\b(der|die|das|und|ist|in|zu|ein|eine|für|dass|mit|sind)\b/gi]
};

// Simple language detection function
const detectLanguage = (text: string): string | undefined => {
  let maxScore = 0;
  let detectedLanguage: string | undefined;

  Object.entries(languagePatterns).forEach(([language, patterns]) => {
    let score = 0;
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      score += matches ? matches.length : 0;
    });
    
    // Normalize score by text length
    score = score / text.length;
    
    if (score > maxScore) {
      maxScore = score;
      detectedLanguage = language;
    }
  });

  return detectedLanguage;
};

class TranslationService {
  // Translate content to the target language
  async translate(content: string, targetLanguage: SupportedLanguage): Promise<TranslationResult> {
    try {
      // Detect source language
      const detectedLanguage = detectLanguage(content);
      
      // If the detected language matches the target language, return the original content
      if (
        (detectedLanguage === "English" && targetLanguage === "en") ||
        (detectedLanguage === "Spanish" && targetLanguage === "es") ||
        (detectedLanguage === "German" && targetLanguage === "de")
      ) {
        return {
          translatedContent: content,
          detectedLanguage,
        };
      }
      
      // Prepare the prompt for translation
      const targetLanguageName = getLanguageName(targetLanguage);
      
      const prompt = `
        Translate the following text into ${targetLanguageName}.
        Maintain the original formatting, including newlines and paragraphs.
        Only return the translated text, nothing else.
        
        Text to translate:
        ${content}
      `;
      
      const response = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219", // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      });
      
      return {
        translatedContent: response.content[0].text.trim(),
        detectedLanguage,
      };
    } catch (error) {
      console.error("Translation error:", error);
      throw new Error("Failed to translate content");
    }
  }
  
  // Explain content in simple, parent-friendly terms
  async explainSimply(content: string, targetLanguage: SupportedLanguage): Promise<ExplanationResult> {
    try {
      // Prepare the prompt for explanation
      const targetLanguageName = getLanguageName(targetLanguage);
      
      const prompt = `
        You are helping a parent understand their child's schoolwork.
        Please explain the following academic content or assignment in simple, easy-to-understand language.
        Your explanation should be thorough but accessible to someone who may not be familiar with the subject.
        Respond in ${targetLanguageName}.
        
        Academic content to explain:
        ${content}
      `;
      
      const response = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219", // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      });
      
      return {
        explanation: response.content[0].text.trim(),
      };
    } catch (error) {
      console.error("Explanation error:", error);
      throw new Error("Failed to generate an explanation");
    }
  }
}

export const translationService = new TranslationService();