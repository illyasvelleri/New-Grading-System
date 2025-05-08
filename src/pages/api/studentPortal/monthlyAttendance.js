
import db from '@/lib/db';
import Student from '@/models/Student';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { studentId, month, total, workingDays } = req.body;
    
    // Debugging: Log the received request body to verify fields
    console.log("Request Body:", req.body);

    if (!studentId || !month || total === undefined || workingDays === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Debugging: Log before DB connection
        console.log('Connecting to DB...');
        await db();

        // Find student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Debugging: Log student and attendanceTotal
        console.log("Student found:", student);
        console.log("Current attendanceTotal:", student.attendanceTotal);

        // Ensure student.attendanceTotal is initialized
        if (!student.attendanceTotal) {
            student.attendanceTotal = {};
        }

        // Update attendanceTotal for the month
        console.log(`Saving attendance for ${month}:`, { total, workingDays });
        student.attendanceTotal.set(month, {
            total: Number(total),
            workingDays: Number(workingDays)
          });
          

        // Save the student document
        await student.save();

        return res.status(200).json({ message: 'Monthly attendance saved successfully' });
    } catch (error) {
        // Debugging: Log the detailed error
        console.error('Error saving monthly attendance:', error.message);
        console.error(error.stack); // Log the stack trace for more detail
        return res.status(500).json({ message: 'Server error while saving attendance' });
    }
}
