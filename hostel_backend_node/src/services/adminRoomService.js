import { pool } from "../config/db.js";


//  Get Pending Room Requests

export const getPendingRoomRequests = async () => {
  const [rows] = await pool.query(`
    SELECT
      rr.id AS request_id,
      rr.request_type,
      rr.status,
      rr.room_id,
      rr.user_id,
      u.name,
      r.block_name,
      r.room_number
    FROM room_requests rr
    JOIN users u ON u.id = rr.user_id
    LEFT JOIN rooms r ON r.id = rr.room_id
    WHERE rr.status = 'pending'
    ORDER BY rr.requested_at ASC
  `);

  return rows;
};


//  Get Unassigned Students

export const getUnassignedStudents = async () => {
  const [rows] = await pool.query(`
    SELECT u.id, u.name, u.email
    FROM users u
    LEFT JOIN room_assignments ra
      ON u.id = ra.user_id AND ra.is_active = TRUE
    WHERE u.userType = 'student'
      AND ra.id IS NULL
  `);

  return rows;
};


//  Get Students by Block

export const getStudentsByBlock = async (blockName) => {
  const [rows] = await pool.query(`
    SELECT u.name, u.email, r.block_name, r.room_number
    FROM room_assignments ra
    JOIN users u ON ra.user_id = u.id
    JOIN rooms r ON ra.room_id = r.id
    WHERE ra.is_active = TRUE
      AND r.block_name = ?
  `, [blockName]);

  return rows;
};


//  Approve Room Request

export const approveRoomRequest = async (requestId, roomId, userId) => {
  await pool.query(`UPDATE room_requests SET status='approved' WHERE id=?`, [requestId]);

  await pool.query(`
    UPDATE room_assignments
    SET is_active = FALSE
    WHERE user_id = ? AND is_active = TRUE
  `, [userId]);

  await pool.query(`
    INSERT INTO room_assignments (user_id, room_id, status, start_date)
    VALUES (?, ?, 'occupied', CURDATE())
  `, [userId, roomId]);

  await pool.query(`
    UPDATE rooms SET occupied_count = occupied_count + 1 WHERE id=?
  `, [roomId]);
};


//  Reject Room Request

export const rejectRoomRequest = async (requestId) => {
  await pool.query(`UPDATE room_requests SET status='rejected' WHERE id=?`, [requestId]);
};


//  Approve Room Leave Request

export const approveLeaveRequest = async (requestId, userId) => {

  await pool.query(
    `
    UPDATE room_assignments
    SET is_active = FALSE, end_date = CURDATE()
    WHERE user_id = ? AND is_active = TRUE
    `,
    [userId]
  );


  await pool.query(
    `
    UPDATE room_requests
    SET status = 'approved'
    WHERE id = ?
    `,
    [requestId]
  );
};


// Remove Student from the room

export const removeStudentFromRoom = async (userId, roomId) => {
  const [result] = await pool.query(
    `
    UPDATE room_assignments
    SET is_active = FALSE,
        end_date = CURDATE()
    WHERE user_id = ?
      AND room_id = ?
      AND is_active = TRUE
    `,
    [userId, roomId]
  );

  if (result.affectedRows === 0) {
    throw new Error("No active student found in this room");
  }
};


//  ASSIGN / UPDATE GUEST

export const assignGuestToRoom = async (
  roomId,
  fromDate,
  toDate,
  guestCount,
  guestNames
) => {
  const [active] = await pool.query(
    `
    SELECT id FROM room_assignments
    WHERE room_id = ?
      AND is_active = TRUE
    `,
    [roomId]
  );

  if (active.length > 0) {
    throw new Error("Room is not vacant");
  }

  await pool.query(
    `
    INSERT INTO room_assignments
    (room_id, user_id, status, start_date, end_date, is_active, guest_count, guest_names)
    VALUES (?, NULL, 'guest', ?, ?, TRUE, ?, ?)
    `,
    [roomId, fromDate, toDate, guestCount, JSON.stringify(guestNames)]
  );
};


//  REMOVE GUEST

export const removeGuestFromRoom = async (roomId) => {
  const [result] = await pool.query(
    `
    UPDATE room_assignments
    SET is_active = FALSE,
        end_date = CURDATE()
    WHERE room_id = ?
      AND status = 'guest'
      AND is_active = TRUE
    `,
    [roomId]
  );

  if (result.affectedRows === 0) {
    throw new Error("No active guest found in this room");
  }
};

// Get all room request

export const getAllRoomRequests = async () => {
  const [rows] = await pool.query(`
    SELECT rr.id, rr.request_type, rr.status,
           u.name, u.email,
           r.block_name, r.room_number
    FROM room_requests rr
    JOIN users u ON u.id = rr.user_id
    LEFT JOIN rooms r ON r.id = rr.room_id
    ORDER BY rr.requested_at DESC
  `);
  return rows;
};
