import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import { uploadToImageKit, deleteFromImageKit } from '../utils/imageHandler.js';

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error getting user profile", error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        
        // Check if username or email already exists
        const existingUser = await User.findOne({
            $and: [
                { _id: { $ne: req.userId } },
                { $or: [{ username }, { email }] }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                message: existingUser.email === email 
                    ? "Email already in use" 
                    : "Username already in use"
            });
        }

        const currentUser = await User.findById(req.userId);
        
        const updateData = {
            username: username || undefined,
            email: email || undefined,
        };

        // Handle profile picture update
        if (req.file) {
            // Upload new image to ImageKit
            const imageData = await uploadToImageKit(req.file, 'profiles');
            
            // Delete old image from ImageKit if exists
            if (currentUser.imageId) {
                await deleteFromImageKit(currentUser.imageId);
            }
            
            updateData.picture = imageData.url;
            updateData.imageId = imageData.fileId;
        }

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { $set: updateData },
            { 
                new: true,
                select: '-password',
                runValidators: true
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete user's profile picture from ImageKit if exists
        if (user.imageId) {
            await deleteFromImageKit(user.imageId);
        }

        // Find all posts by the user
        const userPosts = await Post.find({ author: req.userId });

        // Delete all post images from ImageKit
        for (const post of userPosts) {
            if (post.imageId) {
                await deleteFromImageKit(post.imageId);
            }
        }

        // Delete all user's posts
        await Post.deleteMany({ author: req.userId });

        // Delete the user
        await User.findByIdAndDelete(req.userId);

        // Clear auth cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        res.json({ message: "Account deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting account", error: error.message });
    }
};
