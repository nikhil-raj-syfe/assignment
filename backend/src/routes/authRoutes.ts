import express from 'express';
import { login, getUserInfo, checkUserResponse, signup } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/signup', signup);

// Protected routes
router.get('/me', authenticateToken, getUserInfo);
router.get('/check-response', authenticateToken, checkUserResponse);

export default router; 