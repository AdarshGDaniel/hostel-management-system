import { pool } from "../config/db.js";

export const createUpdate = async ({ title, caption, imageUrl }) => {
  const query = `
    INSERT INTO updates (title, caption, image_url)
    VALUES (?, ?, ?)
  `;
  await pool.query(query, [title, caption, imageUrl]);
  return { success: true, message: "Update posted successfully" };
};

export const getAllUpdates = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM updates ORDER BY created_at DESC"
  );
  return rows;
};
