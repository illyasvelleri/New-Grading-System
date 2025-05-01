import { useEffect, useState } from 'react';

export default function MagazineProgress() {
  const [stats, setStats] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [loading, setLoading] = useState(false);

  const monthMapping = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12',
  };

  const currentYear = new Date().getFullYear();
  const activities = ['Al-Zahra', 'Darshanam'];

  useEffect(() => {
    const fetchMagazineData = async () => {
      if (!selectedMonth) return;
      setLoading(true);

      try {
        const monthNumber = monthMapping[selectedMonth];
        const formattedMonth = `${currentYear}-${monthNumber}`;
        const res = await fetch(`/api/magazine-activities?month=${formattedMonth}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching magazine data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazineData();
  }, [selectedMonth]);

  const getTotal = (activity) => {
    const monthKey = `${currentYear}-${monthMapping[selectedMonth]}`;
    return stats.reduce((sum, student) => {
      return sum + (student.monthlySummary?.[monthKey]?.[activity] || 0);
    }, 0);
  };

  return (
    <div className="w-full p-3 sm:p-4 lg:p-5 bg-white rounded-2xl shadow-md">
      {/* Month Selector */}
      <div className="mb-4">
        <label htmlFor="monthSelect" className="block text-xs font-medium text-gray-700 mb-1">
          Select Month
        </label>
        <select
          id="monthSelect"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-sm bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          {Object.keys(monthMapping).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="text-center text-gray-500 text-sm py-6">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {activities.map((activity) => (
            <div
              key={activity}
              className="bg-gradient-to-tr from-blue-100 via-blue-50 to-white rounded-xl shadow p-4 hover:shadow-md transition"
            >
              <p className="text-xs text-gray-500 mb-1">{activity}</p>
              <h2 className="text-2xl font-bold text-blue-600">{getTotal(activity)}</h2>
              <p className="text-xs text-gray-400">Total</p>
            </div>
          ))}
        </div>
      )}

      {/* Learn More Button */}
      <div className="mt-6">
        <button className="w-full py-2 bg-pink-500 text-white text-sm font-semibold rounded-full hover:bg-pink-600 transition">
          Learn More
        </button>
      </div>
    </div>



  );
}
