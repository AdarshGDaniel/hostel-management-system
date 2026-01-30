import { getLiveRoomStatus } from "../services/liveStatusService.js";

export const getLiveStatus = async (req, res) => {
  try {
    const rows = await getLiveRoomStatus();
    const blocks = {};

    rows.forEach((row) => {

        //  Initialize the BLOCK

      if (!blocks[row.block_name]) {
        blocks[row.block_name] = {
          block: row.block_name,
          activeStudents: 0,
          rooms: {},
        };
      }


        //  initialize the room ROOM

      if (!blocks[row.block_name].rooms[row.room_id]) {
        blocks[row.block_name].rooms[row.room_id] = {
          roomId: row.room_id,
          roomNumber: row.room_number,
          floor: row.floor,
          capacity: row.capacity,

          students: [],
          occupiedCount: 0,
          onLeaveCount: 0,
          guestCount: 0,

          status: "vacant",
          guestFrom: null,
          guestTo: null,
        };
      }

      const room = blocks[row.block_name].rooms[row.room_id];


        //  STUDENT HANDLING

      if (row.user_id) {
        room.students.push({
          id: row.user_id,
          name: row.name,
          status: row.status,
        });

        if (row.status === "occupied") {
          room.occupiedCount++;
          room.status = "occupied";
          blocks[row.block_name].activeStudents++;
        }

        if (row.status === "on_leave") {
          room.onLeaveCount++;
          if (room.status !== "occupied") {
            room.status = "on_leave";
          }
        }
      }


        //  GUEST HANDLING

      if (row.status === "guest") {
        room.guestCount = 1;
        room.status = "guest";
        room.guestFrom = row.start_date;
        room.guestTo = row.end_date;
      }
    });


      //  CONVERT ROOMS OBJECT → ARRAY

    Object.values(blocks).forEach((block) => {
      block.rooms = Object.values(block.rooms);
    });

    res.json({ blocks: Object.values(blocks) });
  } catch (error) {
    console.error("Live status error:", error);
    res.status(500).json({ message: "Failed to fetch live status" });
  }
};
