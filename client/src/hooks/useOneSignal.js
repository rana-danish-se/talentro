"use client";
import { useEffect } from "react";

// OneSignal is disabled by default to avoid SDK initialization errors
// Enable it by:
// 1. Adding NEXT_PUBLIC_ONESIGNAL_APP_ID to .env.local
// 2. Configuring your OneSignal app for localhost in OneSignal dashboard
// 3. Restarting the dev server

export function useOneSignal(userId) {
  useEffect(() => {
    // OneSignal disabled for local development to avoid errors
    // The app works fine without it - notifications are saved to database
    console.log("OneSignal: Disabled for local development");
  }, [userId]);
}

export async function requestNotificationPermission() {
  // Use native browser API for permissions
  try {
    if ("Notification" in window) {
      const permission = Notification.permission;

      if (permission === "default") {
        const result = await Notification.requestPermission();
        return result === "granted";
      }
      return permission === "granted";
    }
    return false;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
}

export async function getNotificationPermissionStatus() {
  try {
    if ("Notification" in window) {
      return Notification.permission;
    }
    return "unavailable";
  } catch (error) {
    return "unavailable";
  }
}
