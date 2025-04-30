import db from '@/lib/db';
import Student from '@/models/Student';
import Field from '@/models/Field';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  await db();
  const { field } = req.body;

  if (!field) return res.status(400).json({ error: 'Field is required' });

  try {
    // 1. Delete the field from the Field collection
    await Field.deleteOne({ name: field });

    // 2. Remove the field from all students' monthlySummary
    const students = await Student.find();
    let updatedCount = 0;

    for (const student of students) {
      let updated = false;

      if (student.examSummary) {
        for (const [month, summary] of student.examSummary.entries()) {
          if (summary[field] !== undefined) {
            delete summary[field];
            student.examSummary.set(month, summary);
            updated = true;
          }
        }
      }

      if (updated) {
        student.markModified('examSummary');
        await student.save();
        updatedCount++;
      }
    }

    return res.status(200).json({ message: `✅ Field "${field}" deleted from DB and ${updatedCount} students` });
  } catch (err) {
    console.error('❌ Error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
