// ./constants/config.js
const CLIENT_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.CLIENT_URL, // must be set without trailing slash
].filter(Boolean);

export const corsOptions = {
  origin: (origin, callback) => {
    // allow non-browser tools (curl, Postman)
    if (!origin) return callback(null, true);

    console.log("CORS: incoming origin:", origin);
    if (CLIENT_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error("CORS: origin not allowed - " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
};
