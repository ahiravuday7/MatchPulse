import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "./asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Not authorized, token missing", 401);
  }

  const decoded = jwt.verify(token, env.JWT_SECRET);

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new AppError("User no longer exists", 401);
  }

  req.user = {
    _id: user._id,
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };

  next();
});

// This middleware protects private routes.
