"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  UserCheck,
  Filter,
  Check,
  CheckCheck,
  Briefcase,
  Users,
  Sparkles,
  Eye,
  Share2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/Authentication";

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const observerTarget = useRef(null);

  const filterOptions = [
    { value: "all", label: "All Notifications", icon: Bell },
    { value: "unread", label: "Unread Only", icon: Check },
    { value: "post_like", label: "Post Likes", icon: Heart },
    { value: "post_comment", label: "Comments", icon: MessageCircle },
    { value: "connection", label: "Connections", icon: Users },
  ];

  // Fetch notifications
  const fetchNotifications = async (pageNum = 1, filterType = "all") => {
    try {
      setLoading(true);

      // Build query params
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "20",
      });

      if (filterType === "unread") {
        params.append("unreadOnly", "true");
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }/api/notifications?${params}`,
        {
          credentials: "include", // This sends cookies for authentication
        }
      );

      if (!response.ok) throw new Error("Failed to fetch notifications");

      const data = await response.json();

      if (pageNum === 1) {
        setNotifications(data.data);
      } else {
        setNotifications((prev) => [...prev, ...data.data]);
      }

      setUnreadCount(data.unreadCount || 0);
      setHasMore(data.pagination.page < data.pagination.pages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      fetchNotifications(page, filter);
    }
  }, [page]);

  // Initial load
  useEffect(() => {
    fetchNotifications(1, filter);
  }, [filter]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark notification as clicked
  const markAsClicked = async (notificationId) => {
    try {
      await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }/api/notifications/${notificationId}/click`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId
            ? { ...notif, isClicked: true, isRead: true }
            : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as clicked:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }/api/notifications/mark-all-read`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    // Mark as clicked
    if (!notification.isClicked) {
      await markAsClicked(notification._id);
    }

    // Build target URL
    let url = notification.targetRoute || "/dashboard/notifications";
    if (notification.targetParams) {
      Object.entries(notification.targetParams).forEach(([key, value]) => {
        url = url.replace(`:${key}`, value);
      });
    }

    // Navigate (in Next.js, you might use router.push instead)
    window.location.href = url;
  };

  // Get notification icon
  const getNotificationIcon = (type) => {
    const iconMap = {
      post_like: {
        icon: Heart,
        color: "text-red-500",
        bg: "bg-red-50 dark:bg-red-900/20",
      },
      post_reaction: {
        icon: Sparkles,
        color: "text-purple-500",
        bg: "bg-purple-50 dark:bg-purple-900/20",
      },
      post_comment: {
        icon: MessageCircle,
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-900/20",
      },
      post_share: {
        icon: Share2,
        color: "text-green-500",
        bg: "bg-green-50 dark:bg-green-900/20",
      },
      connection_request: {
        icon: UserPlus,
        color: "text-orange-500",
        bg: "bg-orange-50 dark:bg-orange-900/20",
      },
      connection_accepted: {
        icon: UserCheck,
        color: "text-green-500",
        bg: "bg-green-50 dark:bg-green-900/20",
      },
      profile_view: {
        icon: Eye,
        color: "text-indigo-500",
        bg: "bg-indigo-50 dark:bg-indigo-900/20",
      },
      mention: {
        icon: MessageCircle,
        color: "text-yellow-500",
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
      },
    };

    return (
      iconMap[type] || {
        icon: Bell,
        color: "text-gray-500",
        bg: "bg-gray-50 dark:bg-gray-900/20",
      }
    );
  };

  // Get time ago
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {unreadCount} unread notification
                  {unreadCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>

                <AnimatePresence>
                  {showFilterMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden z-20"
                    >
                      {filterOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => {
                              setFilter(option.value);
                              setShowFilterMenu(false);
                              setPage(1);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                              filter === option.value
                                ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                                : "text-gray-700 dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {option.label}
                            {filter === option.value && (
                              <Check className="w-4 h-4 ml-auto" />
                            )}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mark All Read */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors text-sm font-medium text-white"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Mark all read</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {loading && page === 1 ? (
          // Loading skeleton
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-neutral-950 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800 animate-pulse"
              >
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          // Empty state
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-4 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <Bell className="w-10 h-10 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              When you get notifications, they'll show up here
            </p>
          </motion.div>
        ) : (
          // Notifications list
          <div className="space-y-2">
            <AnimatePresence>
              {notifications.map((notification, index) => {
                const iconConfig = getNotificationIcon(notification.type);
                const Icon = iconConfig.icon;

                return (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNotificationClick(notification)}
                    className={`relative bg-white dark:bg-neutral-950 rounded-xl p-4 border transition-all cursor-pointer ${
                      notification.isRead
                        ? "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                        : "border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-900/10 hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-full ${iconConfig.bg} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className={`w-6 h-6 ${iconConfig.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              {getTimeAgo(notification.createdAt)}
                            </p>
                          </div>

                          {/* Unread indicator */}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>

                        {/* Sender info (if available) */}
                        {notification.sender && (
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                            {notification.sender.profileImage && (
                              <Image
                                src={notification.sender.profileImage}
                                alt={notification.sender.fullName || "User"}
                                width={24}
                                height={24}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {notification.sender.fullName || "Unknown User"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mark as read button */}
                    {!notification.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification._id);
                        }}
                        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4 text-gray-400" />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Infinite scroll trigger */}
            <div ref={observerTarget} className="h-10" />

            {/* Loading more indicator */}
            {loading && page > 1 && (
              <div className="text-center py-4">
                <div className="inline-block w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* End message */}
            {!hasMore && notifications.length > 0 && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                You've reached the end
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
