// pages/api/getStudentByRoll.js
import db from '@/lib/db';
import Student from '@/models/Student';

export default async function handler(req, res) {
  await db(); // Connect to MongoDB

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { roll } = req.query;

  if (!roll) {
    return res.status(400).json({ message: 'Roll number is required' });
  }

  try {
    const student = await Student.findOne({ roll });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ student });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
