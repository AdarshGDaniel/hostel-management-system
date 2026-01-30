import { useEffect, useState } from "react";
import api from "../utils/axios.js";
import { toast } from "react-toastify";

const StaffQueries = () => {
  const token = sessionStorage.getItem("authToken");
  const [queries, setQueries] = useState([]);
  const [reply, setReply] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [status, setStatus] = useState("closed");

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);

    const d = date.toLocaleDateString("en-GB", {
      timeZone: "Asia/Kolkata",
    });

    const t = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });

    return `${d} at ${t}`;
  };

  useEffect(() => {
    loadQueries();
    const interval = setInterval(loadQueries, 5000); // live refresh
    return () => clearInterval(interval);
  }, []);

  const loadQueries = async () => {
    try {
      const res = await api.get(
        "/api/queries/staff",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQueries(res.data);
    } catch (err) {
      toast.error("Failed to load queries");
      console.error(err);
    }
  };

  const submitReply = async (id) => {
    await api.post(
      "/api/queries/reply",
      { queryId: id, reply, status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setReply("");
    setActiveId(null);
    loadQueries();
  };

  return (
    <div className="staff-requests-container">
      <h2>Student Queries</h2>

      {queries.map((q) => {

        const canEdit =
          q.status === "pending" || q.status === "escalated";

        return (
          <div
            className="staff-queries-box"
            key={q.id}
            style={{ border: "1px solid #ccc", padding: 10, margin: 10 }}
          >
            <container
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <p><b>Reason</b> — {q.category}</p>
              <p><b>Name: </b>{q.student_name}</p>
              <p><b>Block: </b>{q.block_name}</p>
              <p><b>Room: </b>{q.room_number}</p>
              <p><b>Floor: </b>{q.floor}</p>
            </container>

            <p><b>{q.title}</b></p>
            <p>{q.message}</p>

            <p><b>Status: </b>{q.status}</p>
            <span>{formatDateTime(q.created_at)}</span>

            {q.reply && (
              <p><b>Reply:</b> {q.reply}</p>
            )}

            {q.replied_at && (
              <p>
                <i>Replied on: {formatDateTime(q.replied_at)}</i>
              </p>
            )}

            {/*EDIT ALLOWED ONLY WHEN PENDING / ESCALATED */}
            {canEdit && (
              <>
                <textarea
                  placeholder="Reply"
                  value={activeId === q.id ? reply : ""}
                  onChange={(e) => {
                    setActiveId(q.id);
                    setReply(e.target.value);
                  }}
                />

                <select onChange={(e) => setStatus(e.target.value)}>
                  <option value="closed">Closed</option>
                  <option value="escalated">Escalated</option>
                  <option value="irrelevant">Irrelevant</option>
                </select>

                <button onClick={() => submitReply(q.id)}>
                  Submit Reply
                </button>
              </>
            )}

            {!canEdit && (
              <p style={{ color: "gray" }}>
                This query is closed and cannot be edited.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StaffQueries;
