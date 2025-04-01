CREATE DATABASE IF NOT EXISTS management_db;
USE management_db;

CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('file', 'folder') NOT NULL,
  createdBy VARCHAR(100),
  date VARCHAR(50),
  size VARCHAR(20)
);
