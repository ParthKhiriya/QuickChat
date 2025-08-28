import User from "../models/User.js";
import jwt from "jsonwebtoken";


// Middleware to protect routes:
export const protectRoute = async(req, res, next) => {
    try {
        // Taking the token from headers.
        const token = req.headers.token;
        // Decoding the token for user's id:
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Finding the user id using decoded id
        const user = await User.findById(decoded.userId).select("-password");

        if(!user) return res.json({success: false, message: "User not found"});

        req.user = user;
        next();

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}