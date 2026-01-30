import { pool } from "../config/db.js";


// Student applies for a room

export const applyRoomRequest = async (req, res) => {
  try {
    const { roomId, requestType } = req.body;
    const userId = req.user.id;

    if (!roomId || !requestType) {
      return res.status(400).json({
        success: false,
        message: "Room ID and request type are required",
      });
    }

    // Check if user already has an active room
    const [existing] = await pool.query(
      `
      SELECT * FROM room_assignments
      WHERE user_id = ? AND end_date IS NULL
      `,
      [userId]
    );

    if (existing.length > 0 && requestType === "new") {
      return res.status(400).json({
        success: false,
        message: "User already has a room",
      });
    }

    // Create room request
    await pool.query(
      `
      INSERT INTO room_requests (user_id, room_id, request_type)
      VALUES (?, ?, ?)
      `,
      [userId, roomId, requestType]
    );

    res.status(201).json({
      success: true,
      message: "Room request submitted",
    });
  } catch (error) {
    console.error("Apply room request error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to apply for room",
    });
  }
};


// Student views own requests

export const getMyRoomRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `
      SELECT rr.*, r.block_name, r.room_number
      FROM room_requests rr
      JOIN rooms r ON rr.room_id = r.id
      WHERE rr.user_id = ?
      ORDER BY rr.requested_at DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Get my room requests error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch room requests",
    });
  }
};


// Staff/Admin views pending requests

export const getPendingRoomRequests = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT rr.*, u.name, r.block_name, r.room_number
      FROM room_requests rr
      JOIN users u ON rr.user_id = u.id
      JOIN rooms r ON rr.room_id = r.id
      WHERE rr.status = 'pending'
      ORDER BY rr.requested_at ASC
      `
    );

    res.json(rows);
  } catch (error) {
    console.error("Get pending room requests error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending requests",
    });
  }
};


// Staff/Admin approves request

export const approveRoomRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    // Get request details
    const [[request]] = await pool.query(
      "SELECT * FROM room_requests WHERE id = ?",
      [requestId]
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Assign room
    await pool.query(
      `
      INSERT INTO room_assignments (room_id, user_id, status, start_date)
      VALUES (?, ?, 'occupied', CURDATE())
      `,
      [request.room_id, request.user_id]
    );

    // Update room status
    await pool.query(
      "UPDATE rooms SET status = 'occupied' WHERE id = ?",
      [request.room_id]
    );

    // Approve request
    await pool.query(
      "UPDATE room_requests SET status = 'approved' WHERE id = ?",
      [requestId]
    );

    res.json({
      success: true,
      message: "Room request approved",
    });
  } catch (error) {
    console.error("Approve room request error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve request",
    });
  }
};


// Staff/Admin rejects request

export const rejectRoomRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    await pool.query(
      "UPDATE room_requests SET status = 'rejected' WHERE id = ?",
      [requestId]
    );

    res.json({
      success: true,
      message: "Room request rejected",
    });
  } catch (error) {
    console.error("Reject room request error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject request",
    });
  }
};
