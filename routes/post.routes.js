import express from 'express';
import { createPost, getAllPosts, getPostById, updatePost, deletePost, uploadMiddleware, getPostsByUser } from '../controllers/post.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, uploadMiddleware, createPost);
router.get('/', getAllPosts);
router.get('/user/:userId', getPostsByUser);
router.get('/:id', getPostById);
router.put('/:id', auth, uploadMiddleware, updatePost);
router.delete('/:id', auth, deletePost);

export default router;
