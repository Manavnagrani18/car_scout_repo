import React, { useState, useEffect } from "react";
import axios from "axios";
import "../UserDashboard/UserProfile.css";

const UserProfile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    gender: "",
    dob: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const authToken = localStorage.getItem("authToken"); // Get JWT token

  const fetchUserData = async () => {
    setLoading(true);
    setError("");
    try {
      if (!authToken) {
        setError("Please log in to view your profile.");
        return;
      }

      const response = await axios.get("http://127.0.0.1:8000/auth/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setUserData(response.data);
      localStorage.setItem("userName", response.data.name); // Sync name with localStorage
    } catch (err) {
      setError("Failed to fetch user data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!authToken) {
        setError("You must be logged in to update your profile.");
        return;
      }

      await axios.put("http://127.0.0.1:8000/auth/update-profile", userData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      localStorage.setItem("userName", userData.name); // Update localStorage when saving changes
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="profile-form">
        <label>
          Full Name
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={userData.email}
            disabled // Email should not be editable
          />
        </label>
        <label>
          Gender
          <select
            name="gender"
            value={userData.gender}
            onChange={handleInputChange}
            disabled={!isEditing}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Prefer not to say">Others</option>
          </select>
        </label>
        <label>
          Date of Birth
          <input
            type="date"
            name="dob"
            value={userData.dob}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </label>
        <div className="profile-buttons">
          {isEditing ? (
            <>
              <button onClick={handleSaveChanges} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button onClick={() => setIsEditing(false)} disabled={loading}>
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
