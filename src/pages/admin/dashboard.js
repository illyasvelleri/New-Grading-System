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
import { EyeIcon } from 'lucide-react'

export default function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [admin, setAdmin] = useState(null);
    const [sections, setSections] = useState([]);
    const [newSection, setNewSection] = useState({ number: "", name: "", sectionCategory: "" });
    const router = useRouter();

    useEffect(() => {
        fetchAdmin();
        fetchSections();
    }, []);

    const fetchAdmin = async () => {
        try {
            const res = await axios.get("/api/admin/auth/me");
            setAdmin(res.data);
        } catch (error) {
            router.push("/admin/login");
        }
    };

    const fetchSections = async () => {
        try {
            const res = await axios.get("/api/admin/sections");
            setSections(res.data.sections || []);
        } catch (error) {
            console.error("Failed to fetch sections:", error);
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

    const handleDeleteSection = async (id) => {
        try {
            await axios.delete(`/api/admin/sections/delete?id=${id}`);
            fetchSections();
        } catch (error) {
            console.error("Failed to delete section", error);
        }
    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-[#0f0f0f] flex flex-col md:flex-row">

            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 lg:pl-72">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    {/* Create Section */}
                    <div className="bg-[#1a1a1a] rounded-3xl shadow-2xl p-8 sm:p-12 border border-gray-800">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 tracking-wide">
                            Create New Section
                        </h2>

                        <form
                            onSubmit={handleCreateSection}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#222] p-6 sm:p-10 rounded-3xl border border-green-600"
                        >
                            {/* Section No. */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-300 mb-2">Section No.</label>
                                <input
                                    type="text"
                                    value={newSection.number}
                                    onChange={(e) => setNewSection({ ...newSection, number: e.target.value })}
                                    placeholder="No."
                                    required
                                    className="px-4 py-2 rounded-full border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                />
                            </div>

                            {/* Section Name */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-300 mb-2">Section Name</label>
                                <input
                                    type="text"
                                    value={newSection.name}
                                    onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                                    placeholder="Enter Section Name"
                                    required
                                    className="px-4 py-2 rounded-full border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                />
                            </div>

                            {/* Category */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-300 mb-2">Category</label>
                                <select
                                    value={newSection.sectionCategory}
                                    onChange={(e) => setNewSection({ ...newSection, sectionCategory: e.target.value })}
                                    required
                                    className="px-4 py-2 rounded-full border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                >
                                    <option value="">Select Category</option>
                                    <option value="below-20">Below 20</option>
                                    <option value="below-50">Below 50</option>
                                    <option value="above-50">Above 50</option>
                                </select>
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-end justify-end md:col-span-2">
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full transition"
                                >
                                    ➕ Create Section
                                </button>
                            </div>
                        </form>
                    </div>




                    {/* Metrics */}
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-2xl shadow-2xl p-6 border border-gray-800">

                        <h2 className="text-xl text-white font-bold mb-4">Leaderboard</h2>
                        <LeaderboardSection />
                    </div>

                </div>

                {/* Section Cards */}
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 p-4">
                    {sections.map((section) => (
                        <div
                            key={section._id}
                            className="bg-gradient-to-br from-[#1e1e1e] to-[#111111] rounded-3xl shadow-2xl border border-gray-800 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-green-800/30"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-white break-words">
                                    {section.name}
                                </h3>
                                <span className="px-3 py-1 text-xs rounded-full bg-green-900 text-green-300 font-medium shadow-sm">
                                    {section.sectionCategory}
                                </span>
                            </div>

                            <div className="mt-6 flex justify-between items-center">
                                <button
                                    onClick={() => router.push(`/admin/view-section/${section._id}`)}
                                    className="text-green-400 hover:text-green-300 hover:underline text-sm flex items-center gap-1"
                                >
                                    <EyeIcon className="w-4 h-4" />
                                    View
                                </button>
                                <button
                                    onClick={() => handleDeleteSection(section._id)}
                                    className="text-red-400 hover:text-red-500 text-xl"
                                    title="Delete Section"
                                >
                                    ❌
                                </button>
                            </div>
                        </div>
                    ))}
                </div>


            </main>
        </div>



    );
}
