// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/router";

// export default function Dashboard() {
//     const [user, setUser] = useState(null);
//     const [sections, setSections] = useState([]);
//     const router = useRouter();

//     useEffect(() => {
//         async function fetchUser() {
//             try {
//                 const res = await axios.get("/api/user/auth/me");
//                 setUser(res.data);
//                 fetchSections();
//             } catch (error) {
//                 router.push("/user/login"); // Redirect to login if not authenticated
//             }
//         }

//         fetchUser();
//     }, []);

//     // Fetch sections
//     const fetchSections = async () => {
//         try {
//             const res = await axios.get("/api/user/sections"); // Endpoint to fetch sections
//             setSections(res.data.sections || []);
//         } catch (error) {
//             console.error("Failed to fetch sections:", error);
//         }
//     };

//     if (!user) return <p>Loading...</p>;

//     return (
//         <div className="min-h-screen bg-gray-100 p-6">
//         <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
//             <h1 className="text-2xl font-bold text-gray-700">Welcome, {user.username}!</h1>
//             <p className="text-gray-500">Email: {user.email}</p>
//         </div>

//         <h2 className="mt-6 text-xl font-semibold text-gray-700">Your Sections:</h2>
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
//             {sections.length > 0 ? (
//                 sections.map((section) => (
//                     <div
//                         key={section._id}
//                         className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition duration-300 relative"
//                     >
//                         <h2 className="text-lg font-semibold text-gray-700">{section.name}</h2>
//                         <p className="text-gray-500">Category: {section.sectionCategory}</p>

//                             <button
//                                 onClick={() => router.push(`/user/view-section/${section._id}`)}
//                                 className="inline-block text-blue-600 mt-2 hover:underline"
//                             >
//                                 View Section
//                             </button>
//                     </div>
//                 ))
//             ) : (
//                 <p className="text-gray-500">No sections available.</p>
//             )}
//         </div>
//     </div>
//     );
// }
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import UserSidebar from "@/components/UserSidebar"; // adjust the path if needed
import UserHeader from '@/components/UserHeader';

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
      }); // no params needed
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

    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 px-6 pt-20 pb-32  md:px-12 lg:px-20 xl:px-32">

      {/* Sidebar */}
      <aside className="mb-8 md:mb-0 md:mr-12">
        <UserSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-10">

        {/* Welcome Section */}
        <section>
          <h1 className="text-4xl font-extrabold text-white leading-tight">
            Welcome, <span className="text-green-400">{user.username}</span> 👋
          </h1>
          <p className="text-zinc-300 mt-2 text-lg">Email: {user.email}</p>
        </section>

        {/* Grid: Metrics & Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {/* Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-2 gap-5">
            {[
              // { label: 'Max Score', value: '100' },
              // { label: 'Your Score', value: '82' },
              // { label: 'Avg Score', value: '76%' },
              // { label: 'Sections Completed', value: '6 of 10' }
              { label: "Max Score", value: maxScore },
              { label: "Your Score", value: userScore },
              { label: "Avg Score", value: `${avgScore}%` },
              {
                label: "Sections Completed",
                value: `${sectionsCompleted} of ${totalSections}`,
              },
            ].map((metric, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 bg-[#1e293b]/80 border border-green-800/30 backdrop-blur-md shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.015] transition duration-300"
              >
                <h3 className="text-lg font-medium text-green-400 mb-1">{metric.label}</h3>
                <p className="w-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">{metric.value}</p>
              </div>
            ))}
          </div>

          {/* Sections Cards */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Your Sections</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-2 gap-5">
              {sections.length > 0 ? (
                sections.map((section) => (
                  <div
                    key={section._id}
                    className="bg-[#1e293b]/90 border border-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-lg transition duration-300 hover:shadow-2xl hover:border-green-500"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">{section.name}</h3>

                      <button
                        onClick={() => router.push(`/user/view-section/${section._id}`)}
                        className="text-green-400 hover:text-white transition"
                        aria-label="View Section"
                      >
                        <ArrowRight className="w-8 h-8" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white/70">No sections available.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );






}
