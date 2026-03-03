// backend/routes/liveRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getLivePackets,
  getLiveStats,
} from "../controllers/liveController.js";

const router = express.Router();

router.get("/packets", protect, getLivePackets);
router.get("/stats", protect, getLiveStats);

export default router;
