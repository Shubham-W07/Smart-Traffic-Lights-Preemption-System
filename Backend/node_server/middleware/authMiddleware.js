import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export function verifyToken(req, res, next) {
    const token = req.headers["authorization"];

    // console.log("\n\n JWT GET DATA : ", token);

    if (!token) {
        return res.status(401).json({ error: "Token is missing" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }

        req.user = user;
        next();
    });
}
