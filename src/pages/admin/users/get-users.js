import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { ArrowRight } from "lucide-react"; // You can install lucide-react if needed

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
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">All Users</h1>
                <button
                    onClick={handleBack}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                    Back to Dashboard
                </button>
            </div>

            {loading ? (
                <p className="text-gray-600">Loading users...</p>
            ) : users.length === 0 ? (
                <p className="text-gray-600">No users found.</p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {users.map((user) => (
                        <div
                            key={user._id}
                            className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition duration-300 relative"
                        >
                            <h2 className="text-lg font-semibold text-gray-700">{user.name || "Unnamed User"}</h2>
                            <p className="text-gray-500">Email: {user.email || "N/A"}</p>
                            <p className="text-gray-500">ID: {user._id}</p>

                            <button
                                onClick={() => goToUserPage(user._id)}
                                className="absolute top-4 right-4 text-blue-600 hover:text-blue-800"
                                title="View Details"
                            >
                                <ArrowRight />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
