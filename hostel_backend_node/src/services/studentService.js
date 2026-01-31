import { pool } from "../config/db.js";


//  Get Student Requests (History)

export const getStudentRequests = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT rr.id, rr.request_type, rr.status, rr.requested_at,
           r.block_name, r.floor, r.room_number
    FROM room_requests rr
    LEFT JOIN rooms r ON rr.room_id = r.id
    WHERE rr.user_id = ?
    ORDER BY rr.requested_at DESC
    `,
    [userId]
  );

  return rows;
};


//  Get Current Room Allocation

export const getCurrentRoom = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT r.block_name, r.floor, r.room_number
    FROM room_assignments ra
    JOIN rooms r ON ra.room_id = r.id
    WHERE ra.user_id = ?
      AND ra.is_active = TRUE
      AND ra.status = 'occupied'
    `,
    [userId]
  );

  return rows[0] || null;
};


//  Has Pending Request?

export const hasPendingRequest = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT id
    FROM room_requests
    WHERE user_id = ?
      AND status = 'pending'
    LIMIT 1
    `,
    [userId]
  );

  return rows.length > 0;
};



//  Get all students

export const getAllStudents = async () => {
  const [rows] = await pool.query(`
    SELECT id, name, email, mobile
    FROM users
    WHERE userType = 'student'
    ORDER BY name
  `);

  return rows;
};


//  Get full student history

export const getStudentHistory = async (studentId) => {

  const [roomRequests] = await pool.query(`
    SELECT rr.id, rr.request_type, rr.status,
           r.block_name, r.room_number
    FROM room_requests rr
    LEFT JOIN rooms r ON r.id = rr.room_id
    WHERE rr.user_id = ?
    ORDER BY rr.requested_at DESC
  `, [studentId]);


  const [leaves] = await pool.query(`
    SELECT id, from_date, to_date, status
    FROM leave_requests
    WHERE user_id = ?
    ORDER BY requested_at DESC
  `, [studentId]);


  const [queries] = await pool.query(`
    SELECT id, title, message, category, status, reply
    FROM queries
    WHERE user_id = ?
    ORDER BY created_at DESC
  `, [studentId]);

  return { roomRequests, leaves, queries };
};