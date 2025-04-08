import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET; // Ensure it matches login

export const verifyAuth = (req) => {
    try {
        const token = req.cookies?.authToken; // Use optional chaining to avoid errors
        if (!token) return null;
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded Token:", decoded); // ✅ LOG THIS
        return decoded;
    } catch (error) {
        console.error("Auth Verification Error:", error.message);
        return null;
    }
};
