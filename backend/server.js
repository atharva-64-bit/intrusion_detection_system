// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "../config/db.js";
import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import threatRoutes from "./routes/threatRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import liveRoutes from "./routes/liveRoutes.js";
import { initLive } from "./controllers/liveController.js";
import internalRoutes from "./routes/internalRoutes.js";




dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/threats", threatRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/live", liveRoutes);
app.use("/api/internal", internalRoutes);



// Basic health route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "ShieldEye IDS Backend" });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ShieldEye backend running on http://localhost:${PORT}`);
  initLive();
});
