import { viewTables } from "@/controllers/adminController"; // Import viewTables from the controller

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: "Missing section ID" });
        }

        try {
            // Fetch tables from the database
            const tables = await viewTables(id); // Call viewTables from the controller
            return res.status(200).json({ tables });
        } catch (error) {
            return res.status(500).json({ error: "Failed to fetch tables" });
        }
    } else {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
}
