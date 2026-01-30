import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  getRequestsPageData,
  requestRoom,
  requestLeave,
  deleteRoom,
} from "../controllers/roomController.js";
import { getRoomRequests } from "../controllers/adminRoomController.js";


const router = express.Router();

// Student Requests Page 
router.get(
  "/requests-page",
  verifyToken,
  authorizeRoles("student"),
  getRequestsPageData
);

// Room request (new/change/remove) 
router.post(
  "/room-request",
  verifyToken,
  authorizeRoles("student"),
  requestRoom
);

// Leave request 
router.post(
  "/leave-request",
  verifyToken,
  authorizeRoles("student"),
  requestLeave
);

router.get(
  "/room/requests",
  verifyToken,
  authorizeRoles("staff", "admin"),
  getRoomRequests
);


//  DELETE ROOM 

router.post(
  "/delete",
  verifyToken,
  authorizeRoles("staff", "admin"),
  deleteRoom
);


export default router;
