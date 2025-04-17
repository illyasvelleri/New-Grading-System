// import { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/router";

// export default function Register() {
//     const [formData, setFormData] = useState({ username: "", email: "", password: "", category: "" });
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");
//     const router = useRouter();

//     const handleRegister = async (e) => {
//         e.preventDefault();
//         setError("");
//         setSuccess("");

//         try {
//             const res = await axios.post("/api/user/auth/register", formData);
//             if (res.status === 201) {
//                 setSuccess("Registration successful! Redirecting to login...");
//                 setTimeout(() => router.push("/user/login"), 2000);
//             }
//         } catch (err) {
//             setError(err.response?.data?.error || "Something went wrong");
//         }
//     };

//     return (
//         <div>
//             <h1>User Registration</h1>
//             <form onSubmit={handleRegister}>
//                 <input
//                     type="text"
//                     placeholder="User Name"
//                     value={formData.username}
//                     onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//                     required
//                 />
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     value={formData.email}
//                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                     required
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={formData.password}
//                     onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                     required
//                 />
//                 {/* Category Select */}
//                 <select
//                     className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={formData.category}
//                     onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                     required
//                 >
//                     <option value="" disabled>Select Category</option>
//                     <option value="below-20">Below 20</option>
//                     <option value="below-50">Below 50</option>
//                     <option value="above-50">Above 50</option>
//                 </select>


//                 <button type="submit">Register</button>
//             </form>
//             {error && <p style={{ color: "red" }}>{error}</p>}
//             {success && <p style={{ color: "green" }}>{success}</p>}
//         </div>
//     );
// }

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        category: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await axios.post("/api/user/auth/register", formData);
            if (res.status === 201) {
                setSuccess("Registration successful! Redirecting to login...");
                setTimeout(() => router.push("/user/login"), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow bg-gray-500">
            <h1 className="text-2xl font-semibold mb-6 text-center">User Registration</h1>
            <form onSubmit={handleRegister} className="space-y-4 text-gray-800">
                <input
                    type="text"
                    placeholder="User Name"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex flex-col md:flex-row gap-4">
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                        className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled>
                            Select Category
                        </option>
                        <option value="below-20">Below 20</option>
                        <option value="below-50">Below 50</option>
                        <option value="above-50">Above 50</option>
                    </select>

                    <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Register
                </button>
            </form>

            {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}
            {success && <p className="text-green-600 mt-4 text-sm">{success}</p>}
        </div>
    );
}
