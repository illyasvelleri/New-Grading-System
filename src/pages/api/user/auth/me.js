import { getUserProfile } from "@/controllers/userController";

export default async function handler(req, res) {
    if (req.method === "GET") return getUserProfile(req, res);
    res.status(405).json({ error: "Method Not Allowed" });
}
