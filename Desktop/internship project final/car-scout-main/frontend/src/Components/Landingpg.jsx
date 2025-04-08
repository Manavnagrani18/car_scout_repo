import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LandingPage = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/cars");
        setCars(response.data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };
    fetchCars();
  }, []);

  return (
    <div className="font-poppins">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold">Car-scout</h1>
        <p className="text-lg mt-2">Discover the joy of driving with confidence.</p>
        <p className="text-lg">Looking for the best deals on cars? You're at the right place!</p>
        <button className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition">
          Explore
        </button>
      </section>

      {/* Explore Cars Section */}
      <section className="container mx-auto py-12">
        <h2 className="text-3xl font-semibold text-center mb-6">Explore Used Cars</h2>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow-lg p-4 hover:scale-105 transition">
              <img
                src={car.image_urls?.[0] || "https://via.placeholder.com/300"}
                alt={car.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h3 className="text-xl font-bold mt-3">{car.name}</h3>
              <p className="text-gray-600">{car.fuel_type} • {car.location}</p>
              <p className="text-gray-700"><b>{car.kms_driven} km</b></p>
              <p className="text-green-600 font-semibold">₹ {car.price} Lakhs</p>
              <button
                onClick={() => navigate(`/car/${car.id}`)}
                className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                View More Details
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Compare Cars Section */}
      <section className="bg-gray-100 py-12 px-6 text-center">
        <h2 className="text-3xl font-semibold">Compare Cars</h2>
        <div className="mt-6 bg-white shadow-md p-6 rounded-lg mx-auto w-full max-w-2xl">
          <div className="flex gap-4">
            <select className="w-full border p-3 rounded-lg">
              <option>Select First Car</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>{car.name}</option>
              ))}
            </select>
            <select className="w-full border p-3 rounded-lg">
              <option>Select Second Car</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>{car.name}</option>
              ))}
            </select>
          </div>
          <button className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition">
            Compare
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
          <div>
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <p>Ward No 29, Ahmedabad</p>
            <p>📞 +910000000000</p>
            <p>✉️ carscout@gmail.com</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <a href="#" className="block text-gray-400 hover:text-white">Home</a>
            <a href="#" className="block text-gray-400 hover:text-white">Explore Car</a>
            <a href="#" className="block text-gray-400 hover:text-white">Compare Car</a>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Social Media</h3>
            <div className="flex justify-center space-x-4 mt-2">
              <a href="#" className="text-blue-400 text-2xl hover:text-blue-600"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-pink-400 text-2xl hover:text-pink-600"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
