import React, { useEffect, useState } from "react";

const Welcome = () => {
    const [userName, setUserName] = useState("Guest");

    useEffect(() => {
        const name = localStorage.getItem("userName") || "Guest";
        setUserName(name);
    }, []); // ✅ Removed dependency to avoid unnecessary re-renders

    return (
        <div className="welcome-container">
            <h3 className="welcome-message">Welcome, {userName}!</h3>
        </div>
    );
};

export default Welcome;
