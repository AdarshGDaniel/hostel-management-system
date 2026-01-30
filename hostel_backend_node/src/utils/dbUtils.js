import { pool } from "../config/db.js";

import cron from "node-cron";
import { cleanupExpiredGuests } from "./guestCleanup.js";
import { startLeaveResetJob } from "./leaveResetJob.js";

cron.schedule("0 0 * * *", cleanupExpiredGuests); // midnight daily
startLeaveResetJob();



//  USERS

const userTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  mobile VARCHAR(15),
  password VARCHAR(255) NOT NULL,
  userType ENUM('student','staff','admin') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;


//  POSTS

const postTableQuery = `
CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`;


//  LIVE UPDATES

const updatesTableQuery = `
CREATE TABLE IF NOT EXISTS updates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  caption TEXT NOT NULL,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;


//  ROOMS

const roomsTableQuery = `
CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  block_name VARCHAR(50) NOT NULL,
  floor INT NOT NULL,
  room_number VARCHAR(10) NOT NULL,
  capacity INT DEFAULT 1,
  occupied_count INT DEFAULT 0,
  onleave_count INT DEFAULT 0,
  guest_count INT DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(block_name, floor, room_number)
);
`;


//  ROOM ASSIGNMENTS
//  (ONE ACTIVE ROOM PER STUDENT)

const roomAssignmentsTableQuery = `
CREATE TABLE IF NOT EXISTS room_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  user_id INT NULL,
  status ENUM('occupied', 'is_active', 'on_leave','guest') NOT NULL,
  guest_count INT DEFAULT 0,
  guest_names JSON,
  is_active BOOLEAN DEFAULT TRUE,
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`;


//  ROOM REQUESTS 

const roomRequestsTableQuery = `
CREATE TABLE IF NOT EXISTS room_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  room_id INT,
  request_type ENUM('new','change','remove') NOT NULL,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);
`;


//  LEAVE REQUESTS

const leaveRequestsTableQuery = `
CREATE TABLE IF NOT EXISTS leave_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  title VARCHAR(255),
  reason TEXT,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);
`;


//  Queries

const queriesTableQuery = `
CREATE TABLE IF NOT EXISTS queries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  category ENUM('mess','hostel','campus','staff','maintenance') NOT NULL,
  reply TEXT NULL,
  status ENUM('pending','closed', 'escalated','irrelevant') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  replied_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`;


//  TABLE CREATOR

const createTable = async (tableName, query) => {
  try {
    await pool.query(query);
    console.log(`${tableName} table ready`);
  } catch (error) {
    console.error(`Error creating ${tableName}`, error);
  }
};


//  CREATE ALL TABLES

const createAllTable = async () => {
  try {
    await createTable("Users", userTableQuery);
    await createTable("Posts", postTableQuery);
    await createTable("Updates", updatesTableQuery);
    await createTable("Rooms", roomsTableQuery);
    await createTable("Room Assignments", roomAssignmentsTableQuery);
    await createTable("Room Requests", roomRequestsTableQuery);
    await createTable("Leave Requests", leaveRequestsTableQuery);
    await createTable("Queries", queriesTableQuery);

    console.log("✅ All tables created successfully");
  } catch (error) {
    console.error("❌ Error initializing database", error);
    throw error;
  }
};

export default createAllTable;
