'use client';

import { useEffect, useState } from 'react';

const categories = ['below-20', 'below-50', 'above-50'];

const LeaderboardSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('below-20');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/all-user-scores?category=${selectedCategory}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedCategory]);

  const rankColor = ['bg-yellow-100', 'bg-gray-100', 'bg-orange-100'];

  return (
    <div className="p-6 sm:p-10 bg-[#1a1a1a] rounded-3xl shadow-2xl border border-gray-800">
  {/* Tabs */}
  <div className="flex gap-3 mb-8 flex-wrap">
    {categories.map((cat) => (
      <button
        key={cat}
        onClick={() => setSelectedCategory(cat)}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
          selectedCategory === cat
            ? 'bg-green-600 text-white shadow-md'
            : 'bg-[#333] text-gray-300 hover:bg-[#444]'
        }`}
      >
        {cat.replace('-', ' ').toUpperCase()}
      </button>
    ))}
  </div>

  {/* Top 3 Ranks */}
  {loading ? (
    <p className="text-gray-400 text-sm">Loading leaderboard...</p>
  ) : (
    <>
      <div className="grid gap-6 sm:grid-cols-3">
        {stats?.topThree?.map((user, index) => (
          <div
            key={user._id}
            className="rounded-2xl p-5 bg-[#222] border border-gray-700 shadow-xl hover:-translate-y-1 transition-transform"
          >
            <span className="text-xs text-gray-400 mb-1">Rank #{index + 1}</span>
            <p className="text-lg font-bold text-white">{user.name || 'Unnamed'}</p>
            <p className="text-sm text-green-400 font-semibold">
              Score: {user.totalMarks}
            </p>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-8 text-right">
        <a
          href={`/admin/all-users?category=${selectedCategory}`}
          className="inline-block text-green-500 hover:text-green-400 hover:underline text-sm font-medium"
        >
          View All →
        </a>
      </div>

      {/* Footer Metrics */}
      <div className="mt-8 bg-[#222] rounded-xl p-4 flex flex-col sm:flex-row justify-between text-sm font-medium text-gray-300 gap-3 sm:gap-0 border border-gray-700">
        <div>
          Total Users:{' '}
          <span className="text-green-400 font-semibold">{stats.totalUsers}</span>
        </div>
        <div>
          Total Max Score:{' '}
          <span className="text-green-400 font-semibold">{stats.totalMaxScore}</span>
        </div>
      </div>
    </>
  )}
</div>


  );
};

export default LeaderboardSection;
