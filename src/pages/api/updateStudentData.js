import db from '../../lib/db';
import Student from '../../models/Student';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { studentId, month, updates } = req.body;

  if (!studentId || !month || !updates || typeof updates !== 'object') {
    return res.status(400).json({ error: 'Missing or invalid required fields' });
  }

  try {
    await db();

    // Build nested update paths using dot notation
    const updatePayload = {};
    for (const key in updates) {
      updatePayload[`monthlySummary.${month}.${key}`] = Number(updates[key]);
    }

    const result = await Student.updateOne(
      { _id: studentId },
      { $set: updatePayload }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Student not found or no changes made' });
    }

    return res.status(200).json({ message: 'Student data updated' });
  } catch (err) {
    console.error('Update Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
