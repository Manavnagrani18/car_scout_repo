import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../ExploreCars/CarDetails.css";

const CarDetails = () => {
  const navigate = useNavigate();
  const [car, setCar] = useState(null);

  useEffect(() => {
    const selectedCar = localStorage.getItem("selected_car");
    if (selectedCar) {
      try {
        const parsedCar = JSON.parse(selectedCar);
        setCar(parsedCar);
      } catch (error) {
        console.error("❌ Error parsing selected car data:", error);
      }
    }
  }, []);

  if (!car) {
    return <p>Loading car details...</p>;
  }

  const hasMultipleImages = car.image_urls && car.image_urls.length > 1;

  const sliderSettings = {
    dots: true,
    infinite: hasMultipleImages,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true , // Show arrows only if more than one image
    centerMode: true, // Ensures the images remain visible properly
    centerPadding: "0px", // Prevents unnecessary cropping
  };

  return (
    <div className="car-details">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      {/* Car Name */}
      <h2 className="car-title">{car.name}</h2>

      {/* Slick Image Slider */}
      <div className="slider-container">
        <Slider {...sliderSettings}>
          {car.image_urls && car.image_urls.length > 0 ? (
            car.image_urls.map((url, index) => (
              <div key={index} className="slider-item">
                <img src={url}  style={{ width: '100%', height: 'auto', objectFit: 'contain' }} alt={`Car ${index}`} className="car-image" />
                

              </div>
            ))
          ) : (
            <div className="slider-item">
              <img src="https://via.placeholder.com/500" alt="Placeholder" className="car-image" />
            </div>
          )}
        </Slider>
      </div>

      {/* Car Details (Centered) */}
      <div className="car-info">
        <p><strong>Brand:</strong> {car.brand}</p>
        <p><strong>Type:</strong> {car.car_type} | <strong>Transmission:</strong> {car.transmission} | <strong>Fuel:</strong> {car.fuel_type}</p>
        <p><strong>Year:</strong> {car.year} | <strong>Ownership:</strong> {car.ownership}</p>
        <p><strong>Engine:</strong> {car.engine} | <strong>KMs Driven:</strong> {car.kms_driven}</p>
        <p className="car-price">Price: ₹ {car.price} lakhs</p>
        <p><strong>Location:</strong> {car.location}</p>
        <p className="car-description"><strong>Description:</strong> {car.description}</p>
      </div>

      {/* Car Inspection Report */}
      <div className="inspection-report">
        <h3>Car Inspection Report</h3>
        <p><strong>Accident History:</strong> {car.accident_history || "No records available"}</p>
        <p><strong>Service Records:</strong> {car.service_records || "No records available"}</p>
        <p><strong>Certification:</strong> {car.certification || "Not certified"}</p>
      </div>

      <button className="buy-now-btn">Buy Now</button>
    </div>
  );
};

export default CarDetails;
