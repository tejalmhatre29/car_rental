import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Login from "./Components/Login";
import Signup from "./Components/Signup";
import AdminDashboard from "./Components/AdminDashboard";
import CustomerDashboard from "./Components/CustomerDashboard";
import AddCar from "./Components/AddCar";
import ViewCars from "./Components/ViewCars";
import BookCar from "./Components/BookCar";
import BrowseCars from "./Components/BrowseCars";
import Profile from "./Components/Profile";
import AdminBookings from "./Components/AdminBookings";

function RequireRole({ allowedRoles, children }) {
  const userRole = localStorage.getItem("userRole");
  if (!userRole) return <Navigate to="/" replace />;

  if (!allowedRoles.includes(userRole)) {
    const fallback = userRole === "admin" ? "/admin" : "/customer";
    return <Navigate to={fallback} replace />;
  }

  return children;
}

function App(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Login/>}/>
<Route path="/signup" element={<Signup/>}/>
<Route
  path="/admin"
  element={
    <RequireRole allowedRoles={["admin"]}>
      <AdminDashboard />
    </RequireRole>
  }
/>
<Route
  path="/admin/bookings"
  element={
    <RequireRole allowedRoles={["admin"]}>
      <AdminBookings />
    </RequireRole>
  }
/>
<Route
  path="/customer"
  element={
    <RequireRole allowedRoles={["customer"]}>
      <CustomerDashboard />
    </RequireRole>
  }
/>
<Route
  path="/profile"
  element={
    <RequireRole allowedRoles={["admin", "customer"]}>
      <Profile />
    </RequireRole>
  }
/>
<Route path="/browse" element={<BrowseCars/>}/>
<Route
  path="/addcar"
  element={
    <RequireRole allowedRoles={["admin"]}>
      <AddCar />
    </RequireRole>
  }
/>
<Route
  path="/cars"
  element={
    <RequireRole allowedRoles={["admin"]}>
      <ViewCars />
    </RequireRole>
  }
/>
<Route
  path="/book"
  element={
    <RequireRole allowedRoles={["admin", "customer"]}>
      <BookCar />
    </RequireRole>
  }
/>

</Routes>

</BrowserRouter>

);

}

export default App;
