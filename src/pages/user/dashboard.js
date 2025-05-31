import { ArrowRight } from 'lucide-react';
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import UserHeader from '@/components/UserHeader';
import ProgressBar from "@/components/ProgressBar";

function CountUp({ end }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000; // 1 second
    const increment = end / (duration / 10);
    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(Math.round(end));
        clearInterval(counter);
      } else {
        setCount(Math.round(start));
      }
    }, 10);
    return () => clearInterval(counter);
  }, [end]);

  return <span>{count}</span>;
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [maxScore, setMaxScore] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [sectionsCompleted, setSectionsCompleted] = useState(0);
  const [totalSections, setTotalSections] = useState(0);
  const [sections, setSections] = useState([]);

  const [totalUserPoints, setTotalUserPoints] = useState(0);
  const [totalMaxPoints, setTotalMaxPoints] = useState(0);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("/api/user/auth/me");
        const userData = res.data;
        setUser(userData);
        fetchSections();
        fetchDashboardData(userData);
      } catch (error) {
        router.push("/user/login");
      }
    }
    fetchUser();
  }, [router]);

  const fetchSections = async () => {
    try {
      const res = await axios.get("/api/user/sections");
      setSections(res.data.sections || []);
    } catch (error) {
      console.error("Failed to fetch sections:", error);
    }
  };

  const fetchDashboardData = async (userData) => {
    try {
      const res = await axios.get("/api/user/calc-sections", {
        params: {
          userId: userData._id,
          category: userData.category,
        },
      });
      const {
        totalMaxScore,
        totalUserScore,
        sectionsCompleted,
        totalSections,
        avgScore,
        totalUserPoints,
        totalMaxPoints,
      } = res.data;

      setMaxScore(totalMaxScore);
      setUserScore(totalUserScore);
      setSectionsCompleted(sectionsCompleted);
      setTotalSections(totalSections);
      setAvgScore(avgScore);
      setTotalUserPoints(totalUserPoints);
      setTotalMaxPoints(totalMaxPoints);
    } catch (error) {
      console.error(error);
      router.push("/user/login");
    }
  };

  function StarRating({ totalUserPoints, totalMaxPoints }) {
    const fraction = totalMaxPoints ? totalUserPoints / totalMaxPoints : 0;
    const rating = Math.min(5, Math.max(0, fraction * 5)); // Clamp to 0–5

    const totalStars = 5;

    return (
      <div className="flex items-center space-x-1 mt-2">
        {[...Array(totalStars)].map((_, i) => {
          const fillPercentage = Math.min(Math.max(rating - i, 0), 1) * 100;

          return (
            <svg
              key={i}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id={`grad-${i}`}>
                  <stop offset={`${fillPercentage}%`} stopColor="#facc15" />
                  <stop offset={`${fillPercentage}%`} stopColor="#d1d5db" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#grad-${i})`}
                d="M12 17.3l6.18 3.73-1.64-7.03L21.5 9.24l-7.19-.61L12 2 9.69 8.63 2.5 9.24l5.96 4.76-1.64 7.03L12 17.3z"
              />
            </svg>
          );
        })}
        <span className="ml-2 text-sm text-gray-700">
          {rating.toFixed(1)} / 5
        </span>
      </div>
    );
  }


  const handleSectionClick = useCallback((sectionId) => {
    router.push(`/user/view-section/${sectionId}`);
  }, [router]);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-gray-50 to-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 text-gray-600 text-lg"
      >
        <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Loading...
      </motion.div>
    </div>
  );

  return (

    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-tr from-blue-50 via-gray-50 to-white text-sm text-gray-800">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white md:bg-transparent shadow-md md:shadow-none">
        <UserHeader />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-8 pb-36">
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl p-6"
        >
          <div className="absolute top-0 left-0 w-16 h-16 bg-green-100 rounded-full opacity-20 blur-xl" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            Hello , <span className="text-green-500">{user.username}</span>
            <motion.span
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              👋
            </motion.span>
          </h2>
          <p className="mt-2 text-sm text-gray-600">{user.email}</p>

          {/* Star Rating Below Email */}
          <h2 className="mt-4 text-lg font-semibold text-gray-800">Your Rating:</h2>
          <StarRating totalUserPoints={totalUserPoints} totalMaxPoints={totalMaxPoints} />
        </motion.section>

        {/* Metrics & Progress Section */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Metric Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Max Score", value: maxScore, from: "from-blue-100", to: "to-blue-300", icon: "🏆", badge: "Top Potential" },
              { label: "Your Score", value: userScore, from: "from-green-100", to: "to-green-300", icon: "📊", badge: "Your Score" },
              { label: "Avg Score", value: avgScore, from: "from-yellow-100", to: "to-yellow-300", icon: "📈", badge: "Your Avg Score" },
            ].map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                className={`relative p-5 rounded-2xl bg-gradient-to-br ${metric.from} ${metric.to} shadow-lg overflow-hidden`}
              >
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                  {metric.badge}
                </div>
                <div className="flex items-center gap-4">
                  <motion.span
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl"
                  >
                    {metric.icon}
                  </motion.span>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {typeof metric.value === 'number' ? <CountUp end={metric.value} /> : metric.value}
                    </p>
                    <p className="text-sm font-medium text-gray-700">{metric.label}</p>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full transform translate-x-12 translate-y-12" />
              </motion.div>
            ))}
          </div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-2 p-5 bg-white rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-20 h-20 bg-green-100 rounded-full opacity-20 blur-xl" />
            <p className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              Your Progress
              <span className="text-green-500">{userScore}</span> / {maxScore}
            </p>
            <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(userScore / maxScore) * 100 || 0}%` }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-end"
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="text-xs font-semibold text-white drop-shadow pr-2"
                >
                  {Math.round((userScore / maxScore) * 100 || 0)}%
                </motion.span>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sections - Left Half */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-100 rounded-full opacity-20 blur-xl" />
            <h3 className="text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
              Your Sections
              <motion.span
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, delay: 0.8, repeat: 1 }}
                className="text-green-500 text-sm"
              >
                ({sections.length})
              </motion.span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sections.length > 0 ? (
                sections.map((section, i) => (
                  <motion.div
                    key={section._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
                    className="p-4 rounded-3xl bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
                  >
                    <h4 className="text-base font-semibold text-gray-900">{section.name}</h4>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSectionClick(section._id)}
                      className="text-green-500 hover:text-green-600 transition-all"
                      aria-label={`View ${section.name} section`}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-600 text-sm">No sections available.</p>
              )}
            </div>
          </motion.section>

          {/* Progress - Right Half */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
          >
            <ProgressBar />
          </motion.div>
        </div>




      </main>
    </div>
  );
}