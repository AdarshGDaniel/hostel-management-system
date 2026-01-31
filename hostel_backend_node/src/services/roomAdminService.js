import { pool } from "../config/db.js";


//  Add Single Room

export const addSingleRoom = async ({
  block_name,
  floor,
  room_number,
  capacity,
}) => {
  await pool.query(
    `
    INSERT INTO rooms (block_name, floor, room_number, capacity)
    VALUES (?, ?, ?, ?)
    `,
    [block_name, floor, room_number, capacity]
  );
};


//  Add Multiple Rooms 

export const addMultipleRooms = async ({
  block_name,
  floor,
  startRoom,
  endRoom,
  capacity,
}) => {
  const values = [];

  for (let room = startRoom; room <= endRoom; room++) {
    values.push([block_name, floor, room.toString(), capacity]);
  }

  await pool.query(
    `
    INSERT IGNORE INTO rooms (block_name, floor, room_number, capacity)
    VALUES ?
    `,
    [values]
  );

  return values.length;
};
