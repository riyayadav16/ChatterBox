import express from "express";
import { handleAiAssistant } from "../controllers/ai.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection, protectRoute);
router.post("/assistant", handleAiAssistant);

export default router;
