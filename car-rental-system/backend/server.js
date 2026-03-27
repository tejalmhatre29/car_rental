const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

/* ROUTES */

const dashboardRoutes = require("./routes/dashboard");

/* MIDDLEWARE */

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "1mb" }));

app.use("/api/dashboard", dashboardRoutes);

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "car-rental-api" });
});

/* DATABASE CONNECTION */

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME || "car_rental",
  port: Number(process.env.DB_PORT) || 3306,
});

db.connect((err)=>{
if(err){
console.log("Database connection failed:",err);
}else{
console.log("MySQL Connected");
}
});


/* SIGNUP API */

app.post("/signup",(req,res)=>{

const {name,email,password,role} = req.body;

if(!name || String(name).trim().length < 2){
return res.status(400).json({message:"Name must be at least 2 characters."});
}
if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())){
return res.status(400).json({message:"Valid email is required."});
}
const roleNorm = role === "admin" ? "admin" : "customer";

if(!password || typeof password !== "string" || password.length < 8){
return res.status(400).json({message:"Password must be at least 8 characters."});
}

const hasLetter = /[a-zA-Z]/.test(password);
const hasNumber = /\d/.test(password);
if(!hasLetter || !hasNumber){
return res.status(400).json({message:"Password must include at least one letter and one number."});
}

const sql = "INSERT INTO users(name,email,password,role) VALUES (?,?,?,?)";

db.query(sql,[String(name).trim(),String(email).trim().toLowerCase(),password,roleNorm],(err,result)=>{

if(err){
console.error("Signup DB error:", err.code, err.message);
if(err.code === "ER_DUP_ENTRY"){
return res.status(409).json({message:"User already exists"});
}
return res.status(500).json({message:"Signup failed. Check database setup."});
}

res.status(201).json({message:"Signup successful"});

});

});


/* LOGIN API */

app.post("/login",(req,res)=>{

const {email,password} = req.body;
const emailNorm = email != null ? String(email).trim().toLowerCase() : "";

const sql =
  "SELECT * FROM users WHERE LOWER(TRIM(email)) = ? AND password = ? LIMIT 1";

db.query(sql,[emailNorm,password],(err,result)=>{

if(err){
console.error("Login DB error:", err.message);
return res.status(500).json({message:"Server error. Check database connection."});
}

if(result && result.length>0){

res.json({
message:"Login successful",
role:result[0].role,
userId:result[0].id
});

}else{

res.status(401).json({message:"Invalid credentials"});

}

});

});


/* ADD CAR */

app.post("/addcar",(req,res)=>{

const {car_name,brand,price_per_day} = req.body;

const sql="INSERT INTO cars(car_name,brand,price_per_day) VALUES (?,?,?)";

db.query(sql,[car_name,brand,price_per_day],(err,result)=>{

if(err){
console.log(err);
return res.send({message:"Error adding car"});
}

res.send({message:"Car Added"});

});

});


/* VIEW CARS */

app.get("/cars",(req,res)=>{

db.query("SELECT * FROM cars",(err,result)=>{

if(err){
console.log(err);
return res.send({message:"Error fetching cars"});
}

res.send(result);

});

});

/* DELETE CAR */

app.delete("/deletecar/:id",(req,res)=>{

const id = req.params.id;

const sql = "DELETE FROM cars WHERE id=?";

db.query(sql,[id],(err,result)=>{

if(err){
console.log(err);
return res.send({message:"Error deleting car"});
}

res.send({message:"Car deleted"});

});

});


/* UPDATE CAR */

app.put("/updatecar/:id",(req,res)=>{

const id = req.params.id;

const {car_name,brand,price_per_day} = req.body;

const sql = "UPDATE cars SET car_name=?, brand=?, price_per_day=? WHERE id=?";

db.query(sql,[car_name,brand,price_per_day,id],(err,result)=>{

if(err){
console.log(err);
return res.send({message:"Error updating car"});
}

res.send({message:"Car updated"});

});

});

/* USER PROFILE */

app.get("/user/:id",(req,res)=>{

const id = req.params.id;

db.query("SELECT id, name, email, role FROM users WHERE id=?",[id],(err,result)=>{

if(err){
console.log(err);
return res.status(500).send({message:"Error fetching user"});
}

if(result.length===0){
return res.status(404).send({message:"User not found"});
}

res.send(result[0]);

});

});


