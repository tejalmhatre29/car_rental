import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewCars.css";

function AvailableCars({userId}) {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  const fetchCars = () => {
    fetch("http://localhost:5000/cars")
      .then(res => res.json())
      .then(data => setCars(data.filter(car => car.available === 1))); // only available cars
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const bookCar = (car) => {
    navigate("/bookcar", { state: { car, userId } }); // send car and user id to booking page
  };

  return (
    <div className="cars-grid">
      {cars.map(car => (
        <div className="car-card" key={car.id}>
          <h3>{car.car_name}</h3>
          <p>{car.brand}</p>
          <p>₹{car.price_per_day}/day</p>
          <button onClick={() => bookCar(car)}>Book Now</button>
        </div>
      ))}
    </div>
  );
}

export default AvailableCars;
