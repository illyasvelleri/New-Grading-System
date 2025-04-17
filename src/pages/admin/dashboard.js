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

        <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 lg:pl-72">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
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
                    <div className="bg-white rounded-2xl shadow-xl p-12">
                        <h2 className="text-2xl font-bold text-primary mb-6">Create New Section</h2>
                        <form onSubmit={handleCreateSection} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-green-300 rounded-2xl p-12">

                            {/* Section No. */}
                            <div className="flex flex-col">
                                <label className="block text-sm text-gray-700 mb-1">Section No.</label>
                                <input
                                    type="text"
                                    value={newSection.number}
                                    onChange={(e) => setNewSection({ ...newSection, number: e.target.value })}
                                    placeholder="No."
                                    required
                                    className="w-full md:w-64 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                                />
                            </div>

                            {/* Section Name */}
                            <div className="flex flex-col">
                                <label className="block text-sm text-gray-700 mb-1">Section Name</label>
                                <input
                                    type="text"
                                    value={newSection.name}
                                    onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                                    placeholder="Enter Section Name"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                                />
                            </div>

                            {/* Category */}
                            <div className="flex flex-col">
                                <label className="block text-sm text-gray-700 mb-1">Category</label>
                                <select
                                    value={newSection.sectionCategory}
                                    onChange={(e) => setNewSection({ ...newSection, sectionCategory: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-accent"
                                >
                                    <option value="">Select Category</option>
                                    <option value="below-20">Below 20</option>
                                    <option value="below-50">Below 50</option>
                                    <option value="above-50">Above 50</option>
                                </select>
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-end justify-end">
                                <button
                                    type="submit"
                                    className="bg-accent text-white px-6 py-2 rounded-xl hover:bg-accentDark transition"
                                >
                                    Create Section
                                </button>
                            </div>
                        </form>
                    </div>



                    {/* Metrics */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h2 className="text-2xl font-bold text-primary mb-6">User Metrics</h2>
                        <div className="grid grid-cols-2 gap-4 sm:gap-6">
                            {[
                                { title: 'Total Users', value: '120' },
                                { title: 'Active Users', value: '89' },
                                { title: 'Inactive Users', value: '31' },
                                { title: 'Average Grade', value: 'B+' },
                            ].map((item, i) => (
                                <div key={i} className="bg-gray-100 p-4 rounded-xl shadow-sm text-center">
                                    <h3 className="text-sm text-gray-600">{item.title}</h3>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section Cards */}
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {sections.map((section) => (
                        <div
                            key={section._id}
                            className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:translate-y-1 transition-all p-5"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">{section.name}</h3>
                                <span className="inline-block px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                                    {section.sectionCategory}
                                </span>
                            </div>

                            <div className="mt-4 flex justify-between items-center">
                                <button
                                    onClick={() => router.push(`/admin/view-section/${section._id}`)}
                                    className="text-accent hover:underline text-sm flex items-center gap-1"
                                >
                                    <EyeIcon className="w-4 h-4" />
                                    View
                                </button>
                                <button
                                    onClick={() => handleDeleteSection(section._id)}
                                    className="text-red-500 hover:text-red-700 text-xl"
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
