-- Car rental app — run once to create database and tables.
-- Example (adjust user/password):
--   mysql -u root -p < backend/schema.sql

CREATE DATABASE IF NOT EXISTS car_rental
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE car_rental;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'customer'
);

CREATE TABLE IF NOT EXISTS cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_name VARCHAR(255) NOT NULL,
  brand VARCHAR(255) NOT NULL,
  price_per_day DECIMAL(10, 2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  car_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'Booked',
  CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_bookings_car FOREIGN KEY (car_id) REFERENCES cars (id)
    ON DELETE CASCADE
);
