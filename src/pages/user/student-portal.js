// pages/user/student-portal.js
import { useState } from 'react';

export default function StudentPortal() {
  const [roll, setRoll] = useState('');
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');

  const fetchStudent = async () => {
    setError('');
    setStudent(null);

    if (!roll) {
      setError('Please enter a roll number');
      return;
    }

    try {
      const res = await fetch(`/api/studentPortal/getStudentByRoll?roll=${roll}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      setStudent(data.student);
    } catch (err) {
      setError(err.message);
    }
  };

  const renderSection = (title, data) => {
    if (!data || typeof data !== 'object') return null;

    return (
      <div>
        <h4 className="text-lg font-semibold text-blue-700 mb-2">{title}</h4>
        <div className="space-y-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="bg-gray-50 p-3 rounded border">
              <p className="font-medium text-gray-600 mb-1">{key}</p>
              {typeof value === 'object' ? (
                <ul className="text-sm text-gray-800 list-disc pl-5">
                  {Object.entries(value).map(([subKey, subValue]) => (
                    <li key={subKey}>
                      <span className="font-medium">{subKey}</span>: {subValue}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-800">{value}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Student Portal</h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter Roll Number"
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchStudent}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {student && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Student Details</h3>
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Roll:</strong> {student.roll}</p>
            <p><strong>Batch:</strong> {student.batch}</p>
          </div>

          {renderSection('Exam Summary', student.examSummary)}
          {renderSection('Monthly Summary', student.monthlySummary)}
          {/* {renderSection('Attendance', student.attendanceSummary)} */}
          {renderSection('Attendance Total', student.attendanceTotal)}
        </div>
      )}
    </div>
  );
}
