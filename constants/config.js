// ./constants/config.js

// Whitelist of allowed client origins (remove trailing slash in env)
const CLIENT_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.CLIENT_URL, // make sure this is set in Render/Vercel without trailing slash
].filter(Boolean);

// name of cookie used across server and client
const CHATTU_TOKEN = "chattu-token";

export const corsOptions = {
  origin: (origin, callback) => {
    // allow non-browser requests (curl, Postman)
    if (!origin) return callback(null, true);

    // debug log (optional - remove in prod)
    console.log("CORS: incoming origin:", origin);

    if (CLIENT_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error("CORS: origin not allowed - " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
};

export { CHATTU_TOKEN };
