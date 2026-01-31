import { pool } from "../config/db.js";


//  ROOM REQUEST HISTORY

export const getRoomRequestHistory = async () => {
  const [rows] = await pool.query(`
    SELECT
      rr.id,
      rr.request_type,
      rr.status,
      rr.requested_at AS action_date,
      u.name AS student_name,
      r.block_name,
      r.room_number
    FROM room_requests rr
    JOIN users u ON u.id = rr.user_id
    LEFT JOIN rooms r ON r.id = rr.room_id
    WHERE rr.status IN ('approved','rejected')
    ORDER BY rr.requested_at DESC
  `);

  return rows;
};


//  LEAVE REQUEST HISTORY

export const getLeaveHistory = async () => {
  const [rows] = await pool.query(`
    SELECT
      lr.id,
      lr.from_date,
      lr.to_date,
      lr.status,
      lr.requested_at AS action_date,
      u.name AS student_name,
      r.block_name,
      r.room_number
    FROM leave_requests lr
    JOIN users u ON u.id = lr.user_id
    JOIN rooms r ON r.id = lr.room_id
    WHERE lr.status IN ('approved','rejected')
    ORDER BY lr.requested_at DESC
  `);

  return rows;
};


//  QUERY HISTORY


export const getQueryHistory = async () => {
  const [rows] = await pool.query(`
    SELECT
      q.id,
      q.title,
      q.category,
      q.status,
      q.reply,
      COALESCE(q.replied_at, q.created_at) AS action_date,

      u.name AS student_name,
      u.userType,

      r.block_name,
      r.room_number,
      r.floor

    FROM queries q

    JOIN users u
      ON u.id = q.user_id

    LEFT JOIN room_assignments ra
      ON ra.user_id = u.id
     AND ra.end_date IS NULL

    LEFT JOIN rooms r
      ON r.id = ra.room_id

    WHERE q.status IN ('closed', 'escalated', 'irrelevant')
      AND u.userType NOT IN ('staff', 'admin')

    ORDER BY action_date DESC
  `);

  return rows;
};


