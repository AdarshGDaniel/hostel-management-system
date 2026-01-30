import api from "../utils/axios.js";
import { useState } from "react";
import { toast } from "react-toastify";

const StaffUpdate = () => {

  //  UPDATE STATES 

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);


  //  ROOM STATES

  const [mode, setMode] = useState("single"); // single | multiple

  const [blockName, setBlockName] = useState("");
  const [floor, setFloor] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  const [startRoom, setStartRoom] = useState("");
  const [endRoom, setEndRoom] = useState("");
  const [capacity, setCapacity] = useState(1);

  const token = sessionStorage.getItem("authToken");


  //  POST UPDATE

  const submitUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("caption", caption);
      if (image) formData.append("image", image);

      await api.post(
        "http://localhost:3000/api/updates/post",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Update posted successfully");
      setTitle("");
      setCaption("");
      setImage(null);
    } catch (error) {
      toast.error("Failed to post update");
      console.error(error);
    }
  };


  //  ADD ROOM (SINGLE / MULTIPLE)

  const addRoom = async () => {
    try {
      const url =
        mode === "single"
          ? "http://localhost:3000/api/admin/rooms/add-single"
          : "http://localhost:3000/api/admin/rooms/add-multiple";

      const payload =
        mode === "single"
          ? {
              block_name: blockName,
              floor,
              room_number: roomNumber,
              capacity,
            }
          : {
              block_name: blockName,
              floor,
              startRoom,
              endRoom,
              capacity,
            };

      await api.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Room(s) added successfully");

      // reset
      setBlockName("");
      setFloor("");
      setRoomNumber("");
      setStartRoom("");
      setEndRoom("");
      setCapacity(1);
    } catch (error) {
      toast.error("Failed to add room(s)");
      console.error(error);
    }
  };

  return (
    <div className="main-outter staff-update-container">
      {/* ================= UPDATE SECTION ================= */}
      <div className="staff-update-page-new-update">
        <h2>Post New Update</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button onClick={submitUpdate}>Post Update</button>
      </div>

      <hr />

      {/* ================= ROOM SECTION ================= */}
      <div className="staff-update-page-add-room">
        <h2>Add Room</h2>

        {/* Mode selector */}
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="single">Single Room</option>
          <option value="multiple">Multiple Rooms (Series)</option>
        </select>

        <input
          placeholder="Block Name (e.g. STJBlock)"
          value={blockName}
          onChange={(e) => setBlockName(e.target.value)}
        />

        <input
          placeholder="Floor"
          type="number"
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
        />

        <input
          placeholder="Capacity"
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />

        {/* SINGLE ROOM */}
        {mode === "single" && (
          <input
            placeholder="Room Number (e.g. 101)"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
          />
        )}

        {/* MULTIPLE ROOMS */}
        {mode === "multiple" && (
          <>
            <input
              placeholder="Start Room (e.g. 101)"
              value={startRoom}
              onChange={(e) => setStartRoom(e.target.value)}
            />
            <input
              placeholder="End Room (e.g. 130)"
              value={endRoom}
              onChange={(e) => setEndRoom(e.target.value)}
            />
          </>
        )}

        <button onClick={addRoom}>Add Room(s)</button>
      </div>
    </div>
  );
};

export default StaffUpdate;
