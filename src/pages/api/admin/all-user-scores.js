import { LeaderboardSection } from "@/controllers/adminController";

export default async function handler(req, res) {
    if (req.method === "GET") return LeaderboardSection(req, res);
    res.status(405).json({ error: "Method Not Allowed" });
}
