import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import StudentPortalSidebar from '@/components/StudentPortalSidebar';

const AttendanceDashboard = () => {
    const [students, setStudents] = useState([]);
    const [batch, setBatch] = useState('all');
    const [attendanceData, setAttendanceData] = useState({});
    const [workingDaysData, setWorkingDaysData] = useState({});
    const [loading, setLoading] = useState(false);

    const [presentToday, setPresentToday] = useState(0);
    const [absentToday, setAbsentToday] = useState(0);
    const [totalPercentage, setTotalPercentage] = useState(0);
    const [viewMode, setViewMode] = useState('day');
    const [selectedDate, setSelectedDate] = useState(() =>
        new Date().toISOString().split('T')[0]
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const studentResponse = await axios.get(`/api/students?batch=${batch}`);
                setStudents(studentResponse.data);

                let attendanceMap = {};
                let workingMap = {};

                if (viewMode === 'day') {
                    const response = await axios.get(
                        `/api/studentPortal/attendanceRecords?date=${selectedDate}&batch=${batch}`
                    );
                    response.data.students.forEach((record) => {
                        attendanceMap[record._id] = record.status;
                    });
                    const presentCount = Object.values(attendanceMap).filter(
                        (status) => status === 'present'
                    ).length;
                    setPresentToday(presentCount);
                    setAbsentToday(studentResponse.data.length - presentCount);
                    setTotalPercentage(
                        ((presentCount / studentResponse.data.length) * 100).toFixed(2)
                    );
                } else {
                    const response = await axios.get(
                        `/api/studentPortal/monthlyAttendanceRecords?month=${selectedDate.slice(0, 7)}&batch=${batch}`
                    );
                    response.data.forEach((record) => {
                        attendanceMap[record.studentId] = record.total;
                        workingMap[record.studentId] = record.workingDays;
                    });
                    setAttendanceData(attendanceMap);
                    setWorkingDaysData(workingMap);

                    let totalPresent = 0;
                    let totalWorking = 0;
                    response.data.forEach((rec) => {
                        totalPresent += rec.total;
                        totalWorking += rec.workingDays;
                    });

                    setPresentToday(totalPresent);
                    setAbsentToday(totalWorking - totalPresent);
                    setTotalPercentage(
                        totalWorking > 0 ? ((totalPresent / totalWorking) * 100).toFixed(2) : 0
                    );
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, [batch, selectedDate, viewMode]);

    const handleAttendanceMark = async (studentId, status) => {
        const newAttendanceData = { ...attendanceData, [studentId]: status };
        setAttendanceData(newAttendanceData);

        const presentCount = Object.values(newAttendanceData).filter((val) => val === 'present').length;
        setPresentToday(presentCount);
        setAbsentToday(students.length - presentCount);
        setTotalPercentage(((presentCount / students.length) * 100).toFixed(2));

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

    const handleSaveAttendance = async (studentId) => {
        const total = attendanceData[studentId];
        const workingDays = workingDaysData[studentId];

        if (total === undefined || workingDays === undefined) {
            alert('Enter both attendance and working days');
            return;
        }

        try {
            setLoading(true);
            await axios.post('/api/studentPortal/monthlyAttendance', {
                studentId,
                month: selectedDate.slice(0, 7),
                total,
                workingDays,
            });
            alert('Attendance saved successfully!');
        } catch (error) {
            console.error('Error saving attendance:', error);
            alert('Error saving. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex flex-col md:flex-row">
            <StudentPortalSidebar />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 py-16">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
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
                                {b === 'all' ? 'All Batches' : `${b}`}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('day')}
                            className={`px-4 py-2 rounded-xl ${viewMode === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Day View
                        </button>
                        <button
                            onClick={() => setViewMode('month')}
                            className={`px-4 py-2 rounded-xl ${viewMode === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Monthly View
                        </button>
                    </div>


                    {/* Date Picker */}
                    {viewMode === 'day' ? (
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-4 py-2 rounded-xl border"
                        />
                    ) : (
                        <input
                            type="month"
                            value={selectedDate.slice(0, 7)} // yyyy-mm
                            onChange={(e) => setSelectedDate(e.target.value + '-01')} // add dummy day
                            className="px-4 py-2 rounded-xl border"
                        />
                    )}

                </div>


                {/* Student Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {students.map((student, i) => (
                        <motion.div
                            key={student._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            whileHover={{ scale: 1.03 }}
                            className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-md p-5 border border-gray-200 overflow-hidden"
                        >
                            {/* Student Name + Roll */}
                            <div className="flex flex-col gap-1 z-10 relative">
                                <h3 className="text-lg font-semibold text-gray-800 truncate">{student.name}</h3>
                                <p className="text-xs text-gray-500">
                                    🎟 Token: <span className="font-medium">{student.roll}</span>
                                </p>
                            </div>

                            {/* Attendance Controls */}
                            <div className="mt-5 z-10 relative">
                                {viewMode === 'day' ? (
                                    <div className="flex gap-3 flex-wrap">
                                        <button
                                            onClick={() => handleAttendanceMark(student._id, 'present')}
                                            className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium shadow-md transition"
                                        >
                                            ✅ Present
                                        </button>
                                        <button
                                            onClick={() => handleAttendanceMark(student._id, 'absent')}
                                            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium shadow-md transition"
                                        >
                                            ❌ Absent
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap items-center gap-3">
                                        {/* Present Days Input */}
                                        <input
                                            id={`attendance-${student._id}`}
                                            type="number"
                                            min="0"
                                            value={attendanceData[student._id] || ''}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value, 10);
                                                if (!isNaN(val)) {
                                                    setAttendanceData((prev) => ({
                                                        ...prev,
                                                        [student._id]: val,
                                                    }));
                                                }
                                            }}
                                            placeholder="Present Days"
                                            className="flex-1 min-w-[120px] border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />

                                        {/* Working Days Input */}
                                        <input
                                            id={`working-${student._id}`}
                                            type="number"
                                            min="0"
                                            value={workingDaysData[student._id] || ''}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value, 10);
                                                if (!isNaN(val)) {
                                                    setWorkingDaysData((prev) => ({
                                                        ...prev,
                                                        [student._id]: val,
                                                    }));
                                                }
                                            }}
                                            placeholder="Working Days"
                                            className="flex-1 min-w-[120px] border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />

                                        {/* Save Button */}
                                        <button
                                            onClick={() => handleSaveAttendance(student._id)}
                                            disabled={loading}
                                            className="flex-1 sm:flex-none min-w-[100px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition"
                                        >
                                            {loading ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                )}
                            </div>


                            {/* Soft Background Accent */}
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-200 opacity-10 rounded-full z-0" />
                        </motion.div>
                    ))}
                </div>




            </main>
        </div>

    );
};

export default AttendanceDashboard;
