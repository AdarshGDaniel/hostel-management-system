import { useEffect, useState } from "react";
import api from "../utils/axios.js";
import StaffQueries from "./StaffQueries";

const StaffRequests = () => {
  const token = sessionStorage.getItem("authToken");
  const [requests, setRequests] = useState([]);

  const getRequestLabel = (type) => {
    if (type === "new") return "🆕 New Room Request";
    if (type === "change") return "🔁 Change Room Request";
    if (type === "remove") return "🚪 Leave Hostel Request";
    return type;
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // live refresh
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const res = await api.get(
      "/api/admin/room/requests",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setRequests(res.data);
  };

  const approve = async (req) => {
    await api.post(
      "/api/admin/room/approve",
      {
        requestId: req.request_id,
        requestType: req.request_type,
        roomId: req.room_id,
        userId: req.user_id,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    loadData();
  };

  const reject = async (id) => {
    await api.post(
      "/api/admin/room/reject",
      { requestId: id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    loadData();
  };

  return (
    <div className="main-outter">
      <h2>Pending Room Requests</h2>

      {requests.map((req) => (
        <div className="staff-requests-container"
          key={req.request_id}
          style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}
        >
          <p>
            <b>{req.name}</b> — {getRequestLabel(req.request_type)}
          </p>

          <p>
            Requested Room:{" "}
            {req.block_name
              ? `${req.block_name} - ${req.room_number}`
              : "Not selected"}
          </p>

          {req.request_type !== "remove" && (
            <button onClick={() => approve(req)}>Approve</button>
          )}

          {req.request_type === "remove" && (
            <button onClick={() => approve(req)}>Approve Leave</button>
          )}

          <button onClick={() => reject(req.request_id)}>Reject</button>
        </div>
      ))}

      <StaffQueries />
    </div>
  );
};

export default StaffRequests;
