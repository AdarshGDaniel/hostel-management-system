import express from 'express';
import { getAllUsers, createUser } from '../controllers/userController.js';
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const userRoutes = express.Router();

userRoutes.get('/get-user', verifyToken, authorizeRoles('admin'), getAllUsers);
userRoutes.post('/create-user', createUser);

export default userRoutes;