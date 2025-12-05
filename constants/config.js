// server/src/constants/config.js

// client origin(s)
const CLIENT_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://chat-app-client-alpha-five.vercel.app", // your Vercel URL
].filter(Boolean);

const CHATTU_TOKEN = "chattu-token";

const corsOptions = {
  origin: (origin, callback) => {
    // allow tools like Postman (no origin)
    if (!origin) return callback(null, true);

    if (CLIENT_ORIGINS.includes(origin)) return callback(null, true);

    return callback(new Error("CORS: origin not allowed - " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
};

export { corsOptions, CHATTU_TOKEN };
