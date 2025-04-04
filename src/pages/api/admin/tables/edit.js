// Another API route that uses the same function
import { getEditableTable } from "@/controllers/adminController";

export default async function handler(req, res) {
    return await getEditableTable(req, res);
}
