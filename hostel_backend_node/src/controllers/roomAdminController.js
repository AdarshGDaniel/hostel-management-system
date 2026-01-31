import {
  addSingleRoom,
  addMultipleRooms,
} from "../services/roomAdminService.js";


  //  Add Single Room

export const createSingleRoom = async (req, res) => {
  try {
    const { block_name, floor, room_number, capacity } = req.body;

    if (!block_name || !floor || !room_number) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await addSingleRoom({
      block_name,
      floor,
      room_number,
      capacity: capacity || 1,
    });

    res.json({ success: true, message: "Room added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add room" });
  }
};


  //  Add Multiple Rooms

export const createMultipleRooms = async (req, res) => {
  try {
    const { block_name, floor, startRoom, endRoom, capacity } = req.body;

    if (!block_name || !floor || !startRoom || !endRoom) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (Number(startRoom) > Number(endRoom)) {
      return res
        .status(400)
        .json({ message: "Start room cannot be greater than end room" });
    }

    const count = await addMultipleRooms({
      block_name,
      floor,
      startRoom: Number(startRoom),
      endRoom: Number(endRoom),
      capacity: capacity || 1,
    });

    res.json({
      success: true,
      message: `${count} rooms processed`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add rooms" });
  }
};
