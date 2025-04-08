import React, { useState } from "react";
import axios from "axios";
import "../Styles/SellCar.css";

const SellCar = () => {
  const [formData, setFormData] = useState({
    brand: "",
    carType: "",
    transmission: "",
    fuelType: "",
    carYear: "",
    ownership: "",
    carName: "",
    kmsDriven: "",
    price: "",
    location: "",
    engine: "",
    description: "",
    featuredImage: null,
    gallery: Array(8).fill(null),
  });

  const [message, setMessage] = useState("");
  const authToken = localStorage.getItem("authToken"); // Get JWT token

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, index = null) => {
    if (index !== null) {
      const newGallery = [...formData.gallery];
      newGallery[index] = e.target.files[0];
      setFormData({ ...formData, gallery: newGallery });
    } else {
      setFormData({ ...formData, featuredImage: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authToken) {
      setMessage("Please log in to submit the car details.");
      return;
    }

    const galleryImages = formData.gallery.filter((file) => file !== null);
    if (galleryImages.length < 2) {
      setMessage("At least 2 gallery images are required.");
      return;
    }

    try {
      const uploadData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "gallery") {
          galleryImages.forEach((file) => uploadData.append("gallery", file));
        } else if (key === "featuredImage" && formData.featuredImage) {
          uploadData.append("featuredImage", formData.featuredImage);
        } else {
          uploadData.append(key, formData[key]);
        }
      });

      const response = await axios.post("http://127.0.0.1:8000/cars", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`, // Attach JWT Token
        },
      });

      setMessage(response.data.message || "Car details uploaded successfully!");
      setFormData({
        brand: "",
        carType: "",
        transmission: "",
        fuelType: "",
        carYear: "",
        ownership: "",
        carName: "",
        kmsDriven: "",
        price: "",
        location: "",
        engine: "",
        description: "",
        featuredImage: null,
        gallery: Array(8).fill(null),
      });
    } catch (err) {
      console.error(err);
      setMessage("Error uploading car details.");
    }
  };

  return (
    <div className="sell-car-container">
      <form className="sell-car-form" onSubmit={handleSubmit}>
        <h2>SELL YOUR CAR</h2>
        <div className="form-row">
          <label>Brand</label>
          <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} />

          <label>Car Type</label>
          <input type="text" name="carType" value={formData.carType} onChange={handleInputChange} />

          <label>Transmission</label>
          <input type="text" name="transmission" value={formData.transmission} onChange={handleInputChange} />
        </div>

        <div className="form-row">
          <label>Fuel Type</label>
          <input type="text" name="fuelType" value={formData.fuelType} onChange={handleInputChange} />

          <label>Car Year</label>
          <input type="number" name="carYear" value={formData.carYear} onChange={handleInputChange} />

          <label>Ownership</label>
          <input type="text" name="ownership" value={formData.ownership} onChange={handleInputChange} />
        </div>

        <div className="form-row">
          <label>Car Name</label>
          <input type="text" name="carName" value={formData.carName} onChange={handleInputChange} />

          <label>Kms Driven</label>
          <input type="number" name="kmsDriven" value={formData.kmsDriven} onChange={handleInputChange} />

          <label>Price</label>
          <input type="number" name="price" value={formData.price} onChange={handleInputChange} />
        </div>

        <div className="form-row">
          <label>Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleInputChange} />

          <label>Engine</label>
          <input type="text" name="engine" value={formData.engine} onChange={handleInputChange} />
        </div>

        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange}></textarea>

        <div className="file-upload">
          <label>Featured Image</label>
          <input type="file" onChange={(e) => handleFileChange(e)} />
        </div>

        <div className="gallery">
          {formData.gallery.map((_, index) => (
            <div key={index} className="gallery-item">
              <label>
                +
                <input type="file" onChange={(e) => handleFileChange(e, index)} style={{ display: "none" }} />
              </label>
            </div>
          ))}
        </div>

        <button className="submitbtn" type="submit">Submit</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default SellCar;
