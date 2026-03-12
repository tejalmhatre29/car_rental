import { Link } from "react-router-dom";
import "./CustomerDashboard.css";

function CustomerDashboard(){

return(

<div className="customer-container">

<h1>Customer Dashboard</h1>

<div className="customer-menu">

<Link to="/cars">
<button>View Cars</button>
</Link>

<Link to="/book">
<button>Book Car</button>
</Link>

<Link to="/">
<button>Logout</button>
</Link>

</div>

</div>

);

}

export default CustomerDashboard;
