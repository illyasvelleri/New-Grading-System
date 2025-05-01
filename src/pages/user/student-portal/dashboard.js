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
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-tr from-blue-50 via-gray-50 to-white text-sm text-gray-800 transition-colors duration-300">
      <StudentPortalSidebar />
      <div className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-xl font-bold">Alathurpadi Dars</div>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 bg-gray-100 rounded-full outline-none"
            />
            <div className="w-10 h-10 rounded-full bg-gray-300" />
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Stats */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Overall Stats</h2>
            <div className="text-4xl font-bold mb-6">{totalStudents} Students</div>
            <div className="space-y-4">
              <div className="flex justify-between bg-blue-50 p-4 rounded-lg">
                <div>
                  <p className="font-semibold">Present Today</p>
                  <p className="text-sm text-gray-500">{presentToday} Students</p>
                </div>
                <div className="text-green-600 font-bold">
                  {((presentToday / totalStudents) * 100 || 0).toFixed(0)}%
                </div>
              </div>
              <div className="flex justify-between bg-red-50 p-4 rounded-lg">
                <div>
                  <p className="font-semibold">Absent Today</p>
                  <p className="text-sm text-gray-500">{absentToday} Students</p>
                </div>
                <div className="text-red-500 font-bold">
                  {((absentToday / totalStudents) * 100 || 0).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          {/* Center - Magazine Progress */}
          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold mb-4">Magazine Progress</h2>
            <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
              <MagazineProgress />
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
              Learn More
            </button>
          </div>

          {/* Right - Batch Attendance */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Batch Attendance</h2>
            <div className="space-y-3">
              {Object.entries(batchStats).map(([batchName, stats], index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      📚
                    </div>
                    <div>
                      <p className="font-semibold">Batch {batchName}</p>
                      <p className="text-sm text-gray-500">
                        {stats.present} / {stats.total} Present
                      </p>
                    </div>
                  </div>
                  <div className="text-green-600 font-semibold">
                    {((stats.present / stats.total) * 100 || 0).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom - Attendance Graph */}
          <div className="col-span-2 bg-white p-6 rounded-2xl shadow-lg mt-6">
            <h2 className="text-lg font-semibold mb-4">Attendance Over Time</h2>
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Graph Placeholder</p>
            </div>
          </div>

          {/* Bottom Right - Performance Score */}
          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center mt-6">
            <h2 className="text-lg font-semibold mb-4">Performance Score</h2>
            <div className="relative w-32 h-32 mb-2">
              <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                <p className="text-3xl font-bold text-gray-700">720</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">Excellent</p>
            <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
              Explore Benefits
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
