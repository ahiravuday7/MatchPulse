// Expose test endpoint
import express from "express";
import { testCache } from "../controllers/cacheTestController.js";

const router = express.Router();

router.get("/", testCache);

export default router;
