import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/CompareCar.css";

const CompareCars = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [selectedCar1, setSelectedCar1] = useState(null);
  const [selectedCar2, setSelectedCar2] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:8000/cars");
        if (!response.data) throw new Error("No data received");
        
        // Add temporary IDs if they don't exist
        const carsWithIds = response.data.map((car, index) => ({
          ...car,
          tempId: index.toString() // Using index as temporary ID
        }));
        
        console.log("Processed Cars:", carsWithIds);
        setCars(carsWithIds);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(`Error loading cars: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleSelectCar1 = (e) => {
    const tempId = e.target.value;
    const car = cars.find(c => c.tempId === tempId);
    console.log("Selected Car 1:", car);
    setSelectedCar1(car || null);
  };

  const handleSelectCar2 = (e) => {
    const tempId = e.target.value;
    const car = cars.find(c => c.tempId === tempId);
    console.log("Selected Car 2:", car);
    setSelectedCar2(car || null);
  };

  const renderComparisonRow = (icon, label, field) => (
    <tr>
      <td><i className={`fa fa-${icon}`}></i> {label}</td>
      <td>{selectedCar1?.[field] ?? "N/A"}</td>
      <td>{selectedCar2?.[field] ?? "N/A"}</td>
    </tr>
  );

  return (
    <div className="compare-cars">
      <button className="back-btn" onClick={() => navigate("/")}>
        <i className="fa fa-arrow-left"></i> Back
      </button>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      <div className="car-selection">
        <select 
          onChange={handleSelectCar1} 
          value={selectedCar1?.tempId || ""}
          disabled={isLoading}
        >
          <option value="">Select First Car</option>
          {cars.map(car => (
            <option 
              key={car.tempId} 
              value={car.tempId}
              disabled={selectedCar2 && car.tempId === selectedCar2.tempId}
            >
              {car.brand} - {car.name}
            </option>
          ))}
        </select>

        <select 
          onChange={handleSelectCar2} 
          value={selectedCar2?.tempId || ""}
          disabled={isLoading}
        >
          <option value="">Select Second Car</option>
          {cars.map(car => (
            <option 
              key={car.tempId} 
              value={car.tempId}
              disabled={selectedCar1 && car.tempId === selectedCar1.tempId}
            >
              {car.brand} - {car.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCar1 && selectedCar2 && (
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>{selectedCar1.brand} {selectedCar1.name}</th>
                <th>{selectedCar2.brand} {selectedCar2.name}</th>
              </tr>
            </thead>
            <tbody>
              {renderComparisonRow("car", "Brand", "brand")}
              {renderComparisonRow("list", "Model", "name")}
              {renderComparisonRow("list", "Type", "car_type")}
              {renderComparisonRow("cogs", "Transmission", "transmission")}
              {renderComparisonRow("gas-pump", "Fuel Type", "fuel_type")}
              {renderComparisonRow("calendar", "Year", "year")}
              {renderComparisonRow("user", "Ownership", "ownership")}
              {renderComparisonRow("road", "KMs Driven", "kms_driven")}
              {renderComparisonRow("dollar-sign", "Price", "price")}
              {renderComparisonRow("map-marker-alt", "Location", "location")}
              {renderComparisonRow("cog", "Engine", "engine")}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompareCars;