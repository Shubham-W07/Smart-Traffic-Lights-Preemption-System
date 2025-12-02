import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import navigation_routes from "./routes/navigation_routes.js";

import { createWebSocketServer } from "./Algorithm/websocketServer.js";
import { getLocalIPNetwork } from "./getLocalIPNetwork.js";


const app = express();

await getLocalIPNetwork();
dotenv.config();

const LOCAL_IP = process.env.LOCAL_IP;

app.use(
  cors({
    origin: [
      `http://localhost:5173`,
      `http://${LOCAL_IP}:5173`,
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// -------------------- Routes --------------------
app.get("/", (req, res) => {
  res.send("Server is Running!");
});

app.use("/user", navigation_routes);

// -------------------- Server --------------------
const API_PORT = process.env.API_PORT || 3000;
const WS_PORT = process.env.WS_PORT || 5000;

// Start HTTP Server
app.listen(API_PORT, "0.0.0.0", () => {
  console.log('\n Server API');
  console.log(`Localhost -> http://localhost:${API_PORT}`);
  console.log(`Network ->  http://${LOCAL_IP}:${API_PORT}`);

  console.log('\n Web Sockets API');
  console.log(`Localhost -> ws://localhost:${WS_PORT}`);
  console.log(`Network ->  ws://${LOCAL_IP}:${WS_PORT}`);
});
