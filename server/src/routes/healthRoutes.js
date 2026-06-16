import express from "express";

import {
  healthController,
  livenessController,
  readinessController,
} from "../controllers/healthController.js";

const router = express.Router();

router.get("/", healthController);
router.get("/live", livenessController);
router.get("/ready", readinessController);

export default router;
