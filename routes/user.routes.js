import express from 'express';
import { auth } from '../middleware/auth.js';
import { deleteAccount, getProfile, updateProfile } from '../controllers/user.controller.js';
import { uploadMiddleware } from '../controllers/post.controller.js';

const router = express.Router();

// Profile routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, uploadMiddleware, updateProfile);
router.delete('/profile', auth, deleteAccount);

export default router;
