'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentPortalSidebar from '../../../components/StudentPortalSidebar';
import MagazineProgress from "@/components/MagazineProgress";

const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [absentToday, setAbsentToday] = useState(0);
  const [batchStats, setBatchStats] = useState({});

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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-pink-100 via-orange-100 to-yellow-50 text-gray-900 font-sans">
      <StudentPortalSidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-10">
        {/* Topbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <h1 className="text-3xl font-bold text-pink-600">Alathurpadi Dars</h1>
          <div className="flex items-center w-full sm:w-auto gap-3">
            <input
              type="text"
              placeholder="Search"
              className="flex-1 px-4 py-2 bg-white rounded-full border border-pink-300 shadow focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <div className="w-10 h-10 rounded-full bg-pink-400 shadow-inner" />
          </div>
        </div>

        {/* Main Layout */}
        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Overall Stats - 6/12 */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="bg-green-400 p-8 rounded-3xl shadow-xl">
              <h2 className="text-2xl font-bold text-pink-500 mb-4">Overall Stats</h2>
              <div className="text-5xl font-extrabold text-gray-800 mb-6">{totalStudents} Students</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-100 p-6 rounded-2xl flex justify-between items-center shadow">
                  <div>
                    <p className="text-lg font-semibold">Present Today</p>
                    <p className="text-sm text-gray-600">{((presentToday / totalStudents) * 100 || 0).toFixed(0)}%</p>
                  </div>
                  <span className="text-green-700 font-bold text-2xl">{presentToday} Student</span>
                </div>
                <div className="bg-red-100 p-6 rounded-2xl flex justify-between items-center shadow">
                  <div>
                    <p className="text-lg font-semibold">Absent Today</p>
                    <p className="text-sm text-gray-600">{((absentToday / totalStudents) * 100 || 0).toFixed(0)}%</p>
                  </div>
                  <span className="text-red-600 font-bold text-2xl">{absentToday} Students</span>
                </div>
              </div>
            </div>
          </div>

          {/* Magazine Progress - 3/12 */}
          <div className='lg:col-span-3 flex flex-col gap-6'>
          <MagazineProgress />
            </div>

          {/* Batch Attendance - 9/12 */}
          <div className="lg:col-span-9 bg-white p-6 rounded-3xl shadow-xl h-fit">
            <h2 className="text-2xl font-bold text-pink-500 mb-6">Batch Attendance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(batchStats).map(([batchName, stats], index) => (
                <div
                  key={index}
                  className="flex flex-col bg-pink-50 rounded-3xl border border-pink-100 shadow-md p-4 hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-pink-400 text-white text-xl flex items-center justify-center rounded-full shadow-lg">
                        📘
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-base sm:text-lg mb-1">Batch {batchName}</p>
                      <div className="flex justify-between items-center text-xs text-gray-600">
                        <p>Total: <span className="font-medium">{stats.total}</span></p>
                        <span className="bg-pink-100 text-pink-600 font-semibold px-3 py-1 rounded-full shadow-sm text-xs">
                          {stats.present} Present
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>



        {/* <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold text-pink-500 mb-4">Attendance Over Time</h2>
            <div className="w-full h-48 bg-pink-50 rounded-xl flex items-center justify-center shadow-inner">
             
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-between">
            <h2 className="text-lg font-semibold text-pink-500 mb-4">Performance Score</h2>
            <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center shadow-inner text-2xl font-bold text-pink-700">
              720
            </div>
            <p className="text-sm text-gray-600 mt-3 mb-2">Excellent</p>
            <button className="px-4 py-2 bg-pink-400 text-white rounded-full hover:bg-pink-500 transition">
              Explore Benefits
            </button>
          </div>
        </div> */}
      </div>
    </div>




  );
};

export default Dashboard;
