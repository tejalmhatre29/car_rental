import { useState, useEffect } from "react";
import "./BookCar.css";

function BookCar({ userId }) {

  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [dates, setDates] = useState({ start_date: "", end_date: "" });
  const [totalPrice, setTotalPrice] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    fetch("http://localhost:5000/cars")
      .then(res => res.json())
      .then(data => {
        const availableCars = data.filter(car => car.available === 1);
        setCars(availableCars);
      });
  }, []);

  useEffect(() => {
    if (selectedCar && dates.start_date && dates.end_date) {

      const start = new Date(dates.start_date);
      const end = new Date(dates.end_date);

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
    if (dates.start_date > dates.end_date) return alert("Invalid dates!");

    setShowPayment(true);
  };

  const confirmBooking = () => {

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
        alert("Payment Successful!\n" + res.message);
        setShowPayment(false);
      });

  };

  return (

    <div className="bookcar-container">

      <h2 className="bookcar-title">Book a Car</h2>

      {/* Car Selection */}

      <div className="car-selection">

        {cars.map(car => (

          <div
            key={car.id}
            className={`car-option ${selectedCar?.id === car.id ? "selected" : ""}`}
            onClick={() => setSelectedCar(car)}
          >

            <h3>{car.car_name}</h3>
            <p>Brand: {car.brand}</p>
            <p>Price: ₹{car.price_per_day}/day</p>

          </div>

        ))}

      </div>

      {/* Booking Form */}

      {selectedCar && (

        <form className="booking-form" onSubmit={handleSubmit}>

          <h3>Booking Details for: {selectedCar.car_name}</h3>

          <label>Start Date</label>
          <input
            type="date"
            name="start_date"
            value={dates.start_date}
            onChange={handleChange}
            required
          />

          <label>End Date</label>
          <input
            type="date"
            name="end_date"
            value={dates.end_date}
            onChange={handleChange}
            required
          />

          {totalPrice > 0 && (
            <p className="total-price">
              Total Price: ₹{totalPrice}
            </p>
          )}

          <button type="submit" className="book-btn">
            Book & Pay
          </button>

        </form>

      )}

      {/* Payment Interface */}

      {showPayment && (

        <div className="payment-overlay">

          <div className="payment-box">

            <h3>Payment</h3>

            <p><b>Car:</b> {selectedCar.car_name}</p>
            <p><b>Total Amount:</b> ₹{totalPrice}</p>

            <label>Select Payment Method</label>

            <select
              value={paymentMethod}
              onChange={(e)=>setPaymentMethod(e.target.value)}
            >
              <option value="card">Credit / Debit Card</option>
              <option value="upi">UPI</option>
              <option value="netbanking">Net Banking</option>
            </select>

            {paymentMethod === "card" && (

              <div>

                <input placeholder="Card Number" />

                <input placeholder="Card Holder Name" />

                <div className="card-row">
                  <input placeholder="MM/YY" />
                  <input placeholder="CVV" />
                </div>

              </div>

            )}

            {paymentMethod === "upi" && (
              <input placeholder="Enter UPI ID" />
            )}

            <button
              className="pay-btn"
              onClick={confirmBooking}
            >
              Pay ₹{totalPrice}
            </button>

            <button
              className="cancel-btn"
              onClick={()=>setShowPayment(false)}
            >
              Cancel
            </button>

          </div>

        </div>

      )}

    </div>

  );

}

export default BookCar;
