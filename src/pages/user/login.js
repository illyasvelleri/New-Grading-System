import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Login() {
    const [formData, setFormData] = useState({ identifier: "", password: "" });
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("/api/user/auth/login", formData);
            if (res.status === 200) {
                router.push("/user/dashboard"); // Redirect to dashboard
            }
        } catch (err) {
            setError("Invalid Email or Password");
        }
    };

    return (
        <div>
            <h1>User Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    name="identifier"
                    placeholder="Email or Username"
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
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
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
