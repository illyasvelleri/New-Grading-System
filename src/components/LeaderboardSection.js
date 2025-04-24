// 'use client';

// import { useEffect, useState } from 'react';
// import { FaMedal } from 'react-icons/fa';

// const categories = ['below-20', 'below-50', 'above-50'];

// const trophyColors = ['text-yellow-400', 'text-gray-400', 'text-orange-400'];

// const LeaderboardSection = () => {
//   const [selectedCategory, setSelectedCategory] = useState('below-20');
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchLeaderboard = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`/api/admin/all-user-scores?category=${selectedCategory}`);
//         const data = await res.json();
//         setStats(data);
//       } catch (err) {
//         console.error('Error fetching leaderboard:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLeaderboard();
//   }, [selectedCategory]);

//   return (
//     <div className="p-6 sm:p-10 bg-white rounded-3xl shadow-xl border border-gray-200">

//       {/* Category Tabs */}
//       <div className="flex gap-3 mb-8 flex-wrap">
//         {categories.map((cat) => (
//           <button
//             key={cat}
//             onClick={() => setSelectedCategory(cat)}
//             className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === cat
//                 ? 'bg-gray-900 text-white shadow'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//           >
//             {cat.replace('-', ' ').toUpperCase()}
//           </button>
//         ))}
//       </div>

//       {/* Top 3 Cards */}
//       {loading ? (
//         <p className="text-gray-500 text-sm">Loading leaderboard...</p>
//       ) : (
//         <>
//           <div className="grid gap-6 sm:grid-cols-3">
//             {stats?.topThree?.map((user, index) => (
//               <div
//                 key={user._id}
//                 className="rounded-2xl p-6 bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all"
//               >
//                 <div className="flex items-center gap-2 mb-2">
//                   <FaMedal className={`${trophyColors[index]} text-lg`} />
//                   <span className="text-sm text-gray-500 font-medium">Rank #{index + 1}</span>
//                 </div>
//                 <h3 className="text-gray-800 text-lg font-semibold">{user.name || 'Unnamed'}</h3>
//                 <p className="text-green-600 text-sm font-medium mt-1">
//                   Score: {user.totalMarks}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* Footer Metrics */}
//           <div className="mt-8 bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row justify-between text-sm font-medium text-gray-600 gap-3 sm:gap-0 border border-gray-200">
//             <div>
//               Total Users:{' '}
//               <span className="text-gray-900 font-semibold">{stats.totalUsers}</span>
//             </div>
//             <div className="text-right">
//               <a
//                 href={`/admin/all-users?category=${selectedCategory}`}
//                 className="text-blue-600 hover:text-blue-500 hover:underline"
//               >
//                 View All →
//               </a>
//             </div>
//           </div>
//         </>
//       )}
//     </div>



//   );
// };

// export default LeaderboardSection;


'use client';

import { useEffect, useState } from 'react';
import { FaMedal } from 'react-icons/fa';

const categories = ['below-20', 'below-50', 'above-50'];

const trophyColors = ['text-yellow-400', 'text-gray-400', 'text-orange-400'];

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

  const getLevelProgress = (marks) => {
    const level = Math.floor(marks / 100); // 100 marks per level
    const progress = marks % 100;
    return { level, progress };
  };

  return (
    <div className="p-6 sm:p-10 bg-white rounded-3xl shadow-xl border border-gray-200">

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

      {/* Top 3 Cards */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading leaderboard...</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-3">
            {stats?.topThree?.map((user, index) => (
              <div
                key={user._id}
                className="rounded-2xl p-6 bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FaMedal className={`${trophyColors[index]} text-lg`} />
                  <span className="text-sm text-gray-500 font-medium">Rank #{index + 1}</span>
                </div>
                <h3 className="text-gray-800 text-lg font-semibold">{user.name || 'Unnamed'}</h3>
                <p className="text-green-600 text-sm font-medium mt-1">
                  Score: {user.totalMarks}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Metrics */}
          <div className="mt-8 bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row justify-between text-sm font-medium text-gray-600 gap-3 sm:gap-0 border border-gray-200">
            <div>
              Total Users:{' '}
              <span className="text-gray-900 font-semibold">{stats.totalUsers}</span>
            </div>
            <div className="text-right">
              <a
                href={`/admin/all-users?category=${selectedCategory}`}
                className="text-blue-600 hover:text-blue-500 hover:underline"
              >
                View All →
              </a>
            </div>
          </div>
        </>
      )}

    </div>



  );
};

export default LeaderboardSection;
