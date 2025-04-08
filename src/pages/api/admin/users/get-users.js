// pages/api/admin/users/get-users.js
import { verifyAuth } from "@/lib/auth";
import { getAllUsers } from "@/controllers/adminController";

export default async function handler(req, res) {
    const admin = verifyAuth(req);
    if (!admin) return res.status(401).json({ error: "Unauthorized" });

    // if (admin.role !== "admin") return res.status(403).json({ error: "Forbidden: Admin access only" });

    if (req.method === "GET") return getAllUsers(req, res); 

    res.status(405).json({ error: "Method Not Allowed" });
}
