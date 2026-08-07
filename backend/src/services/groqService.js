import Groq, {
  APIError,
  AuthenticationError,
  RateLimitError,
  APIConnectionError,
  APIConnectionTimeoutError,
} from "groq-sdk";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const groqClient = new Groq({ apiKey: GROQ_API_KEY });
const groqModels = [
  "llama-3.3-70b-versatile",
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "openai/gpt-oss-20b",
];

const ensureArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string" && item.trim() !== "");
};

const normalizeSuggestion = (suggestion) => {
  if (typeof suggestion !== "string") return null;
  const trimmed = suggestion.trim().replace(/^[-*\d\.\)\s]+/, "");
  return trimmed === "" ? null : trimmed;
};

const parseResponseContent = (content, expectedCount) => {
  if (!content) return [];

  const text = content.trim();
  const jsonStart = text.indexOf("[");
  const jsonEnd = text.lastIndexOf("]");

  if (jsonStart !== -1 && jsonEnd > jsonStart) {
    const jsonText = text.slice(jsonStart, jsonEnd + 1);
    try {
      const parsed = JSON.parse(jsonText);
      const normalized = ensureArray(parsed).map(normalizeSuggestion).filter(Boolean);
      if (normalized.length > 0) return normalized;
    } catch {
      // fall through to line-based parsing
    }
  }

  const lines = text
    .split(/\r?\n/)
    .map(normalizeSuggestion)
    .filter(Boolean);

  if (lines.length > 0) return lines;

  const parts = text
    .split(/;|\u2022|\u2023|\u25E6|\u2043|\u2219/)
    .map(normalizeSuggestion)
    .filter(Boolean);

  return parts;
};

const trimToWordLimit = (suggestions, maxWords) =>
  suggestions
    .map((suggestion) => {
      const words = suggestion.split(/\s+/);
      if (words.length <= maxWords) return suggestion;
      return words.slice(0, maxWords).join(" ");
    })
    .map((suggestion) => suggestion.trim())
    .filter(Boolean);

const createGroqError = (error, defaultMessage) => {
  const message = error?.message || defaultMessage;
  const statusCode = error instanceof AuthenticationError
    ? 401
    : error instanceof RateLimitError
    ? 429
    : error instanceof APIConnectionTimeoutError
    ? 504
    : error instanceof APIConnectionError
    ? 503
    : error instanceof APIError
    ? error.status || 502
    : 502;

  const groqError = new Error(message);
  groqError.statusCode = statusCode;
  return groqError;
};

const supportedAiActions = [
  "summarize",
  "rewrite_professionally",
  "make_shorter",
  "make_friendlier",
  "translate",
];

const supportedLanguages = ["English", "Hindi", "Spanish", "French", "German", "Japanese"];

const buildAiPrompt = (action, text, language = "English") => {
  const safeText = text.trim();

  switch (action) {
    case "summarize":
      return `Summarize the following chat message clearly and concisely without adding any extra information:\n\n${safeText}`;
    case "rewrite_professionally":
      return `Rewrite the following chat message in a professional tone while preserving the meaning:\n\n${safeText}`;
    case "make_shorter":
      return `Rewrite the following chat message using fewer words while keeping the same meaning:\n\n${safeText}`;
    case "make_friendlier":
      return `Rewrite the following chat message in a warm, friendly conversational tone:\n\n${safeText}`;
    case "translate":
      return `Translate the following chat message into ${language}. Preserve the meaning exactly and return only the translated text:\n\n${safeText}`;
    default:
      return safeText;
  }
};

const buildAiSystemMessage = () => ({
  role: "system",
  content:
    "You are a helpful AI assistant that rewrites or summarizes a single chat message exactly as requested. " +
    "Return only the requested text and do not include extra explanation or commentary.",
});

