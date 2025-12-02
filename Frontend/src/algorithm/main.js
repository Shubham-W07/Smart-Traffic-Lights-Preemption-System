import { getVehicleCoOrdinates } from "./get_vehicle_coordinates.js";
import { getAreaName } from "./get_area_name.js";
import { initMQTT, sendRequest } from "./mqtt_request.js";

// Check 
import { jwtDecode } from "jwt-decode";

let ws = null;
let tracking = null;

export async function MAIN(start) {
    if (start) {

        // Get user data from localStorage
        const userData = localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;

        const decoded = jwtDecode(user.token);
        let user_name = decoded.user_name;

        // Connect only if not already connected
        if (!ws || ws.readyState !== WebSocket.OPEN) {

            const wsUrl = import.meta.env.VITE_WS_URL;
            ws = new WebSocket(`${wsUrl}`);

            ws.onopen = async () => {
                console.log("WebSocket Connected");
                startTracking(ws, user_name);
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log("Message from server:", data);

                if (data.mqtt_error) {
                    sendRequest(data.payload.signal_topic, data.payload)
                        .then(() => ws.send("MQTT Activated From Phone"))
                        .catch((err) => console.error("Client MQTT retry failed:", err));
                }
            };

            ws.onclose = () => {
                console.log("WebSocket Disconnected");
                clearInterval(tracking);
                tracking = null;
            };
        } else {
            // already connected — just start tracking again
            startTracking(ws, user_name);
        }
    } else {
        stopTracking();
    }
}

async function startTracking(ws, user_name) {
    console.log("Tracking started...");
    initMQTT();

    let isRegionFound = false;
    let area_name = "";
    let obj = {};

    // Get region before tracking
    while (!isRegionFound) {
        obj = await getVehicleCoOrdinates();
        if (obj.accuracy <= 500) {
            area_name = await getAreaName(obj.latitude, obj.longitude);
            isRegionFound = true;
            sendPayload(ws, user_name, obj.latitude, obj.longitude, area_name, true);
        }
    }

    // Start sending coordinates every 3 sec
    tracking = setInterval(async () => {
        obj = await getVehicleCoOrdinates();
        if (!obj) {
            console.log("No more coordinates.");
            clearInterval(tracking);
            tracking = null;
            return;
        } else if (obj.accuracy <= 50) {
            sendPayload(ws, user_name, obj.latitude, obj.longitude, area_name, true);
        }
    }, 3000);
}

function stopTracking() {
    console.log("Tracking stopped by user.");
    clearInterval(tracking);
    tracking = null;

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
        ws = null;
    }
}

function sendPayload(ws, user_name, lat = null, lon = null, reg = null, start) {
    if (ws && ws.readyState === WebSocket.OPEN) {

        const payload = {
            user_name: user_name,
            latitude: lat,
            longitude: lon,
            region: reg,
            isStarted: start
        };

        ws.send(JSON.stringify(payload));
        console.log("Sent:", payload);
    } else {
        console.log("WebSocket not connected, cannot send payload.");
    }
}
