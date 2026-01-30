import cron from "node-cron";
import { pool } from "../config/db.js";

export const startLeaveResetJob = () => {
  // Runs every day at 00:05 AM
  cron.schedule("0 5 * * *", async () => {
    try {
      console.log("🔄 Running leave reset job...");

      const [expiredLeaves] = await pool.query(`
        SELECT id, user_id, room_id
        FROM leave_requests
        WHERE status = 'approved'
          AND to_date < CURDATE()
      `);

      if (expiredLeaves.length === 0) {
        console.log("✅ No expired leaves found");
        return;
      }

      const leaveIds = expiredLeaves.map(l => l.id);


      await pool.query(
        `
        UPDATE leave_requests
        SET status = 'completed'
        WHERE id IN (?)
        `,
        [leaveIds]
      );


      for (const leave of expiredLeaves) {
        await pool.query(
          `
          UPDATE room_assignments
          SET status = 'occupied'
          WHERE user_id = ?
            AND room_id = ?
            AND status = 'on_leave'
          `,
          [leave.user_id, leave.room_id]
        );
      }

      console.log(`✅ Reset ${expiredLeaves.length} leave(s)`);

    } catch (err) {
      console.error("❌ Leave reset job failed:", err);
    }
  });
};
