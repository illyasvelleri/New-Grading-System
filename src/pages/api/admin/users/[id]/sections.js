import { verifyAuth } from "@/lib/auth";
import { getUserSections } from "@/controllers/adminController";

export default async function handler(req, res) {
    console.log("call recived!")
    const admin = verifyAuth(req);
    if (!admin) return res.status(401).json({ error: "Unauthorized" });

    // Optional: Role check
    // if (admin.role !== "admin") return res.status(403).json({ error: "Forbidden: Admin only" });

    if (req.method === "GET") {
        return getUserSections(req, res);
    }

    res.status(405).json({ error: "Method Not Allowed" });
}
