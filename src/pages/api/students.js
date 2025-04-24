// pages/api/students.js
import db from '../../lib/db';
import Student from '../../models/Student';

export default async function handler(req, res) {
  await db();

  if (req.method === 'GET') {
    try {
      const { batch } = req.query;

      // Fetch students based on the batch filter (if provided)
      const query = batch && batch !== 'all' ? { batch } : {};
      const students = await Student.find(query);

      res.status(200).json(students);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Handle other HTTP methods if necessary (like POST, PUT, DELETE, etc.)
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
