import { updateMark } from "@/controllers/adminController";

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const response = await updateMark(req);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error in API handler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
