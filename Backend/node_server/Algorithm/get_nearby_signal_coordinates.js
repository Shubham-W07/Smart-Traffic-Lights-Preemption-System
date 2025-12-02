import { getDistanceKm } from "./calculate_distance.js";

import dotenv from "dotenv";
dotenv.config();

export async function getNeareBySignalCoOrdinates(region_name, curr_latitude, curr_longitude) {

    const nearbySignals = []; // store nearby signals

    try {
        const LOCAL_IP = process.env.LOCAL_IP;
        const API_PORT = process.env.API_PORT || 3000;

        const response = await fetch(`http://${LOCAL_IP}:${API_PORT}/user/traffic_signals/${region_name}`);
        const result = await response.json();

        result.forEach((element) => {
            const distKm = getDistanceKm(curr_latitude, curr_longitude, element.latitude, element.longitude);

            if (distKm <= 3.0) {
                nearbySignals.push({
                    signal_topic: element.signal_topic,
                    latitude: element.latitude,
                    longitude: element.longitude,
                    pre_distKm: null,
                    isApproching: null,
                    isLeaving: null,
                    hasSent: null
                });
            }
        });

        // console.log("Nearby signals within 2 km:", nearbySignals);
        return nearbySignals;

    } catch (error) {
        console.error("Error fetching signals:", error);
        return [];
    }
}

// Example usage
// findNeareBySignal("Hadapsar", 18.4575, 73.8915);