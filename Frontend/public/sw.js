/* eslint-disable no-restricted-globals */

self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push event received:", event);

  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    console.error("Error parsing push data:", e);
  }

  const title = data.title || "Emergency";
  const options = {
    body: data.body || "You have a new message!",
    icon: "/siren.png",
    badge: "/siren.png",
    vibrate: [200, 100, 200],
    data: {
      // Default fallback to driver login if no URL provided
      url: data.url || "https://localhost:5173/driver/login",
    },
  };

  console.log("[Service Worker] Showing notification:", title, options);
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  console.log("[Service Worker] Notification clicked");
  event.notification.close();

  const target = event.notification.data.url || "https://localhost:5173/driver/login";
  event.waitUntil(clients.openWindow(target));
});
