import db from "@/lib/db";
import User from "@/models/User";
import UserTableData from "@/models/UserTableData";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  await db();

  const { userId, password } = req.body;
  console.log("Received request:", req.body);

  try {
    // Check if the admin password matches the one in the .env file
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Invalid admin password" });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);
    await UserTableData.deleteMany({ user: userId });

    return res.json({ success: true });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
