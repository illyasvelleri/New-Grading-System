import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function AdminLogin() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await axios.post("/api/admin/auth/login", formData);
            if (res.status === 200) {
                router.push("/admin/dashboard"); // Redirect to dashboard on success
            }
        } catch (err) {
            setError("Invalid Email or Password");
        }
    };

    return (
        <div>
            <h1>Admin Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
}
