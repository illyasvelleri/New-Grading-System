import { calcSections } from "@/controllers/userController"; // adjust path if needed

export default async function handler(req, res) {
  if (req.method === "GET") {
    return calcSections(req, res);
  }

  res.status(405).json({ error: "Method Not Allowed" });
}
