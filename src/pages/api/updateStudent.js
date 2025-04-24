import db from '../../lib/db';
import Student from '../../models/Student';

export default async function handler(req, res) {
    await db();
    if (req.method === 'POST') {
      try {
        const { studentId, month, field, value } = req.body;
        const student = await Student.findById(studentId);
        if (!student.monthlySummary) student.monthlySummary = {};
        if (!student.monthlySummary[month]) student.monthlySummary[month] = {};
        student.monthlySummary[month][field] = value;
        await student.save();
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update student' });
      }
    }
  }