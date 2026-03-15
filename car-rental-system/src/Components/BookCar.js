import { useState, useEffect } from "react";

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

          <button
            type="submit"
            style={{
              padding: "12px",
              background: "linear-gradient(135deg,#2563eb,#1e3a8a)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Book & Pay
          </button>

        </form>

      )}


      {/* PAYMENT INTERFACE */}

      {showPayment && (

        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>

          <div style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "10px",
            width: "350px"
          }}>

            <h3 style={{ textAlign: "center" }}>Payment</h3>

            <p><b>Car:</b> {selectedCar.car_name}</p>
            <p><b>Total Amount:</b> ₹{totalPrice}</p>

            <label>Select Payment Method</label>

            <select
              value={paymentMethod}
              onChange={(e)=>setPaymentMethod(e.target.value)}
              style={{ width:"100%", padding:"10px", marginBottom:"10px" }}
            >
              <option value="card">Credit / Debit Card</option>
              <option value="upi">UPI</option>
              <option value="netbanking">Net Banking</option>
            </select>


            {/* CARD PAYMENT */}

            {paymentMethod === "card" && (

              <div>

                <input placeholder="Card Number"
                style={{width:"100%",padding:"10px",marginBottom:"10px"}}/>

                <input placeholder="Card Holder Name"
                style={{width:"100%",padding:"10px",marginBottom:"10px"}}/>

                <div style={{display:"flex",gap:"10px"}}>

                  <input placeholder="MM/YY"
                  style={{flex:1,padding:"10px"}}/>

                  <input placeholder="CVV"
                  style={{flex:1,padding:"10px"}}/>

                </div>

              </div>

            )}


            {/* UPI */}

            {paymentMethod === "upi" && (

              <input
              placeholder="Enter UPI ID"
              style={{width:"100%",padding:"10px",marginTop:"10px"}}
              />

            )}


            <button
              onClick={confirmBooking}
              style={{
                marginTop:"15px",
                width:"100%",
                padding:"12px",
                background:"linear-gradient(135deg,#2563eb,#1e3a8a)",
                color:"white",
                border:"none",
                borderRadius:"8px",
                fontWeight:"bold",
                cursor:"pointer"
              }}
            >
              Pay ₹{totalPrice}
            </button>

            <button
              onClick={()=>setShowPayment(false)}
              style={{
                marginTop:"10px",
                width:"100%",
                padding:"10px",
                background:"#6b7280",
                color:"white",
                border:"none",
                borderRadius:"6px",
                cursor:"pointer"
              }}
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
