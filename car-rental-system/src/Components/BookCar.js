import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resolveApiPath } from "../api";
import "./BookCar.css";

function BookCar() {
  const [searchParams] = useSearchParams();
  const preselectCar = searchParams.get("car");

  const [cars, setCars] = useState([]);
  const [carId, setCarId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ NEW STATES
  const [bookingData, setBookingData] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    fetch(resolveApiPath("/cars"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setCars(data);
          const match = preselectCar
            ? data.find((c) => String(c.id) === String(preselectCar))
            : null;
          setCarId(String(match ? match.id : data[0].id));
        }
      })
      .catch(() => setError("Could not load cars."));
  }, [preselectCar]);

  const selected = useMemo(
    () => cars.find((c) => String(c.id) === String(carId)),
    [cars, carId]
  );

  const estimate = useMemo(() => {
    if (!selected || !startDate || !endDate) return null;
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (e < s) return null;
    const days = Math.ceil((e - s) / 86400000) + 1;
    if (days < 1) return null;
    return { days, total: days * Number(selected.price_per_day) };
  }, [selected, startDate, endDate]);

  // ✅ STEP 1: Move to payment instead of booking directly
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!userId) {
      setError("Please log in first.");
      return;
    }

    if (!carId || !startDate || !endDate) {
      setError("Fill all details.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError("End date must be valid.");
      return;
    }

    setBookingData({
      user_id: userId,
      car_id: carId,
      start_date: startDate,
      end_date: endDate,
    });

    setShowPayment(true);
  };

  // ✅ STEP 2: Final booking after payment
  const handlePayment = () => {
    setLoading(true);

    fetch(resolveApiPath("/bookcar"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);

        if (res.message === "Car Booked") {
          generateReceipt();
          setShowPayment(false);
          setStartDate("");
          setEndDate("");
        } else {
          alert(res.message || "Booking failed");
        }
      })
      .catch(() => {
        setLoading(false);
        alert("Cannot reach server.");
      });
  };

  // ✅ STEP 3: Receipt generator
  const generateReceipt = () => {
  const receiptWindow = window.open("", "_blank");
  const car = selected;

  receiptWindow.document.write(`
    <html>
      <head>
        <title>Receipt</title>
        <style>
          body {
            margin: 0;
            font-family: 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #0f172a, #020617);
            color: #e2e8f0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }

          .receipt {
            width: 380px;
            padding: 24px;
            border-radius: 14px;
            background: linear-gradient(155deg, #0f172a, #1e293b);
            border: 1px solid rgba(34, 211, 238, 0.2);
            box-shadow: 0 20px 50px rgba(0,0,0,0.6);
            animation: fadeIn 0.4s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .header {
            text-align: center;
            margin-bottom: 16px;
          }

          .header h2 {
            margin: 0;
            font-size: 1.4rem;
            color: #22d3ee;
          }

          .sub {
            font-size: 0.8rem;
            color: #94a3b8;
          }

          .line {
            height: 1px;
            background: rgba(148, 163, 184, 0.2);
            margin: 14px 0;
          }

          .row {
            display: flex;
            justify-content: space-between;
            font-size: 0.9rem;
            margin-bottom: 8px;
          }

          .row span:first-child {
            color: #94a3b8;
          }

          .highlight {
            font-weight: 700;
            color: #22d3ee;
          }

          .total {
            font-size: 1.1rem;
            font-weight: 800;
            color: #34d399;
          }

          .footer {
            text-align: center;
            margin-top: 16px;
            font-size: 0.8rem;
            color: #64748b;
          }

          .badge {
            text-align: center;
            margin-top: 10px;
            padding: 6px;
            border-radius: 8px;
            background: rgba(34, 211, 238, 0.1);
            color: #22d3ee;
            font-weight: 600;
            font-size: 0.8rem;
          }

          button {
            margin-top: 16px;
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 8px;
            background: linear-gradient(135deg, #0d9488, #0f766e);
            color: white;
            font-weight: 600;
            cursor: pointer;
          }

          button:hover {
            opacity: 0.9;
          }
        </style>
      </head>

      <body>
        <div class="receipt">
          <div class="header">
            <h2>🚗 Car Rental</h2>
            <div class="sub">Booking Receipt</div>
          </div>

          <div class="line"></div>

          <div class="row">
            <span>User ID</span>
            <span>${userId}</span>
          </div>

          <div class="row">
            <span>Car</span>
            <span>${car.car_name}</span>
          </div>

          <div class="row">
            <span>Brand</span>
            <span>${car.brand}</span>
          </div>

          <div class="row">
            <span>Start</span>
            <span>${startDate}</span>
          </div>

          <div class="row">
            <span>End</span>
            <span>${endDate}</span>
          </div>

          <div class="row">
            <span>Days</span>
            <span>${estimate.days}</span>
          </div>

          <div class="line"></div>

          <div class="row highlight">
            <span>Price / Day</span>
            <span>₹${car.price_per_day}</span>
          </div>

          <div class="row total">
            <span>Total Paid</span>
            <span>₹${estimate.total}</span>
          </div>

          <div class="badge">
            Paid via ${paymentMethod.toUpperCase()}
          </div>

          <button onclick="window.print()">Download / Print</button>

          <div class="footer">
            Thank you for choosing our service!
          </div>
        </div>
      </body>
    </html>
  `);

  receiptWindow.document.close();
};


  return (
    <div className="book-page page-enter">
      <div className="book-bg" aria-hidden />

      <header className="book-header">
        <Link to="/customer" className="book-back">
          ← Dashboard
        </Link>
        <h1>Book a car</h1>
        <p className="book-lead">
          Choose a vehicle and rental period.
        </p>
      </header>

      <form className="book-form" onSubmit={handleSubmit}>
        {!userId && (
          <p className="book-warning">
            You are not logged in. <Link to="/">Sign in</Link>
          </p>
        )}

        <label className="book-field">
          <span>Vehicle</span>
          <select
            value={carId}
            onChange={(e) => setCarId(e.target.value)}
          >
            {cars.map((c) => (
              <option key={c.id} value={c.id}>
                {c.car_name} — {c.brand} (₹{c.price_per_day}/day)
              </option>
            ))}
          </select>
        </label>

        <div className="book-row">
          <label className="book-field">
            <span>Start date</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>

          <label className="book-field">
            <span>End date</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>

        {estimate && (
          <div className="book-estimate">
            <strong>Estimated total</strong>
            <span>
              {estimate.days} day(s) × ₹{selected?.price_per_day} =
              ₹{estimate.total}
            </span>
          </div>
        )}

        {error && <p className="book-error">{error}</p>}

        <button type="submit" className="book-submit">
          Confirm Booking
        </button>
      </form>

      {/* ✅ PAYMENT UI */}
      {showPayment && (
        <div className="payment-box">
          <h2>Payment</h2>

          <label>
            <input
              type="radio"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Card
          </label>

          <label>
            <input
              type="radio"
              value="upi"
              checked={paymentMethod === "upi"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            UPI
          </label>

          <label>
            <input
              type="radio"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash
          </label>

          <br /><br />

          <button onClick={handlePayment} disabled={loading}>
            {loading ? "Processing..." : "Pay & Confirm"}
          </button>
        </div>
      )}
    </div>
  );
}

export default BookCar;
