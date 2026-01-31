import express from 'express';
import { getUserDetails, login, register } from '../controllers/authController.js';
import { verifyToken } from "../middlewares/authMiddleware.js";


const authRoutes = express.Router();

authRoutes.post('/register-user', register);
authRoutes.post('/login', login);
authRoutes.get('/get-userDetails', verifyToken, getUserDetails);


export default authRoutes;