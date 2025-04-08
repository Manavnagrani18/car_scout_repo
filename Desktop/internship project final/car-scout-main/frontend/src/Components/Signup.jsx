import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const Signup = () => {
    const [formData, setFormData] = useState({ 
        username: "", 
        email: "", 
        password: "",
        role: "buyer"
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/auth/register", formData);
            
            // ✅ Store token & username in localStorage
            localStorage.setItem("authToken", response.data.token);
            localStorage.setItem("userName", formData.username);

            navigate("/userdashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="auth-container">
            <h2>Sign Up</h2>
            {error && <p className="error-message">{error}</p>}
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <select name="role" value={formData.role} onChange={handleChange} required>
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
