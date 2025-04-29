// import { useState } from 'react';

// export default function StudentProgress({ students, month }) {
//   const [selectedActivity, setSelectedActivity] = useState('');

//   // Extract unique activities from the first student's monthlySummary
//   const activityList = Array.from(
//     new Set(
//       students.flatMap((s) => Object.keys(s.monthlySummary?.[month] || {}))
//     )
//   );

//   // Sort students by selected activity value (descending)
//   const topStudents =
//     selectedActivity && students
//       .filter((s) => s.monthlySummary?.[month]?.[selectedActivity] != null)
//       .sort(
//         (a, b) =>
//           b.monthlySummary[month][selectedActivity] -
//           a.monthlySummary[month][selectedActivity]
//       );

//   return (
//     <div className="p-6 bg-white shadow-md rounded-xl w-full max-w-4xl mx-auto mt-4">
//       <div className="flex flex-wrap gap-3 mb-6">
//         {activityList.map((activity) => (
//           <button
//             key={activity}
//             onClick={() => setSelectedActivity(activity)}
//             className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
//               selectedActivity === activity
//                 ? 'bg-blue-600 text-white'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             {activity.toUpperCase()}
//           </button>
//         ))}
//       </div>

//       {selectedActivity && (
//         <div className="space-y-4">
//           <h2 className="text-lg font-semibold text-gray-700">
//             Top in {selectedActivity.toUpperCase()}
//           </h2>

//           {topStudents.map((student) => {
//             const value = student.monthlySummary[month][selectedActivity];
//             const max = topStudents[0]?.monthlySummary[month][selectedActivity] || 100;
//             const percent = (value / max) * 100;

//             return (
//               <div key={student._id}>
//                 <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
//                   <span>
//                     {student.name} ({student.roll})
//                   </span>
//                   <span>{value}</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-3">
//                   <div
//                     className="bg-blue-500 h-3 rounded-full transition-all"
//                     style={{ width: `${percent}%` }}
//                   />
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }
