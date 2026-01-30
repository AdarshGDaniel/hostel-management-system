import {
  getStudentRequests,
  getCurrentRoom,
  hasPendingRequest,
} from "../services/studentService.js";

import { pool } from "../config/db.js";


export const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await getStudentRequests(userId);
    const currentRoom = await getCurrentRoom(userId);
    const pending = await hasPendingRequest(userId);

    res.json({
      currentRoom,
      pendingRequest: pending,
      requests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load student dashboard" });
  }
};



  //  STAFF: FETCH ALL STUDENTS

export const fetchAllStudents = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, name, email, mobile
      FROM users
      WHERE userType = 'student'
      ORDER BY name
    `);

    res.json(rows);
  } catch (error) {
    console.error("FETCH STUDENTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load students",
    });
  }
};


  //  STAFF: STUDENT FULL HISTORY

export const fetchStudentHistory = async (req, res) => {
  try {
    const studentId = req.params.id;

    // ROOM REQUESTS
    const [roomRequests] = await pool.query(
      `
      SELECT rr.id, rr.request_type, rr.status,
             r.block_name, r.room_number
      FROM room_requests rr
      LEFT JOIN rooms r ON r.id = rr.room_id
      WHERE rr.user_id = ?
      ORDER BY rr.requested_at DESC
      `,
      [studentId]
    );

    // LEAVES
    const [leaves] = await pool.query(
      `
      SELECT id, from_date, to_date, status
      FROM leave_requests
      WHERE user_id = ?
      ORDER BY requested_at DESC
      `,
      [studentId]
    );

    // QUERIES
    const [queries] = await pool.query(
      `
      SELECT id, title, message, status, reply
      FROM queries
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [studentId]
    );

    res.json({
      roomRequests,
      leaves,
      queries,
    });
  } catch (error) {
    console.error("FETCH STUDENT HISTORY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load student history",
    });
  }
};