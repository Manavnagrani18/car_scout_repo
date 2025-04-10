import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import '@fortawesome/fontawesome-free/css/all.min.css';

import Login from "./Components/Login";
import SignUp from "./Components/Signup";
import ForgetPassword from "./Components/ForgetPassword";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import UserDashboard from "./UserDashboard/UserDashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import ExploreUsedCar from "./Components/ExploreUsedCar";
import SellCar from "./Components/SellCar";
import CompareCar from "./Components/CompareCar";
import Footer from "./Components/Footer";
import UploadedCar from "./UserDashboard/UploadedCar";
import UserProfile from "./UserDashboard/UserProfile";
import Welcome from "./UserDashboard/Welcome";
import AdminDashboard from "./Admin/AdminDashboard";
import AuctionManagement from "./Admin/AuctionManagement";
import CarListingManagement from "./Admin/CarListingManagement";
import ComparisonInsights from "./Admin/ComparisonInsights";
import UserManagement from "./Admin/UserManagement";
import ReportsAnalytics from "./Admin/ReportsAnalytics";
import DashboardOverview from "./Admin/DashboardOverview";
import CarDetails from "./ExploreCars/CarDetails";
import AntiqueCarAuction from "./Auction/AntiqueCarAuction";
import AddCarAuction from "./Auction/AddCarAuction";
import VehicleVerification from "./Users/VehicleVerification";
// import Landingpg from "./Components/Landingpg";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const response = await axios.get("http://127.0.0.1:8000/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsAuthenticated(true);
          setUserRole(response.data.role); // Get user role from backend
          localStorage.setItem("userRole", response.data.role); // Store in localStorage
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem("authToken");
          localStorage.removeItem("userRole");
          setIsAuthenticated(false);
          setUserRole(null);
        }
      }
    };
    checkAuth();
  }, []);

  return (
    <Router>
      <AppLayout isAuthenticated={isAuthenticated} userRole={userRole} />
    </Router>
  );
}

const AppLayout = ({ isAuthenticated, userRole }) => {
  const location = useLocation();

  // Define routes where Navbar should be hidden
  const hideNavbarRoutes = [
    "/admindashboard",
    "/admindashboard/user-management",
    "/admindashboard/car-listings",
    "/admindashboard/auction-management",
    "/admindashboard/comparison-insights",
    "/admindashboard/reports-analytics",
  ];

  return (
    <>
      {/* Show Navbar only if the current path is not in hideNavbarRoutes */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/usedcar" element={<ExploreUsedCar />} />
        <Route path="/cardetails" element={<CarDetails />} />
        <Route path="/sellcar" element={<SellCar />} />
        <Route path="/comparecar" element={<CompareCar />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/carauction" element={<AntiqueCarAuction />} />
        <Route path="/addcarauction" element={<AddCarAuction />} />
        <Route path="/vehicleverification" element={<VehicleVerification />} />

        {/* Protected Routes for Users */}
        <Route
          path="/userdashboard/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="buyer">
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Welcome />} />
          <Route path="uploaded-cars" element={<UploadedCar />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* Protected Routes for Admins */}
        <Route
          path="/admindashboard/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="car-listings" element={<CarListingManagement />} />
          <Route path="auction-management" element={<AuctionManagement />} />
          <Route path="comparison-insights" element={<ComparisonInsights />} />
          <Route path="reports-analytics" element={<ReportsAnalytics />} />
        </Route>

        {/* Redirect unauthorized users */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
