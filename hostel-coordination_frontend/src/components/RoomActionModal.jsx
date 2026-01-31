import { useState } from "react";
import api from "../utils/axios.js";
import { toast } from "react-toastify";

const RoomActionModal = ({ room, onClose, refresh }) => {
  const token = sessionStorage.getItem("authToken");

  const [guestFrom, setGuestFrom] = useState("");
  const [guestTo, setGuestTo] = useState("");

  const [guestCount, setGuestCount] = useState(1);
  const [guestNames, setGuestNames] = useState([""]);

  const isVacant =
    room.students.length === 0 &&
    room.occupiedCount === 0 &&
    room.onLeaveCount === 0 &&
    room.status !== "guest";

  const isGuestOccupied = room.status === "guest";

  const canDeleteRoom =
    room.students.length === 0 &&
    room.occupiedCount === 0 &&
    room.onLeaveCount === 0 &&
    room.status !== "guest";


    //  REMOVE STUDENT

  const removeStudent = async (userId) => {
    try {
      await api.post(
        "/api/admin/room/remove-student",
        { userId, roomId: room.roomId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      refresh();
      onClose();
    } catch {
      toast.error("Failed to remove student");
    }
  };


    //  ASSIGN / UPDATE GUEST

  const assignOrUpdateGuest = async () => {
    if (!guestFrom || !guestTo) {
      toast.info("Select guest dates");
      return;
    }

    try {
      await api.post(
        "/api/admin/room/assign-guest",
        {
          roomId: room.roomId,
          fromDate: guestFrom,
          toDate: guestTo,
          guestCount,
          guestNames,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      refresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Guest update failed");
    }
  };


    //  REMOVE GUEST

  const removeGuest = async () => {
    try {
      await api.post(
        "/api/admin/room/remove-guest",
        { roomId: room.roomId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      refresh();
      onClose();
    } catch {
      toast.error("Failed to remove guest");
    }
  };


    //  DELETE ROOM

  const deleteRoom = async () => {
    if (!canDeleteRoom) return;

    const confirm = window.confirm(
      "Are you sure you want to permanently delete this room?"
    );
    if (!confirm) return;

    try {
      await api.post(
        "/api/rooms/delete",
        { roomId: room.roomId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Room deleted successfully");
      refresh();
      onClose();
    } catch {
      toast.error("Failed to delete room");
    }
  };


    //  GUEST NAME HANDLERS

  const handleGuestNameChange = (index, value) => {
    const updated = [...guestNames];
    updated[index] = value;
    setGuestNames(updated);
  };

  const handleGuestCountChange = (count) => {
    setGuestCount(count);
    setGuestNames(Array.from({ length: count }, () => ""));
  };

  return (
    <div className="RoomAction-modal" style={overlayStyle}>
      <div className="RoomAction-modal-inside" style={modalStyle}>
        <h3>
          Room {room.roomNumber} (Floor {room.floor})
        </h3>

        <p>
          Capacity: {room.capacity} | Status: <b>{room.status}</b>
        </p>

        <hr />

        {/* ================= STUDENTS ================= */}
        {!isGuestOccupied && (
          <>
            <h4>Students</h4>

            {room.students.length === 0 && <p>No students</p>}

            {room.students.map((stu) => (
              <div key={stu.id} style={studentRow}>
                <span>
                  {stu.name} ({stu.status})
                </span>
                <button onClick={() => removeStudent(stu.id)}>
                  Remove
                </button>
              </div>
            ))}

            <hr />
          </>
        )}

        {/* ================= ASSIGN GUEST ================= */}
        {isVacant && (
          <>
            <h4>Assign Guest</h4>

            <label>No. of Guests</label>
            <input
              type="number"
              min="1"
              value={guestCount}
              onChange={(e) =>
                handleGuestCountChange(Number(e.target.value))
              }
            />

            {guestNames.map((name, i) => (
              <input
                key={i}
                placeholder={`Guest ${i + 1} Name`}
                value={name}
                onChange={(e) =>
                  handleGuestNameChange(i, e.target.value)
                }
              />
            ))}

            <input
              type="date"
              value={guestFrom}
              onChange={(e) => setGuestFrom(e.target.value)}
            />
            <input
              type="date"
              value={guestTo}
              onChange={(e) => setGuestTo(e.target.value)}
            />

            <button
              style={{ background: "purple", color: "white" }}
              onClick={assignOrUpdateGuest}
            >
              Assign Guest
            </button>

            <hr />
          </>
        )}

        {/* ================= GUEST OCCUPIED ================= */}
        {isGuestOccupied && (
          <>
            <h4>Guest Details</h4>

            <p>
              Guests: {room.guestCount}
              <br />
              From: {new Date(room.guestFrom).toLocaleDateString()}
              <br />
              To: {new Date(room.guestTo).toLocaleDateString()}
            </p>

            <button
              style={{ background: "red", color: "white" }}
              onClick={removeGuest}
            >
              Remove Guest
            </button>

            <hr />
          </>
        )}

        {/* ================= DELETE ROOM ================= */}

        <button
          onClick={deleteRoom}
          disabled={!canDeleteRoom}
          style={{
            background: canDeleteRoom ? "red" : "#ccc",
            color: "white",
            cursor: canDeleteRoom ? "pointer" : "not-allowed",
          }}
        >
          Delete Room
        </button>

        {!canDeleteRoom && (
          <p style={{ color: "gray", marginTop: "5px" }}>
            Room cannot be deleted while occupied or on leave
          </p>
        )}

        <hr />

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default RoomActionModal;


//  STYLES 

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "#fff",
  padding: "20px",
  width: "520px",
  borderRadius: "8px",
};

const studentRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
};
