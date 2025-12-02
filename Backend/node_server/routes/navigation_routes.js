import express from "express";

import { registerUser, loginUser, userProfile } from "../controllers/controller.js";
import { pool } from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getNearBySignals } from "../services/services.js"


const router = express.Router();

router.get("/", (req, res) => res.send("Driver Route Working!"));

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/algorithm", verifyToken, userProfile);


router.get("/traffic_signals/:region_name", async (req, res) => {

  const { region_name } = req.params;

  try {
    const signals = await getNearBySignals(pool, region_name);
    res.json(signals);
  } 
  catch (error) {
    console.error("Error fetching nearby signals:", error);
    res.status(500).json({ error: "Failed to fetch nearby signals" });
  }

});

export default router;
