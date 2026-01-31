import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;


// REGISTER USER

export const registerUser = async (user) => {
  try {
    // Validate required fields
    if (!user.name || !user.email || !user.password || !user.userType) {
      return { success: false, message: "All required fields must be provided" };
    }

    // Validate user type
    const allowedRoles = ["student", "staff", "admin"];
    if (!allowedRoles.includes(user.userType)) {
      return { success: false, message: "Invalid user type" };
    }

    // Check if user already exists
    const [existingUser] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [user.email]
    );

    if (existingUser.length > 0) {
      return { success: false, message: "User already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Insert user
    const query = `
      INSERT INTO users (name, email, mobile, password, userType)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      user.name,
      user.email,
      user.mobile || null,
      hashedPassword,
      user.userType,
    ];

    await pool.query(query, values);

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Registration failed. Please try again later.",
    };
  }
};


// LOGIN USER

export const loginUser = async (email, password) => {
  try {
    if (!email || !password) {
      return { success: false, message: "Email and password are required" };
    }

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return { success: false, message: "User not found" };
    }

    const user = rows[0];

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { success: false, message: "Incorrect password" };
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        userType: user.userType,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Login failed. Please try again later.",
    };
  }
};


// GET USER FROM TOKEN

export const getUserFromToken = async (token) => {
  try {
    if (!token) {
      return { success: false, message: "Token not provided" };
    }

    // Handle "Bearer <token>"
    const actualToken = token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token.trim();

    // Verify token
    const decoded = jwt.verify(actualToken, JWT_SECRET);

    // Fetch user details
    const [rows] = await pool.query(
      "SELECT id, name, email, mobile, userType FROM users WHERE id = ?",
      [decoded.id]
    );

    if (rows.length === 0) {
      return { success: false, message: "User not found" };
    }

    return { success: true, user: rows[0] };
  } catch (error) {
    console.error("Token verification error:", error);
    return { success: false, message: "Invalid or expired token" };
  }
};
