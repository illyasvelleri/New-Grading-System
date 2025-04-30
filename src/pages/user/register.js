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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-8">
    <h1 className="text-3xl font-bold text-center text-[#10b981] mb-6">User Registration</h1>

    <form onSubmit={handleRegister} className="space-y-4 text-gray-700">
      {/* Username Input */}
      <input
        type="text"
        placeholder="User Name"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]"
      />

      {/* Email Input */}
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]"
      />

      {/* Category + Password */}
      <div className="flex flex-col md:flex-row gap-4">
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]"
        >
          <option value="" disabled>Select Category</option>
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
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-2 bg-[#10b981] text-white rounded-lg hover:bg-[#064e3b] transition-all font-semibold"
      >
        Register
      </button>
    </form>

    {/* Feedback Messages */}
    {error && <p className="mt-4 text-center text-red-500 text-sm">{error}</p>}
    {success && <p className="mt-4 text-center text-green-600 text-sm">{success}</p>}

    {/* Login Redirect */}
    <div className="mt-4 text-center">
      <p className="text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/user/login" className="text-[#10b981] hover:text-[#064e3b] font-semibold">
          Login here
        </a>
      </p>
    </div>
  </div>
</div>

    );
}
