import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "./firebase";

export async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
        throw new Error("Notification permission denied");
    }

    const messaging = await getFirebaseMessaging();

    if (!messaging) {
        throw new Error("Messaging not supported");
    }

    const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    return token;
}

export async function listenForegroundNotifications() {
    const messaging = await getFirebaseMessaging();

    if (!messaging) return;

    onMessage(messaging, (payload) => {
        console.log("Foreground notification:", payload);

        new Notification(payload.notification?.title || "Notification", {
            body: payload.notification?.body,
            icon: "/logo.png",
        });
    });
}