// import { cache, useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/router";

// export default function AdminDashboard() {
//     const [admin, setAdmin] = useState(null);
//     const [sections, setSections] = useState([]);
//     const [newSection, setNewSection] = useState({ number: "", name: "", sectionCategory: "" });
//     const router = useRouter();

//     // Fetch Admin Details
//     useEffect(() => {
//         fetchAdmin();
//         fetchSections();
//     }, []);

//     const fetchAdmin = async () => {
//         try {
//             const res = await axios.get("/api/admin/auth/me");
//             setAdmin(res.data);
//         } catch (error) {
//             router.push("/admin/login"); // Redirect if not authenticated
//         }
//     };

//     // Fetch Sections
//     const fetchSections = async () => {
//         try {
//             const res = await axios.get("/api/admin/sections");
//             setSections(res.data.sections || []);
//         } catch (error) {
//             console.error("Failed to fetch sections:", error);
//         }
//     };

//     // Handle Logout
//     const handleLogout = async () => {
//         await axios.post("/api/admin/auth/logout");
//         router.push("/admin/login");
//     };

//     // Handle Section Creation
//     const handleCreateSection = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post("/api/admin/sections/create", newSection);
//             fetchSections();
//             setNewSection({ number: "", name: "", sectionCategory: "" });
//         } catch (error) {
//             console.error("Failed to create section", error);
//         }
//     };

//     // Handle Section Deletion
//     const handleDeleteSection = async (id) => {
//         try {
//             await axios.delete(`/api/admin/sections/delete?id=${id}`);
//             fetchSections();
//         } catch (error) {
//             console.error("Failed to delete section", error);
//         }
//     };

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             {/* Dashboard Title & Logout */}
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
//                 {admin && (
//                     <button
//                         onClick={handleLogout}
//                         className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
//                     >
//                         Logout
//                     </button>
//                 )}
//             </div>

//             {/* Create Section Form */}
//             <div className="bg-white p-6 rounded-2xl shadow mb-6">

//                 <h2 className="text-xl font-semibold mb-4">Create New Section</h2>
//                 <form onSubmit={handleCreateSection} className="grid gap-4 sm:grid-cols-3">
//                     <input
//                         type="text"
//                         placeholder="Section Number"
//                         value={newSection.number}
//                         onChange={(e) => setNewSection({ ...newSection, number: e.target.value })}
//                         required
//                         className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                     <input
//                         type="text"
//                         placeholder="Section Name"
//                         value={newSection.name}
//                         onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
//                         required
//                         className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                     <select
//                         value={newSection.sectionCategory}
//                         onChange={(e) => setNewSection({ ...newSection, sectionCategory: e.target.value })}
//                         required
//                         className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
//                     >
//                         <option value="">Select Category</option>
//                         <option value="below-20">Below 20</option>
//                         <option value="below-50">Below 50</option>
//                         <option value="above-50">Above 50</option>
//                     </select>

//                     <button
//                         type="submit"
//                         className="col-span-3 sm:col-span-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
//                     >
//                         Create Section
//                     </button>
//                 </form>

//             </div>
//             <button
//                 onClick={() => router.push(`/admin/users/get-users`)}
//                 className="inline-block text-blue-600 mt-2 hover:underline"
//             >
//                 Get Users
//             </button>
//             {/* Section List */}
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                 {(sections || []).map((section) => (
//                     <div
//                         key={section._id}
//                         className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition duration-300 relative"
//                     >
//                         <h2 className="text-lg font-semibold text-gray-700">{section.name}</h2>
//                         <p className="text-gray-500">Category: {section.sectionCategory}</p>

//                         {/* View Section Button */}
//                         <button
//                             onClick={() => router.push(`/admin/view-section/${section._id}`)}
//                             className="inline-block text-blue-600 mt-2 hover:underline"
//                         >
//                             View Section
//                         </button>

//                         {/* Delete Section Button */}
//                         <button
//                             onClick={() => handleDeleteSection(section._id)}
//                             className="absolute top-4 right-4 text-red-500 hover:text-red-700"
//                         >
//                             ❌
//                         </button>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }


// pages/admin/dashboard.js
// pages/admin/dashboard.js

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import AdminSidebar from "@/components/AdminSidebar";
import LeaderboardSection from "@/components/LeaderboardSection";


export default function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [admin, setAdmin] = useState(null);
    const [newSection, setNewSection] = useState({ number: "", name: "", sectionCategory: "" });
    const router = useRouter();

    useEffect(() => {
        fetchAdmin();
    }, []);

    const fetchAdmin = async () => {
        try {
            const res = await axios.get("/api/admin/auth/me");
            setAdmin(res.data);
        } catch (error) {
            router.push("/admin/login");
        }
    };

    const handleLogout = async () => {
        await axios.post("/api/admin/auth/logout");
        router.push("/admin/login");
    };

    const handleCreateSection = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/admin/sections/create", newSection);
            fetchSections();
            setNewSection({ number: "", name: "", sectionCategory: "" });
        } catch (error) {
            console.error("Failed to create section", error);
        }
    };

    return (
        <div className="min-h-screen w-full bg-white text-gray-900 flex flex-col md:flex-row overflow-x-auto">

            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 bg-gray-50">

                {/* Header */}
                <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">🧠 Admin Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-transform transform hover:scale-105 hidden lg:block"
                    >
                        Logout
                    </button>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Create Section Card */}
                    <div className="bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-800">
                        <h2 className="text-xl font-semibold text-center text-white mb-6">➕ Create Section</h2>

                        <form onSubmit={handleCreateSection} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Section No */}
                            <div>
                                <label className="text-sm font-medium text-gray-300">Section No.</label>
                                <input
                                    type="text"
                                    value={newSection.number}
                                    onChange={(e) => setNewSection({ ...newSection, number: e.target.value })}
                                    className="mt-1 w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                                    placeholder="Enter Section No."
                                    required
                                />
                            </div>

                            {/* Section Name */}
                            <div>
                                <label className="text-sm font-medium text-gray-300">Section Name</label>
                                <input
                                    type="text"
                                    value={newSection.name}
                                    onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                                    className="mt-1 w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                                    placeholder="Enter Section Name"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="text-sm font-medium text-gray-300">Category</label>
                                <select
                                    value={newSection.sectionCategory}
                                    onChange={(e) => setNewSection({ ...newSection, sectionCategory: e.target.value })}
                                    className="mt-1 w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="below-20">Below 20</option>
                                    <option value="below-50">Below 50</option>
                                    <option value="above-50">Above 50</option>
                                </select>
                            </div>

                            {/* Submit */}
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-lg font-semibold shadow transition-transform transform hover:scale-105"
                                >
                                    Create Section
                                </button>
                            </div>
                        </form>
                    </div>


                    {/* Leaderboard */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 min-h-[300px]">
                        <LeaderboardSection />
                    </div>

                    <div >
                        {/*progress in here....*/}
                    </div>
                </div>
            </main>
        </div>



    );
}
