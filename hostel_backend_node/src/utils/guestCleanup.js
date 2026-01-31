import { pool } from "../config/db.js";

export const cleanupExpiredGuests = async () => {
  await pool.query(
    `
    UPDATE room_assignments
    SET is_active = FALSE
    WHERE status = 'guest'
      AND end_date < CURDATE()
    `
  );
};
