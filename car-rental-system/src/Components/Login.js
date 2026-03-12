import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login(){

const [data,setData]=useState({
email:"",
password:""
});

const handleChange=(e)=>{
setData({...data,[e.target.name]:e.target.value});
};

const handleSubmit=(e)=>{

e.preventDefault();

fetch("http://localhost:5000/login",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(data)

})
.then(res=>res.json())
.then(res=>{

if(res.role==="admin"){
window.location="/admin";
}
else if(res.role==="customer"){
window.location="/customer";
}
else{
alert(res.message);
}

});

};

return(

<div className="login-container">

<h2>Car Rental Login</h2>

<form onSubmit={handleSubmit}>

<input
type="email"
name="email"
placeholder="Enter Email"
onChange={handleChange}
/>

<input
type="password"
name="password"
placeholder="Enter Password"
onChange={handleChange}
/>

<button type="submit">Login</button>

</form>

<p className="signup-text">
New User? <Link to="/signup">Signup</Link>
</p>

</div>

);

}

export default Login;
