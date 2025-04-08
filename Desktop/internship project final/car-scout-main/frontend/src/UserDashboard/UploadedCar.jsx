import React, { useEffect, useState } from "react";
import axios from "axios";
import "../UserDashboard/UploadedCar.css";

const UploadedCar = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")); // Get user details
  const token = localStorage.getItem("access_token"); // Get JWT token

  useEffect(() => {
    const fetchUserCars = async () => {
      if (!user || !user.id || !token) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/cars/user/${user.id}`, 
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCars(response.data);
      } catch (error) {
        setError("Error fetching user cars.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCars();
  }, [user, token]);

  return (
    <div className="container">
      <div className="header">
        <h2>My Uploaded Cars</h2>
      </div>

      {loading ? (
        <p>Loading cars...</p>
      ) : error ? (
        <p>{error}</p>
      ) : cars.length > 0 ? (
        <table className="car-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Brand</th>
              <th>Type</th>
              <th>Fuel</th>
              <th>Transmission</th>
              <th>Year</th>
              <th>Ownership</th>
              <th>Kms Driven</th>
              <th>Engine</th>
              <th>Location</th>
              <th>Price</th>
              <th>Description</th>
              <th>Sold</th>
              <th>Expired</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car._id}>
                <td>{car.carName}</td>
                <td>{car.brand}</td>
                <td>{car.carType}</td>
                <td>{car.fuelType}</td>
                <td>{car.transmission}</td>
                <td>{car.carYear}</td>
                <td>{car.ownership}</td>
                <td>{car.kmsDriven}</td>
                <td>{car.engine}</td>
                <td>{car.location}</td>
                <td>{car.price}</td>
                <td>{car.description}</td>
                <td>{car.sold ? "Yes" : "No"}</td>
                <td>{car.expired ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No cars uploaded for this user.</p>
      )}
    </div>
  );
};

export default UploadedCar;
