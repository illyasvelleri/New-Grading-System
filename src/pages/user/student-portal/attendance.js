import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

import StudentPortalSidebar from '@/components/StudentPortalSidebar';

const AttendanceDashboard = () => {
    const [students, setStudents] = useState([]);
    const [batch, setBatch] = useState('all');
    const [attendanceData, setAttendanceData] = useState({});
    const [presentToday, setPresentToday] = useState(0);
    const [absentToday, setAbsentToday] = useState(0);
    const [totalPercentage, setTotalPercentage] = useState(0);
    const [selectedDate, setSelectedDate] = useState(() => {
        return new Date().toISOString().split('T')[0]; // default to today
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch students by batch
                const studentResponse = await axios.get(`/api/students?batch=${batch}`);
                setStudents(studentResponse.data);

                // Fetch attendance for selected date
                const attendanceResponse = await axios.get(`/api/studentPortal/attendanceRecords?date=${selectedDate}&batch=${batch}`);
                const attendanceMap = {};
                attendanceResponse.data.students.forEach((record) => {
                    attendanceMap[record._id] = record.status;
                });

                setAttendanceData(attendanceMap);

                // Recalculate attendance when students and attendance data are fetched
                const presentCount = Object.values(attendanceMap).filter((status) => status === 'present').length;
                setPresentToday(presentCount);

                // Ensure to check length only after students data is fetched
                const absentCount = studentResponse.data.length - presentCount;
                setAbsentToday(absentCount);

                // Calculate total percentage of present students
                const percentage = (presentCount / studentResponse.data.length) * 100;
                setTotalPercentage(percentage.toFixed(2));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [batch, selectedDate]); // Re-run when batch or selectedDate changes


    const handleAttendanceMark = async (studentId, status) => {
        const newAttendanceData = { ...attendanceData };
        newAttendanceData[studentId] = status;

        setAttendanceData(newAttendanceData);
        const presentCount = Object.values(newAttendanceData).filter((val) => val === 'present').length;
        setPresentToday(presentCount);
        setAbsentToday(students.length - presentCount);

        // Calculate total percentage
        const percentage = (presentCount / students.length) * 100;
        setTotalPercentage(percentage.toFixed(2));

        try {
            await axios.post('/api/studentPortal/attendance', {
                studentId,
                date: selectedDate,
                status,
            });
        } catch (error) {
            console.error('Error updating attendance:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex flex-col md:flex-row">
            <StudentPortalSidebar />

            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
  <div className="bg-white p-6 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center gap-4">
    <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full">
      <i className="fas fa-users text-blue-500 text-xl"></i>
    </div>
    <div>
      <p className="text-gray-500 text-sm">Total Students</p>
      <h2 className="text-2xl font-bold text-blue-700">{students.length}</h2>
    </div>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center gap-4">
    <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full">
      <i className="fas fa-check-circle text-green-500 text-xl"></i>
    </div>
    <div>
      <p className="text-gray-500 text-sm">Present Today</p>
      <h2 className="text-2xl font-bold text-green-700">{presentToday}</h2>
    </div>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center gap-4">
    <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full">
      <i className="fas fa-times-circle text-red-500 text-xl"></i>
    </div>
    <div>
      <p className="text-gray-500 text-sm">Absent Today</p>
      <h2 className="text-2xl font-bold text-red-700">{absentToday}</h2>
    </div>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center gap-4">
    <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-full">
      <i className="fas fa-percentage text-indigo-500 text-xl"></i>
    </div>
    <div>
      <p className="text-gray-500 text-sm">Attendance %</p>
      <h2 className="text-2xl font-bold text-indigo-700">{totalPercentage}%</h2>
    </div>
  </div>
</div>



                {/* Filters */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">

                    {/* Batch Buttons */}
                    <div className="flex flex-wrap gap-3">
                        {['all', ...'1234567'].map((b) => (
                            <button
                                key={b}
                                onClick={() => setBatch(b)}
                                className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm transition duration-200 ${batch === b
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                                    }`}
                            >
                                {b === 'all' ? 'All Batches' : `Batch ${b}`}
                            </button>
                        ))}
                    </div>

                    {/* Date Picker */}
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-600">📅 Select Date:</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-4 py-2 rounded-xl border border-gray-300 shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>


                {/* Student Cards */}
                {/* Student Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {students.map((student, i) => (
                        <motion.div
                            key={student._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            whileHover={{ scale: 1.03 }}
                            className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-md p-4 border border-gray-200"
                        >
                            {/* Top Name + Roll */}
                            <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-semibold text-gray-800 truncate">{student.name}</h3>
                                <p className="text-xs text-gray-500">🎟 Token: <span className="font-medium">{student.roll}</span></p>
                            </div>

                            {/* Present / Absent Buttons */}
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => handleAttendanceMark(student._id, 'present')}
                                    className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-all duration-200 shadow-sm ${attendanceData[student._id] === 'present'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                        }`}
                                >
                                    ✅ Present
                                </button>
                                <button
                                    onClick={() => handleAttendanceMark(student._id, 'absent')}
                                    className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-all duration-200 shadow-sm ${attendanceData[student._id] === 'absent'
                                            ? 'bg-red-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    ❌ Absent
                                </button>
                            </div>

                            {/* Background Accent */}
                            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-blue-100 opacity-10 rounded-full z-0" />
                        </motion.div>
                    ))}
                </div>



            </main>
        </div>

    );
};

export default AttendanceDashboard;