app.put("/user/:id",(req,res)=>{

const id = req.params.id;
const { name } = req.body;

if(!name || String(name).trim().length<2){
return res.status(400).send({message:"Name must be at least 2 characters."});
}

db.query("UPDATE users SET name=? WHERE id=?",[String(name).trim(),id],(err,result)=>{

if(err){
console.log(err);
return res.send({message:"Update failed"});
}

if(result.affectedRows===0){
return res.send({message:"User not found"});
}

res.send({message:"Profile updated"});

});

});


/* ADMIN — ALL BOOKINGS */

app.get("/admin/bookings",(req,res)=>{

const sql = `
SELECT b.id, b.user_id, b.car_id, b.start_date, b.end_date, b.status,
u.name AS user_name, u.email AS user_email,
c.car_name, c.brand, c.price_per_day
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN cars c ON b.car_id = c.id
ORDER BY b.start_date DESC
`;

db.query(sql,(err,result)=>{

if(err){
console.log(err);
return res.send({message:"Error fetching bookings"});
}

res.send(result);

});

});


/* CANCEL BOOKING (customer — own booking) */

app.post("/cancelbooking",(req,res)=>{

const { booking_id, user_id } = req.body;

const sql = "UPDATE bookings SET status='Cancelled' WHERE id=? AND user_id=? AND status='Booked'";

db.query(sql,[booking_id,user_id],(err,result)=>{

if(err){
console.log(err);
return res.send({message:"Cancel failed"});
}

if(result.affectedRows===0){
return res.send({message:"Cannot cancel this reservation"});
}

res.send({message:"Booking cancelled"});

});

});


/* CANCEL BOOKING (admin — any id) */

app.post("/admin/cancelbooking/:id",(req,res)=>{

const id = req.params.id;

db.query("UPDATE bookings SET status='Cancelled' WHERE id=? AND status='Booked'",[id],(err,result)=>{

if(err){
console.log(err);
return res.send({message:"Cancel failed"});
}

if(result.affectedRows===0){
return res.send({message:"Nothing to cancel"});
}

res.send({message:"Booking cancelled"});

});

});


/* USER BOOKINGS */

app.get("/bookings/:userId",(req,res)=>{

const userId = req.params.userId;

const sql = `
SELECT b.id, b.user_id, b.car_id, b.start_date, b.end_date, b.status,
c.car_name, c.brand, c.price_per_day
FROM bookings b
JOIN cars c ON b.car_id = c.id
WHERE b.user_id = ?
ORDER BY b.start_date DESC
`;

db.query(sql,[userId],(err,result)=>{

if(err){
console.log(err);
return res.send({message:"Error fetching bookings"});
}

res.send(result);

});

});


/* BOOK CAR */

app.post("/bookcar",(req,res)=>{

const {user_id,car_id,start_date,end_date} = req.body;

if (!user_id || !car_id || !start_date || !end_date) {
  return res.status(400).json({ message: "Missing booking details." });
}

const start = String(start_date);
const end = String(end_date);

// Prevent double-booking for overlapping date ranges
const sqlCheck = `
SELECT id
FROM bookings
WHERE car_id = ?
  AND status = 'Booked'
  AND start_date <= ?
  AND end_date >= ?
LIMIT 1
`;

db.query(sqlCheck, [car_id, end, start], (err, rows) => {
  if (err) {
    console.error("Booking overlap check failed:", err.message);
    return res.status(500).json({ message: "Booking failed. Check database." });
  }

  if (rows && rows.length > 0) {
    return res
      .status(409)
      .json({ message: "Car is already booked for the selected dates." });
  }

  const sql =
    "INSERT INTO bookings(user_id,car_id,start_date,end_date,status) VALUES (?,?,?,?,?)";

  db.query(
    sql,
    [user_id, car_id, start, end, "Booked"],
    (err2) => {
      if (err2) {
        console.error("Booking insert failed:", err2.message);
        return res.status(500).json({ message: "Booking failed" });
      }
      return res.json({ message: "Car Booked" });
    }
  );
});

});


/* START SERVER */

app.listen(process.env.PORT,()=>{
console.log(`Server running on port ${process.env.PORT}`);
});
