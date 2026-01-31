import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import { getLiveStatus } from "../controllers/liveStatusController.js";

const router = express.Router();

router.get(
  "/live-status",
  verifyToken,
  authorizeRoles("staff", "admin"),
  getLiveStatus
);

export default router;
