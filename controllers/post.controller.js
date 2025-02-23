import Post from '../models/post.model.js';
import upload from '../config/multer.js';
import { uploadToImageKit, deleteFromImageKit } from '../utils/imageHandler.js';

export const uploadMiddleware = upload.single('picture');

export const createPost = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Post picture is required" });
        }

        // Upload image to ImageKit
        const imageData = await uploadToImageKit(req.file, 'posts');

        const post = await Post.create({
            title: req.body.title,
            content: req.body.content,
            description: req.body.description,
            picture: imageData.url,
            imageId: imageData.fileId,
            author: req.userId
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: "Error creating post", error: error.message });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username email picture')
            .sort('-createdAt');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
};

export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username email picture');
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Error fetching post", error: error.message });
    }
};

export const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.author.toString() !== req.userId) {
            return res.status(403).json({ message: "Not authorized to update this post" });
        }

        const updateData = {
            title: req.body.title || post.title,
            content: req.body.content || post.content,
            description: req.body.description || post.description,
        };

        // Handle image update
        if (req.file) {
            // Upload new image to ImageKit
            const imageData = await uploadToImageKit(req.file, 'posts');
            
            // Delete old image from ImageKit
            if (post.imageId) {
                await deleteFromImageKit(post.imageId);
            }
            
            updateData.picture = imageData.url;
            updateData.imageId = imageData.fileId;
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate('author', 'name email picture');

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: "Error updating post", error: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.author.toString() !== req.userId) {
            return res.status(403).json({ message: "Not authorized to delete this post" });
        }

        // Delete image from ImageKit
        if (post.imageId) {
            await deleteFromImageKit(post.imageId);
        }

        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting post", error: error.message });
    }
};

export const getPostsByUser = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId })
            .populate('author', 'name email picture')
            .sort('-createdAt');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user posts", error: error.message });
    }
};
