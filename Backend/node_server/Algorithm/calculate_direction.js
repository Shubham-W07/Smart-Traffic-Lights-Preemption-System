// Bearing (direction in degrees)
export function getBearing(lat1, lon1, lat2, lon2) {
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x =
        Math.cos(φ1) * Math.sin(φ2) -
        Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const θ = Math.atan2(y, x);
    return (θ * 180 / Math.PI + 360) % 360; // in degrees
}


// Map bearing degrees to only 4 compass directions
export function getCompassDirection(bearingDeg) {
    if (bearingDeg >= 315 || bearingDeg < 45) {
        return "NORTH";
    } else if (bearingDeg >= 45 && bearingDeg < 135) {
        return "EAST";
    } else if (bearingDeg >= 135 && bearingDeg < 225) {
        return "SOUTH";
    } else if (bearingDeg >= 225 && bearingDeg < 315) {
        return "WEST";
    }
}


// // Map bearing degrees to compass direction
// export function getCompassDirection(bearingDeg) {
//     if (bearingDeg >= 337.5 || bearingDeg < 22.5) {
//         return "NORTH";
//     } else if (bearingDeg >= 22.5 && bearingDeg < 67.5) {
//         return "NORTH-EAST";
//     } else if (bearingDeg >= 67.5 && bearingDeg < 112.5) {
//         return "EAST";
//     } else if (bearingDeg >= 112.5 && bearingDeg < 157.5) {
//         return "SOUTH-EAST";
//     } else if (bearingDeg >= 157.5 && bearingDeg < 202.5) {
//         return "SOUTH";
//     } else if (bearingDeg >= 202.5 && bearingDeg < 247.5) {
//         return "SOUTH-WEST";
//     } else if (bearingDeg >= 247.5 && bearingDeg < 292.5) {
//         return "WEST";
//     } else if (bearingDeg >= 292.5 && bearingDeg < 337.5) {
//         return "NORTH-WEST";
//     }
// }

