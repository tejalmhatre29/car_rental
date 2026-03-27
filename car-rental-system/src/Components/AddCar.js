import { useState } from "react";
import { Link } from "react-router-dom";
import { resolveApiPath } from "../api";
import "./AddCar.css";

function AddCar() {
  const [car, setCar] = useState({
    car_name: "",
    brand: "",
    price_per_day: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const price = Number(car.price_per_day);
    if (!car.car_name.trim() || !car.brand.trim() || !car.price_per_day) {
      alert("Please fill car name, brand, and price.");
      return;
    }
    if (Number.isNaN(price) || price <= 0) {
      alert("Price per day must be a positive number.");
      return;
    }
    setLoading(true);
    fetch(resolveApiPath("/addcar"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        car_name: car.car_name.trim(),
        brand: car.brand.trim(),
        price_per_day: price,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        alert(res.message);
        if (res.message === "Car Added") {
          setCar({ car_name: "", brand: "", price_per_day: "" });
        }
      })
      .catch(() => {
        setLoading(false);
        alert("Cannot reach server.");
      });
  };

  return (
    <div className="addcar-page page-enter">
      <div className="addcar-bg" aria-hidden />
      <header className="addcar-header">
        <Link to="/admin" className="addcar-back">
          ← Admin
        </Link>
        <h1>Add vehicle</h1>
      </header>
      <form className="addcar-form" onSubmit={handleSubmit}>
        <label className="addcar-field">
          <span>Car name</span>
          <input
            name="car_name"
            placeholder="e.g. Swift Dzire"
            value={car.car_name}
            onChange={handleChange}
          />
        </label>
        <label className="addcar-field">
          <span>Brand</span>
          <input
            name="brand"
            placeholder="e.g. Maruti"
            value={car.brand}
            onChange={handleChange}
          />
        </label>
        <label className="addcar-field">
          <span>Price per day (₹)</span>
          <input
            name="price_per_day"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 1500"
            value={car.price_per_day}
            onChange={handleChange}
          />
        </label>
        <button type="submit" className="addcar-submit" disabled={loading}>
          {loading ? "Saving…" : "Add to fleet"}
        </button>
      </form>
    </div>
  );
}

export default AddCar;
