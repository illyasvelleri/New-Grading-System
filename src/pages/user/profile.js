import { useState } from "react";
import { useRouter } from "next/router";

const ProfilePage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        location: "",
        category: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Simulate API call (you should replace this with an actual call to your backend)
        setTimeout(() => {
            setLoading(false);
            router.push("/profile-success"); // Redirect to success page or any other page
        }, 1500);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Fill Your Profile</h1>

                {error && <div className="text-red-600 mb-4">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Email Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Location Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your location"
                        />
                    </div>

                    {/* Category Field */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Select Category</option>
                            <option value="student">Student</option>
                            <option value="professional">Professional</option>
                            <option value="business">Business</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full focus:outline-none"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit Profile"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
