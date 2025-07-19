import jwt from 'jsonwebtoken'

// Function to generate a token for the user:
export const generateToken = (userId) => {

    // generating a token for the user, using our JWT_SECRET
    const token = jwt.sign({userId}, process.env.JWT_SECRET)
    return token;
}