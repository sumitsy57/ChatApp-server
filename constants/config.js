// constants/config.js

export const CHATTU_TOKEN = "chattu-token";

const CLIENT_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.CLIENT_URL,     // https://chat-app-client-alpha-five.vercel.app
].filter(Boolean);

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (CLIENT_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error("CORS: origin not allowed - " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
};
