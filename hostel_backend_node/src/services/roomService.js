import { pool } from "../config/db.js";


//  Check if student has active room

export const getActiveRoomByStudent = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT 
      r.id AS room_id,
      r.block_name,
      r.floor,
      r.room_number,
      ra.start_date,
      ra.status
    FROM room_assignments ra
    JOIN rooms r ON r.id = ra.room_id
    WHERE ra.user_id = ?
      AND ra.status IN ('occupied', 'on_leave')
      AND ra.is_active = TRUE
    LIMIT 1
    `,
    [userId]
  );

  if (!rows.length) return null;

  const room = rows[0];

  const [mates] = await pool.query(
    `
    SELECT u.id, u.name, ra.status
    FROM room_assignments ra
    JOIN users u ON u.id = ra.user_id
    WHERE ra.room_id = ?
      AND ra.status IN ('occupied','on_leave')
      AND ra.is_active = TRUE
    `,
    [room.room_id]
  );

  return {
    ...room,
    roommates: mates,
  };
};




//  Get all active rooms

export const getAllRooms = async () => {
  const [rows] = await pool.query(
    `
    SELECT id, block_name, floor, room_number, capacity,
    occupied_count,
    CASE
      WHEN occupied_count < capacity AND is_available = TRUE
      THEN 'vacant'
      ELSE 'occupied'
    END AS status
    FROM rooms
    WHERE is_active = TRUE
    ORDER BY block_name, floor, room_number
    `
  );

  return rows;
};


//  Create room request

export const createRoomRequest = async (userId, roomId, requestType) => {
  await pool.query(
    `
    INSERT INTO room_requests (user_id, room_id, request_type)
    VALUES (?, ?, ?)
    `,
    [userId, roomId, requestType]
  );
};


//  Create leave request

export const createLeaveRequest = async (userId, roomId, fromDate, toDate) => {
  await pool.query(
    `
    INSERT INTO leave_requests (user_id, room_id, from_date, to_date)
    VALUES (?, ?, ?, ?)
    `,
    [userId, roomId, fromDate, toDate]
  );
};

//  Get pending rooms

export const getPendingRoomRequest = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT room_id, request_type
    FROM room_requests
    WHERE user_id = ?
      AND status = 'pending'
    ORDER BY requested_at DESC
    LIMIT 1
    `,
    [userId]
  );

  return rows[0] || null;
};



//  Get rooms with status

export const getAllRoomsWithStatus = async () => {
  const [rows] = await pool.query(`
    SELECT
      id,
      block_name,
      floor,
      room_number,
      capacity,
      occupied_count,
      CASE
        WHEN occupied_count < capacity AND is_available = TRUE
        THEN 'vacant'
        ELSE 'occupied'
      END AS status
    FROM rooms
    WHERE is_active = TRUE
    ORDER BY block_name, floor, room_number
  `);

  return rows;
};


//  Check if it is pending

export const hasPendingRoomRequest = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT id FROM room_requests
    WHERE user_id = ?
      AND status = 'pending'
    LIMIT 1
    `,
    [userId]
  );

  return rows.length > 0;
};

// Check for pending leave

export const hasPendingLeaveRequest = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT id FROM leave_requests
    WHERE user_id = ?
      AND status = 'pending'
    LIMIT 1
    `,
    [userId]
  );
  return rows.length > 0;
};



//  CHECK IF ROOM CAN BE DELETED

export const canDeleteRoom = async (roomId) => {

  const [[students]] = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM room_assignments
    WHERE room_id = ?
      AND end_date IS NULL
      AND status IN ('occupied', 'on_leave')
    `,
    [roomId]
  );

  if (students.count > 0) {
    return {
      canDelete: false,
      reason: "Room has students assigned",
    };
  }


  const [[guests]] = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM room_assignments
    WHERE room_id = ?
      AND end_date >= CURDATE()
      AND status IN ('guest')
    `,
    [roomId]
  );

  if (guests.count > 0) {
    return {
      canDelete: false,
      reason: "Room has active guests",
    };
  }

  return {
    canDelete: true,
  };
};


//  DELETE ROOM (HARD DELETE)

export const deleteRoomById = async (roomId) => {
  await pool.query(
    `DELETE FROM rooms WHERE id = ?`,
    [roomId]
  );
};