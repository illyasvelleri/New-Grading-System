import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [sections, setSections] = useState([]);
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await axios.get("/api/user/auth/me");
                setUser(res.data);
                fetchSections();
            } catch (error) {
                router.push("/user/login"); // Redirect to login if not authenticated
            }
        }

        fetchUser();
    }, []);

    // Fetch sections
    const fetchSections = async () => {
        try {
            const res = await axios.get("/api/user/sections"); // Endpoint to fetch sections
            setSections(res.data.sections || []);
        } catch (error) {
            console.error("Failed to fetch sections:", error);
        }
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
            <h1 className="text-2xl font-bold text-gray-700">Welcome, {user.username}!</h1>
            <p className="text-gray-500">Email: {user.email}</p>
        </div>

        <h2 className="mt-6 text-xl font-semibold text-gray-700">Your Sections:</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            {sections.length > 0 ? (
                sections.map((section) => (
                    <div
                        key={section._id}
                        className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition duration-300 relative"
                    >
                        <h2 className="text-lg font-semibold text-gray-700">{section.name}</h2>
                        <p className="text-gray-500">Category: {section.sectionCategory}</p>

                            <button
                                onClick={() => router.push(`/user/view-section/${section._id}`)}
                                className="inline-block text-blue-600 mt-2 hover:underline"
                            >
                                View Section
                            </button>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No sections available.</p>
            )}
        </div>
    </div>
    );
}
