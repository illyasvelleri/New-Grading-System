import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

                const presentCount = Object.values(attendanceMap).filter((status) => status === 'present').length;
                setPresentToday(presentCount);
                setAbsentToday(students.length - presentCount);

                // Calculate total percentage of present students
                const percentage = (presentCount / students.length) * 100;
                setTotalPercentage(percentage.toFixed(2));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [batch, selectedDate]);

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
        <div className="flex flex-col md:flex-row attendance-dashboard bg-gradient-to-r from-white to-gray-100 min-h-screen p-4 sm:p-8">
            <StudentPortalSidebar />
            <div className='flex-1 p-6'>
                {/* Dashboard Header */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 p-6 bg-white shadow-lg rounded-xl">
                    <div className="bg-white text-gray-800 p-5 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium">Total Students</h3>
                        <p className="text-2xl font-bold text-blue-500">{students.length}</p>
                    </div>
                    <div className="bg-white text-gray-800 p-5 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium">Present Today</h3>
                        <p className="text-2xl font-bold text-green-500">{presentToday}</p>
                    </div>
                    <div className="bg-white text-gray-800 p-5 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium">Absent Today</h3>
                        <p className="text-2xl font-bold text-red-500">{absentToday}</p>
                    </div>
                    <div className="bg-white text-gray-800 p-5 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium">Total Present Percentage</h3>
                        <p className="text-2xl font-bold text-blue-500">{totalPercentage}%</p>
                    </div>
                </div>

                {/* Batch Filter and Date Selector */}
                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setBatch('all')}
                            className={`px-5 py-2 rounded-md text-sm font-medium ${
                                batch === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                        >
                            All Batches
                        </button>
                        {[...'1234567'].map((b) => (
                            <button
                                key={b}
                                onClick={() => setBatch(b)}
                                className={`px-5 py-2 rounded-md text-sm font-medium ${
                                    batch === b
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                Batch {b}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <label className="text-gray-800 font-medium text-sm">Select Date:</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Student Cards */}
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {students.map((student) => (
                        <div
                            key={student._id}
                            className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition duration-300"
                        >
                            <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                            <p className="text-sm text-gray-600">Token: {student.roll}</p>

                            <div className="mt-4 flex gap-3">
                                <button
                                    onClick={() => handleAttendanceMark(student._id, 'present')}
                                    className={`px-5 py-2 text-sm font-medium rounded-md text-white ${
                                        attendanceData[student._id] === 'present'
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                >
                                    Present
                                </button>
                                <button
                                    onClick={() => handleAttendanceMark(student._id, 'absent')}
                                    className={`px-5 py-2 text-sm font-medium rounded-md text-white ${
                                        attendanceData[student._id] === 'absent'
                                            ? 'bg-red-600 hover:bg-red-700'
                                            : 'bg-gray-600 hover:bg-gray-700'
                                    }`}
                                >
                                    Absent
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AttendanceDashboard;
