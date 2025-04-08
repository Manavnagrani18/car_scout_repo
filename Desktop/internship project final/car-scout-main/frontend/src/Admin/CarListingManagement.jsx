import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CarListingManagement.css";

const CarListingsManagement = () => {
  const [cars, setCars] = useState([]);
  const [formData, setFormData] = useState({
    brand: "",
    name: "",
    car_type: "",
    transmission: "",
    fuel_type: "",
    year: "",
    ownership: "",
    kms_driven: "",
    price: "",
    location: "",
    engine: "",
    description: "",
    image_urls: [],
  });
  const [editingCarId, setEditingCarId] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get("http://localhost:8000/cars");
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    const formData = new FormData();
    formData.append("file", imageFile);
    try {
      const response = await axios.post("http://localhost:8000/cars/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.image_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = await uploadImage();
    const updatedData = { ...formData, image_urls: imageUrl ? [imageUrl] : formData.image_urls };
    try {
      if (editingCarId) {
        await axios.put(`http://localhost:8000/cars/${editingCarId}`, updatedData);
        alert("Car updated successfully");
      } else {
        await axios.post("http://localhost:8000/cars", updatedData);
        alert("Car added successfully");
      }
      fetchCars();
      setFormData({
        brand: "",
        name: "",
        car_type: "",
        transmission: "",
        fuel_type: "",
        year: "",
        ownership: "",
        kms_driven: "",
        price: "",
        location: "",
        engine: "",
        description: "",
        image_urls: [],
      });
      setImageFile(null);
      setEditingCarId(null);
    } catch (error) {
      console.error("Error saving car:", error);
      alert("Error saving car");
    }
  };

  const handleEdit = (car) => {
    setFormData(car);
    setEditingCarId(car._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/cars/${id}`);
      fetchCars();
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Error deleting car");
    }
  };

  return (
    <div className="car-listings-management">
      <h2>Car Listings Management</h2>
      <form onSubmit={handleSubmit} className="car-form">
        {Object.keys(formData).map((key) =>
          key !== "image_urls" ? (
            <input
              key={key}
              type={typeof formData[key] === "number" ? "number" : "text"}
              name={key}
              placeholder={key.replace("_", " ")}
              value={formData[key]}
              onChange={handleInputChange}
              required
            />
          ) : null
        )}
        <input type="file" onChange={handleImageUpload} accept="image/*" />
        <button type="submit">{editingCarId ? "Update Car" : "Add Car"}</button>
      </form>

      <table className="car-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Type</th>
            <th>Fuel</th>
            <th>Price</th>
            <th>Year</th>
            <th>Kms Driven</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.length > 0 ? (
            cars.map((car) => (
              <tr key={car._id}>
                <td>
                  <img
                    src={car.image_urls?.[0] || "https://via.placeholder.com/100"}
                    alt={car.name}
                    className="car-thumbnail"
                  />
                </td>
                <td>{car.name}</td>
                <td>{car.brand}</td>
                <td>{car.car_type}</td>
                <td>{car.fuel_type}</td>
                <td>{car.price} Lakhs</td>
                <td>{car.year}</td>
                <td>{car.kms_driven} km</td>
                <td>
                  <button onClick={() => handleEdit(car)}>Edit</button>
                  <button onClick={() => handleDelete(car._id)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No car listings found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CarListingsManagement;
