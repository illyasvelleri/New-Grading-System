import { cache, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function AdminDashboard() {
    const [admin, setAdmin] = useState(null);
    const [sections, setSections] = useState([]);
    const [newSection, setNewSection] = useState({ number: "", name: "", sectionCategory: "" });
    const router = useRouter();

    // Fetch Admin Details
    useEffect(() => {
        fetchAdmin();
        fetchSections();
    }, []);

    const fetchAdmin = async () => {
        try {
            const res = await axios.get("/api/admin/auth/me");
            setAdmin(res.data);
        } catch (error) {
            router.push("/admin/login"); // Redirect if not authenticated
        }
    };

    // Fetch Sections
    const fetchSections = async () => {
        try {
            const res = await axios.get("/api/admin/sections");
            setSections(res.data.sections || []);
        } catch (error) {
            console.error("Failed to fetch sections:", error);
        }
    };

    // Handle Logout
    const handleLogout = async () => {
        await axios.post("/api/admin/auth/logout");
        router.push("/admin/login");
    };

    // Handle Section Creation
    const handleCreateSection = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/admin/sections/create", formData);
            fetchSections();
            setFormData({ number: "", name: "", sectionCategory: "" });
        } catch (error) {
            console.error("Failed to create section", error);
        }
    };

    // Handle Section Deletion
    const handleDeleteSection = async (id) => {
        try {
            await axios.delete(`/api/admin/sections/delete?id=${id}`);
            fetchSections();
        } catch (error) {
            console.error("Failed to delete section", error);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Dashboard Title & Logout */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                {admin && (
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        Logout
                    </button>
                )}
            </div>

            {/* Create Section Form */}
            <div className="bg-white p-6 rounded-2xl shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">Create New Section</h2>
                <form onSubmit={handleCreateSection} className="grid gap-4 sm:grid-cols-3">
                    <input
                        type="text"
                        placeholder="Section Number"
                        value={newSection.number}
                        onChange={(e) => setNewSection({ ...newSection, number: e.target.value })}
                        required
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Section Name"
                        value={newSection.name}
                        onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                        required
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        value={newSection.sectionCategory}
                        onChange={(e) => setNewSection({ ...newSection, sectionCategory: e.target.value })}
                        required
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="col-span-3 sm:col-span-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Create Section
                    </button>
                </form>
            </div>

            {/* Section List */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(sections || []).map((section) => (
                    <div
                        key={section._id}
                        className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition duration-300 relative"
                    >
                        <h2 className="text-lg font-semibold text-gray-700">{section.name}</h2>
                        <p className="text-gray-500">Category: {section.sectionCategory}</p>

                        {/* View Section Button */}
                        <button
                            onClick={() => router.push(`/admin/view-section/${section._id}`)}
                            className="inline-block text-blue-600 mt-2 hover:underline"
                        >
                            View Section
                        </button>

                        {/* Delete Section Button */}
                        <button
                            onClick={() => handleDeleteSection(section._id)}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                        >
                            ❌
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
