import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "buyer",
  });
  const [error, setError] = useState("");
  const authToken = localStorage.getItem("authToken"); // Get auth token

  // Fetch Users from FastAPI Backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/auth/users", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [authToken]);

  // Handle Role Update
  const handleRoleChange = async (id, role) => {
    if (!["admin", "buyer", "seller"].includes(role)) return;
    try {
      await axios.put(
        `http://127.0.0.1:8000/auth/users/${id}`,
        { role },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, role } : user
        )
      );
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  // Handle User Deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Handle Adding New User
  const handleAddUser = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!newUser.username.trim() || !newUser.email || !newUser.password) {
      setError("All fields are required.");
      return;
    }

    if (!newUser.email.endsWith("@gmail.com")) {
      setError("Email must be a valid @gmail.com address.");
      return;
    }

    if (
      newUser.password.length < 8 ||
      !/[A-Z]/.test(newUser.password) ||
      !/[0-9]/.test(newUser.password) ||
      !/[@$!%*?&#]/.test(newUser.password)
    ) {
      setError("Password must be at least 8 characters, include an uppercase letter, a number, and a special character.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/register",
        newUser,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setUsers([...users, response.data]);
      setNewUser({ username: "", email: "", password: "", role: "buyer" });
    } catch (error) {
      console.error("Error adding user:", error);
      setError("Failed to add user. Please try again.");
    }
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleAddUser} className="add-user-form">
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Add User</button>
      </form>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) => user.username.toLowerCase().includes(search.toLowerCase()))
            .map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
