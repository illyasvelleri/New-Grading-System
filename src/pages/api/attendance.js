// // pages/api/attendance.js
// import db from '../../lib/db';
// import Student from '../../models/Student';

// export default async function handler(req, res) {
//     await db();

//     if (req.method === 'POST') {
//         try {
//             const { studentId, date, status } = req.body;
//             console.log("hajar:", req.body);
//             if (!studentId || !date || !status) {
//                 return res.status(400).json({ error: 'Missing required fields' });
//             }

//             // Check if the status is valid
//             if (!['present', 'absent'].includes(status)) {
//                 return res.status(400).json({ error: 'Invalid attendance status' });
//             }

//             // Update the attendance for the given student and date
//             const result = await Student.updateOne(
//                 { _id: studentId },
//                 { $set: { [`attendance.${date}`]: status } }
//             );

//             if (result.modifiedCount === 0) {
//                 return res.status(404).json({ error: 'Student not found or attendance already updated' });
//             }

//             res.status(200).json({ message: 'Attendance updated successfully' });
//         } catch (error) {
//             console.error('Error updating attendance:', error);
//             res.status(500).json({ error: 'Internal Server Error' });
//         }
//     } else {
//         res.status(405).json({ error: 'Method Not Allowed' });
//     }
// }
// pages/api/attendance.js
// Assuming this handler is for marking attendance.
import db from '../../lib/db';
import Student from '../../models/Student';

export default async function handler(req, res) {
  await db();

  if (req.method === 'POST') {
    try {
      const { studentId, date, status } = req.body;

      // Find the student by studentId
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      // Ensure the attendance field is initialized as a Map if it is undefined
      if (!student.attendance) {
        student.attendance = new Map();
      }

      // Update the attendance map for the specific date
      student.attendance.set(date, status);

      // Save the updated student document
      await student.save();

      res.status(200).json({ message: 'Attendance updated successfully' });
    } catch (error) {
      console.error('Error updating attendance:', error);
      res.status(500).json({ error: 'Failed to update attendance' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
