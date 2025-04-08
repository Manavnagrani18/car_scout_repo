import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const Login = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/auth/login",
                new URLSearchParams({
                    grant_type: "password",
                    username: formData.username,
                    password: formData.password
                }),
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            );

            // Store token and username in localStorage
            localStorage.setItem("authToken", response.data.access_token);
            localStorage.setItem("userName", formData.username); // ✅ Store username

            // Redirect to user dashboard
            navigate("/userdashboard");
        } catch (err) {
            setError(err.response?.data?.detail || "Login failed");
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
