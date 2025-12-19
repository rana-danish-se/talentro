"use client";
import { ProfileProvider } from "@/context/ProfileContext";
import DashboardNavbar from "./components/DashboardNavbar";
import NotificationPermissionBanner from "@/components/NotificationPermissionBanner";
import { useOneSignal } from "@/hooks/useOneSignal";
import { useAuth } from "@/context/Authentication";

import { NotificationProvider } from "@/context/NotificationContext";

export default function DashboardLayout({ children }) {
  const { user } = useAuth();

  // Initialize OneSignal with user ID
  useOneSignal(user?._id);

  return (
    <NotificationProvider>
      <NotificationPermissionBanner />
      <DashboardNavbar />
      {children}
    </NotificationProvider>
  );
}
