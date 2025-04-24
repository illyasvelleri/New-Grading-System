import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { ArrowRight } from "lucide-react"; // You can install lucide-react if needed
import AdminSidebar from "@/components/AdminSidebar";

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("/api/admin/users/get-users");
            setUsers(res.data.users || []);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            setLoading(false);
            if (error.response?.status === 401) {
                router.push("/admin/login");
            }
        }
    };

    const handleBack = () => {
        router.push("/admin/dashboard");
    };

    const goToUserPage = (id) => {
        router.push(`/admin/users/${id}`);
    };

    return (
        <div className="min-h-screen w-full bg-white text-gray-900 flex flex-col md:flex-row overflow-x-auto">

      <AdminSidebar />
        <div className="flex-1 p-6 md:p-10bg-white p-6 py-24 min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900">All Users</h1>
            </div>

            {loading ? (
                <p className="text-gray-600 text-center">Loading users...</p>
            ) : users.length === 0 ? (
                <p className="text-gray-600 text-center">No users found.</p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {users.map((user) => (
                        <div
                            key={user._id}
                            className="relative p-6 bg-white text-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                        >
                            <h2 className="text-xl font-semibold text-green-800">{user.username || "Unnamed User"}</h2>
                            <p className="text-gray-600 mt-2">Email: {user.email || "N/A"}</p>
                            <p className="text-gray-700 mt-1">Category: {user.category || "N/A"}</p>

                            <button
                                onClick={() => goToUserPage(user._id)}
                                className="absolute top-4 right-4 text-blue-600 hover:text-blue-800 transition duration-300"
                                title="View Details"
                            >
                                <ArrowRight />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>


        </div>
    );
}
