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
    await db();

    const filter = batch && batch !== 'all' ? { batch } : {};
    const students = await Student.find(filter);

    const results = [];

    students.forEach((student) => {
      const attendanceData = student.attendanceTotal?.get(month) || {};
      const total = parseInt(attendanceData.total) || 0;
      const workingDays = parseInt(attendanceData.workingDays) || 0;

      results.push({
        studentId: student._id,
        name: student.name,
        roll: student.roll,
        batch: student.batch,
        total,
        workingDays
      });
    });

    res.status(200).json(results);
  } catch (error) {
    console.error('Monthly Attendance Fetch Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
