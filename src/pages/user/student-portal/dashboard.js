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
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar */}
      <StudentPortalSidebar />

      {/* Main Content */}
      <div className="flex-1 pl-0 pt-20 pb-8">
        {/* Dashboard content */}
        <main className="px-4 sm:px-6 lg:px-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl shadow-lg mb-8 overflow-hidden">
            <div className="px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Welcome to Student Portal</h1>
                <p className="mt-2 text-indigo-100">Here's what's happening at Althurpadi Dars today</p>
              </div>
              <div className="mt-4 md:mt-0 bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-lg">
                <p className="text-white text-sm font-medium">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Students Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center px-6 py-5">
                <div className="bg-blue-50 rounded-lg p-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-2xl font-bold text-gray-800">{totalStudents}</p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Registered students</p>
                </div>
              </div>
            </div>

            {/* Present Today Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center px-6 py-5">
                <div className="bg-green-50 rounded-lg p-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-sm font-medium text-gray-500">Present Today</h3>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-2xl font-bold text-gray-800">{presentToday}</p>
                    <p className="ml-2 text-sm font-medium text-green-600">
                      {((presentToday / totalStudents) * 100 || 0).toFixed(0)}%
                    </p>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-green-500 h-1.5 rounded-full"
                      style={{ width: `${((presentToday / totalStudents) * 100 || 0).toFixed(0)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Absent Today Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center px-6 py-5">
                <div className="bg-red-50 rounded-lg p-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-sm font-medium text-gray-500">Absent Today</h3>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-2xl font-bold text-gray-800">{absentToday}</p>
                    <p className="ml-2 text-sm font-medium text-red-600">
                      {((absentToday / totalStudents) * 100 || 0).toFixed(0)}%
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Missing students</p>
                </div>
              </div>
            </div>

            {/* Activities Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center px-6 py-5">
                <div className="bg-purple-50 rounded-lg p-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-sm font-medium text-gray-500">Activities</h3>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-2xl font-bold text-gray-800">
                      {!magazineLoading ? activities.reduce((sum, activity) => sum + calculateActivityTotal(activity), 0) : "-"}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Total this month</p>
                </div>
              </div>
            </div>
          </div>

          {/* Batches and Activities Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Batch attendance section - Takes 2/3 width on desktop */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="font-semibold text-gray-800">Batch Attendance</h3>
                </div>
                <div className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Today's data
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {Object.entries(batchStats).map(([batchName, stats], index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-indigo-200 transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                          </svg>
                          <h4 className="font-semibold text-gray-800">Batch {batchName}</h4>
                        </div>
                        <div className="mt-3 flex items-center">
                          <span className="text-xs font-medium text-gray-500">Attendance:</span>
                          <div className="ml-2 w-24 bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-indigo-500 h-1.5 rounded-full"
                              style={{ width: `${((stats.present / stats.total) * 100).toFixed(0)}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs font-medium text-indigo-600">
                            {((stats.present / stats.total) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div className="font-bold text-xl text-gray-800">{stats.present}</div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">of {stats.total} students</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Magazine Activities Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="font-semibold text-gray-800">Magazine Activities</h3>
                </div>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="text-sm bg-white border border-gray-200 rounded-lg py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {Object.keys(monthMapping).map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>

              <div className="p-6">
                {magazineLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div
                        key={activity}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-purple-200 transition-all duration-300"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <h4 className="font-medium text-gray-700">{activity}</h4>
                          </div>
                          <span className="text-lg font-bold text-purple-600">{calculateActivityTotal(activity)}</span>
                        </div>
                      </div>
                    ))}
                    <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-sm flex items-center justify-center">
                      <span>View Details</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Toppers Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <h3 className="font-semibold text-gray-800">Top Performers by Batch</h3>
              </div>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-sm bg-white border border-gray-200 rounded-lg py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                {Object.keys(monthMapping).map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(topToppers).map(([batch, students]) => (
                <div
                  key={batch}
                  className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-yellow-200 transition-all duration-300"
                >
                  <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h4 className="font-semibold text-gray-800">
                      Batch {batch}
                    </h4>
                  </div>

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
                          <li key={student._id || index} className="flex justify-between items-center p-2 hover:bg-white rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                              <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${badgeColor}`}>
                                {index + 1}
                              </span>
                              <span className="font-medium text-gray-800">{student.name}</span>
                            </div>
                            <span className="flex items-center font-bold text-indigo-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                              {student.total}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="flex items-center justify-center py-8 text-sm text-gray-500 italic">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      No data available
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

