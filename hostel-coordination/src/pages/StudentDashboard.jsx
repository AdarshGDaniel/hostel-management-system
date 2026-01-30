import { useEffect, useState } from "react";
import api from "../utils/axios.js";

const StudentDashboard = () => {
  const token = sessionStorage.getItem("authToken");
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const res = await api.get(
      "/api/admin/dashboard",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setData(res.data);
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className="main-outter student-dashboard-page-container">
    <div className="student-dashboard-page">
      <h2>Student Dashboard</h2>

      {/* ================= CURRENT ROOM ================= */}
      <h3>Current Room</h3>
      {data.currentRoom ? (
        <p>
          {data.currentRoom.block_name} - {data.currentRoom.room_number}
        </p>
      ) : (
        <p>No room allocated yet</p>
      )}

      {/* ================= NOTIFICATION ================= */}
      {data.pendingRequest && (
        <p style={{ color: "orange" }}>
          ⏳ You have a pending room request
        </p>
      )}

      {/* ================= REQUEST HISTORY ================= */}
      <h3>Request History</h3>

      {data.requests.length === 0 ? (
        <p>No requests made</p>
      ) : (
        data.requests.map((req) => (
          <div
            key={req.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p>
              <b>Type:</b> {req.request_type}
            </p>
            <p>
              <b>Room:</b>{" "}
              {req.block_name
                ? `${req.block_name} - ${req.room_number}`
                : "Not selected"}
            </p>
            <p>
              <b>Status:</b>{" "}
              <span
                style={{
                  color:
                    req.status === "approved"
                      ? "green"
                      : req.status === "rejected"
                      ? "red"
                      : "orange",
                }}
              >
                {req.status}
              </span>
            </p>
            <small>
              {new Date(req.requested_at).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
    </div>
  );
};

export default StudentDashboard;
