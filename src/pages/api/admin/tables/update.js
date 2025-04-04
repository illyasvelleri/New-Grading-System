import { updateTable } from "@/controllers/adminController";

export default async function handler(req, res) {
    if (req.method === "PUT") return updateTable(req, res);
    res.status(405).json({ error: "Method Not Allowed" });
}
