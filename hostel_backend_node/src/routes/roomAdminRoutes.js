import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  createSingleRoom,
  createMultipleRooms,
} from "../controllers/roomAdminController.js";

const router = express.Router();

router.post(
  "/add-single",
  verifyToken,
  authorizeRoles("staff", "admin"),
  createSingleRoom
);

router.post(
  "/add-multiple",
  verifyToken,
  authorizeRoles("staff", "admin"),
  createMultipleRooms
);


export default router;
