import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateUserProfile,
  deleteUserAccount,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/authValidators.js";

import { updateProfileValidator } from "../validators/userValidators.js";

const router = express.Router();

router.post("/register", registerValidator, validateRequest, registerUser);
router.post("/login", loginValidator, validateRequest, loginUser);
router.post("/logout", protect, logoutUser);

router.get("/me", protect, getMe);
router.patch(
  "/profile",
  protect,
  updateProfileValidator,
  validateRequest,
  updateUserProfile,
);
router.delete("/account", protect, deleteUserAccount);

export default router;
