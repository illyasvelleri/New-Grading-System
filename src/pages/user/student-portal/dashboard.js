

import React, { useEffect, useState } from 'react';
import { HomeIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import axios from 'axios';
import StudentPortalSidebar from '../../../components/StudentPortalSidebar';


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

                const activityRes = await axios.get('/api/activities');
                setActivityCount(activityRes.data.length);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-tr from-white via-gray-50 to-blue-50 text-sm text-gray-800 dark:text-white transition-colors duration-300 pb-24">
            <StudentPortalSidebar />
            <div className="min-h-screen p-6 bg-gray-100">
                <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Total Students" value={totalStudents} icon={<UserGroupIcon className="w-8 h-8" />} />
                    <StatCard title="Present Today" value={presentToday} icon={<HomeIcon className="w-8 h-8" />} />
                    <StatCard title="Total Activities" value={activityCount} icon={<UserGroupIcon className="w-8 h-8" />} />
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <QuickLink href="/user/student-portal/students" name="Students" icon={<UserGroupIcon className="w-6 h-6" />} />
                    <QuickLink href="/user/student-portal/activities" name="Activities" icon={<UserGroupIcon className="w-6 h-6" />} />
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
        <div>
            <p className="text-gray-500">{title}</p>
            <h2 className="text-xl font-bold">{value}</h2>
        </div>
        <div className="text-blue-500">{icon}</div>
    </div>
);

const QuickLink = ({ href, name, icon }) => (
    <Link href={href}>
        <div className="bg-white p-4 rounded-lg shadow hover:bg-blue-100 transition cursor-pointer flex items-center gap-3">
            {icon}
            <span className="text-lg font-medium">{name}</span>
        </div>
    </Link>
);

export default Dashboard;
