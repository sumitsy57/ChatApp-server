// middlewares/auth.js
import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import { adminSecretKey } from "../app.js";
import { TryCatch } from "./error.js";
import { CHATTU_TOKEN } from "../constants/config.js";
import { User } from "../models/user.js";

/**
 * isAuthenticated
 * - Reads token from cookie (CHATTU_TOKEN).
 * - Verifies token and sets req.user to decoded _id.
 * - Returns 401 on missing/invalid/expired token.
 */
const isAuthenticated = TryCatch((req, res, next) => {
  try {
    const token = req.cookies[CHATTU_TOKEN];
    if (!token) return next(new ErrorHandler("Please login to access this route", 401));

    // verify token (throws on invalid/expired)
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedData._id;
    return next();
  } catch (err) {
    // log for debugging (optional)
    console.error("Auth error:", err.message);
    return next(new ErrorHandler("Please login to access this route", 401));
  }
});

/**
 * adminOnly
 * - Verifies an admin token signed with the adminSecretKey.
 * - Expects the admin token to be signed using adminSecretKey (not JWT_SECRET).
 * - If your admin token is implemented differently (e.g., stored as a value rather than a JWT),
 *   adjust this accordingly.
 */
const adminOnly = (req, res, next) => {
  try {
    const token = req.cookies["chattu-admin-token"];
    if (!token) return next(new ErrorHandler("Only Admin can access this route", 401));

    // Verify the token using the adminSecretKey.
    // If token was created via `jwt.sign(adminSecretValue, adminSecretKey)` then this will succeed.
    const decoded = jwt.verify(token, adminSecretKey);

    // Optionally, you can check the payload for a specific claim:
    // if (decoded.role !== "admin") return next(new ErrorHandler("Only Admin can access this route", 401));

    return next();
  } catch (err) {
    console.error("Admin auth error:", err.message);
    return next(new ErrorHandler("Only Admin can access this route", 401));
  }
};

/**
 * socketAuthenticator
 * - Used by socket.io connection middleware
 * - Reads cookie from socket.request.cookies and verifies token
 * - Attaches full user document to socket.user
 */
const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);

    const authToken = socket.request.cookies[CHATTU_TOKEN];

    if (!authToken) return next(new ErrorHandler("Please login to access this route", 401));

    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

    const user = await User.findById(decodedData._id);

    if (!user) return next(new ErrorHandler("Please login to access this route", 401));

    socket.user = user;
    return next();
  } catch (error) {
    console.error("Socket auth error:", error.message);
    return next(new ErrorHandler("Please login to access this route", 401));
  }
};

export { isAuthenticated, adminOnly, socketAuthenticator };
