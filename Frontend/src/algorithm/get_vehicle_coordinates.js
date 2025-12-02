// Actual taking the user phone co-ordinates in eal time
// get_vehicle_coordinates.js

// export function getVehicleCoOrdinates() {
//     return new Promise((resolve, reject) => {
//         if (!navigator.geolocation) {
//             reject(new Error("Geolocation is not supported by this browser."));
//             return;
//         }

//         let obj = {
//             latitude: 0,
//             longitude: 0,
//             accuracy: 0
//         };

//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const { latitude, longitude, accuracy } = position.coords;
//                 console.log(`Latitude: ${latitude} | Longitude: ${longitude} | Accuracy: ${accuracy}m`);

//                 obj.latitude = latitude;
//                 obj.longitude = longitude;
//                 obj.accuracy = accuracy;

//                 resolve(obj);
//             },
//             (error) => {
//                 console.error("Geolocation error:", error);
//                 reject(error);
//             },
//             {
//                 enableHighAccuracy: true, // get more precise readings if possible
//                 timeout: 10000,           // wait max 10 seconds
//                 maximumAge: 0             // do not use cached position
//             }
//         );
//     });
// }


// For Testing On Dummy Data
let i = 0;
export async function getVehicleCoOrdinates() {

    const journey = [
        // Approaching (West → East) with 20m gaps
        { vehical_id: 101, latitude: 18.45750, longitude: 73.88930, direction: "East", approx_distance_m: 200, accuracy: 33 },
        { vehical_id: 101, latitude: 18.45750, longitude: 73.88950, direction: "East", approx_distance_m: 180, accuracy: 31 },
        { vehical_id: 101, latitude: 18.45750, longitude: 73.88970, direction: "East", approx_distance_m: 160, accuracy: 29 },
        { vehical_id: 101, latitude: 18.45750, longitude: 73.88990, direction: "East", approx_distance_m: 140, accuracy: 27 },
        { vehical_id: 101, latitude: 18.45750, longitude: 73.89010, direction: "East", approx_distance_m: 120, accuracy: 25 },
        { vehical_id: 101, latitude: 18.45750, longitude: 73.89030, direction: "East", approx_distance_m: 100, accuracy: 23 },
        { vehical_id: 101, latitude: 18.45750, longitude: 73.89050, direction: "East", approx_distance_m: 80, accuracy: 21 },
        { vehical_id: 101, latitude: 18.45750, longitude: 73.89070, direction: "East", approx_distance_m: 60, accuracy: 20 },
        { vehical_id: 101, latitude: 18.45750, longitude: 73.89090, direction: "East", approx_distance_m: 40, accuracy: 18 },
        { vehical_id: 101, latitude: 18.45750, longitude: 73.89110, direction: "East", approx_distance_m: 20, accuracy: 16 },
        { vehical_id: 101, latitude: 18.45750, longitude: 73.89120, direction: "East", approx_distance_m: 0, accuracy: 15 },

        // Leaving (East → West)
        { vehical_id: 101, latitude: 18.45750, longitude: 73.89130, direction: "West", approx_distance_m: 20, accuracy: 16 },
        { vehical_id: 101, latitude: 18.45750, longitude: 73.89150, direction: "West", approx_distance_m: 40, accuracy: 17 },
        { vehical_id: 101, latitude: 18.45750, longitude: 73.89170, direction: "West", approx_distance_m: 60, accuracy: 18 },
        { vehical_id: 101, latitude: 18.45750, longitude: 73.89190, direction: "West", approx_distance_m: 80, accuracy: 19 },
        { vehical_id: 101, latitude: 18.45750, longitude: 73.89210, direction: "West", approx_distance_m: 100, accuracy: 21 },
        { vehical_id: 101, latitude: 18.45750, longitude: 73.89230, direction: "West", approx_distance_m: 120, accuracy: 23 },
        { vehical_id: 101, latitude: 18.45750, longitude: 73.89250, direction: "West", approx_distance_m: 140, accuracy: 26 },
        { vehical_id: 101, latitude: 18.45750, longitude: 73.89270, direction: "West", approx_distance_m: 160, accuracy: 28 },
        { vehical_id: 101, latitude: 18.45750, longitude: 73.89290, direction: "West", approx_distance_m: 180, accuracy: 30 },
        { vehical_id: 101, latitude: 18.45750, longitude: 73.89310, direction: "West", approx_distance_m: 200, accuracy: 33 }
    ];


    if (i >= journey.length) {
        console.log("Journey finished. Restarting...");
        i = 0;
    }

    const record = journey[i];

    const obj = {
        id: i + 1,
        vehicle_id: record.vehical_id,
        latitude: record.latitude,
        longitude: record.longitude,
        accuracy: record.accuracy,
        distance: record.approx_distance_m,
        direction: record.direction
    };

    i++;
    return obj;
}

