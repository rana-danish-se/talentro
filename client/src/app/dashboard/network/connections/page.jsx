"use client";
import React, { useEffect, useState } from "react";
import { useNetwork } from "@/lib/Network";
import {
  Loader2,
  User,
  MessageSquare,
  Briefcase,
  Clock,
  Send,
  Inbox,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

const ConnectionsPage = () => {
  const {
    connections,
    invitations,
    sentInvitations,
    loading,
    fetchConnections,
    fetchInvitations,
    fetchSentInvitations,
    acceptInvitation,
    declineInvitation,
    error,
  } = useNetwork();

  const [activeTab, setActiveTab] = useState("accepted");

  useEffect(() => {
    if (activeTab === "accepted") fetchConnections();
    if (activeTab === "received") fetchInvitations();
    if (activeTab === "sent") fetchSentInvitations();
  }, [activeTab, fetchConnections, fetchInvitations, fetchSentInvitations]);

  const tabs = [
    {
      id: "accepted",
      label: "Accepted",
      count: connections.length,
      icon: User,
    },
    {
      id: "received",
      label: "Invitations",
      count: invitations.length,
      icon: Inbox,
    },
    {
      id: "sent",
      label: "Sent Requests",
      count: sentInvitations.length,
      icon: Send,
    },
  ];

  const handleAction = async (action, id) => {
    try {
      if (action === "accept") await acceptInvitation(id);
      if (action === "decline") await declineInvitation(id);
      if (action === "remove") {
        if (
          window.confirm("Are you sure you want to remove this connection?")
        ) {
          await removeConnection(id);
        }
      }
    } catch (err) {
      console.error(`Error during ${action}:`, err);
    }
  };

  if (
    loading &&
    (activeTab === "accepted"
      ? connections.length === 0
      : activeTab === "received"
      ? invitations.length === 0
      : sentInvitations.length === 0)
  ) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] dark:text-gray-200">
        <Loader2 className="animate-spin text-purple-600" size={32} />
      </div>
    );
  }

  const renderContent = () => {
    const list =
      activeTab === "accepted"
        ? connections
        : activeTab === "received"
        ? invitations
        : sentInvitations;

    if (list.length === 0) {
      return (
        <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm mt-6">
          <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-full inline-block mb-4">
            <User
              size={48}
              className="text-neutral-400 dark:text-neutral-500"
            />
          </div>
          <h2 className="text-xl font-semibold mb-2 dark:text-white">
            {activeTab === "accepted"
              ? "No connections yet"
              : activeTab === "received"
              ? "No pending invitations"
              : "No sent requests"}
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6 px-4">
            {activeTab === "accepted"
              ? "Grow your network by connecting with people in your industry."
              : activeTab === "received"
              ? "When people want to connect with you, they'll show up here."
              : "Your sent connection requests that are awaiting a response."}
          </p>
          <Link
            href="/dashboard/network"
            className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Find People
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {list.map((item) => {
          const user =
            activeTab === "accepted"
              ? item.user
              : activeTab === "received"
              ? item.sender
              : item.recipient;
          const dateLabel =
            activeTab === "accepted"
              ? "Connected"
              : activeTab === "received"
              ? "Received"
              : "Sent";
          const dateValue =
            activeTab === "accepted" ? item.connectedAt : item.createdAt;

          return (
            <div
              key={item._id}
              className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition duration-200"
            >
              <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-neutral-100 dark:border-neutral-800">
                <Image
                  src={
                    user.profilePicture ||
                    user.profileImage ||
                    "/assets/default-avatar.jpg"
                  }
                  alt={user.fullName}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1 line-clamp-1">
                {user.fullName}
              </h3>

              <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3 h-10 line-clamp-2">
                {user.headline || "No headline"}
              </p>

              <div className="w-full flex flex-col gap-2 mb-4 text-sm text-neutral-500 dark:text-neutral-500">
                {user.industry && (
                  <div className="flex items-center justify-center gap-2">
                    <Briefcase size={14} />
                    <span className="truncate">{user.industry}</span>
                  </div>
                )}
                <div className="text-xs flex items-center justify-center gap-1">
                  <Clock size={12} />
                  {dateLabel}{" "}
                  {formatDistanceToNow(new Date(dateValue), {
                    addSuffix: true,
                  })}
                </div>
              </div>

              <div className="border-t border-neutral-100 dark:border-neutral-800 w-full pt-4 mt-auto">
                {activeTab === "accepted" ? (
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex gap-2 w-full">
                      {!user.isDeletedAccount ? (
                        <>
                          <Link
                            href={`/dashboard/profile/${
                              user.username || user.slug
                            }`}
                            className="flex-1 py-2 px-4 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium transition text-center"
                          >
                            View Profile
                          </Link>
                          <Link
                            href={`/dashboard/messaging?recipient=${user._id}`}
                            className="flex-1 py-2 px-4 rounded-lg bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-sm font-medium transition flex items-center justify-center gap-2"
                          >
                            <MessageSquare size={16} /> Message
                          </Link>
                        </>
                      ) : (
                        <div className="w-full py-2 px-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-sm font-medium italic">
                          Account no longer available
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleAction("remove", item._id)}
                      className="w-full py-1.5 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded transition-colors"
                    >
                      Remove Connection
                    </button>
                  </div>
                ) : activeTab === "received" ? (
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => handleAction("decline", item._id)}
                      className="flex-1 py-2 px-4 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 text-sm font-medium transition"
                    >
                      Ignore
                    </button>
                    <button
                      onClick={() => handleAction("accept", item._id)}
                      className="flex-1 py-2 px-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700 text-sm font-medium transition"
                    >
                      Accept
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 w-full">
                    <Link
                      href={`/dashboard/profile/${user.slug}`}
                      className="flex-1 py-2 px-4 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium transition"
                    >
                      View Profile
                    </Link>
                    <div className="flex-1 py-2 px-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm font-medium italic">
                      Pending
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 text-neutral-900 dark:text-neutral-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Network Management
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
            Build and manage your professional relationships
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800/50 p-1 rounded-xl w-fit mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                active
                  ? "bg-white dark:bg-neutral-900 text-purple-600 dark:text-purple-400 shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              <Icon size={16} />
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    active
                      ? "bg-purple-100 dark:bg-purple-900/40"
                      : "bg-neutral-200 dark:bg-neutral-700"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => {
              if (activeTab === "accepted") fetchConnections();
              if (activeTab === "received") fetchInvitations();
              if (activeTab === "sent") fetchSentInvitations();
            }}
            className="mt-4 text-purple-600 hover:underline"
          >
            Try Again
          </button>
        </div>
      ) : (
        renderContent()
      )}
    </div>
  );
};

export default ConnectionsPage;
