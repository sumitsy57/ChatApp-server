// ./constants/config.js

// Whitelist of allowed client origins.
// Ensure process.env.CLIENT_URL (in your deployed environment) does NOT have a trailing slash.
const CLIENT_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.CLIENT_URL, // e.g. https://chat-app-client-alpha-five.vercel.app
].filter(Boolean);

// name of cookie used across server and client
export const CHATTU_TOKEN = "chattu-token";

export const corsOptions = {
  origin: (origin, callback) => {
    // allow non-browser tools (curl, Postman) that don't set origin
    if (!origin) return callback(null, true);

    // Debug log to help during testing (remove in production)
    console.log("CORS: incoming origin:", origin);

    if (CLIENT_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error("CORS: origin not allowed - " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
};

// export CLIENT_ORIGINS so other modules (like app.js for socket io) can reuse the same whitelist
export { CLIENT_ORIGINS };
