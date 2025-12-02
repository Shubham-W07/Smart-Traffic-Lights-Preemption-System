/* Actual taking the region based on user co-ordinates */
// const GOOGLE_API_KEY = "AIzaSyD59cbxDKz-cVKh_VKPtQ_-LPjv-3BH2yg";

// export async function getAreaName(lat, lon) {
//   try {
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_API_KEY}`;
//     const response = await fetch(url);
//     const data = await response.json();

//     if (data.status !== "OK") {
//       throw new Error(`Google API Error: ${data.status}`);
//     }

//     let area = "Unknown Area";
//     const components = data.results[0].address_components;

//     for (const comp of components) {
//       // Try more specific types first
//       if (
//         comp.types.includes("sublocality_level_1") ||
//         comp.types.includes("neighborhood") ||
//         comp.types.includes("sublocality")
//       ) {
//         area = comp.long_name;
//         break;
//       }
//     }

//     return area;
//   } 
//   catch (err) {
//     console.error("Error fetching area:", err);
//     return null;
//   }
// }

// For testing on dummy data
export async function getAreaName(lat, lon) {
    return "Pune";
}
