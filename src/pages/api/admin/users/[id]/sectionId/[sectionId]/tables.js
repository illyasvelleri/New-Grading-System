import { verifyAuth } from "@/lib/auth";
import { getTablesByUserAndSection } from "@/controllers/adminController";

export default async function handler(req, res) {
    const admin = verifyAuth(req);
    if (!admin) return res.status(401).json({ error: "Unauthorized" });

    // Optional: Role check
    // if (admin.role !== "admin") return res.status(403).json({ error: "Forbidden" });

    const { id, sectionId } = req.query;

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const tables = await getTablesByUserAndSection(id, sectionId);
        res.status(200).json({ tables });
    } catch (error) {
        console.error("Fetch tables error:", error);
        res.status(500).json({ error: "Failed to fetch tables" });
    }
}
