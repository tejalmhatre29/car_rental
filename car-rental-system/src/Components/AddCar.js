import {useState} from "react";

function AddCar(){

const [car,setCar]=useState({
car_name:"",
brand:"",
price_per_day:""
});

const handleChange=(e)=>{
setCar({...car,[e.target.name]:e.target.value});
};

const handleSubmit=(e)=>{

e.preventDefault();

fetch("http://localhost:5000/addcar",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(car)

})
.then(res=>res.json())
.then(res=>alert(res.message));

};

return(

<div>

<h2>Add Car</h2>

<form onSubmit={handleSubmit}>

<input name="car_name" placeholder="Car Name" onChange={handleChange}/>

<input name="brand" placeholder="Brand" onChange={handleChange}/>

<input name="price_per_day" placeholder="Price per day" onChange={handleChange}/>

<button>Add</button>

</form>

</div>

);

}

export default AddCar;
