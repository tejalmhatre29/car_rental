require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

/* ROUTES */

const dashboardRoutes = require("./routes/dashboard");

/* MIDDLEWARE */

app.use(cors());
app.use(bodyParser.json());

app.use("/api/dashboard", dashboardRoutes);


/* DATABASE CONNECTION */

const db = mysql.createConnection({
host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME,
port: process.env.DB_PORT
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

const sql = "INSERT INTO users(name,email,password,role) VALUES (?,?,?,?)";

db.query(sql,[name,email,password,role],(err,result)=>{

if(err){
return res.send({message:"User already exists"});
}

res.send({message:"Signup successful"});

});

});


/* LOGIN API */

app.post("/login",(req,res)=>{

const {email,password} = req.body;

const sql="SELECT * FROM users WHERE email=? AND password=?";

db.query(sql,[email,password],(err,result)=>{

if(result.length>0){

res.send({
message:"Login successful",
role:result[0].role,
userId:result[0].id
});

}else{

res.send({message:"Invalid credentials"});

}

});

});


/* ADD CAR */

app.post("/addcar",(req,res)=>{

const {car_name,brand,owner_name,price_per_day} = req.body;

const sql="INSERT INTO cars(car_name,brand,owner_name,price_per_day) VALUES (?,?,?,?)";

db.query(sql,[car_name,brand,owner_name,price_per_day],(err,result)=>{

if(err) throw err;

res.send({message:"Car Added Successfully"});

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


/* BOOK CAR */

app.post("/bookcar", (req, res) => {

  const {
    user_id,
    car_id,
    start_date,
    end_date,
    pickup_location,
    drop_location
  } = req.body;

  // Check if car is available
  db.query("SELECT available FROM cars WHERE id=?", [car_id], (err, result) => {

    if (err) {
      console.log(err);
      return res.json({ message: "Database error" });
    }

    if (result[0].available === 0) {
      return res.json({ message: "Car not available" });
    }

    const sql = `
      INSERT INTO bookings
      (user_id, car_id, start_date, end_date, pickup_location, drop_location, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [user_id, car_id, start_date, end_date, pickup_location, drop_location, "Booked"],
      (err, result) => {

        if (err) {
          console.log(err);
          return res.json({ message: "Booking failed" });
        }

        // Make car unavailable
        db.query("UPDATE cars SET available = 0 WHERE id=?", [car_id]);

        res.json({ message: "Car booked successfully!" });

      }
    );

  });

});


/* VIEW BOOKINGS */
app.get("/admin/bookings",(req,res)=>{
  const sql = `SELECT b.id, u.name AS user_name, c.car_name, c.brand, c.price_per_day, b.start_date, b.end_date, b.status
               FROM bookings b
               JOIN users u ON b.user_id=u.id
               JOIN cars c ON b.car_id=c.id`;
  db.query(sql,(err,result)=>{
    if(err) return res.send(err);
    res.json(result);
  });
});









app.get("/user/bookings/:user_id",(req,res)=>{
  const user_id = req.params.user_id;
  const sql = `SELECT b.id, c.car_name, c.brand, c.price_per_day, b.start_date, b.end_date, b.status
               FROM bookings b
               JOIN cars c ON b.car_id=c.id
               WHERE b.user_id=?`;
  db.query(sql,[user_id],(err,result)=>{
    if(err) return res.send(err);
    res.json(result);
  });
});

/* START SERVER */

app.listen(process.env.PORT,()=>{
console.log(`Server running on port ${process.env.PORT}`);
});
