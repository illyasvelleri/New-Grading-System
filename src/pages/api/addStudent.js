// import db from '../../lib/db';
// import Student from '../../models/Student';

// export default async function handler(req, res) {
//   await db();
//   if (req.method === 'POST') {
//     try {
//       const { name, batch } = req.body;
//       console.log("sss:", req.body);
//       const roll = Math.floor(1000 + Math.random() * 9000); // generate 4-digit roll
//       const student = await Student.create({ name, batch, roll });
//       res.status(200).json(student);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to add student' });
//     }
//   }
// }



import db from '../../lib/db';
import Student from '../../models/Student';

export default async function handler(req, res) {
  await db();
  if (req.method === 'POST') {
    try {
      const { name, batch } = req.body;

      // Step 1: Find the student with the highest roll number
      const lastStudent = await Student.findOne().sort({ roll: -1 }).limit(1);
      const lastRoll = lastStudent ? lastStudent.roll : 999; // start from 1000

      // Step 2: Generate next roll number (ensuring 4 digits)
      let nextRoll = lastRoll + 1;
      console.log(nextRoll, "next")
      
      // Step 3: Create the student
      const student = await Student.create({ name, batch, roll: nextRoll });
      res.status(200).json(student);

    } catch (error) {
      console.error('Error creating student:', error);
      res.status(500).json({ error: 'Failed to add student' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}




