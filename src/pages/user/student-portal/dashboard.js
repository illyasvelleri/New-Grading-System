

import React, { useEffect, useState } from 'react';
import { HomeIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import axios from 'axios';
import StudentPortalSidebar from '../../../components/StudentPortalSidebar';
import MagazineProgress from "@/components/MagazineProgress";

const Dashboard = () => {
    const [totalStudents, setTotalStudents] = useState(0);
    const [presentToday, setPresentToday] = useState(0);
    const [activityCount, setActivityCount] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const studentsRes = await axios.get('/api/students');
                setTotalStudents(studentsRes.data.length);

                const present = studentsRes.data.filter(student => {
                    const today = new Date().toISOString().split('T')[0];
                    return student.attendance?.[today] === 'present';
                });
                setPresentToday(present.length);

                // const activityRes = await axios.get('/api/activities');
                // setActivityCount(activityRes.data.length);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            }
        };

        fetchStats();
    }, []);
    const activities = [
        { name: "Attendance", value: 80 },
        { name: "Homework", value: 65 },
        { name: "Project", value: 45 },
        { name: "Discipline", value: 90 },
    ];
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-tr from-blue-50 via-gray-50 to-white text-sm text-gray-800 transition-colors duration-300">
      <StudentPortalSidebar />
      <div className="flex-1 p-6">
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-semibold text-gray-800">Alathurpadi Dars</span>
            </div>
            {/* <nav className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-800">All</a>
              <a href="#" className="text-gray-600 hover:text-gray-800">Attendance</a>
              <a href="#" className="text-gray-600 hover:text-gray-800">Analytics</a>
              <a href="#" className="text-gray-600 hover:text-gray-800">Reports</a>
            </nav> */}
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-4 py-2 rounded-full bg-gray-100 text-gray-800 focus:outline-none"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">🔍</span>
            </div>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">⚙️</button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">🔔</button>
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Overall Stats */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Overall Stats</h2>
            <div className="text-4xl font-extrabold text-gray-800 mb-4">128 Students</div>
            <div className="flex space-x-4 mb-6">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <span>📊</span>
                <span>View</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <span>📋</span>
                <span>Details</span>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-700">Present Today</p>
                  <p className="text-sm text-gray-500">116 Students</p>
                </div>
                <div className="text-green-600 font-extrabold">91%</div>
              </div>
              <div className="flex justify-between items-center bg-green-50 p-4 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-700">Absent Today</p>
                  <p className="text-sm text-gray-500">12 Students</p>
                </div>
                <div className="text-red-500 font-extrabold">9%</div>
              </div>
            </div>
          </div>

          {/* Center Section - Magazine Progress */}
          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Magazine Progress</h2>
            <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
              <MagazineProgress />
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
              Learn More
            </button>
          </div>

          {/* Right Section - Batch Attendance */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Batch Attendance</h2>
              <select className="bg-gray-100 rounded-full px-3 py-1 text-gray-700">
                <option>Month</option>
                <option>Week</option>
                <option>Day</option>
              </select>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(batch => (
                <div key={batch} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      📚
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Batch {batch}</p>
                      <p className="text-sm text-gray-500">30 mins ago</p>
                    </div>
                  </div>
                  <div className="text-green-600 font-semibold">+18 Present</div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-blue-600 hover:underline">See All</button>
          </div>

          {/* Bottom Left - Attendance Graph */}
          <div className="col-span-2 bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Attendance Over Time</h2>
              <select className="bg-gray-100 rounded-full px-3 py-1 text-gray-700">
                <option>Dec 06</option>
                <option>Dec 05</option>
                <option>Dec 04</option>
              </select>
            </div>
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              {/* Placeholder for graph */}
              <p className="text-gray-500">Graph Placeholder</p>
            </div>
          </div>

          {/* Bottom Right - Performance Score */}
          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Performance Score</h2>
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-3xl font-bold text-gray-800">720</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-gray-500 mt-12">Excellent</p>
              </div>
              {/* Placeholder for circular progress */}
              <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                <p className="text-gray-500">Circular Progress</p>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
              Explore Benefits
            </button>
          </div>
        </div>
      </div>
    </div>
    
    );
};

export default Dashboard;
