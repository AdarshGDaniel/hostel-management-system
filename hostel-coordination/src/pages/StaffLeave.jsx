import { useEffect, useState } from "react";
import api from "../utils/axios.js";
import { toast } from "react-toastify";

const StaffLeave = () => {
  const token = sessionStorage.getItem("authToken");
  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // live refresh
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const res = await api.get(
      "http://localhost:3000/api/leaves/staff",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setData(res.data);
  };

  const decide = async (leaveId, decision) => {
    try {
      await api.post(
        "http://localhost:3000/api/leaves/staff/decision",
        {
          leaveId: leaveId,
          decision: decision,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.info(`Leave ${decision}`);
      loadData();
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to update leave");
    }
  };


  if (!data) return <p>Loading...</p>;

  return (
    <div className="main-outter staff-leave-page-container">
    <div className="staff-leave-page">
      <h2>Leave Management</h2>

      <h3>Students on Leave: {data.totalOnLeave}</h3>

      {/* ===== ROOM GRID ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: 12,
        }}
      >
        {data.rooms.map((r) => (
          <div
            key={r.room_id}
            style={{
              padding: 12,
              background: "#ffe5b4",
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          >
            <b>{r.block_name} - {r.room_number}</b>
            <p>Floor: {r.floor}</p>
            <p>On Leave: {r.on_leave_count}</p>
          </div>
        ))}
      </div>

      <hr />

      {/* ===== PENDING REQUESTS ===== */}
      <h3>Pending Leave Requests</h3>

      {data.requests.length === 0 && <p>No pending requests</p>}

      {data.requests.map((req) => (
        <div className="staff-view-pending-leave"
          key={req.id}
          style={{
            border: "1px solid #ccc",
            padding: 12,
            marginBottom: 10,
          }}
        >
          <b>{req.name}</b>
          <p>
            {req.block_name} - {req.room_number}
          </p>
          <p>
            {new Date(req.from_date).toLocaleDateString()} →{" "}
            {new Date(req.to_date).toLocaleDateString()}
          </p>

          <button onClick={() => decide(req.id, "approved")}>
            Approve
          </button>

          <button
            onClick={() => decide(req.id, "rejected")}
            style={{ marginLeft: 10 }}
          >
            Reject
          </button>
        </div>
      ))}
    </div>
    </div>
  );
};

export default StaffLeave;
