import { useEffect, useState } from "react";
import api from "../utils/axios.js";
import { toast } from "react-toastify";

const StaffHistory = () => {
  const token = sessionStorage.getItem("authToken");

  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get(
        "/api/admin/history",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHistory(res.data);
    } catch (error) {
      console.error("FAILED TO LOAD STAFF HISTORY", error);
      toast.error("Failed to load staff history");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading history...</p>;
  if (!history) return <p>No history found</p>;

  return (
    <div className="staff-his" style={{ padding: 20, maxWidth: 1200 }}>
      <h2>Staff Action History</h2>

      {/* ================= ROOM REQUESTS ================= */}
      <Section title="Room Requests">
        {history.roomRequests.length === 0 && <p>No room actions</p>}

        {history.roomRequests.map((r) => (
          <Card key={`room-${r.id}`}>
            <b>{r.student_name}</b>
            <p>Type: {r.request_type.toUpperCase()}</p>
            <p>
              Room:{" "}
              {r.block_name
                ? `${r.block_name} - ${r.room_number}`
                : "N/A"}
            </p>
            <Status status={r.status} />
            <small>{formatDate(r.action_date)}</small>
          </Card>
        ))}
      </Section>

      {/* ================= LEAVE REQUESTS ================= */}
      <Section title="Leave Requests">
        {history.leaves.length === 0 && <p>No leave actions</p>}

        {history.leaves.map((l) => (
          <Card key={`leave-${l.id}`}>
            <b>{l.student_name}</b>
            <p>
              {l.from_date} → {l.to_date}
            </p>
            <Status status={l.status} />
            <small>{formatDate(l.action_date)}</small>
          </Card>
        ))}
      </Section>

      {/* ================= QUERIES ================= */}
      <Section title="Queries">
        {history.queries.length === 0 && <p>No query actions</p>}

        {history.queries.map((q) => (
          <Card key={`query-${q.id}`}>
            <b>{q.student_name}</b>
            <p>Title: {q.title}</p>
            <p>Category: {q.category}</p>

            {q.reply && (
              <p>
                <b>Reply:</b> {q.reply}
              </p>
            )}

            <Status status={q.status} />
            <small>{formatDate(q.action_date)}</small>
          </Card>
        ))}
      </Section>
    </div>
  );
};

export default StaffHistory;


const Section = ({ title, children }) => (
  <div style={{ marginTop: 30 }}>
    <h3>{title}</h3>
    {children}
  </div>
);

const Card = ({ children }) => (
  <div
    style={{
      border: "1px solid #ddd",
      padding: 15,
      borderRadius: 8,
      marginBottom: 12,
      background: "#fff",
    }}
  >
    {children}
  </div>
);

const Status = ({ status }) => {
  const color =
    status === "closed" || status === "approved"
      ? "green"
      : status === "escalated" || status === "pending"
      ? "orange"
      :status === "irrelevant" || status === "rejected"
      ? "red"
      : "none"
      ;

  return <p style={{ color }}>Status: <b>{status}</b></p>;
};

const formatDate = (d) =>
  new Date(d).toLocaleString();
