"use client";
import React from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";

const NotificationsPage = () => {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20"
        >
          <Bell className="h-12 w-12 text-blue-500" />
        </motion.div>

        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Notifications Coming Soon
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          We&apos;re working hard to bring you a comprehensive notification
          system. Stay tuned for updates!
        </p>
      </motion.div>
    </div>
  );
};

export default NotificationsPage;
