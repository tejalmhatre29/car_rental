import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function PaymentPage(){

const location = useLocation();
const navigate = useNavigate();

const { selectedCar, dates, totalPrice, userId } = location.state;

const [paymentMethod,setPaymentMethod] = useState("card");

const confirmPayment = () => {

fetch("http://localhost:5000/bookcar",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
user_id:userId,
car_id:selectedCar.id,
start_date:dates.start_date,
end_date:dates.end_date
})
})
.then(res=>res.json())
.then(res=>{
alert("Payment Successful!\n"+res.message);
navigate("/customer");
});

};

return(

<div style={{
maxWidth:"500px",
margin:"50px auto",
background:"#fff",
padding:"30px",
borderRadius:"10px",
boxShadow:"0 5px 15px rgba(0,0,0,0.2)"
}}>

<h2 style={{textAlign:"center"}}>Payment</h2>

<h3>Billing Details</h3>

<p><b>Car:</b> {selectedCar.car_name}</p>
<p><b>Brand:</b> {selectedCar.brand}</p>
<p><b>Price/day:</b> ₹{selectedCar.price_per_day}</p>
<p><b>Total Amount:</b> ₹{totalPrice}</p>

<hr/>

<h3>Select Payment Method</h3>

<select
value={paymentMethod}
onChange={(e)=>setPaymentMethod(e.target.value)}
style={{width:"100%",padding:"10px"}}
>

<option value="card">Credit / Debit Card</option>
<option value="upi">UPI</option>
<option value="netbanking">Net Banking</option>

</select>


{paymentMethod === "card" && (

<div style={{marginTop:"15px"}}>

<input placeholder="Card Number" style={{width:"100%",padding:"10px",marginBottom:"10px"}}/>

<input placeholder="Card Holder Name" style={{width:"100%",padding:"10px",marginBottom:"10px"}}/>

<div style={{display:"flex",gap:"10px"}}>

<input placeholder="MM/YY" style={{flex:1,padding:"10px"}}/>

<input placeholder="CVV" style={{flex:1,padding:"10px"}}/>

</div>

</div>

)}

{paymentMethod === "upi" && (

<div style={{marginTop:"15px"}}>

<input placeholder="Enter UPI ID" style={{width:"100%",padding:"10px"}}/>

</div>

)}

<button
onClick={confirmPayment}
style={{
marginTop:"20px",
width:"100%",
padding:"12px",
background:"linear-gradient(135deg,#2563eb,#1e3a8a)",
color:"#fff",
border:"none",
borderRadius:"8px",
fontWeight:"bold",
cursor:"pointer"
}}
>

Pay ₹{totalPrice}

</button>

</div>

);

}

export default PaymentPage;
