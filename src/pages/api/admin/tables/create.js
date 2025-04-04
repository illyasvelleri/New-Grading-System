import { createTable } from "@/controllers/adminController";

export default async function handler(req, res) {
    if (req.method === "POST") return createTable(req, res);
    res.status(405).json({ error: "Method Not Allowed" });
}