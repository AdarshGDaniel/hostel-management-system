import { useEffect, useState } from "react";
import api from "../utils/axios.js";
import { toast } from "react-toastify";
import MyLeaves from "../components/MyLeaves";


const Requests = () => {
  const [data, setData] = useState(null);

  const [showChangePopup, setShowChangePopup] = useState(false);
  const [showLeavePopup, setShowLeavePopup] = useState(false);
  const [showQueryPopup, setShowQueryPopup] = useState(false);
  const [clickedRoomId, setClickedRoomId] = useState(null);

  const [leaveTitle, setLeaveTitle] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveTo, setLeaveTo] = useState("");

  const [queryTitle, setQueryTitle] = useState("");
  const [queryMessage, setQueryMessage] = useState("");
  const [queryCategory, setQueryCategory] = useState("mess");



  const token = sessionStorage.getItem("authToken");

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // live refresh
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    const res = await api.get(
      "/api/rooms/requests-page",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setData(res.data);
  };


    //  ROOM REQUEST

  const requestRoom = async (roomId, requestType) => {
    try {
      await api.post(
        "/api/rooms/room-request",
        { roomId, requestType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Request submitted. Please wait for approval.");
      setShowChangePopup(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to submit request: " + error.message);
    }
  };


    //  APPLY LEAVE

  const submitLeave = async () => {
    if (!leaveTitle || !leaveReason || !leaveFrom || !leaveTo) {
      toast.info("Fill all leave fields");
      return;
    }

    await api.post(
      "/api/rooms/leave-request",
      {
        roomId: data.room.room_id,
        fromDate: leaveFrom,
        toDate: leaveTo,
        title: leaveTitle,
        reason: leaveReason,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Leave request submitted");
    setShowLeavePopup(false);
    fetchData();
  };


    //  SUBMIT QUERY

  const submitQuery = async () => {
    if (!queryTitle || !queryMessage) {
      toast.info("Fill all fields");
      return;
    }

    await api.post(
      "/api/queries/raise",
      {
        title: queryTitle,
        message: queryMessage,
        category: queryCategory,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Query submitted");
    setShowQueryPopup(false);
  };


  if (!data) return <p>Loading...</p>;

  const pending = data.pendingRequest === true;

  
    //  NO ROOM

  if (!data.hasRoom) {
    return (
      <div className="main-outer student-requests-page-container">
        <div className="student-requests-page">
          <h2>Select a Room</h2>

          {data.pendingRequest && (
            <p style={{ color: "gray" }}>
              ⏳ You already applied. Waiting for approval.
            </p>
          )}

          <RoomGrid
            rooms={data.rooms || []}
            pendingRoomId={data.pendingRoomId}
            clickedRoomId={clickedRoomId}
            disabled={data.pendingRequest}
            onSelect={(roomId) => requestRoom(roomId, "new")}
          />
        </div>
      </div>
    );
  }


    //  HAS ROOM

  return (
    <div className="main-outer student-requests-page-container-two">
      <div className="student-requests-page-two">
      {data.hasRoom && data.room ? (
        <>
          <h2>Your Room Details</h2>

          {data.room.status === "on_leave" && (
            <p style={{ color: "orange" }}>
              <b>🟠 You are currently on leave</b>
            </p>
          )}


          <p>
            <b>Block:</b> {data.room.block_name} <br />
            <b>Floor:</b> {data.room.floor} <br />
            <b>Room:</b> {data.room.room_number}
          </p>
        </>
      ) : (
        <p style={{ color: "gray" }}>
          ⏳ No room assigned yet
        </p>
      )}


      {pending && (
        <p style={{ color: "gray", marginBottom: 10 }}>
          ⏳ Waiting for approval. Actions are disabled.
        </p>
      )}

      <button disabled={pending} onClick={() => setShowChangePopup(true)}>
        Change Room
      </button>

      <button disabled={pending} onClick={() => setShowLeavePopup(true)}>
        Apply Leave
      </button>

      <button onClick={() => setShowQueryPopup(true)}>
        Raise Query
      </button>

      <button
        disabled={pending}
        onClick={() => requestRoom(data.room.room_id, "remove")}
      >
        Leave Hostel
      </button>

      {/* ================= CHANGE ROOM ================= */}
      {showChangePopup && !pending && (
        <PopupWrapper onClose={() => setShowChangePopup(false)}>
          <h3>Select New Room</h3>

          <div className="change-room-blocks"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              height: "80vh",
              overflow: "scroll",
              gap: 10,
            }}
          >
            {data.rooms
              .filter((r) => r.status === "vacant")
              .map((r) => {
                const available = r.capacity - r.occupied_count;
                const disabled = available <= 0;

                let bg = "#eaffea";
                if (available === 1) bg = "#fff3cd";
                if (available === 0) bg = "#ffdede";

                return (
                  <div
                    key={r.id}
                    style={{
                      border: "1px solid #ccc",
                      padding: 10,
                      background: bg,
                      cursor: disabled ? "not-allowed" : "pointer",
                      opacity: disabled ? 0.6 : 1,
                    }}
                    onClick={() =>
                      !disabled && requestRoom(r.id, "change")
                    }
                  >
                    <b>{r.block_name} - {r.room_number}</b>
                    <p>Occupancy: {r.occupied_count}/{r.capacity}</p>
                    <p>Available: {available}</p>
                    <p>Floor: {r.floor}</p>
                  </div>
                );
              })}
          </div>
        </PopupWrapper>
      )}

      {/* ================= LEAVE ================= */}
      {showLeavePopup && !pending && (
        <PopupWrapper onClose={() => setShowLeavePopup(false)}>
          <h3>Apply Leave</h3>
          <input placeholder="Title" onChange={(e) => setLeaveTitle(e.target.value)} />
          <textarea placeholder="Reason" onChange={(e) => setLeaveReason(e.target.value)} />
          <input type="date" onChange={(e) => setLeaveFrom(e.target.value)} />
          <input type="date" onChange={(e) => setLeaveTo(e.target.value)} />
          <button onClick={submitLeave}>Submit</button>
        </PopupWrapper>
      )}

      {/* ================= QUERY ================= */}
      {showQueryPopup && (
        <PopupWrapper onClose={() => setShowQueryPopup(false)}>
          <h3>Raise Query</h3>
          <input placeholder="Title" onChange={(e) => setQueryTitle(e.target.value)} />
          <select onChange={(e) => setQueryCategory(e.target.value)}>
            <option value="hostel">Hostel</option>
            <option value="campus">Campus</option>
            <option value="staff">Staff</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <textarea placeholder="Message" onChange={(e) => setQueryMessage(e.target.value)} />
          <button onClick={submitQuery}>Submit</button>
        </PopupWrapper>
      )}

      <h3 style={{ marginTop: "25px" }}>My Queries</h3>

      {data.myQueries?.length === 0 && (
        <p style={{ color: "gray" }}>No queries raised yet</p>
      )}

      {data.myQueries?.map((q) => (
        <div
          key={q.id}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "10px",
            background:
              q.status === "closed"
                ? "#eaffea"
                : q.status === "irrelevant"
                ? "#f8d7da"
                : "#fff3cd",
          }}
        >
          <b>{q.title}</b>
          <p style={{ marginTop: 5 }}>{q.message}</p>

          <p>
            <b>Category:</b> {q.category}
          </p>

          <p>
            <b>Status:</b>{" "}
            {q.status === "pending" && "⏳ Pending"}
            {q.status === "escalated" && "🚩 Escalated"}
            {q.status === "closed" && "✅ Closed"}
            {q.status === "irrelevant" && "❌ Irrelevant"}
          </p>

          <p>
            <b>Reply: </b>
            {q.reply || "No reply yet"}
          </p>

          {q.staff_reply && (
            <div
              style={{
                marginTop: 8,
                padding: 8,
                background: "#f1f1f1",
                borderRadius: 4,
              }}
            >
              <b>Staff Reply:</b>
              <p>{q.staff_reply}</p>
            </div>
          )}

          <small style={{ color: "#666" }}>
            Submitted on {new Date(q.created_at).toLocaleString()}
          </small>
        </div>
      ))}

      <MyLeaves />

    </div>
    </div>
  );
};

export default Requests;

const RoomGrid = ({
  rooms,
  pendingRoomId,
  clickedRoomId,
  disabled,
  onSelect,
}) => {
  return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 15,
        }}
      >
        {rooms.map((r) => {
          const isDisabled =
            disabled ||
            r.status !== "vacant" ||
            r.id === pendingRoomId ||
            r.id === clickedRoomId;

          const available = r.capacity - r.occupied_count;

          return (
            <div className="blocks-room"
              key={r.id}
              style={{
                border: "2px solid #005c00",
                borderRadius: 8,
                padding: 15,
                background: isDisabled ? "#e0e0e0" : "#aeffae",
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.6 : 1,
              }}
              onClick={() => !isDisabled && onSelect(r.id)}
            >
              <b>
                {r.block_name} - {r.room_number}
              </b>

              <p>Status: {r.status}</p>

              <p>
                Occupancy: {r.occupied_count} / {r.capacity}
              </p>

              <p>Available Beds: {available}</p>

              <p>Floor: {r.floor}</p>
            </div>
          );
        })}
      </div>
  );
};



//  POPUP

const PopupWrapper = ({ children, onClose }) => (
  <div style={overlay}>
    <div className="change-popup" style={popup}>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const popup = {
  background: "#fff",
  padding: 20,
  width: 450,
  borderRadius: 8,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};
