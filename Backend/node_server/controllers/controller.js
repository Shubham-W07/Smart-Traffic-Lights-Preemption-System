import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { Register_User, Authenticate_User } from "../services/services.js";
import { pool } from "../config/db.js";

import { createWebSocketServer } from "../Algorithm/websocketServer.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// ---------------- DRIVER REGISTER ----------------
export async function registerUser(req, res) {
  try {
    const { user_name, email, password } = req.body;

    if (!user_name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertedId = await Register_User(pool, {
      user_name,
      email,
      password: hashedPassword
    });

    res.json({ message: "User registered successfully!", id: insertedId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// ---------------- DRIVER LOGIN ----------------
export async function loginUser(req, res) {
  try {
    const login_data = req.body;
    console.log("Data from client to server for login : " + login_data.password);

    if (!login_data.email || !login_data.password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const user = await Authenticate_User(pool, login_data);

    const passwordMatch = await bcrypt.compare(login_data.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const jwtToken = jwt.sign(
      {
        user_name: user.user_name,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Driver authenticated successfully!",
      token: jwtToken
    });

    // console.log("\nToken : " + jwtToken);

  }
  catch (error) {
    res.status(400).json({ error: error.message + " From Controller" });
  }
}

// ---------------- DRIVER PROFILE ----------------
let wsStarted = false;
export async function userProfile(req, res) {
  
  console.log("Verified User:", req.user);
  if(!wsStarted) {
    const PORT = process.env.PORT || 5000;
    createWebSocketServer(PORT);
    wsStarted = true;
  }

  return res.json({ message: "Verified Successfully", user: req.user });
}
