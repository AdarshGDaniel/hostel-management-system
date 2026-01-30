import { pool } from "../config/db.js";

//  Student Raises a query

export const createQuery = async (userId, title, message, category) => {
  await pool.query(
    `
    INSERT INTO queries (user_id, title, message, category)
    VALUES (?, ?, ?, ?)
    `,
    [userId, title, message, category]
  );
};


//  Student – get own queries

export const getStudentQueries = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT
      q.id,
      q.title,
      q.message,
      q.category,
      q.status,
      q.reply,
      q.created_at,
      q.replied_at,

      r.block_name,
      r.room_number,
      r.floor

    FROM queries q

    LEFT JOIN room_assignments ra
      ON ra.user_id = q.user_id
     AND ra.end_date IS NULL        -- current room only

    LEFT JOIN rooms r
      ON r.id = ra.room_id

    WHERE q.user_id = ?

    ORDER BY q.created_at DESC
    `,
    [userId]
  );

  return rows;
};

// Get All the queries

export const getAllQueries = async () => {
  const [rows] = await pool.query(`
    SELECT
      q.id,
      q.title,
      q.message,
      q.category,
      q.status,
      q.reply,
      q.created_at,
      q.replied_at,

      u.name AS student_name,

      r.block_name,
      r.room_number,
      r.floor

    FROM queries q

    JOIN users u 
      ON u.id = q.user_id

    LEFT JOIN room_assignments ra
      ON ra.user_id = u.id
     AND ra.end_date IS NULL        -- current room only

    LEFT JOIN rooms r
      ON r.id = ra.room_id

    ORDER BY q.created_at DESC
  `);

  return rows;
};


// Staff reply to the query 

export const replyToQuery = async (queryId, reply, status) => {
  await pool.query(
    `
    UPDATE queries
    SET reply = ?, status = ?, replied_at = NOW()
    WHERE id = ?
    `,
    [reply, status, queryId]
  );
};
