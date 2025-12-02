// utils/features.js
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { getBase64, getSockets } from "../lib/helper.js";

/**
 * Cookie options:
 * - In production (https) we need sameSite: 'none' and secure: true for cross-site cookies.
 * - In development (http://localhost) use sameSite: 'lax' and secure: false so cookies are accepted locally.
 */
const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax",
  httpOnly: true,
  secure: process.env.NODE_ENV === "PRODUCTION",
  path: "/", // explicit path
};

const connectDB = (uri) => {
  mongoose
    .connect(uri, { dbName: "Chattu" })
    .then((data) => console.log(`Connected to DB: ${data.connection.host}`))
    .catch((err) => {
      throw err;
    });
};

/**
 * sendToken
 * - Generates a JWT with expiry.
 * - Sets cookie using cookieOptions above (env-aware).
 * - Returns a sanitized user object (removes password).
 */
const sendToken = (res, user, statusCode = 200, message = "") => {
  if (!process.env.JWT_SECRET) {
    console.warn("JWT_SECRET is not set. Please set JWT_SECRET in your environment.");
  }

  // Create token with expiration
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7d", // token validity
  });

  // sanitize user before sending (remove sensitive fields)
  const userObj = user.toObject ? user.toObject() : { ...user };
  if (userObj.password) delete userObj.password;
  if (userObj.__v) delete userObj.__v;

  return res
    .status(statusCode)
    .cookie("chattu-token", token, cookieOptions)
    .json({
      success: true,
      message,
      user: userObj,
    });
};

const emitEvent = (req, event, users, data) => {
  const io = req.app.get("io");
  const usersSocket = getSockets(users);
  io.to(usersSocket).emit(event, data);
};

const uploadFilesToCloudinary = async (files = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);

    const formattedResults = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));
    return formattedResults;
  } catch (err) {
    throw new Error("Error uploading files to cloudinary: " + (err.message || err));
  }
};

const deletFilesFromCloudinary = async (public_ids) => {
  // Delete files from cloudinary (implement if you need it)
};

export {
  connectDB,
  sendToken,
  cookieOptions,
  emitEvent,
  deletFilesFromCloudinary,
  uploadFilesToCloudinary,
};
