import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import ExploreUsedCar from "./ExploreUsedCar";
import CompareCar from "./CompareCar";
import Footer from "./Footer";
// import heroImage from "../Assests/car.png"; // Ensure this path is correct

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Dream Car</h1>
          <p>Browse through a variety of high-quality used cars.</p>
          <button className="explore-btn" onClick={() => navigate("/usedcar")}>
            Explore Now
          </button>
        </div>
        
      </section>

      {/* Explore Used Cars */}
      <ExploreUsedCar />

      {/* Compare Cars */}
      <CompareCar />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
