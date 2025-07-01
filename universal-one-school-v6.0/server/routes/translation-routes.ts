import { Router } from "express";
import { z } from "zod";
import { translationService } from "../services/translation-service";

const router = Router();

// Define validation schemas
const translateSchema = z.object({
  content: z.string().min(1, "Content is required"),
  targetLanguage: z.enum(["en", "es", "de"])
});

const explainSchema = z.object({
  content: z.string().min(1, "Content is required"),
  targetLanguage: z.enum(["en", "es", "de"])
});

// Translate text
router.post("/translate", async (req, res) => {
  try {
    const { content, targetLanguage } = translateSchema.parse(req.body);
    
    const result = await translationService.translate(content, targetLanguage);
    
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    
    console.error("Translation error:", error);
    res.status(500).json({ message: "Failed to translate content" });
  }
});

// Explain content in simple terms
router.post("/translate/explain", async (req, res) => {
  try {
    const { content, targetLanguage } = explainSchema.parse(req.body);
    
    const result = await translationService.explainSimply(content, targetLanguage);
    
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    
    console.error("Explanation error:", error);
    res.status(500).json({ message: "Failed to explain content" });
  }
});

export default router;