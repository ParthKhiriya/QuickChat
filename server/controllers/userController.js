import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";


// Sign up a new user:
export const signup = async (req, res) => {
    // De-structuring the request which the user made
    const {fullName, email, password, bio} = req.body;

    try {
        // Checking if all the data is entered
        if(!fullName || !email || !password || !bio) {
            return res.json({success: false, message: "Missing Details"});
        }
        // Is any user already there with this email?
        const user = await User.findOne({email});
        if(user) return res.json({success: false, message: "Account already exists"});

        // Encrypting the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = await User.create({fullName, email, password: hashedPassword, bio});

        // Creating a token for authenticating the user
        const token = generateToken(newUser._id);

        // Send this token to response
        res.json({success: true, userData: newUser, token, message: "Account created successfully"});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}


// Login user:
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Find the user with this email id:
        const userData = await User.findOne({email});

        // Compare if password entered is same as the one which is in our database
        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if(!isPasswordCorrect) {
            return res.json({success: false, message: "Invalid Credentials"});
        }

        // Create token for logged in user if the password is correct:
        const token = generateToken(userData._id);
        res.json({success: true, userData, token, message: "Login Successfull"});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}


// Whether the user is authenticated or not?
export const checkAuth = (req, res) => {
    res.json({success: true, user: req.user});
}


// Controller to update user profile details:
export const updateProfile = async(req, res) => {
    try {
        const {profilePic, bio, fullName} = req.body;
        const userId = req.user._id;

        let updatedUser;

        if(!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new: true});
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, fullName}, {new: true});
        }

        res.json({success: true, user: updatedUser});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}