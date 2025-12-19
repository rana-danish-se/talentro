"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import apiClient from "../api/apiClient";
import { useAuth } from "./Authentication";

const NotificationContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await apiClient.get("/api/notifications/unread-count");
      if (response.data.success) {
        setUnreadCount(response.data.data.unreadCount);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const decrementUnreadCount = useCallback(() => {
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const clearUnreadCount = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const incrementUnreadCount = useCallback(() => {
    setUnreadCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      // Optionally set up a polling or socket listener here for real-time updates
      const interval = setInterval(fetchUnreadCount, 60000); // Poll every minute
      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
    }
  }, [user, fetchUnreadCount]);

  const value = {
    unreadCount,
    loading,
    fetchUnreadCount,
    decrementUnreadCount,
    clearUnreadCount,
    incrementUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
