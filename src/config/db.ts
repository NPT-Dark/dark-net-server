import mongoose from "mongoose";

export default function connectDatabase() {
    mongoose.Promise
    mongoose
        .connect(process.env.MONGO_URI || "")
        .then(() => console.log("✅ Connect to MongoDB successfully"))
        .catch((err) => console.error("❌ Could not connect to MongoDB: ", err));
}