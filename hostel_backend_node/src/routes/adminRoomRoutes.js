import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  viewRequests,
  approveRequest,
  rejectRequest,
  fetchUnassignedStudents,
  fetchStudentsByBlock,
  assignGuest,
  removeStudent,
  removeGuest,
  updateRoomRequestStatus,
} from "../controllers/adminRoomController.js";

import { getAllRoomRequests } from "../services/adminRoomService.js";

const router = express.Router();

router.get("/requests", verifyToken, authorizeRoles("staff","admin"), viewRequests);
router.post("/approve", verifyToken, authorizeRoles("staff","admin"), approveRequest);
router.post("/reject", verifyToken, authorizeRoles("staff","admin"), rejectRequest);

router.get("/unassigned", verifyToken, authorizeRoles("staff","admin"), fetchUnassignedStudents);
router.get("/by-block", verifyToken, authorizeRoles("staff","admin"), fetchStudentsByBlock);

router.post("/assign-guest", verifyToken, authorizeRoles("staff", "admin"), assignGuest);
router.post("/remove-student", verifyToken, authorizeRoles("staff", "admin"), removeStudent);
router.post("/remove-guest", verifyToken, authorizeRoles("staff", "admin"), removeGuest); 

router.get("/room-requests", verifyToken, authorizeRoles("staff","admin"), getAllRoomRequests);
router.post("/room-requests/update", verifyToken, authorizeRoles("staff","admin"), updateRoomRequestStatus);



export default router;
