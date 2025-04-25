// import { ArrowRight } from 'lucide-react';
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/router";
// import UserSidebar from "@/components/UserSidebar"; // adjust the path if needed

// export default function Dashboard() {
//   const [user, setUser] = useState(null);
//   const [maxScore, setMaxScore] = useState(0);
//   const [userScore, setUserScore] = useState(0);
//   const [sectionsCompleted, setSectionsCompleted] = useState(0);
//   const [totalSections, setTotalSections] = useState(0);
//   const [avgScore, setAvgScore] = useState(0);
//   const [sections, setSections] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     async function fetchUser() {
//       try {
//         const res = await axios.get("/api/user/auth/me");
//         const userData = res.data;
//         setUser(res.data);
//         fetchSections();
//         fetchDashboardData(userData);
//       } catch (error) {
//         router.push("/user/login");
//       }
//     }

//     fetchUser();
//   }, []);

//   const fetchSections = async () => {
//     try {
//       const res = await axios.get("/api/user/sections");
//       setSections(res.data.sections || []);
//     } catch (error) {
//       console.error("Failed to fetch sections:", error);
//     }
//   };

//   const fetchDashboardData = async (userData) => {
//     try {
//       const res = await axios.get("/api/user/calc-sections", {
//         params: {
//           userId: userData._id,
//           category: userData.category,
//         },
//       }); // no params needed
//       const {
//         totalMaxScore,
//         totalUserScore,
//         sectionsCompleted,
//         totalSections,
//         avgScore,
//       } = res.data;

//       setMaxScore(totalMaxScore);
//       setUserScore(totalUserScore);
//       setSectionsCompleted(sectionsCompleted);
//       setTotalSections(totalSections);
//       setAvgScore(avgScore);
//     } catch (error) {
//       console.error(error);
//       router.push("/user/login");
//     }
//   };

//   if (!user) return <p>Loading...</p>;

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row pb-20 text-sm">

//       {/* Sidebar */}
//       <aside className="mb-8 md:mb-0 md:mr-12">
//         <UserSidebar />
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 space-y-10">

//         {/* Welcome Section */}
//         <section>
//           <h1 className="text-4xl font-extrabold text-white leading-tight">
//             Welcome, <span className="text-green-400">{user.username}</span> 👋
//           </h1>
//           <p className="text-zinc-300 mt-2 text-lg">Email: {user.email}</p>
//         </section>

//         {/* Grid: Metrics & Sections */}
//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

//           {/* Metrics Cards */}
//           <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-2 gap-5">
//             {[
//               { label: "Max Score", value: maxScore },
//               { label: "Your Score", value: userScore },
//               { label: "Avg Score", value: `${avgScore}%` },
//               {
//                 label: "Sections Completed",
//                 value: `${sectionsCompleted} of ${totalSections}`,
//               },
//             ].map((metric, i) => (
//               <div
//                 key={i}
//                 className="rounded-2xl p-6 bg-[#1e293b]/80 border border-green-800/30 backdrop-blur-md shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.015] transition duration-300"
//               >
//                 <h3 className="text-lg font-medium text-green-400 mb-1">{metric.label}</h3>
//                 <p className="w-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">{metric.value}</p>
//               </div>
//             ))}
//           </div>

//           {/* Sections Cards */}
//           <div>
//             <h3 className="text-xl font-bold text-white mb-4">Your Sections</h3>
//             <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-2 gap-5">
//               {sections.length > 0 ? (
//                 sections.map((section) => (
//                   <div
//                     key={section._id}
//                     className="bg-[#1e293b]/90 border border-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-lg transition duration-300 hover:shadow-2xl hover:border-green-500"
//                   >
//                     <div className="flex items-center justify-between">
//                       <h3 className="text-lg font-semibold text-white">{section.name}</h3>

