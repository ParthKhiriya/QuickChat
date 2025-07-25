// In this file we will create the functions for user to login, authenticating the user, update the user profile etc.
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from 'bcryptjs'

// Sign Up New User:
export const singUp = async (req, res) => {
    // De-structuring all the information which we will get when the user fills his details
    const {fullName, email, password, bio} = req.body;

    try {
        // If any of the details is missing, then we have to return this.
        if(!fullName || !email || !password || !bio) return res.json({ success: false, message: "Missing Details" })
        
        // If the email that the user entered in his request already exists inside the database then also we have to return false
        const user = await User.findOne({ email });
        if(user) return res.json({ success: false, message: "Account already exists"})
        
        // Hashing the password which the user entered so that we can store the hashed password inside our database, so that we do not get to know what the user has entered as password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // After getting all the details, we create a new user in our database
        const newUser = await User.create({ fullName, email, hashedPassword, bio });

        // calling our generateToken function from the utils.js file
        const token = generateToken(newUser._id);

        // Sending the response back
        res.json({success: true, userData: newUser, token, message: "Account created successfully"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// Login Function :
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const userData = await User.findOne({email});

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if(!isPasswordCorrect) return res.json({success: false, message: "Invalid Credentials"});

        const token = generateToken(userData._id);

        res.json({success: true, userData, token, message: "Login Successfull"});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// Controller to check if the user is authenticated or not
export const checkAuth = (req, res) => {
    res.json({success: true, user: req.user});
}

// Controller to update user profile details
export const updateProfile = async (req, res) => {
    try {
        const {profilePic, bio, fullName } = req.body;
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
