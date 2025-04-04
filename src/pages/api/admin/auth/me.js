import { verifyAuth } from "@/lib/auth";

export default function handler(req, res) {
    const admin = verifyAuth(req);
    if (!admin) return res.status(401).json({ error: "Unauthorized" });

    res.status(200).json({ email: admin.email });
}
;