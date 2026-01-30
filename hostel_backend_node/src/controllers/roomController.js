import {
  getActiveRoomByStudent,
  getAllRoomsWithStatus,
  createRoomRequest,
  createLeaveRequest,
  getPendingRoomRequest,
  hasPendingRoomRequest,
  canDeleteRoom,
} from "../services/roomService.js";
import { pool } from "../config/db.js";

import { getStudentQueries } from "../services/queryService.js";


  //  Requests Page Data

export const getRequestsPageData = async (req, res) => {
  try {
    const userId = req.user.id;

    const activeRoom = await getActiveRoomByStudent(userId);
    const rooms = await getAllRoomsWithStatus();
    const pendingRequest = await hasPendingRoomRequest(userId);
    const pendingRoom = await getPendingRoomRequest(userId);

    const myQueries = await getStudentQueries(userId);

    if (activeRoom) {
      return res.json({
        hasRoom: true,
        room: activeRoom,
        rooms,
        pendingRequest,
        pendingRoomId: pendingRoom?.room_id || null,
        myQueries,
      });
    }

    return res.json({
      hasRoom: false,
      rooms,
      pendingRequest,
      pendingRoomId: pendingRoom?.room_id || null,
      myQueries,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load request page data" });
  }
};

  //  Request New / Change / Remove

export const requestRoom = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomId, requestType } = req.body;

    if (!["new", "change", "remove"].includes(requestType)) {
      return res.status(400).json({ message: "Invalid request type" });
    }

    await createRoomRequest(userId, roomId || null, requestType);

    res.json({ success: true, message: "Room request submitted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit room request" });
  }
};


  //  Leave Request

export const requestLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomId, fromDate, toDate } = req.body;

    await createLeaveRequest(userId, roomId, fromDate, toDate);

    res.json({ success: true, message: "Leave request submitted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit leave request" });
  }
};



  //  DELETE ROOM (ADMIN)

export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({ message: "Room ID required" });
    }

    const check = await canDeleteRoom(roomId);

    if (!check.canDelete) {
      return res.status(400).json({
        success: false,
        message: check.reason,
      });
    }

    await pool.query(`DELETE FROM rooms WHERE id = ?`, [roomId]);

    res.json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (err) {
    console.error("DELETE ROOM ERROR:", err);
    res.status(500).json({ message: "Failed to delete room" });
  }
};
