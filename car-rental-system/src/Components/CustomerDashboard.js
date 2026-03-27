import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resolveApiPath } from "../api";
import "./CustomerDashboard.css";

function CustomerDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  const loadBookings = useCallback(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetch(resolveApiPath("/bookings/" + userId))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBookings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const cancelBooking = (bookingId) => {
    if (!userId) return;
    if (!window.confirm("Cancel this reservation?")) return;
    fetch(resolveApiPath("/cancelbooking"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking_id: bookingId, user_id: userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        loadBookings();
      })
      .catch(() => alert("Request failed."));
  };

  return (
    <div className="customer-page page-enter">
      <div className="customer-bg" aria-hidden />
      <header className="customer-header">
        <div className="customer-brand">
          <span className="customer-brand-icon">◆</span>
          <div>
            <h1>Customer hub</h1>
            <p>Browse, book, profile, and trips — all in one place</p>
          </div>
        </div>
        <button type="button" className="customer-logout" onClick={logout}>
          Log out
        </button>
      </header>

      <main className="customer-main">
        <section className="customer-actions">
          <h2 className="customer-section-title">Quick actions</h2>
          <div className="customer-cards">
            <Link to="/browse" className="customer-card customer-card--pulse">
              <span className="customer-card-icon">🔍</span>
              <div>
                <h3>Browse &amp; filter</h3>
                <p>Search fleet, sort by price, book instantly</p>
              </div>
            </Link>
            <Link to="/book" className="customer-card">
              <span className="customer-card-icon">📅</span>
              <div>
                <h3>New booking</h3>
                <p>Dates, vehicle, and estimate</p>
              </div>
            </Link>
            <Link to="/profile" className="customer-card">
              <span className="customer-card-icon">👤</span>
              <div>
                <h3>Profile</h3>
                <p>Update your display name</p>
              </div>
            </Link>
            <Link to="/cars" className="customer-card">
              <span className="customer-card-icon">📋</span>
              <div>
                <h3>Full catalog</h3>
                <p>Same list as admin view (read-only actions)</p>
              </div>
            </Link>
          </div>
        </section>

        <section className="customer-bookings">
          <h2 className="customer-section-title">Your bookings</h2>
          {!userId && (
            <p className="customer-hint">
              Sign in again to see your bookings. Your session may have expired.
            </p>
          )}
          {loading && userId && (
            <p className="customer-muted">Loading bookings…</p>
          )}
          {!loading && userId && bookings.length === 0 && (
            <p className="customer-muted">
              No bookings yet. Open Browse &amp; filter to get started.
            </p>
          )}
          {bookings.length > 0 && (
            <ul className="booking-list">
              {bookings.map((b) => (
                <li key={b.id} className="booking-item">
                  <div>
                    <strong>{b.car_name}</strong>
                    <span className="booking-meta">
                      {b.brand} · ₹{b.price_per_day}/day
                    </span>
                  </div>
                  <div className="booking-dates">
                    {String(b.start_date).slice(0, 10)} →{" "}
                    {String(b.end_date).slice(0, 10)}
                  </div>
                  <span className={`booking-status booking-status--${b.status}`}>
                    {b.status}
                  </span>
                  {b.status === "Booked" && (
                    <button
                      type="button"
                      className="booking-cancel-btn"
                      onClick={() => cancelBooking(b.id)}
                    >
                      Cancel
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default CustomerDashboard;
