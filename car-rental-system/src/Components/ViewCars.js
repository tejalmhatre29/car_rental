import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewCars.css";

function AvailableCars() {

  const [cars, setCars] = useState([]);
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

  return (

    <div className="cars-container">

      <h1 className="cars-title">Available Cars</h1>

      <div className="cars-grid">

        {cars.map(car => (

          <div className="car-card" key={car.id}>

<h3>{car.car_name}</h3>

<p className="brand">{car.brand}</p>

<p className="owner">Owner: {car.owner_name}</p>

<p className="price">₹{car.price_per_day}/day</p>

<button
className="book-btn"
onClick={() => bookCar(car)}
>
Book Now
</button>

</div>


        ))}

      </div>

    </div>

  );

}

export default AvailableCars;
