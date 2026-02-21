CREATE DATABASE IF NOT EXISTS outfitgo_db;
USE outfitgo_db;

-- USER TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    gender VARCHAR(20),
    age INT,
    style_preference VARCHAR(50), -- e.g., 'Casual', 'Formal', 'Streetwear'
    location VARCHAR(100)
);

-- CLOTHING TABLE
CREATE TABLE IF NOT EXISTS clothing (
    cloth_id INT AUTO_INCREMENT PRIMARY KEY,
    cloth_type VARCHAR(50), -- e.g., 'T-Shirt', 'Jeans', 'Jacket'
    color VARCHAR(30),
    style VARCHAR(50), -- Matches style_preference
    season VARCHAR(20), -- 'Summer', 'Winter', 'Rainy', 'All'
    image_url VARCHAR(255),
    price DECIMAL(10, 2)
);

-- USER INTERACTION TABLE (For Collaborative Filtering)
CREATE TABLE IF NOT EXISTS user_interactions (
    interaction_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    cloth_id INT,
    feedback TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (cloth_id) REFERENCES clothing(cloth_id) ON DELETE CASCADE
);

-- WEATHER TABLE (For History/Context)
CREATE TABLE IF NOT EXISTS weather_logs (
    weather_id INT AUTO_INCREMENT PRIMARY KEY,
    temperature FLOAT,
    humidity INT,
    condition_text VARCHAR(50),
    city VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
