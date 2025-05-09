const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },  // Required Username
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },  // Required Password
    category: {
        type: String,
        enum: ["below-20", "below-50", "above-50"]
    },
    studentCount: { type: Number, default: 0 }, // New Field
    role: { type: String, enum: ["admin", "user"], default: "user" },
    location: { type: String, maxLength: 1000 } // Support iframe HTML, optional
});

export default mongoose.models.User || mongoose.model("User", userSchema);