export const generateAiResponse = async (action, text, language = "English") => {
  if (!GROQ_API_KEY) {
    const error = new Error("Missing GROQ_API_KEY environment variable.");
    error.statusCode = 500;
    throw error;
  }

  if (!action || !supportedAiActions.includes(action)) {
    const error = new Error("Unsupported AI action.");
    error.statusCode = 400;
    throw error;
  }

  if (!text || typeof text !== "string" || text.trim() === "") {
    const error = new Error("Message text is required for AI actions.");
    error.statusCode = 400;
    throw error;
  }

  if (action === "translate" && !supportedLanguages.includes(language)) {
    const error = new Error("Unsupported language.");
    error.statusCode = 400;
    throw error;
  }

  const systemMessage = buildAiSystemMessage();
  const userMessage = {
    role: "user",
    content: buildAiPrompt(action, text, language),
  };

  let lastError = null;

  for (const model of groqModels) {
    try {
      const response = await groqClient.chat.completions.create({
        model,
        messages: [systemMessage, userMessage],
        temperature: 0.6,
        max_tokens: 160,
      });

      const content = response?.choices?.[0]?.message?.content;
      const trimmed = typeof content === "string" ? content.trim() : "";
      if (trimmed) return trimmed;

      lastError = new Error("Groq returned an empty AI response.");
      lastError.statusCode = 502;
      if (model === groqModels[groqModels.length - 1]) {
        throw lastError;
      }
    } catch (error) {
      if (
        error instanceof AuthenticationError ||
        error instanceof RateLimitError ||
        error instanceof APIConnectionError ||
        error instanceof APIConnectionTimeoutError
      ) {
        throw createGroqError(error, "Groq API request failed.");
      }

      if (error instanceof APIError) {
        lastError = createGroqError(error, "Groq API request failed.");
        if (model === groqModels[groqModels.length - 1]) {
          throw lastError;
        }
        continue;
      }

      throw error;
    }
  }

  throw lastError || new Error("Unable to generate AI response.");
};

export const generateSmartReplies = async (messages, loggedInUserId, suggestionCount = 4) => {
  if (!GROQ_API_KEY) {
    const error = new Error("Missing GROQ_API_KEY environment variable.");
    error.statusCode = 500;
    throw error;
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    const error = new Error("Conversation is empty. No smart replies can be generated.");
    error.statusCode = 400;
    throw error;
  }

  const conversationMessages = messages
    .slice(-30)
    .map((message) => {
      const role = message.senderId?.toString() === loggedInUserId?.toString() ? "user" : "assistant";
      const content = message.text?.trim() || (message.image ? "Sent an image." : "");
      return { role, content };
    })
    .filter((item) => item.content.length > 0);

  if (conversationMessages.length === 0) {
    const error = new Error("Conversation has no text content. Unable to generate smart replies.");
    error.statusCode = 400;
    throw error;
  }

  const systemMessage = {
    role: "system",
    content:
      "You are a helpful assistant that suggests short, natural chat replies. " +
      "Generate only 3 to 5 distinct replies, each under 15 words, and return them as a plain JSON array of strings. " +
      "Do not include any explanation, numbering, or extra text.",
  };

  const userMessage = {
    role: "user",
    content: `Review the conversation above and create ${suggestionCount} distinct short replies. ` +
      "Each reply must be under 15 words and sound human-like. Return only a JSON array.",
  };

  let lastError = null;

  for (const model of groqModels) {
    try {
      const response = await groqClient.chat.completions.create({
        model,
        messages: [systemMessage, ...conversationMessages, userMessage],
        temperature: 0.7,
        max_tokens: 180,
      });

      const content = response?.choices?.[0]?.message?.content;
      const parsed = parseResponseContent(content, suggestionCount);
      const trimmed = trimToWordLimit(parsed, 15)
        .map((suggestion) => suggestion.replace(/^"|"$/g, ""))
        .filter((suggestion) => suggestion.length > 0);

      const finalSuggestions = trimmed.slice(0, suggestionCount);
      if (finalSuggestions.length >= 3) {
        return finalSuggestions;
      }

      lastError = new Error("Unable to parse enough valid reply suggestions from the Groq response.");
      lastError.statusCode = 502;
      if (model === groqModels[groqModels.length - 1]) {
        throw lastError;
      }
    } catch (error) {
      if (
        error instanceof AuthenticationError ||
        error instanceof RateLimitError ||
        error instanceof APIConnectionError ||
        error instanceof APIConnectionTimeoutError
      ) {
        throw createGroqError(error, "Groq API request failed.");
      }

      if (error instanceof APIError) {
        lastError = createGroqError(error, "Groq API request failed.");
        if (model === groqModels[groqModels.length - 1]) {
          throw lastError;
        }
        continue;
      }

      throw error;
    }
  }

  throw lastError || new Error("Unable to generate smart replies.");
};
