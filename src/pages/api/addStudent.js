import db from '../../lib/db';
import Student from '../../models/Student';

export default async function handler(req, res) {
    await db();
    if (req.method === 'POST') {
      try {
        const { name, batch } = req.body;
        console.log("sss:", req.body);
        const roll = Math.floor(1000 + Math.random() * 9000); // generate 4-digit roll
        const student = await Student.create({ name, batch, roll });
        res.status(200).json(student);
      } catch (error) {
        res.status(500).json({ error: 'Failed to add student' });
      }
    }
  }

  