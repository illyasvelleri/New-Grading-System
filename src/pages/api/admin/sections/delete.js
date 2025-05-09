import { deleteSection } from "@/controllers/adminController";

export default async function handler(req, res) {
    if (req.method === "DELETE") return deleteSection(req, res);
    res.status(405).json({ error: "Method Not Allowed" });
}
