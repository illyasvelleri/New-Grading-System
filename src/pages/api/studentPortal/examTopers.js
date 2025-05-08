// pages/api/examTopers.js
import db from '@/lib/db'; // Adjust the path if needed
import Student from '@/models/Student';

export default async function handler(req, res) {
  await db(); // Connect to MongoDB

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { month } = req.query;

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ message: 'Invalid or missing month. Expected format: YYYY-MM' });
  }

  try {
    const students = await Student.find();

    const batchMap = {};

    students.forEach((student) => {
      const monthlySummary = student.examSummary?.get(month); // Assuming it's a Map or JS object

      if (!monthlySummary) return;

      let totalMarks = 0;

      for (const subject in monthlySummary) {
        const mark = parseFloat(monthlySummary[subject]);
        if (!isNaN(mark)) totalMarks += mark;
      }

      const studentData = {
        studentId: student._id,
        name: student.name,
        roll: student.roll,
        batch: student.batch,
        total: totalMarks,
      };

      if (!batchMap[student.batch]) {
        batchMap[student.batch] = [];
      }

      batchMap[student.batch].push(studentData);
    });

    // Sort and get top 3 for each batch
    const topToppers = {};

    Object.keys(batchMap).forEach((batch) => {
      const sorted = batchMap[batch].sort((a, b) => b.total - a.total);
      topToppers[batch] = sorted.slice(0, 3);
    });

    res.status(200).json(topToppers);
  } catch (error) {
    console.error('Error calculating monthly exam toppers:', error);
    res.status(500).json({ message: 'Server error fetching exam toppers' });
  }
}
