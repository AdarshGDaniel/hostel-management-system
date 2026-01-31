import { useEffect, useState } from "react";
import api from "../utils/axios.js";
import { toast } from "react-toastify";

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("authToken");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await api.get(
        "/api/leaves/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLeaves(res.data);
    } catch (error) {
      console.error("Failed to load leaves", error);
      toast.error("Failed to load leave history");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading leave history...</p>;

  return (
    <div className="my-leave-block">
      <h2>My Leave History</h2>

      {leaves.length === 0 && (
        <p style={{ color: "gray" }}>No leave requests found.</p>
      )}

      {leaves.map((leave) => (
        <div
          key={leave.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "12px",
            marginBottom: "12px",
          }}
        >
          <p>
            <b>Room:</b>{" "}
            {leave.block_name} - {leave.room_number} (Floor {leave.floor})
          </p>

          <p>
            <b>From:</b>{" "}
            {new Date(leave.from_date).toLocaleDateString()} <br />
            <b>To:</b>{" "}
            {new Date(leave.to_date).toLocaleDateString()}
          </p>

          <p>
            <b>Status:</b>{" "}
            <span style={statusStyle(leave.status)}>
              {leave.status.toUpperCase()}
            </span>
          </p>

          <p style={{ fontSize: "13px", color: "#666" }}>
            Requested on{" "}
            {new Date(leave.requested_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyLeaves;


//  STATUS COLOR
const statusStyle = (status) => {
  if (status === "approved") {
    return { color: "green", fontWeight: "bold" };
  }
  if (status === "rejected") {
    return { color: "red", fontWeight: "bold" };
  }
  return { color: "orange", fontWeight: "bold" }; // pending
};
