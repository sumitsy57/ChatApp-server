// ./constants/config.js

// whitelist - ensure the production client origin is listed exactly (no trailing slash)
const CLIENT_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://chat-app-client-alpha-five.vercel.app", // <- ensure this exact value is present
  process.env.CLIENT_URL, // optional: keep env too (will be filtered if undefined)
].filter(Boolean);

export const CHATTU_TOKEN = "chattu-token";

export const corsOptions = {
  origin: (origin, callback) => {
    // allow non-browser tools (curl, Postman)
    if (!origin) return callback(null, true);

    console.log("CORS: incoming origin:", origin);

    if (CLIENT_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    // don't throw an Error here (that becomes a 500) — return false so CORS simply doesn't allow it
    console.warn("CORS: origin not allowed -", origin);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
};

export { CLIENT_ORIGINS };
