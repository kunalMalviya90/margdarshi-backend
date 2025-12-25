import express from 'express';
import { getGitaResponse } from '../controllers/chatController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Get Gita-based AI response (protected route)
router.post('/geeta', authMiddleware, getGitaResponse);

export default router;
