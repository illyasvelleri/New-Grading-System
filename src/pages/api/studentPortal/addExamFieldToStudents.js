import db from '@/lib/db';
import Student from '@/models/Student';
import Field from '@/models/Field';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { field } = req.body;
 console.log("consoled",req.body);
  const trimmed = field?.trim();
  if (!trimmed) return res.status(400).json({ error: 'Field name is required' });

  await db();

  // Step 1: Save to Fields collection (ignore if already exists)
  try {
    await Field.updateOne({ name: trimmed }, { name: trimmed }, { upsert: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to add field to Field collection' });
  }

  // Step 2: Update all students with this field for current month
  const month = new Date().toISOString().slice(0, 7);
  const students = await Student.find({});

  const bulkOps = students.map((student) => {
    // Initialize monthlySummary if it's undefined
    if (!student.examSummary) {
      student.examSummary = {};
    }

    const currentMonth = student.examSummary[month] || {};
    if (currentMonth[trimmed] === undefined) {
      currentMonth[trimmed] = 0;
      // Ensure student.monthlySummary[month] exists before assignment
      student.examSummary[month] = currentMonth;

      return {
        updateOne: {
          filter: { _id: student._id },
          update: { examSummary: student.examSummary }
        }
      };
    }
    return null;
  }).filter(Boolean);

  if (bulkOps.length > 0) {
    await Student.bulkWrite(bulkOps);
  }

  return res.status(200).json({ message: `'${trimmed}' added to all students and field collection` });
}