//                       <button
//                         onClick={() => router.push(`/user/view-section/${section._id}`)}
//                         className="text-green-400 hover:text-white transition"
//                         aria-label="View Section"
//                       >
//                         <ArrowRight className="w-8 h-8" />
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-white/70">No sections available.</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );






// }


import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
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
  const [sectionsCompleted, setSectionsCompleted] = useState(0);
  const [totalSections, setTotalSections] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [sections, setSections] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("/api/user/auth/me");
        const userData = res.data;
        setUser(res.data);
        fetchSections();
        fetchDashboardData(userData);
      } catch (error) {
        router.push("/user/login");
      }
    }
    fetchUser();
  }, []);

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
      } = res.data;

      setMaxScore(totalMaxScore);
      setUserScore(totalUserScore);
      setSectionsCompleted(sectionsCompleted);
      setTotalSections(totalSections);
      setAvgScore(avgScore);
    } catch (error) {
      console.error(error);
      router.push("/user/login");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-tr from-white via-gray-50 to-blue-50 text-sm text-gray-800 dark:text-white transition-colors duration-300 pb-24">

      {/* Header */}
      <aside>
        <UserHeader />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 sm:p-8 md:p-10 space-y-10">

        {/* Welcome Section */}
        <section>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-sky-900 mt-6">
            Hello, <span className="text-emerald-600">{user.username}</span> 👋
          </h2>
          <p className="mt-2 text-base text-sky-700 dark:text-sky-300">{user.email}</p>
        </section>

        {/* Metric Cards */}
        {/* Metrics & Progress Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {[
              { label: "Max Score", value: maxScore, from: "from-sky-200", to: "to-sky-400" },
              { label: "Your Score", value: userScore, from: "from-emerald-200", to: "to-emerald-400" },
              { label: "Avg Score", value: avgScore, from: "from-yellow-200", to: "to-yellow-400" },
              { label: "Completed", value: `${sectionsCompleted} / ${totalSections}`, from: "from-purple-200", to: "to-purple-400" },
            ].map((metric, i) => (
              <div
                key={i}
                className={`p-4 sm:p-5 rounded-2xl shadow-md bg-gradient-to-br ${metric.from} ${metric.to} text-black hover:scale-[1.03] transition-transform`}
              >
                <p className="text-3xl sm:text-4xl md:text-5xl font-bold">
                  {typeof metric.value === 'number' ? <CountUp end={metric.value} /> : metric.value}
                </p>
                <p className="text-sm font-medium mt-2 tracking-wide">{metric.label}</p>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col justify-center p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-sky-200 dark:border-gray-700">
            <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
              Your Score: <span className="text-emerald-600">{userScore}</span> / {maxScore}
            </p>
            <div className="relative h-6 sm:h-7 bg-gradient-to-r from-sky-100 to-sky-200 dark:from-gray-700 dark:to-gray-800 rounded-full overflow-hidden shadow-inner">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-700 ease-in-out"
                style={{ width: `${(userScore / maxScore) * 100 || 0}%` }}
              >
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] sm:text-xs font-semibold text-white drop-shadow-sm">
                  {Math.round((userScore / maxScore) * 100 || 0)}%
                </span>
              </div>
            </div>
          </div>
        </section>



        {/* Sections */}
        <section className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-md border border-sky-200 dark:border-gray-800">
          <h3 className="text-xl font-bold mb-5 text-sky-900 dark:text-white">Your Sections</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sections.length > 0 ? (
              sections.map((section) => (
                <div
                  key={section._id}
                  className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-md sm:text-lg font-semibold text-sky-800 dark:text-white">
                      {section.name}
                    </h4>
                    <button
                      onClick={() => router.push(`/user/view-section/${section._id}`)}
                      className="text-emerald-600 hover:text-emerald-700 transition"
                    >
                      <ArrowRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sky-600 dark:text-sky-400">No sections available.</p>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <ProgressBar />
        </div>
      </main>
    </div>

  );
}
