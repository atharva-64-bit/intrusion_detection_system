import express from "express";
import { addThreatInternal } from "../controllers/internalController.js";
import { verifyInternalKey } from "../middleware/internalAuth.js";

const router = express.Router();

router.post("/threats", verifyInternalKey, addThreatInternal);

export default router;
