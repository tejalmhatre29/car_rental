const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME || "car_rental",
  port: Number(process.env.DB_PORT) || 3306,
});


// Dashboard statistics

router.get("/stats",(req,res)=>{

const stats = {};

db.query("SELECT COUNT(*) AS totalCars FROM cars",(err,result)=>{
if(err) return res.json(err);

stats.totalCars = result[0].totalCars;

db.query("SELECT COUNT(*) AS totalUsers FROM users",(err,result)=>{
if(err) return res.json(err);

stats.totalUsers = result[0].totalUsers;

db.query("SELECT COUNT(*) AS totalBookings FROM bookings",(err,result)=>{
if(err) return res.json(err);

stats.totalBookings = result[0].totalBookings;

db.query("SELECT COUNT(*) AS availableCars FROM cars",(err,result)=>{
if(err) return res.json(err);

stats.availableCars = result[0].availableCars;

res.json(stats);

});

});

});

});

});

module.exports = router;
