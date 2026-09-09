-- Run this once to set up the database:
--   mysql -u root -p < sql/schema.sql

CREATE DATABASE IF NOT EXISTS reminder_app;
USE reminder_app;

CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  appointment_time DATETIME NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  reminder_offset_minutes INT NOT NULL DEFAULT 1440,
  status ENUM('pending', 'reminded', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);