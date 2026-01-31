import express from "express";
import { postUpdate, fetchUpdates } from "../controllers/updateController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Staff/Admin 
router.post(
  "/post",
  verifyToken,
  authorizeRoles("staff", "admin"),
  upload.single("image"),
  postUpdate
);

// Public
router.get("/all", fetchUpdates);

export default router;
