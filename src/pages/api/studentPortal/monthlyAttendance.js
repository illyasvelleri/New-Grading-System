import db from '@/lib/db';
import Student from '@/models/Student'; // Import your Student model

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { studentId, month, total } = req.body;
        console.log("rccc");
        try {
            // Connect to the database
            await db();

            // Find the student by studentId
            const student = await Student.findById(studentId);

            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }

            // Update the attendanceTotal for the given month
            student.attendanceTotal.set(month, total);

            // Save the updated student document
            await student.save();

            return res.status(200).json({ message: 'Attendance saved/updated successfully!' });
        } catch (error) {
            console.error('Error saving attendance:', error);
            return res.status(500).json({ message: 'An error occurred while saving attendance.' });
        }
    } else {
        // Handle non-POST requests
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
