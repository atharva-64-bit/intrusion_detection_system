import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getThreats, addThreat, deleteThreat } from "../controllers/threatController.js";

const router = express.Router();

router.get("/", protect, getThreats);
router.post("/", protect, addThreat);
router.delete("/:id", protect, deleteThreat);

export default router;
