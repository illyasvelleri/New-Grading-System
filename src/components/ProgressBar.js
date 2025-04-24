'use client';

import { useEffect, useState } from 'react';
import { FaMedal } from 'react-icons/fa';

const categories = ['below-20', 'below-50', 'above-50'];

const trophyColors = ['text-yellow-400', 'text-gray-400', 'text-orange-400'];

const ProgressBar = () => {
    const [selectedCategory, setSelectedCategory] = useState('below-20');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgressBar = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/admin/all-user-scores?category=${selectedCategory}`);
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error('Error fetching progress bar data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProgressBar();
    }, [selectedCategory]);

    const getLevelProgress = (marks) => {
        const level = Math.floor(marks / 100); // 100 marks per level
        const progress = marks % 100;
        return { level, progress };
    };

    return (
        <div className="p-6 sm:p-10 bg-white rounded-3xl shadow-xl border border-gray-200 mt-8">
            {/* Category Tabs */}
            <div className="flex gap-3 mb-8 flex-wrap">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === cat
                            ? 'bg-gray-900 text-white shadow'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {cat.replace('-', ' ').toUpperCase()}
                    </button>
                ))}
            </div>
            {/* All Users Completion Bars */}
            <div className="mt-10">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">User Progress</h2>

                {/* Wrapper to handle horizontal scroll */}
                <div className="overflow-x-auto scrollbar-custom">
                    {/* Inner scrollable content */}
                    <div className="flex gap-2 pb-4 min-w-max">
                        {stats?.allUsers?.map((user) => {
                            const { level, progress } = getLevelProgress(user.totalMarks);
                            return (
                                <div key={user._id} className="flex flex-col items-center w-24 text-center">
                                    <div className="relative h-48 w-6 bg-gray-200 rounded-full overflow-hidden flex items-end">
                                        <div
                                            className="bg-green-500 w-full transition-all duration-300"
                                            style={{ height: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="mt-2 text-sm font-medium text-gray-700">
                                        {user.name || 'Unnamed'}
                                    </div>
                                    <div className="text-xs text-gray-500">Lvl {level}</div>
                                    <div className="text-xs text-green-600">Score: {user.totalMarks}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProgressBar;
