import {BrowserRouter,Routes,Route} from "react-router-dom";

import Login from "./Components/Login";
import Signup from "./Components/Signup";
import AdminDashboard from "./Components/AdminDashboard";
import CustomerDashboard from "./Components/CustomerDashboard";
import AddCar from "./Components/AddCar";
import ViewCars from "./Components/ViewCars";
import BookCar from "./Components/BookCar";
import PaymentPage from "./Components/PaymentPage";


function App(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Login/>}/>
<Route path="/signup" element={<Signup/>}/>
<Route path="/admin" element={<AdminDashboard/>}/>
<Route path="/customer" element={<CustomerDashboard/>}/>
<Route path="/addcar" element={<AddCar/>}/>
<Route path="/cars" element={<ViewCars/>}/>
<Route path="/book" element={<BookCar/>}/>
<Route path="/payment" element={<PaymentPage />} />

</Routes>

</BrowserRouter>

);

}

export default App;
