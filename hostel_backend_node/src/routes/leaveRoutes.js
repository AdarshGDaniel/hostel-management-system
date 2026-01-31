import express from "express";
import {
  applyLeave,
  getLeaveDashboard,
  decideLeave,
  getMyLeaves,
} from "../controllers/leaveController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();


  //  STUDENT ROUTES

router.post("/apply", verifyToken, applyLeave);
router.get("/my", verifyToken, getMyLeaves);


  //  STAFF / ADMIN ROUTES

router.get(
  "/staff",
  verifyToken,
  authorizeRoles("staff", "admin"),
  getLeaveDashboard
);

router.post(
  "/staff/decision",
  verifyToken,
  authorizeRoles("staff", "admin"),
  decideLeave
);

export default router;
