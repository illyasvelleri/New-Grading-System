import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import AdminSidebar from "@/components/AdminSidebar";
import { EyeIcon } from 'lucide-react';

export default function Sections() {
    const [admin, setAdmin] = useState(null);
    const [sections, setSections] = useState([]);
    const [filteredSections, setFilteredSections] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");

    const router = useRouter();

    useEffect(() => {
        fetchAdmin();
        fetchSections();
    }, []);

    useEffect(() => {
        if (selectedCategory === "all") {
            setFilteredSections(sections);
        } else {
            setFilteredSections(sections.filter(sec => sec.sectionCategory === selectedCategory));
        }
    }, [sections, selectedCategory]);

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

    const handleDeleteSection = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this section?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`/api/admin/sections/delete?id=${id}`);
            fetchSections();
        } catch (error) {
            console.error("Failed to delete section", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row pb-20 text-sm">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 p-3 md:p-5 rounded-xl">

                {/* Filter Section */}
                <div className="mb-5">
                    <label className="text-sm font-medium text-gray-700 mr-3">Filter by Category:</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-1.5 rounded border border-gray-300 bg-white text-gray-800 text-sm"
                    >
                        <option value="all">All</option>
                        <option value="below-20">Below 20</option>
                        <option value="below-50">Below 50</option>
                        <option value="above-50">Above 50</option>
                    </select>
                </div>

                {/* Section Cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {filteredSections.map((section) => (
                        <div
                            key={section._id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-sm font-semibold text-gray-800 break-words">{section.name}</h3>
                                <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-600 font-medium">
                                    {section.sectionCategory}
                                </span>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <button
                                    onClick={() => router.push(`/admin/view-section/${section._id}`)}
                                    className="text-green-600 hover:underline text-xs flex items-center gap-1"
                                >
                                    <EyeIcon className="w-4 h-4" />
                                    View
                                </button>
                                <button
                                    onClick={() => handleDeleteSection(section._id)}
                                    className="text-red-500 hover:text-red-600 text-base"
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
