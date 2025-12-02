// ./constants/config.js
const CLIENT_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:4173",
  // Ensure this env var is set (include protocol e.g. https://your-site.vercel.app)
  process.env.CLIENT_URL,
].filter(Boolean); // remove any undefined entries

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman, curl or some mobile clients)
    if (!origin) return callback(null, true);

    // allow if origin is in whitelist
    if (CLIENT_ORIGINS.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // else block it
    return callback(new Error("CORS policy: This origin is not allowed - " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
};

export const CHATTU_TOKEN = "chattu-token";
