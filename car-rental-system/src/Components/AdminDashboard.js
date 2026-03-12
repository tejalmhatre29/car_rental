import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard(){

const [stats,setStats] = useState({
totalCars:0,
totalUsers:0,
totalBookings:0,
availableCars:0
});

useEffect(()=>{

const fetchStats = () => {
fetch("http://localhost:5000/api/dashboard/stats")
.then(res=>res.json())
.then(data=>setStats(data));
}

fetchStats();

const interval = setInterval(fetchStats,5000);

return () => clearInterval(interval);

},[]);


return(

<div className="admin-dashboard">

<header className="admin-header">

<h2>Car Rental Admin Panel</h2>

<Link to="/">
<button className="logout-btn">Logout</button>
</Link>

</header>


<div className="admin-content">

<h1>Dashboard Overview</h1>


{/* Real Time Stats */}

<div className="stats-container">

<div className="stat-box">
<h3>Total Cars</h3>
<p>{stats.totalCars}</p>
</div>

<div className="stat-box">
<h3>Total Users</h3>
<p>{stats.totalUsers}</p>
</div>

<div className="stat-box">
<h3>Total Bookings</h3>
<p>{stats.totalBookings}</p>
</div>

<div className="stat-box">
<h3>Available Cars</h3>
<p>{stats.availableCars}</p>
</div>

</div>


{/* Quick Actions */}

<h2 className="section-title">Quick Actions</h2>

<div className="admin-cards">

<Link to="/addcar" className="card">
<h3>Add Car</h3>
<p>Add new cars to the system</p>
</Link>

<Link to="/cars" className="card">
<h3>View Cars</h3>
<p>See all available cars</p>
</Link>

<Link to="/cars" className="card">
<h3>Manage Cars</h3>
<p>Edit or delete cars</p>
</Link>

</div>


{/* Recent Activity */}

<div className="recent-section">

<h2>Recent Activity</h2>

<ul className="activity-list">

<li>New user registered</li>
<li>Car added to inventory</li>
<li>Booking confirmed</li>
<li>Car details updated</li>

</ul>

</div>


</div>

</div>

);

}

export default AdminDashboard;
