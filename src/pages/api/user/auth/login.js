import { loginUser } from "@/controllers/userController";

export default async function handler(req, res) {
    if (req.method === "POST") return loginUser(req, res);
    res.status(405).json({ error: "Method Not Allowed" });
}
