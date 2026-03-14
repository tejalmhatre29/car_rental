import { useState, useEffect } from "react";

function BookCar({ userId }) {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [dates, setDates] = useState({ start_date: "", end_date: "" });
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch available cars
  useEffect(() => {
    fetch("http://localhost:5000/cars")
      .then(res => res.json())
      .then(data => {
        const availableCars = data.filter(car => car.available === 1);
        setCars(availableCars);
      });
  }, []);

  // Update total price whenever dates or selected car change
  useEffect(() => {
    if (selectedCar && dates.start_date && dates.end_date) {
      const start = new Date(dates.start_date);
      const end = new Date(dates.end_date);

      // Calculate number of days
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (diffDays > 0) {
        setTotalPrice(diffDays * selectedCar.price_per_day);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  }, [dates, selectedCar]);

  const handleChange = (e) => {
    setDates({ ...dates, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCar) return alert("Please select a car!");
    if (dates.start_date > dates.end_date) return alert("End date cannot be before start date!");

    fetch("http://localhost:5000/bookcar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        car_id: selectedCar.id,
        start_date: dates.start_date,
        end_date: dates.end_date
      })
    })
      .then(res => res.json())
      .then(res => {
        alert(res.message);
        if (res.message.includes("successfully")) {
          // Redirect to payment page if needed
        }
      });
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2 style={{ textAlign: "center" }}>Book a Car</h2>

      {/* Car Selection */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "20px" }}>
        {cars.map(car => (
          <div
            key={car.id}
            onClick={() => setSelectedCar(car)}
            style={{
              border: selectedCar?.id === car.id ? "2px solid #007bff" : "1px solid #ccc",
              padding: "15px",
              borderRadius: "10px",
              cursor: "pointer",
              width: "calc(50% - 20px)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
            }}
          >
            <h3>{car.car_name}</h3>
            <p>Brand: {car.brand}</p>
            <p>Price: ₹{car.price_per_day}/day</p>
          </div>
        ))}
      </div>

      {/* Booking Form */}
      {selectedCar && (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <h3>Booking Details for: {selectedCar.car_name}</h3>

          <label>Start Date</label>
          <input type="date" name="start_date" value={dates.start_date} onChange={handleChange} required />

          <label>End Date</label>
          <input type="date" name="end_date" value={dates.end_date} onChange={handleChange} required />

          {totalPrice > 0 && (
            <p style={{ fontWeight: "bold", fontSize: "16px" }}>
              Total Price: ₹{totalPrice}
            </p>
          )}

          <button type="submit" style={{
            padding: "12px",
            background: "linear-gradient(135deg, #007bff, #0056b3)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}>
            Book & Pay
          </button>
        </form>
      )}
    </div>
  );
}

export default BookCar;
