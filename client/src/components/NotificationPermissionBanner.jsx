"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Check } from "lucide-react";
import {
  requestNotificationPermission,
  getNotificationPermissionStatus,
} from "@/hooks/useOneSignal";

const NotificationPermissionBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("checking");

  useEffect(() => {
    const checkPermission = async () => {
      const status = await getNotificationPermissionStatus();
      setPermissionStatus(status);

      // Show banner if permission is default (not asked yet)
      if (status === "default") {
        // Don't show immediately - wait a bit for better UX
        setTimeout(() => {
          setShowBanner(true);
        }, 3000);
      }
    };

    checkPermission();
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setShowBanner(false);
      setPermissionStatus("granted");
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Remember dismissal in localStorage (optional)
    localStorage.setItem("notification-banner-dismissed", "true");
  };

  // Don't show if permission already granted or denied
  if (permissionStatus !== "default" || !showBanner) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
      >
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Stay Updated!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Get instant notifications when someone likes or comments on your
                posts
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleEnableNotifications}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Enable Notifications
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationPermissionBanner;
