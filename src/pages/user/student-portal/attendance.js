import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendanceDashboard = () => {
    const [students, setStudents] = useState([]);
    const [batch, setBatch] = useState('all');
    const [attendanceData, setAttendanceData] = useState({});
    const [presentToday, setPresentToday] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/students?batch=${batch}`);
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchData();
    }, [batch]);

    // Function to handle attendance marking
    const handleAttendanceMark = async (studentId, status) => {
        const newAttendanceData = { ...attendanceData };
        newAttendanceData[studentId] = status;

        setAttendanceData(newAttendanceData);

        // Update present count
        setPresentToday(Object.values(newAttendanceData).filter(Boolean).length);

        // Optionally, make an API call to save attendance in the database (depending on your setup)
        try {
            const date = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
            await axios.post('/api/attendance', {
                studentId,
                date,
                status,
            });
        } catch (error) {
            console.error('Error updating attendance:', error);
        }
    };

    return (
        <div className="attendance-dashboard bg-gradient-to-r from-white to-gray-100 min-h-screen p-8">
            {/* Dashboard Header */}
            <div className="dashboard-header grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 p-6 bg-white shadow-lg rounded-lg">

                {/* Total Students Card */}
                <div className="stat-card bg-white text-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                    <h3 className="text-lg font-semibold">Total Students</h3>
                    <p className="text-2xl font-bold text-blue-500">{students.length}</p>
                </div>

                {/* Present Today Card */}
                <div className="stat-card bg-white text-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                    <h3 className="text-lg font-semibold">Present Today</h3>
                    <p className="text-2xl font-bold text-green-500">{presentToday}</p>
                </div>

                {/* Absent Today Card (optional) */}
                <div className="stat-card bg-white text-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                    <h3 className="text-lg font-semibold">Absent Today</h3>
                    <p className="text-2xl font-bold text-red-500">{students.length - presentToday}</p>
                </div>
            </div>

            {/* View Toggle and Batch Selection */}
            <div className="view-toggle flex justify-between gap-4 mb-6">
                <div className="flex gap-4">
                    <button
                        onClick={() => setBatch('all')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
                    >
                        All Batches
                    </button>
                    {[...'1234567'].map((b) => (
                        <button
                            key={b}
                            onClick={() => setBatch(b)}
                            className={`px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none ${batch === b && 'bg-blue-600 text-white'}`}
                        >
                            Batch {b}
                        </button>
                    ))}
                </div>

                <div className="batch-selector flex items-center">
                    <label className="text-lg font-medium text-gray-800 mr-2">Select Batch:</label>
                    <select
                        onChange={(e) => setBatch(e.target.value)}
                        className="p-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Batches</option>
                        {[...'1234567'].map((b) => (
                            <option key={b} value={b}>Batch {b}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Student List Grid */}
            <div className="student-list grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {students.map((student) => (
                    <div key={student._id} className="student-item bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                        <h3 className="text-xl font-semibold text-gray-800">{student.name}</h3>
                        <p className="text-gray-600">Token Number: {student.roll}</p>

                        <div className="attendance-buttons mt-4 flex gap-4">
                            <button
                                onClick={() => handleAttendanceMark(student._id, 'present')}
                                className={`px-6 py-2 rounded-lg text-white transition duration-300 ${attendanceData[student._id] === 'present' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                Present
                            </button>
                            <button
                                onClick={() => handleAttendanceMark(student._id, 'absent')}
                                className={`px-6 py-2 rounded-lg text-white transition duration-300 ${attendanceData[student._id] === 'absent' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                            >
                                Absent
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>


    );
};

export default AttendanceDashboard;
