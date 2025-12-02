// mqtt_request.js
import mqtt from "mqtt";

let client = null;

export function initMQTT() {
    const BROKER_URL = "wss://broker.hivemq.com:8884/mqtt";

    if (!client) {
        client = mqtt.connect(BROKER_URL);

        client.on("connect", () => {
            console.log("Connected to MQTT broker");
        });

        client.on("error", (err) => {
            console.error("MQTT connection error:", err);
        });

        client.on("close", () => {
            console.log("MQTT connection closed");
            client = null; // allow reconnection later
        });
    }
}

/*
  - Sends a payload to the specified MQTT topic.
  - Returns a Promise that resolves on success or rejects on error.
*/
export function sendRequest(signalTopic, payload) {
    return new Promise((resolve, reject) => {
        if (!client || !client.connected) {
            const error = new Error("MQTT client is not connected");
            console.error(error.message);
            return reject(error);
        }

        if (!payload) {
            const error = new Error("Payload is missing");
            console.error(error.message);
            return reject(error);
        }

        const TOPIC = `traffic/${signalTopic}`;

        client.publish(TOPIC, JSON.stringify(payload), (err) => {
            if (err) {
                console.error(`Error publishing to ${TOPIC}:`, err);
                return reject(err);
            } else {
                console.log(`Payload sent to [${TOPIC}]:`, payload);
                return resolve({ topic: TOPIC, payload });
            }
        });
    });
}
