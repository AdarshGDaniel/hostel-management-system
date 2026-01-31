import { pool } from "../config/db.js";

export const getLiveRoomStatus = async () => {
  const [rows] = await pool.query(`
    SELECT
      r.id AS room_id,
      r.block_name,
      r.floor,
      r.room_number,
      r.capacity,

      ra.status,
      ra.start_date,
      ra.end_date,

      u.id AS user_id,
      u.name

    FROM rooms r

    LEFT JOIN room_assignments ra
      ON ra.room_id = r.id
     AND ra.is_active = TRUE   -- ✅ DO NOT FILTER user_id

    LEFT JOIN users u
      ON ra.user_id = u.id     -- ✅ LEFT JOIN (guest-safe)

    WHERE r.is_active = TRUE

    ORDER BY r.block_name, r.floor, r.room_number
  `);

  return rows;
};
