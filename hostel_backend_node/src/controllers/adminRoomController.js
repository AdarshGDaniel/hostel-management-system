import {
  getPendingRoomRequests,
  approveRoomRequest,
  rejectRoomRequest,
  approveLeaveRequest,
  getUnassignedStudents,
  getStudentsByBlock,
  assignGuestToRoom,
  removeStudentFromRoom,
  removeGuestFromRoom,
} from "../services/adminRoomService.js";


// View Pending Requests
export const viewRequests = async (req, res) => {
  const requests = await getPendingRoomRequests();
  res.json(requests);
};

// Approve Request
export const approveRequest = async (req, res) => {
  const { requestId, requestType, roomId, userId } = req.body;

  if (requestType === "new" || requestType === "change") {
    if (!roomId) {
      return res.status(400).json({ message: "Room is required" });
    }

    await approveRoomRequest(requestId, roomId, userId);
  }

  if (requestType === "remove") {
    await approveLeaveRequest(requestId, userId);
  }

  res.json({ success: true, message: "Request processed successfully" });
};

// Reject Request
export const rejectRequest = async (req, res) => {
  const { requestId } = req.body;
  await rejectRoomRequest(requestId);
  res.json({ success: true, message: "Request rejected" });
};

// Filters
export const fetchUnassignedStudents = async (req, res) => {
  const students = await getUnassignedStudents();
  res.json(students);
};

// Get Student by block
export const fetchStudentsByBlock = async (req, res) => {
  const { block } = req.query;
  const students = await getStudentsByBlock(block);
  res.json(students);
};

// Assign or update guest
export const assignGuest = async (req, res) => {
  try {
    const { roomId, fromDate, toDate, guestCount, guestNames } = req.body;

    if (!roomId || !fromDate || !toDate || !guestCount) {
      return res.status(400).json({ message: "Missing data" });
    }

    await assignGuestToRoom(
      roomId,
      fromDate,
      toDate,
      guestCount,
      guestNames || []
    );

    res.json({ success: true, message: "Guest assigned successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove Guest
export const removeGuest = async (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({ message: "Room ID required" });
    }

    await removeGuestFromRoom(roomId);

    res.json({ success: true, message: "Guest removed successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove Student
export const removeStudent = async (req, res) => {
  try {
    const { userId, roomId } = req.body;

    if (!userId || !roomId) {
      return res.status(400).json({ message: "Missing data" });
    }

    await removeStudentFromRoom(userId, roomId);

    res.json({ success: true, message: "Student removed from room" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Room Request
export const updateRoomRequestStatus = async (req, res) => {
  const { requestId, status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  await pool.query(
    `UPDATE room_requests SET status = ? WHERE id = ?`,
    [status, requestId]
  );

  res.json({ success: true });
};

// Get room Request
export const getRoomRequests = async (req, res) => {
  try {
    const requests = await getPendingRoomRequests();
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load room requests" });
  }
};
