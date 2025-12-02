import fs from "fs";
import os from "os";
import dotenv from "dotenv";

// Get local IP
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name in interfaces) {
        for (const iface of interfaces[name]) {
            if (iface.family === "IPv4" && !iface.internal) {
                return iface.address;
            }
        }
    }
    return "localhost";
}

// Save it into .env file
function saveLocalIPtoEnv(ip) {
    const envPath = ".env";
    let content = "";

    if (fs.existsSync(envPath)) {
        content = fs.readFileSync(envPath, "utf8");

        // Replace existing LOCAL_IP entry
        if (content.includes("LOCAL_IP=")) {
            content = content.replace(/LOCAL_IP=.*/g, `LOCAL_IP=${ip}`);
        } else {
            content += `\nLOCAL_IP=${ip}`;
        }
    } else {
        content = `LOCAL_IP=${ip}`;
    }

    fs.writeFileSync(envPath, content.trim());
    console.log(`✔ LOCAL_IP saved to .env: ${ip}`);
}


export function getLocalIPNetwork() {

    return new Promise((resolve, reject) => {
        try {
            const LOCAL_IP = getLocalIP();
            saveLocalIPtoEnv(LOCAL_IP);
            dotenv.config();

            resolve(LOCAL_IP);
        } catch (err) {
            reject(err);
        }
    });

}


