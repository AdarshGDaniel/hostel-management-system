import { pool } from "../config/db.js";


//  Student applies for leave

export const createLeaveRequest = async (
  userId,
  roomId,
  fromDate,
  toDate
) => {
  await pool.query(
    `
    INSERT INTO leave_requests
      (user_id, room_id, from_date, to_date, status)
    VALUES (?, ?, ?, ?, 'pending')
    `,
    [userId, roomId, fromDate, toDate]
  );
};


//  Pending leave requests (STAFF)

export const getPendingLeaveRequests = async () => {
  const [rows] = await pool.query(`
    SELECT
      lr.id,
      lr.user_id,
      lr.room_id,
      lr.from_date,
      lr.to_date,
      lr.status,
      lr.requested_at,
      u.name,
      r.block_name,
      r.room_number,
      r.floor
    FROM leave_requests lr
    JOIN users u ON u.id = lr.user_id
    JOIN rooms r ON r.id = lr.room_id
    WHERE lr.status = 'pending'
    ORDER BY lr.requested_at DESC
  `);

  return rows;
};


//  Students currently on leave

export const getActiveLeaveRooms = async () => {
  const [rows] = await pool.query(`
    SELECT
      r.id AS room_id,
      r.block_name,
      r.room_number,
      r.floor,
      COUNT(ra.id) AS on_leave_count
    FROM room_assignments ra
    JOIN rooms r ON r.id = ra.room_id
    WHERE ra.status = 'on_leave'
    GROUP BY r.id
    ORDER BY r.block_name, r.floor, r.room_number
  `);

  return rows;
};


//  Approve leave

export const approveLeaveRequest = async (leaveId) => {
  const [[leave]] = await pool.query(
    `
    SELECT user_id, room_id
    FROM leave_requests
    WHERE id = ?
    `,
    [leaveId]
  );

  if (!leave) return;

  await pool.query(
    `
    UPDATE leave_requests
    SET status = 'approved'
    WHERE id = ?
    `,
    [leaveId]
  );

  await pool.query(
    `
    UPDATE room_assignments
    SET status = 'on_leave'
    WHERE user_id = ?
      AND room_id = ?
    `,
    [leave.user_id, leave.room_id]
  );
};


//  Reject leave

export const rejectLeaveRequest = async (leaveId) => {
  await pool.query(
    `
    UPDATE leave_requests
    SET status = 'rejected'
    WHERE id = ?
    `,
    [leaveId]
  );
};



//  Student: Leave history

export const getMyLeaves = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT
      lr.id,
      lr.from_date,
      lr.to_date,
      lr.status,
      lr.requested_at,
      r.block_name,
      r.room_number,
      r.floor
    FROM leave_requests lr
    JOIN rooms r ON r.id = lr.room_id
    WHERE lr.user_id = ?
    ORDER BY lr.requested_at DESC
    `,
    [userId]
  );

  return rows;
};
