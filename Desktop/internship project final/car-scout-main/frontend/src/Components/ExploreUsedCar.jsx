import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ExploreUsedCar.css";

const ExploreUsedCar = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [carTypeFilter, setCarTypeFilter] = useState("");
  const [fuelTypeFilter, setFuelTypeFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const fetchCars = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/cars");
        console.log("Fetched Data:", response.data);
        if (Array.isArray(response.data)) {
          setCars(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setCars([]);
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

  const handleViewDetails = (car) => {
    localStorage.setItem("selected_car", JSON.stringify(car));
    navigate("/cardetails");
  };

  const filteredCars = cars.filter((car) => {
    const matchesSearch = car?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCarType = carTypeFilter ? car?.car_type === carTypeFilter : true;
    const matchesFuelType = fuelTypeFilter ? car?.fuel_type === fuelTypeFilter : true;
    const matchesMinPrice = minPrice ? car?.price >= parseFloat(minPrice) : true;
    const matchesMaxPrice = maxPrice ? car?.price <= parseFloat(maxPrice) : true;

    return matchesSearch && matchesCarType && matchesFuelType && matchesMinPrice && matchesMaxPrice;
  });

  return (
    <div className="explore">
      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by car name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
        <select value={carTypeFilter} onChange={(e) => setCarTypeFilter(e.target.value)} className="dropdown">
          <option value="">All Car Types</option>
          <option value="SUV">SUV</option>
          <option value="Sedan">Sedan</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Truck">Truck</option>
        </select>
        <select value={fuelTypeFilter} onChange={(e) => setFuelTypeFilter(e.target.value)} className="dropdown">
          <option value="">All Fuel Types</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        <input
          type="number"
          placeholder="Min Price (in lakhs)"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="price-input"
        />
        <input
          type="number"
          placeholder="Max Price (in lakhs)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="price-input"
        />
      </div>

      {/* Car Listings */}
      <div className="carlist">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <div key={car.id} className="car-card">
              <div className="card-header">
                <span className="car-type">{car?.car_type?.toUpperCase() || "N/A"}</span>

                {car.image_urls && car.image_urls.length > 0 ? (
                  car.image_urls.length > 1 ? (
                    <Slider dots={true} infinite={true} speed={500} slidesToShow={1} slidesToScroll={1}>
                      {car.image_urls.map((url, index) => (
                        <div key={index}>
                          <img src={url} alt={`Car ${index}`} className="car-image" />
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <img src={car.image_urls[0]} alt="Car" className="car-image" />
                  )
                ) : (
                  <img src="https://via.placeholder.com/300x200" alt="Placeholder" className="car-image" loading="lazy" />
                )}
              </div>

              <div className="card-body">
                <h3 className="car-name">{car?.name || "Unknown Car"}</h3>
                <p>
                  <i className="fa fa-gas-pump"></i> {car?.fuel_type || "N/A"} &nbsp; | &nbsp;
                  <i className="fa fa-map-marker-alt"></i> {car?.location || "Unknown"}
                </p>
                <p>
                  <i className="fa fa-road"></i> {car?.kms_driven || "0"} km
                </p>
                <p className="car-price">Price: ₹ {car?.price || "N/A"} lakhs</p>
              </div>

              <button className="view-details-btn" onClick={() => handleViewDetails(car)}>
                View More Details
              </button>
            </div>
          ))
        ) : (
          <p>No cars found</p>
        )}
      </div>
    </div>
  );
};

export default ExploreUsedCar;
