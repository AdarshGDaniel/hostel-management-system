import { useEffect, useState } from "react";
import api from "../utils/axios.js";
import RoomActionModal from "../components/RoomActionModal";


//  ROOM COLOR HELPER

const getRoomColor = (room) => {
  if (room.status === "guest") return "#ab5cff";     // purple
  if (room.onLeaveCount > 0) return "#ffc14f";       // orange
  if (room.occupiedCount > 0) return "#64ff64";     // green
  return "#ff4f4f";                                 // red (vacant)
};

const LiveStatus = () => {
  const [blocks, setBlocks] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const token = sessionStorage.getItem("authToken");

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // live refresh
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    const res = await api.get(
      "/api/admin/live-status",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setBlocks(res.data.blocks);
  };

  return (
    <div className="main-outter">
      <h2>Live Hostel Status</h2>

      {blocks.map((block) => (
        <div className="staff-live-status" key={block.block}>
          <h3>
            {block.block} — Active Students: {block.activeStudents}
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6,1fr)",
              gap: "10px",
            }}
          >
            {block.rooms.map((room) => (
              <div className="room-blocks"
                key={room.roomId}
                style={{
                  background: getRoomColor(room), 
                  padding: "10px",
                  cursor: "pointer",
                  borderRadius: "6px",
                  color: "#333",
                }}
                onClick={() => setSelectedRoom(room)}
              >
                <h4>{room.roomNumber}</h4>
                {room.status === "guest" && (
                  <p>Guest Count: {room.guestCount}</p>
                )}
                {room.status !== "guest" && (
                    <>
                    <p>Students: {room.students.length}</p>
                    <p>Floor: {room.floor}</p>
                    <p>On Leave: {room.onLeaveCount}</p>
                    </>
                )}

                {room.status === "guest" && (
                  <small>
                    Guest till{" "}
                    {new Date(room.guestTo).toLocaleDateString()}
                  </small>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedRoom && (
        <RoomActionModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          refresh={fetchStatus}
        />
      )}
    </div>
  );
};

export default LiveStatus;
