import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import roomRoutes from "./routes/roomRoutes.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import updateRoutes from "./routes/updateRoutes.js";
import { checkConnection } from "./config/db.js";
import createAllTable from "./utils/dbUtils.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import roomRequestRoutes from "./routes/roomRequestRoutes.js";
import adminRoomRoutes from "./routes/adminRoomRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import liveStatusRoutes from "./routes/liveStatusRoutes.js";
import roomAdminRoutes from "./routes/roomAdminRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";
import staffHistoryRoutes from "./routes/staffHistoryRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/updates", updateRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/roomRequestController", roomRequestRoutes);
app.use("/api/admin/room", adminRoomRoutes);
app.use("/api/admin/rooms", roomAdminRoutes);
app.use("/api/admin", studentRoutes);
app.use("/api/admin", liveStatusRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api", staffHistoryRoutes);



const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await checkConnection();
    await createAllTable();
  } catch (error) {
    console.log("Failed to initialize the database", error);
  }
});
