import express from "express";
import {
  raiseQuery,
  getMyQueries,
  getQueriesForStaff,
  replyQuery,
} from "../controllers/queryController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";


const router = express.Router();

// Student
router.post("/raise", verifyToken, raiseQuery);
router.get("/my", verifyToken, getMyQueries);

// Staff
router.get(
  "/staff",
  verifyToken,
  authorizeRoles("staff", "admin"),
  getQueriesForStaff
);

router.post(
  "/reply",
  verifyToken,
  authorizeRoles("staff", "admin"),
  replyQuery
);

export default router;
