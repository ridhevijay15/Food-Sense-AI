-- =========================================================
-- FoodSense MySQL Database Script (foodsense_db)
-- Run this script inside MySQL Workbench, phpMyAdmin, or VS Code MySQL extension
-- =========================================================

CREATE DATABASE IF NOT EXISTS foodsense_db;
USE foodsense_db;

-- 1. Users / Mess Managers Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    mess_name VARCHAR(150) NOT NULL,
    mess_type ENUM('Hostel Mess', 'College Canteen', 'Restaurant Kitchen', 'Corporate Mess') DEFAULT 'Hostel Mess',
    capacity INT DEFAULT 300,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 1-Month Training Meal Sessions Table
CREATE TABLE IF NOT EXISTS meal_training_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_date DATE NOT NULL,
    meal_type ENUM('Breakfast', 'Lunch', 'Dinner') NOT NULL,
    headcount INT NOT NULL,
    logged_by VARCHAR(100) DEFAULT 'Mess Manager',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Dish-level Quantities (Cooked vs Leftover) Table
CREATE TABLE IF NOT EXISTS dish_training_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    dish_name VARCHAR(100) NOT NULL,
    quantity_cooked DECIMAL(8,2) NOT NULL,
    quantity_remaining DECIMAL(8,2) NOT NULL,
    unit ENUM('pieces', 'kg', 'litres') NOT NULL DEFAULT 'kg',
    FOREIGN KEY (session_id) REFERENCES meal_training_sessions(id) ON DELETE CASCADE
);

-- 4. NGO Partners Table (Pre-loaded with 2 Demo NGOs)
CREATE TABLE IF NOT EXISTS ngo_partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ngo_name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(255),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    daily_capacity_servings INT DEFAULT 150,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Surplus Food Listings Table
CREATE TABLE IF NOT EXISTS surplus_listings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    dish_name VARCHAR(150) NOT NULL,
    quantity DECIMAL(8,2) NOT NULL,
    unit ENUM('pieces', 'kg', 'litres') NOT NULL,
    servings INT NOT NULL,
    dietary_type ENUM('Veg', 'Non-Veg', 'Jain') DEFAULT 'Veg',
    prepared_at DATETIME NOT NULL,
    best_before_hours INT DEFAULT 4,
    status ENUM('AVAILABLE', 'CLAIMED', 'EN_ROUTE', 'COMPLETED') DEFAULT 'AVAILABLE',
    claimed_by_ngo_id INT DEFAULT NULL,
    pickup_contact VARCHAR(20),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (claimed_by_ngo_id) REFERENCES ngo_partners(id)
);

-- Seed Initial Users
INSERT INTO users (id, name, email, password_hash, mess_name, mess_type, capacity, location)
VALUES 
(1, 'Rajesh Kumar', 'rajesh@sunrisehostel.edu', 'password123', 'Sunrise Hostel Mess', 'Hostel Mess', 350, 'Block-B, Campus Tech Hub'),
(2, 'Priya Sharma', 'priya@canteen.edu', 'password123', 'Central College Canteen', 'College Canteen', 500, 'Main Gate Campus, Sector 2')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed 2 NGO Partners
INSERT INTO ngo_partners (id, ngo_name, contact_person, phone, address, latitude, longitude, daily_capacity_servings)
VALUES 
(1, 'Asha Food Rescue Foundation', 'Sunita Sharma', '+91 98123 45678', 'Community Center 4, Sector 3', 12.9780, 77.5910, 150),
(2, 'Annapurna Seva Trust', 'Sister Mary', '+91 99001 12233', 'Shelter Home, Railway Station Road', 12.9600, 77.5890, 200)
ON DUPLICATE KEY UPDATE ngo_name=VALUES(ngo_name);
