import { generateAiResponse } from "../services/groqService.js";

const supportedActions = [
  "summarize",
  "rewrite_professionally",
  "make_shorter",
  "make_friendlier",
  "translate",
];

const supportedLanguages = ["English", "Hindi", "Spanish", "French", "German", "Japanese"];

export const handleAiAssistant = async (req, res) => {
  try {
    const { action, text, language } = req.body;

    if (!action || typeof action !== "string") {
      return res.status(400).json({ error: "AI action is required." });
    }

    if (!supportedActions.includes(action)) {
      return res.status(400).json({ error: "Unsupported AI action." });
    }

    if (!text || typeof text !== "string" || text.trim() === "") {
      return res.status(400).json({ error: "Message text is required for AI action." });
    }

    if (action === "translate") {
      const targetLanguage = typeof language === "string" && language.trim() !== "" ? language.trim() : "English";
      if (!supportedLanguages.includes(targetLanguage)) {
        return res.status(400).json({ error: "Unsupported language." });
      }

      const result = await generateAiResponse(action, text, targetLanguage);
      return res.status(200).json({ result, language: targetLanguage });
    }

    const result = await generateAiResponse(action, text);
    return res.status(200).json({ result });
  } catch (error) {
    console.error("Error in AI controller:", error);
    const status = error.statusCode || 500;
    const message = error.message || "Failed to generate AI response.";
    return res.status(status).json({ error: message });
  }
};
