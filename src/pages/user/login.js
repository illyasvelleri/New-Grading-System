import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Login() {
    const [formData, setFormData] = useState({ identifier: "", password: "" });
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Reset error before trying

        try {
            const res = await axios.post("/api/user/auth/login", formData);
            if (res.status === 200) {
                router.push("/user/dashboard"); // Redirect to user dashboard
            }
        } catch (err) {
            setError("Invalid Email or Password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-8">
                <h1 className="text-3xl font-bold text-center text-[#10b981] mb-6">User Login</h1>

                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Email or Username Input */}
                    <input
                        type="text"
                        name="identifier"
                        placeholder="Email or Username"
                        value={formData.identifier}
                        onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981] text-gray-700"
                    />

                    {/* Password Input */}
                    <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981] text-gray-700"
                    />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 bg-[#10b981] text-white rounded-lg hover:bg-[#064e3b] transition-all"
                    >
                        Login
                    </button>
                </form>

                {/* Error Message */}
                {error && <p className="mt-4 text-center text-red-500">{error}</p>}

                {/* Forgot Password Link */}
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        <a href="/user/login" className="text-[#10b981] hover:text-[#064e3b] font-semibold">
                            Forgot Password?
                        </a>
                    </p>
                </div>

                {/* Create Account Link */}
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <a
                            href="/user/register"
                            className="text-[#10b981] hover:text-[#064e3b] font-semibold"
                        >
                            Create one here
                        </a>
                    </p>
                </div>
            </div>
        </div>

    );
}
