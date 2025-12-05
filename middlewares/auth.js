// server/src/middlewares/auth.js
import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import { adminSecretKey } from "../app.js";
import { TryCatch } from "./error.js";
import { CHATTU_TOKEN } from "../constants/config.js";
import { User } from "../models/user.js";

const getTokenFromRequest = (req) => {
  // cookie
  const cookieToken = req.cookies[CHATTU_TOKEN];

  // header
  const authHeader = req.headers.authorization || req.headers.Authorization;
  let headerToken;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    headerToken = authHeader.substring(7);
  }

  return cookieToken || headerToken || null;
};

const isAuthenticated = TryCatch((req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token)
    return next(new ErrorHandler("Please login to access this route", 401));

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error("JWT error:", err.message);
    return next(new ErrorHandler("Please login to access this route", 401));
  }

  req.user = decoded._id;
  next();
});

const adminOnly = (req, res, next) => {
  try {
    const token = req.cookies["chattu-admin-token"];

    if (!token)
      return next(new ErrorHandler("Only Admin can access this route", 401));

    const secretKey = jwt.verify(token, process.env.JWT_SECRET);
    const isMatched = secretKey === adminSecretKey;

    if (!isMatched)
      return next(new ErrorHandler("Only Admin can access this route", 401));

    next();
  } catch (err) {
    console.error("Admin auth error:", err.message);
    return next(new ErrorHandler("Only Admin can access this route", 401));
  }
};

const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);

    const cookieToken = socket.request.cookies[CHATTU_TOKEN];
    const authToken = socket.handshake?.auth?.token;
    const token = cookieToken || authToken;

    if (!token)
      return next(new ErrorHandler("Please login to access this route", 401));

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      console.error("Socket JWT error:", e.message);
      return next(new ErrorHandler("Please login to access this route", 401));
    }

    const user = await User.findById(decoded._id);
    if (!user)
      return next(new ErrorHandler("Please login to access this route", 401));

    socket.user = user;
    next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Please login to access this route", 401));
  }
};

export { isAuthenticated, adminOnly, socketAuthenticator };
