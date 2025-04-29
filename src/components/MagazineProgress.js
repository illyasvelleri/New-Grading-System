import { useEffect, useState } from 'react';

export default function MagazineProgress() {
  const [stats, setStats] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [loading, setLoading] = useState(false);

  // Map months to numbers
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

  const currentYear = new Date().getFullYear(); // Example: 2025

  useEffect(() => {
    const fetchMagazineProgressBar = async () => {
      if (!selectedMonth) return;

      setLoading(true);
      try {
        const monthNumber = monthMapping[selectedMonth];
        const formattedMonth = `${currentYear}-${monthNumber}`;
        console.log('formattedMonth:', formattedMonth);

        const res = await fetch(`/api/magazine-activities?month=${formattedMonth}`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching progress bar data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazineProgressBar();
  }, [selectedMonth]);

  const activities = ['Al-Zahra', 'Darshanam'];

  // Function to calculate total for each activity
  const getTotal = (activity) => {
    const monthNumber = monthMapping[selectedMonth];
    const monthKey = `${currentYear}-${monthNumber}`;

    return stats.reduce((total, student) => {
      const value = student.monthlySummary?.[monthKey]?.[activity] || 0;
      return total + value;
    }, 0);
  };

  // Calculate progress percentage for each activity
  const getProgress = (activity) => {
    const total = getTotal(activity);
    const maxGoal = 100; // Assuming the max goal is 100, adjust as needed
    return (total / maxGoal) * 100;
  };

  return (
    <div className="w-full h-full flex flex-col justify-center p-4">
      {/* Month Selector */}
      <div className="mb-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-1 bg-white rounded-full text-gray-700 focus:outline-none focus:ring focus:ring-blue-200 w-full text-sm transition-colors duration-200"
          aria-label="Select month for progress"
        >
          {Object.keys(monthMapping).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Total Progress for Al-Zahra and Darshanam */}
      {loading ? (
        <div className="text-center text-gray-500 text-sm">Loading...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {activities.map((activity) => {
            const total = getTotal(activity);
            const activityProgress = getProgress(activity);

            return (
              <div key={activity} className="flex flex-col">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-800">{activity}</span>
                  <span className="text-xs text-gray-500">{getTotal(activity)}</span>
                </div>
                <span className="text-sm font-semibold text-blue-600">{Math.round(activityProgress)}%</span>
              </div>
              <div className="relative flex">
                <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full shadow-sm transition-all duration-300 hover:brightness-110"
                    style={{
                      backgroundImage: 'linear-gradient(to right, #3b82f6, #60a5fa)',
                      width: `${activityProgress}%`,
                      transition: 'width 1s ease-out',
                    }}
                    role="progressbar"
                    aria-valuenow={activityProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
                <div
                  className="absolute -right-2 -top-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{ transform: `translateX(${activityProgress}%)` }}
                >
                  <div className="bg-gray-800 text-white text-xs rounded-md px-2 py-1">
                    {Math.round(activityProgress)}%
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}