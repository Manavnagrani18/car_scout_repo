import React from "react";
import { useNavigate } from "react-router-dom";
import ExploreUsedCar from "./ExploreUsedCar";
import CompareCar from "./CompareCar";
import heroImage from "../Assests/car.png";

import Footer from "./Footer";
import "./Home.css"; // Ensure your CSS has the background image for hero

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Find Your Dream Car</h1>
          <p>Browse through a variety of high-quality used cars.</p>
          <button className="explore-btn" onClick={() => navigate("/usedcar")}>
            Explore Now
          </button>
        </div>
      </div>

      {/* Explore Used Cars Section */}
      <ExploreUsedCar />

      {/* Compare Cars Section */}
      <CompareCar />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
