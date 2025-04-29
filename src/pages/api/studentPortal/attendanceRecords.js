import db from '../../../lib/db.js';
import Student from '../../../models/Student.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { date, batch } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  try {
    await db(); // Connect to MongoDB

    // Filter students by batch if specified
    const filter = batch && batch !== 'all' ? { batch } : {};
    const students = await Student.find(filter);

    let presentToday = 0;
    let absentToday = 0;

    // Build student list with status from attendanceSummary
    const results = students.map((student) => {
      const status = student.attendanceSummary?.get(date) || 'not_marked';

      if (status === 'present') presentToday++;
      else if (status === 'absent') absentToday++;

      return {
        _id: student._id,
        name: student.name,
        roll: student.roll,
        batch: student.batch,
        status,
      };
    });

    res.status(200).json({
      date,
      batch: batch || 'all',
      total: results.length,
      presentToday,
      absentToday,
      students: results,
    });
  } catch (error) {
    console.error('Attendance fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
