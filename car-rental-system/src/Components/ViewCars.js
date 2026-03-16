import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewCars.css";

function AvailableCars() {

  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const fetchCars = () => {
    fetch("http://localhost:5000/cars")
      .then(res => res.json())
      .then(data => setCars(data.filter(car => car.available === 1)));
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const bookCar = (car) => {
    navigate("/book", {
      state: {
        car: car,
        userId: userId
      }
    });
  };

  /* SEARCH + FILTER LOGIC */

  const filteredCars = cars
    .filter(car =>
      car.car_name.toLowerCase().includes(search.toLowerCase()) ||
      car.brand.toLowerCase().includes(search.toLowerCase())
    )
    .filter(car => {

      if (priceFilter === "low") return car.price_per_day < 2000;
      if (priceFilter === "medium") return car.price_per_day >= 2000 && car.price_per_day <= 5000;
      if (priceFilter === "luxury") return car.price_per_day > 5000;

      return true;
    });

  return (

    <div className="cars-container">

      <h1 className="cars-title">Available Cars</h1>

      {/* SEARCH + FILTER */}

      <div className="car-controls">

        <input
          type="text"
          placeholder="Search car or brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
        />

        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="filter-box"
        >
          <option value="all">All Prices</option>
          <option value="low">Below ₹2000</option>
          <option value="medium">₹2000 - ₹5000</option>
          <option value="luxury">Above ₹5000</option>
        </select>

      </div>

      {/* CAR GRID */}

      <div className="cars-grid">

        {filteredCars.length === 0 ? (
          <p>No cars found</p>
        ) : (

          filteredCars.map(car => (

            <div className="car-card" key={car.id}>

              <h3>{car.car_name}</h3>
              <p className="brand">{car.brand}</p>
              <p className="price">₹{car.price_per_day}/day</p>

              <button
                className="book-btn"
                onClick={() => bookCar(car)}
              >
                Book Now
              </button>

            </div>

          ))

        )}

      </div>

    </div>

  );

}

export default AvailableCars;
