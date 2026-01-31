import { useEffect, useState } from "react";
import api from "../utils/axios.js";
import StaffHistory from "../components/StaffHistory";

const StaffDashboard = () => {
  const token = sessionStorage.getItem("authToken");


  //  STATES

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);


  //  LOAD ALL STUDENTS

  useEffect(() => {
    loadStudents();
    const interval = setInterval(loadStudents, 5000); // live refresh
    return () => clearInterval(interval);
  }, []);


  const loadStudents = async () => {
    const res = await api.get(
      "http://localhost:3000/api/admin/student", 
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setStudents(res.data);
  };


  //  FILTER (HALF WORD SEARCH)

  const filteredStudents =
    search.length === 0
      ? []
      : students.filter((s) =>
          `${s.name} ${s.email}`
            .toLowerCase()
            .includes(search.toLowerCase())
        );


  //  LOAD STUDENT HISTORY

  const fetchStudentHistory = async (student) => {
    setSelectedStudent(student);
    setShowDropdown(false);
    setLoading(true);

    const res = await api.get(
      `http://localhost:3000/api/admin/student/${student.id}/history`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setHistory(res.data);
    setLoading(false);
  };

  const clearStudent = () => {
    setSelectedStudent(null);
    setHistory(null);
  }


  //  SEARCH ACTION (ENTER / ICON)

  const handleSearchSubmit = () => {
    if (filteredStudents.length === 1) {
      fetchStudentHistory(filteredStudents[0]);
    }
  };

  return (
    <div className="main-outter" style={{ padding: 20}}>
      <h2>Staff Dashboard</h2>

      {/* ================= SEARCH BAR ================= */}
      <div style={{ position: "relative", maxWidth: "1400px" }}>
        <input
          placeholder="Search student (name / email)"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
          style={{ width: "100%", padding: "10px 40px 10px 10px" }}
        />

        {/* 🔍 ICON */}
        <span
          onClick={handleSearchSubmit}
          style={{
            position: "absolute",
            right: 10,
            top: 10,
            cursor: "pointer",
          }}
        >
          🔍
        </span>
        
      
        {/* ================= DROPDOWN ================= */}
        {showDropdown && filteredStudents.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: 45,
              width: "100%",
              border: "1px solid #ccc",
              background: "#fff",
              zIndex: 10,
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            {filteredStudents.map((s) => (
              <div
                key={s.id}
                onClick={() => fetchStudentHistory(s)}
                style={{
                  padding: 10,
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
              >
                <b>{s.name}</b>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {s.email}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={selectedStudent ? "box-main" : ""}>
      {selectedStudent ?  (<button onClick={() => clearStudent()}>Clear</button>) : "Select / Search for a Student to display details" }
      {/* ================= STUDENT DETAILS ================= */}
      {selectedStudent && (
        <div style={{ marginTop: 30 }}>
          <h3>Student Details</h3>

          <div style={card}>
            <p><b>Name:</b> {selectedStudent.name}</p>
            <p><b>Email:</b> {selectedStudent.email}</p>
            <p><b>Mobile:</b> {selectedStudent.mobile}</p>
          </div>
        </div>
      )}

      {/* ================= HISTORY ================= */}
      {loading && <p>Loading history...</p>}

      {history && (
        <div style={{ marginTop: 20 }}>
          <h3>Request History</h3>

          {/* ===== ROOM REQUESTS ===== */}
          <Section title="Room Requests">
            {history.roomRequests.length === 0 && <p>No room requests</p>}
            {history.roomRequests.map((r) => (
              <HistoryCard key={r.id}>
                <b>{r.request_type.toUpperCase()}</b>
                <p>
                  Room:{" "}
                  {r.block_name
                    ? `${r.block_name} - ${r.room_number}`
                    : "N/A"}
                </p>
                <Status status={r.status} />
              </HistoryCard>
            ))}
          </Section>

          {/* ===== LEAVE REQUESTS ===== */}
          <Section title="Leave Requests">
            {history.leaves.length === 0 && <p>No leave requests</p>}
            {history.leaves.map((l) => (
              <HistoryCard key={l.id}>
                <p>
                  {l.from_date} → {l.to_date}
                </p>
                <Status status={l.status} />
              </HistoryCard>
            ))}
          </Section>

          {/* ===== QUERIES ===== */}
          <Section title="Queries">
            {history.queries.length === 0 && <p>No queries</p>}
            {history.queries.map((q) => (
              <HistoryCard key={q.id}>
                <b>{q.title}</b>
                <p>{q.message}</p>
                <Status status={q.status} />
                {q.reply && (
                  <p><b>Reply:</b> {q.reply}</p>
                )}
              </HistoryCard>
            ))}
          </Section>
        </div>
      )}
      </div>
      <StaffHistory />
    </div>
  );
};

export default StaffDashboard;


//  UI HELPERS


const Section = ({ title, children }) => (
  <div style={{ marginBottom: 20 }}>
    <h4>{title}</h4>
    {children}
  </div>
);

const HistoryCard = ({ children }) => (
  <div
    style={{
      border: "1px solid #ddd",
      padding: 12,
      marginBottom: 10,
      borderRadius: 6,
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

const card = {
  border: "1px solid #ccc",
  padding: 15,
  borderRadius: 6,
};
