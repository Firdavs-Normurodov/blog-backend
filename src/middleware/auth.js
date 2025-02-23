import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const auth = async (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.token;
        console.log('Received Token:', token);
        
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded Token:', decoded);
            
            // Check if user still exists
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            console.log('Found User ID:', user._id.toString());
            console.log('Decoded User ID:', decoded.userId);

            // Add user id to request (ensure string format)
            req.userId = user._id.toString();
            next();
        } catch (error) {
            console.error('Token Verification Error:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
