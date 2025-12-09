import { WebSocketServer } from "ws";
import { spawn } from "child_process";
import { initMQTT, sendRequest } from "./mqtt_request.js";
import { getNeareBySignalCoOrdinates } from "./get_nearby_signal_coordinates.js";


export function createWebSocketServer(PORT) {

  const wss = new WebSocketServer({ port: PORT });
  console.log("WebSocket Server is running...");

  wss.on("connection", (ws) => {
    let isNearbySignalsFound = false;
    let nearbySignals = [];

    console.log("Client Connected");
    ws.send(JSON.stringify({ response: "Websockets Connected Successfully!" }));

    ws.on("message", async (message) => {

      console.log("\n" + message.toString());

      try {
        initMQTT();
        const obj = JSON.parse(message.toString());

        if (!isNearbySignalsFound) {
          nearbySignals = await getNeareBySignalCoOrdinates(
            obj.region,
            obj.latitude,
            obj.longitude
          );
          console.log("Near Signals: ", nearbySignals);

          nearbySignals.forEach((signal) => {
            signal.pre_distKm = null;
            signal.isApproching = false;
            signal.isLeaving = false;
            signal.hasSent = false;
          });

          isNearbySignalsFound = true;
        }

        if (!obj) return;

        // --- Spawn Python process using virtual environment ---
        const py = spawn(
          "C:/Users/shubh/OneDrive/Documents/BTECH_PROJECT/Version 10/Smart-Traffic-Lights-Management-System-for-Emergency-Services/Backend/python_engine/venv/Scripts/python.exe",
          ["../python_engine/calculation.py"]
        );

        const input = JSON.stringify({ obj, nearbySignals });
        let output = "";

        py.stdin.write(input);
        py.stdin.end();

        py.stdout.on("data", (data) => {
          output += data.toString();
        });

        py.stderr.on("data", (err) => {
          console.error("Python error:", err.toString());
        });

        py.on("close", async () => {
          try {
            const parsed = JSON.parse(output);

            if (parsed.error) {
              console.error("Python error:", parsed.error);
              return;
            }

            // Update local state with latest signal info
            if (parsed.updated_signals) nearbySignals = parsed.updated_signals;

            const results = parsed.results;
            results.forEach((res) => {
              console.log(
                `signal_topic: ${res.signal_topic} | distKM: ${res.distKM.toFixed(
                  4
                )} | direction: ${res.direction} | isApproching: ${res.isApproching
                } | isLeaving: ${res.isLeaving}`
              );

              if (res.mqtt_action) {
                // console.log("Sending MQTT:", res.mqtt_action);
                sendRequest(res.mqtt_action.signal_topic, res.mqtt_action)
                  .then((r) => {/* console.log("MQTT sent:", r) */})
                  .catch((err) => {
                    console.error("MQTT error:", err);
                    ws.send(
                      JSON.stringify({
                        mqtt_error: true,
                        payload: res.mqtt_action,
                      })
                    );
                  });
              }
            });
          } catch (e) {
            console.error("Failed to parse Python output:", e);
            console.error("Raw output:", output);
          }
        });
      } catch (error) {
        console.log("Some Error Occured!", error);
      }
    });

    ws.on("close", () => {
      console.log("Client Disconnected");
      isNearbySignalsFound = false;
      nearbySignals = [];
    });
  });
}

