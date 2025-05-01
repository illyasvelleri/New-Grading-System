import db from '@/lib/db.js';
import Student from '@/models/Student.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { month, batch } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Month is required' });
  }

  try {
    await db(); // Connect to MongoDB

    const filter = batch && batch !== 'all' ? { batch } : {};
    const students = await Student.find(filter);

    const results = [];

    students.forEach((student) => {
      const total = student.attendanceTotal?.get(month) || 0;

      results.push({
        studentId: student._id,
        name: student.name,
        roll: student.roll,
        batch: student.batch,
        total: parseInt(total), // Convert to number if stored as string
      });
    });

    res.status(200).json(results);
  } catch (error) {
    console.error('Monthly Attendance Fetch Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
