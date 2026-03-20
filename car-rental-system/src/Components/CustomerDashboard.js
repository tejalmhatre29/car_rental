import { Link } from "react-router-dom";
import "./CustomerDashboard.css";

function CustomerDashboard() {

  return (

    <div className="customer-dashboard">

      {/* HEADER */}
      <header className="customer-header">
        <h2>Car Rental System</h2>

        <Link to="/">
          <button className="logout-btn">Logout</button>
        </Link>
      </header>


      {/* CONTENT */}
      <div className="customer-container">

        <h1 className="dashboard-title">Customer Dashboard</h1>

        <div className="dashboard-cards">

          <Link to="/cars" className="dashboard-card">
            <h2>🚗 View Cars</h2>
            <p>Browse all available cars to rent.</p>
          </Link>

          <Link to="/book" className="dashboard-card">
            <h2>📅 Book Car</h2>
            <p>Select a car and reserve it instantly.</p>
          </Link>

        </div>

      </div>

    </div>

  );

}

export default CustomerDashboard;
