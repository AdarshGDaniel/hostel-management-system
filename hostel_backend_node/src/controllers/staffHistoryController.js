import {
  getRoomRequestHistory,
  getLeaveHistory,
  getQueryHistory,
} from "../services/staffHistoryService.js";

// Get Staff History for Dashboard

export const getStaffHistory = async (req, res) => {
  try {
    const [roomRequests, leaves, queries] = await Promise.all([
      getRoomRequestHistory(),
      getLeaveHistory(),
      getQueryHistory(),
    ]);

    res.json({
      roomRequests,
      leaves,
      queries,
    });
  } catch (error) {
    console.error("STAFF HISTORY ERROR:", error);
    res.status(500).json({ message: "Failed to load staff history" });
  }
};
