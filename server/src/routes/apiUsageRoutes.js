import express from "express";

import { getTodayApiUsageController } from "../controllers/apiUsageController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/today", getTodayApiUsageController);

export default router;
