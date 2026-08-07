import { ENV } from "./env.js";

const devOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

export const allowedOrigins = Array.from(new Set([ENV.CLIENT_URL, ...devOrigins].filter(Boolean)));

export const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
};
