import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import AdminSidebar from "@/components/AdminSidebar";
import { EyeIcon } from 'lucide-react';

export default function Sections() {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
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
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteSection = async (id) => {
        const confirmDelete = await confirmDeletePrompt();
        if (!confirmDelete) return;

        try {
            await axios.delete(`/api/admin/sections/delete?id=${id}`);
            fetchSections();
        } catch (error) {
            console.error("Failed to delete section", error);
        }
    };

    const confirmDeletePrompt = () => {
        return new Promise((resolve) => {
            const overlay = document.createElement("div");
            overlay.className = "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40";

            const box = document.createElement("div");
            box.className = "bg-white p-4 rounded-lg shadow-lg text-center max-w-xs w-full";

            box.innerHTML = `
                <h2 class="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h2>
                <p class="text-gray-700 text-sm mb-4">Are you sure you want to delete this section?</p>
                <div class="flex justify-center gap-4">
                    <button id="cancelBtn" class="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">Cancel</button>
                    <button id="confirmBtn" class="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Yes</button>
                </div>
            `;

            overlay.appendChild(box);
            document.body.appendChild(overlay);

            box.querySelector("#cancelBtn").onclick = () => {
                document.body.removeChild(overlay);
                resolve(false);
            };

            box.querySelector("#confirmBtn").onclick = () => {
                document.body.removeChild(overlay);
                resolve(true);
            };
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-white flex flex-col lg:flex-row text-xs sm:text-sm text-gray-900">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 mx-auto w-full">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 md:mb-8 tracking-tight">
          Manage Sections
        </h2>

        {/* Filter Section */}
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <label
            htmlFor="category-filter"
            className="text-sm font-medium text-gray-700 whitespace-nowrap"
          >
            Filter by Category:
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm transition-all duration-200 hover:bg-gray-100"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            <option value="below-20">Below 20</option>
            <option value="below-50">Below 50</option>
            <option value="above-50">Above 50</option>
          </select>
        </div>

        {/* Section Cards */}
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading sections...</div>
        ) : filteredSections.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
            No sections found
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSections.map((section) => (
              <div
                key={section._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words leading-tight">
                    {section.name}
                  </h3>
                  <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600 font-medium capitalize">
                    {section.sectionCategory}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <button
                    onClick={() => router.push(`/admin/view-section/${section._id}`)}
                    className="flex items-center gap-1.5 text-green-600 hover:text-green-700 text-xs sm:text-sm font-medium transition-colors duration-200"
                    aria-label={`View section ${section.name}`}
                  >
                    <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteSection(section._id)}
                    className="text-red-500 hover:text-red-600 text-xs sm:text-sm font-medium transition-colors duration-200"
                    aria-label={`Delete section ${section.name}`}
                  >
                    ❌ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>

    );
}
