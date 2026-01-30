import express from "express";
import {
  applyRoomRequest,
  getMyRoomRequests,
  getPendingRoomRequests,
  approveRoomRequest,
  rejectRoomRequest,
} from "../controllers/roomRequestController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/apply", verifyToken, applyRoomRequest);
router.get("/my", verifyToken, getMyRoomRequests);

router.get(
  "/pending",
  verifyToken,
  authorizeRoles("staff", "admin"),
  getPendingRoomRequests
);

router.post(
  "/:id/approve",
  verifyToken,
  authorizeRoles("staff", "admin"),
  approveRoomRequest
);

router.post(
  "/:id/reject",
  verifyToken,
  authorizeRoles("staff", "admin"),
  rejectRoomRequest
);

export default router;
