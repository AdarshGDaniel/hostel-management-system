import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import { getStudentDashboard, fetchAllStudents, fetchStudentHistory } from "../controllers/studentController.js";

const router = express.Router();

router.get(
  "/dashboard",
  verifyToken,
  authorizeRoles("student"),
  getStudentDashboard
);

// STAFF / ADMIN 
router.get(
  "/student",
  verifyToken,
  authorizeRoles("staff", "admin"),
  fetchAllStudents
);

router.get(
  "/student/:id/history",
  verifyToken,
  authorizeRoles("staff", "admin"),
  fetchStudentHistory
);

export default router;
