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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!userId) {
      setError("Please log in first. Your user id was not found.");
      return;
    }
    if (!carId) {
      setError("Select a car.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Choose start and end dates.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError("End date must be on or after start date.");
      return;
    }
    setLoading(true);
    fetch(resolveApiPath("/bookcar"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        car_id: carId,
        start_date: startDate,
        end_date: endDate,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        if (res.message === "Car Booked") {
          alert("Booking confirmed!");
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

  return (
    <div className="book-page page-enter">
      <div className="book-bg" aria-hidden />
      <header className="book-header">
        <Link to="/customer" className="book-back">
          ← Dashboard
        </Link>
        <h1>Book a car</h1>
        <p className="book-lead">
          Choose a vehicle and rental period. Estimates update automatically.
        </p>
      </header>

      <form className="book-form" onSubmit={handleSubmit}>
        {!userId && (
          <p className="book-warning">
            You are not logged in.{" "}
            <Link to="/">Sign in</Link> so your booking is tied to your account.
          </p>
        )}

        <label className="book-field">
          <span>Vehicle</span>
          <select
            value={carId}
            onChange={(e) => setCarId(e.target.value)}
            disabled={!cars.length}
          >
            {cars.length === 0 && (
              <option value="">No cars available</option>
            )}
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
              {estimate.days} day{estimate.days !== 1 ? "s" : ""} × ₹
              {selected?.price_per_day} ={" "}
              <em>₹{estimate.total.toLocaleString("en-IN")}</em>
            </span>
          </div>
        )}

        {error && <p className="book-error">{error}</p>}

        <button type="submit" className="book-submit" disabled={loading}>
          {loading ? "Booking…" : "Confirm booking"}
        </button>
      </form>
    </div>
  );
}

export default BookCar;
