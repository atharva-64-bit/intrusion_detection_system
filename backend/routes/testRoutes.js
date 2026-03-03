import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/secure", protect, (req, res) => {
  res.json({
    message: "Secure data access granted",
    user: req.user, 
  });
});

export default router;
