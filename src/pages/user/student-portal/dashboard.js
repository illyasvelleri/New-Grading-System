'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentPortalSidebar from '../../../components/StudentPortalSidebar';

const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [absentToday, setAbsentToday] = useState(0);
  const [batchStats, setBatchStats] = useState({});
  const [magazineStats, setMagazineStats] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [magazineLoading, setMagazineLoading] = useState(false);
  const [topToppers, setTopToppers] = useState({});

  const monthMapping = {
    January: '01', February: '02', March: '03', April: '04',
    May: '05', June: '06', July: '07', August: '08',
    September: '09', October: '10', November: '11', December: '12',
  };

  const currentYear = new Date().getFullYear();
  const activities = ['Al-Zahra', 'Darshanam'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/studentPortal/statsToday');
        setTotalStudents(res.data.totalStudents);
        setPresentToday(res.data.presentToday);
        setAbsentToday(res.data.absentToday);
        setBatchStats(res.data.batchStats);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchMagazineData = async () => {
      if (!selectedMonth) return;
      setMagazineLoading(true);
      try {
        const monthNumber = monthMapping[selectedMonth];
        const formattedMonth = `${currentYear}-${monthNumber}`;
        const res = await axios.get(`/api/magazine-activities?month=${formattedMonth}`);
        setMagazineStats(res.data);
      } catch (err) {
        console.error('Error fetching magazine data:', err.message);
      } finally {
        setMagazineLoading(false);
      }
    };

    fetchMagazineData();
  }, [selectedMonth]);

  useEffect(() => {
    const fetchToppers = async () => {
      try {
        const monthNumber = monthMapping[selectedMonth];
        const formattedMonth = `${currentYear}-${monthNumber}`;
        const response = await axios.get(`/api/studentPortal/examTopers?month=${formattedMonth}`);
        setTopToppers(response.data);
      } catch (error) {
        console.error('Failed to fetch exam toppers:', error.message);
      }
    };

    fetchToppers();
  }, [selectedMonth]);

  // Calculate magazine activity totals
  const calculateActivityTotal = (activity) => {
    const monthKey = `${currentYear}-${monthMapping[selectedMonth]}`;
    return magazineStats.reduce((sum, student) => {
      return sum + (student.monthlySummary?.[monthKey]?.[activity] || 0);
    }, 0);
  };

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-b from-blue-50 to-white min-h-screen text-gray-900 font-sans">
      {/* Main content */}
      {/* Sidebar */}
      <StudentPortalSidebar />
      <div className="flex-1 mb-12 pt-16">
        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="">
            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Students</span>
                  <span className="mt-2 text-2xl font-bold text-gray-800">{totalStudents}</span>
                  <span className="mt-1 text-xs text-gray-500">Registered students</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Present Today</span>
                  <div className="flex items-baseline mt-2">
                    <span className="text-2xl font-bold text-gray-800">{presentToday}</span>
                    <span className="ml-2 text-xs font-medium text-green-500">
                      {((presentToday / totalStudents) * 100 || 0).toFixed(0)}%
                    </span>
                  </div>
                  <span className="mt-1 text-xs text-gray-500">Students in attendance</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Absent Today</span>
                  <div className="flex items-baseline mt-2">
                    <span className="text-2xl font-bold text-gray-800">{absentToday}</span>
                    <span className="ml-2 text-xs font-medium text-red-500">
                      {((absentToday / totalStudents) * 100 || 0).toFixed(0)}%
                    </span>
                  </div>
                  <span className="mt-1 text-xs text-gray-500">Missing students</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Activities</span>
                  <div className="flex items-baseline mt-2">
                    <span className="text-2xl font-bold text-gray-800">
                      {!magazineLoading ? activities.reduce((sum, activity) => sum + calculateActivityTotal(activity), 0) : "-"}
                    </span>
                  </div>
                  <span className="mt-1 text-xs text-gray-500">Total this month</span>
                </div>
              </div>
            </div>

            {/* Batches and Activities Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              {/* Batch attendance section - Takes 2/3 width on desktop */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-medium text-gray-800">Batch Attendance</h3>
                  <div className="text-xs text-gray-500">Today's data</div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(batchStats).map(([batchName, stats], index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-700">Batch {batchName}</h4>
                          <p className="text-xs text-gray-500 mt-1">Total: {stats.total} students</p>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-xl text-blue-600">{stats.present}</div>
                          <p className="text-xs text-gray-500">Present</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">📰 Magazine Activities</h3>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="text-sm bg-gray-50 border border-gray-300 rounded-md py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.keys(monthMapping).map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>

                {/* Content */}
                <div className="p-5">
                  {magazineLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div key={activity} className="bg-gray-50 rounded-lg p-4 hover:shadow-sm transition duration-200 ease-in-out">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium text-gray-700">{activity}</h4>
                            <span className="text-lg font-bold text-blue-600">{calculateActivityTotal(activity)}</span>
                          </div>
                        </div>
                      ))}
                      <button className="w-full py-2.5 mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-200">
                        View Details
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Top Toppers Section */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-gray-900">🏆 Top Performers by Batch</h3>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="text-sm bg-gray-50 border border-gray-300 rounded-md py-1.5 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.keys(monthMapping).map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>

              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(topToppers).map(([batch, students]) => (
                  <div key={batch} className="bg-gray-50 rounded-xl p-4 hover:shadow transition duration-200 ease-in-out">
                    <h4 className="text-sm font-semibold text-gray-700 pb-2 mb-3 border-b border-gray-200">
                      🎓 Batch {batch}
                    </h4>

                    {students.length > 0 ? (
                      <ul className="space-y-3">
                        {students.map((student, index) => {
                          const rankColors = [
                            'bg-yellow-400 text-yellow-900',
                            'bg-gray-400 text-white',
                            'bg-amber-700 text-white',
                          ];
                          const badgeColor = rankColors[index] || 'bg-blue-500 text-white';
                          return (
                            <li key={student._id || index} className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${badgeColor}`}>
                                  {index + 1}
                                </span>
                                <span className="text-sm text-gray-800 font-medium">{student.name}</span>
                              </div>
                              <span className="text-sm font-bold text-blue-600">{student.total}</span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="text-center py-4 text-sm text-gray-500 italic">
                        No data available
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;