import { useEffect, useState } from "react";
import "./ViewCars.css";

function ViewCars(){

const [cars,setCars] = useState([]);

const fetchCars = () => {
fetch("http://localhost:5000/cars")
.then(res=>res.json())
.then(data=>setCars(data));
};

useEffect(()=>{
fetchCars();
},[]);


/* DELETE FUNCTION */

const deleteCar = (id) => {

fetch(`http://localhost:5000/deletecar/${id}`,{
method:"DELETE"
})
.then(res=>res.json())
.then(data=>{
alert(data.message);
fetchCars(); // refresh list
});

};

return(

<div className="cars-container">

<h1 className="cars-title">Car Inventory</h1>

<div className="cars-grid">

{cars.map(car => (

<div className="car-card" key={car.id}>

<h3>{car.car_name}</h3>

<p>{car.brand}</p>

<p>₹{car.price_per_day}/day</p>

<div className="admin-actions">

<button className="edit-btn">Edit</button>

<button 
className="delete-btn"
onClick={()=>deleteCar(car.id)}
>
Delete
</button>

</div>

</div>

))}

</div>

</div>

);

}

export default ViewCars;
