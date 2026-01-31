import {
  createLeaveRequest,
  getPendingLeaveRequests,
  getActiveLeaveRooms,
  approveLeaveRequest,
  rejectLeaveRequest,
  getMyLeaves as getMyLeavesService,
} from "../services/leaveService.js";


// STUDENT: Apply for leave

export const applyLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomId, title, reason, fromDate, toDate } = req.body;

    if (!roomId || !title || !reason || !fromDate || !toDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await createLeaveRequest(
      userId,
      roomId,
      title,
      reason,
      fromDate,
      toDate
    );

    res.json({ success: true, message: "Leave request submitted" });
  } catch (err) {
    console.error("APPLY LEAVE ERROR:", err);
    res.status(500).json({ message: "Failed to apply leave" });
  }
};


  //  STAFF: Leave Dashboard

export const getLeaveDashboard = async (req, res) => {
  try {
    const rooms = await getActiveLeaveRooms();
    const requests = await getPendingLeaveRequests();

    const totalOnLeave = rooms.reduce(
      (sum, r) => sum + r.on_leave_count,
      0
    );

    res.json({
      totalOnLeave,
      rooms,
      requests,
    });
  } catch (err) {
    console.error("LEAVE DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Failed to load leave dashboard" });
  }
};


  //  STAFF: Approve / Reject Leave (SINGLE ENTRY)

export const decideLeave = async (req, res) => {
  try {
    const { leaveId, decision } = req.body;

    if (!leaveId || !decision) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (decision === "approved") {
      await approveLeaveRequest(leaveId);
    } else if (decision === "rejected") {
      await rejectLeaveRequest(leaveId);
    } else {
      return res.status(400).json({ message: "Invalid decision" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("LEAVE DECISION ERROR:", error);
    res.status(500).json({ message: "Failed to update leave status" });
  }
};


// STUDENT: View Leave History

export const getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.id;
    const leaves = await getMyLeavesService(userId);
    res.json(leaves);
  } catch (error) {
    console.error("MY LEAVES ERROR:", error);
    res.status(500).json({ message: "Failed to load leave history" });
  }
};
