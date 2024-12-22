import mongoose from "mongoose";

export const connectMongoDB = async () => {
    try {
        mongoose.connect("mongodb+srv://brunobottiroli7:mHzTCrtaqUy0Adl4@cluster0.r3kmo.mongodb.net/clase15")
        
        console.log("mongo conectado")
    } catch (error) {
        console.log(error)
    }
}