import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resolveApiPath } from "../api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCars: 0,
    totalUsers: 0,
    totalBookings: 0,
    availableCars: 0,
  });

  useEffect(() => {
    const fetchStats = () => {
      fetch(resolveApiPath("/api/dashboard/stats"))
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.totalCars === "number") setStats(data);
        })
        .catch(() => {});
    };
    fetchStats();
    const interval = setInterval(fetchStats, 8000);
    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <div className="admin-dashboard page-enter">
      <header className="admin-header">
        <div className="admin-header-brand">
          <span className="admin-header-icon">◆</span>
          <h2>Admin · Fleet control</h2>
        </div>
        <button type="button" className="logout-btn" onClick={logout}>
          Log out
        </button>
      </header>

      <div className="admin-content">
        <h1>Dashboard overview</h1>
        <p className="admin-lead">
          Live counts refresh every few seconds while this page is open.
        </p>

        <div className="stats-container">
          <div className="stat-box">
            <h3>Total cars</h3>
            <p>{stats.totalCars}</p>
          </div>
          <div className="stat-box">
            <h3>Total users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="stat-box">
            <h3>Total bookings</h3>
            <p>{stats.totalBookings}</p>
          </div>
          <div className="stat-box">
            <h3>Cars in fleet</h3>
            <p>{stats.availableCars}</p>
          </div>
        </div>

        <h2 className="section-title">Quick actions</h2>
        <div className="admin-cards">
          <Link to="/addcar" className="card">
            <span className="card-icon">➕</span>
            <h3>Add car</h3>
            <p>Add new vehicles to inventory</p>
          </Link>
          <Link to="/cars" className="card">
            <span className="card-icon">🚗</span>
            <h3>View &amp; edit cars</h3>
            <p>Browse fleet, update pricing, remove units</p>
          </Link>
          <Link to="/admin/bookings" className="card">
            <span className="card-icon">📑</span>
            <h3>All reservations</h3>
            <p>See every booking, cancel if needed</p>
          </Link>
        </div>

        <div className="recent-section">
          <h2>Operations tips</h2>
          <ul className="activity-list">
            <li>Keep daily rates competitive and update after service.</li>
            <li>Remove sold or retired vehicles to avoid double bookings.</li>
            <li>Encourage customers to book from the customer dashboard.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
