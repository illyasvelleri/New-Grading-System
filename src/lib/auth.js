import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET; // Ensure it matches login

export const verifyAuth = (req) => {
    try {
        const token = req.cookies?.authToken; // Use optional chaining to avoid errors
        if (!token) return null;
        return jwt.verify(token, JWT_SECRET); // Consistent secret key
    } catch (error) {
        console.error("Auth Verification Error:", error.message);
        return null;
    }
};
