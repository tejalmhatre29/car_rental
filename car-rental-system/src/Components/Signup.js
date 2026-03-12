import {useState} from "react";
import "./Signup.css";

function Signup(){

const [data,setData]=useState({
name:"",
email:"",
password:"",
role:"customer"
});

const handleChange=(e)=>{
setData({...data,[e.target.name]:e.target.value});
};

const handleSubmit=(e)=>{

e.preventDefault();

fetch("http://localhost:5000/signup",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(data)

})
.then(res=>res.json())
.then(res=>alert(res.message));

};

return(

<div>

<h2>Signup</h2>

<form onSubmit={handleSubmit}>

<input name="name" placeholder="Name" onChange={handleChange}/>

<input name="email" placeholder="Email" onChange={handleChange}/>

<input name="password" placeholder="Password" type="password" onChange={handleChange}/>

<select name="role" onChange={handleChange}>
<option value="customer">Customer</option>
<option value="admin">Admin</option>
</select>

<button type="submit">Signup</button>

</form>

</div>

);

}

export default Signup;
