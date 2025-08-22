import mongoose from 'mongoose'

// Function to connect to the MongoDB Database
export const connnectDB = async () => {
    try {
        mongoose.connection.on('connected', ()=> console.log("Database Connected"));
        await mongoose.connect(`${process.env.MONGODB_URI}/quickchat`);
    } catch (error) {
        console.log(error);
    }
}