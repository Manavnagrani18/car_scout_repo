import requests

API_URL = "http://127.0.0.1:8000/cars"

sample_cars = [
    {
        "name": "Maruti Swift",
        "brand": "Maruti Suzuki",
        "year": 2022,
        "price": 7000,
        "fuel_type": "Petrol",
        "mileage": 18,
        "description": "Compact and fuel-efficient.",
        "image_url": "https://example.com/swift.jpg"
    },
    {
        "name": "Hyundai Creta",
        "brand": "Hyundai",
        "year": 2023,
        "price": 25000,
        "fuel_type": "Diesel",
        "mileage": 16,
        "description": "Spacious SUV with modern features.",
        "image_url": "https://example.com/creta.jpg"
    }
]

for car in sample_cars:
    response = requests.post(API_URL, json=car)
    print(response.json())
