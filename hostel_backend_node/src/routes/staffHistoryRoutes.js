import express from "express";
import { getStaffHistory } from "../controllers/staffHistoryController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/admin/history",
  verifyToken,
  authorizeRoles("staff", "admin"),
  getStaffHistory
);

export default router;
