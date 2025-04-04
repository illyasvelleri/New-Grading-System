import { deleteTable } from "@/controllers/adminController";

export default async function handler(req, res) {
    if (req.method === "DELETE") return deleteTable(req, res);
    res.status(405).json({ error: "Method Not Allowed" });
}
