import { saveUserTable } from "@/controllers/userController";

export default async function handler(req, res) {
    if (req.method === "POST") {
        return await saveUserTable(req, res);
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
