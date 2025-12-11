"use client";

import React, { useState } from "react";
import { UserPlus, UserMinus, MessageCircle, Clock, Check } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ConnectionButtons = ({ user, onConnectionChange }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { connectionStatus, connectionId, _id: userId } = user || {};

  const handleConnect = async () => {
    setLoading(true);
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/network/send-invitation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ recipientId: userId }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Connection request sent!");
        if (onConnectionChange) onConnectionChange();
      } else {
        toast.error(data.message || "Failed to send connection request");
      }
    } catch (error) {
      console.error("Error sending connection:", error);
      toast.error("Failed to send connection request");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to remove this connection?")) return;

    setLoading(true);
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/network/remove-connection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ connectionId }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Connection removed");
        if (onConnectionChange) onConnectionChange();
      } else {
        toast.error(data.message || "Failed to remove connection");
      }
    } catch (error) {
      console.error("Error removing connection:", error);
      toast.error("Failed to remove connection");
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = () => {
    // Navigate to messages page or open chat
    router.push(`/dashboard/messages?user=${userId}`);
  };

  const renderConnectionButton = () => {
    if (!connectionStatus) {
      // No connection - show Connect button
      return (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleConnect}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UserPlus className="w-4 h-4" />
          {loading ? "Connecting..." : "Connect"}
        </motion.button>
      );
    }

    if (connectionStatus === "accepted") {
      // Already connected - show Remove button
      return (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDisconnect}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UserMinus className="w-4 h-4" />
          {loading ? "Removing..." : "Remove"}
        </motion.button>
      );
    }

    if (connectionStatus === "pending_sent") {
      // Request sent - show Pending button
      return (
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg font-medium cursor-not-allowed opacity-70"
        >
          <Clock className="w-4 h-4" />
          Pending
        </button>
      );
    }

    if (connectionStatus === "pending_received") {
      // Request received - user should accept/decline from notifications
      return (
        <button
          onClick={() => router.push("/dashboard/network")}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-all"
        >
          <Clock className="w-4 h-4" />
          Respond to Request
        </button>
      );
    }

    return null;
  };

  return (
    <div className="flex items-center gap-3">
      {renderConnectionButton()}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleMessage}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg font-medium transition-all"
      >
        <MessageCircle className="w-4 h-4" />
        Message
      </motion.button>
    </div>
  );
};

export default ConnectionButtons;
