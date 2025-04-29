// pages/api/studentPortal/attendance.js

import db from '@/lib/db'; // Adjust the path if needed
import Student from '@/models/Student';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { studentId, date, status } = req.body;

  if (!studentId || !date || !status) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await db();

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Set the attendance for the specific date
    student.attendanceSummary.set(date, status);

    await student.save();

    res.status(200).json({ message: 'Attendance updated successfully' });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
