import { ENV } from "./env.js";

const devOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

export const allowedOrigins = Array.from(
  new Set([ENV.CLIENT_URL, ...devOrigins].filter(Boolean))
);

export const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (Postman, mobile apps, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};