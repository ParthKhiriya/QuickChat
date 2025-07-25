// Middleware to protect routes
import jwt from 'jsonwebtoken';
import User from '../models/User.js'

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token;
        // Decoding the token of the user
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Finding if user has already loggen in or not, using the findBy function 
        const user = await User.findById(decoded.userId).select("-password");
        // If user not found
        if(!user) return res.json({success: false, message: "User Not Found."});
        // If user is found
        req.user = user;
        next();
    } catch (error) {
        res.json({success: false, message: error.message});
        console.log(error.message);
    }
}