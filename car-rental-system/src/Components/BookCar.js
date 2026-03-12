import {useState} from "react";

function BookCar(){

const [data,setData]=useState({
user_id:"",
car_id:"",
start_date:"",
end_date:""
});

const handleChange=(e)=>{
setData({...data,[e.target.name]:e.target.value});
};

const handleSubmit=(e)=>{

e.preventDefault();

fetch("http://localhost:5000/bookcar",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(data)

})
.then(res=>res.json())
.then(res=>alert(res.message));

};

return(

<div>

<h2>Book Car</h2>

<form onSubmit={handleSubmit}>

<input name="user_id" placeholder="User ID" onChange={handleChange}/>

<input name="car_id" placeholder="Car ID" onChange={handleChange}/>

<input type="date" name="start_date" onChange={handleChange}/>

<input type="date" name="end_date" onChange={handleChange}/>

<button>Book</button>

</form>

</div>

);

}

export default BookCar;
