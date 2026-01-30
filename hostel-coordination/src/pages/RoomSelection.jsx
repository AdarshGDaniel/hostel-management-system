import api from "../utils/axios.js";
import { useEffect, useState } from "react";

const RoomSelection = () => {
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      const token = sessionStorage.getItem("authToken");

      const res = await api.get(
        "/api/rooms/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRooms(res.data);
    } catch (error) {
      console.error("Failed to fetch rooms", error);
    }
  };

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Available Rooms</h2>

      <div className="room-grid">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`room-card ${room.status}`}
          >
            <h4>
              {room.block_name} - {room.room_number}
            </h4>
            <p>Status: {room.status}</p>

            {/* Allow request only if vacant */}
            {room.status === "vacant" && (
              <button
                onClick={() => requestRoom(room.id)}
              >
                Request Room
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomSelection;
