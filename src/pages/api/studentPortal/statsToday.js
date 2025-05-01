import db from '@/lib/db';
import Student from '@/models/Student';

export default async function handler(req, res) {
  await db();

  try {
    const students = await Student.find();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    let overallPresent = 0;
    let batchStats = {};

    students.forEach(student => {
      const isPresent = student.attendanceSummary?.get(today) === 'present';
      const batch = student.batch || 'Unknown';

      if (!batchStats[batch]) {
        batchStats[batch] = {
          present: 0,
          absent: 0,
          total: 0
        };
      }

      batchStats[batch].total += 1;
      if (isPresent) {
        batchStats[batch].present += 1;
        overallPresent += 1;
      } else {
        batchStats[batch].absent += 1;
      }
    });

    const totalStudents = students.length;
    const overallAbsent = totalStudents - overallPresent;

    res.status(200).json({
      totalStudents,
      presentToday: overallPresent,
      absentToday: overallAbsent,
      batchStats
    });
  } catch (err) {
    console.error('Error fetching today stats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
