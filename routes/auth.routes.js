import express from 'express';
import { register, login, logout, uploadMiddleware } from '../controllers/auth.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', uploadMiddleware, register);
router.post('/login', login);
router.post('/logout', auth, logout);



export default router;