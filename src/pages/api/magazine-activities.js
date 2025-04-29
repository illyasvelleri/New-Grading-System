import { stringify } from 'postcss';
import db from '../../lib/db'; // adjust path if needed
import Student from '../../models/Student';  // your mongoose model

export default async function handler(req, res) {
  await db();
  console.log("called");
  const { month } = req.query; // example: 2025-04
  console.log("received", req.query);

  if (!month) {
    return res.status(400).json({ message: "Month is required" });
  }

  try {
    // Only select necessary fields
    const students = await Student.find({}, 'name roll batch monthlySummary').lean();
    console.log(students);
    // filter students who have any Al-Zahra or Darshanam record for that month
    const filteredStudents = students.map((student) => {
      const summary = student.monthlySummary?.[month];
      return {
        _id: student._id,
        name: student.name,
        roll: student.roll,
        batch: student.batch,
        monthlySummary: {
          [month]: {
            'Al-Zahra': summary?.['Al-Zahra'] || 0,
            'Darshanam': summary?.['Darshanam'] || 0,
          }
        }
      };
    });
    console.log("filtered::", JSON.stringify(filteredStudents, null, 2));

    res.status(200).json(filteredStudents);

  } catch (error) {
    console.error('Error fetching student activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
}


// import db from '../../lib/db'; // adjust path if needed
// import Student from '../../models/Student';  // your mongoose model

// export default async function handler(req, res) {
//   await db();
//   console.log("called");
//   const { month } = req.query; // example: 2025-04
//   console.log("received", req.query);

//   if (!month) {
//     return res.status(400).json({ message: "Month is required" });
//   }

//   try {
//     // Only select necessary fields
//     const students = await Student.find({}, 'monthlySummary').lean();

//     // Initialize total counters
//     let totalAlZahra = 0;
//     let totalDarshanam = 0;

//     students.forEach(student => {
//       const summary = student.monthlySummary?.[month];
//       if (summary) {
//         totalAlZahra += summary['Al-Zahra'] || 0;
//         totalDarshanam += summary['Darshanam'] || 0;
//       }
//     });

//     res.status(200).json({
//       month,
//       totalAlZahra,
//       totalDarshanam
//     });

//   } catch (error) {
//     console.error('Error fetching student activities:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// }
