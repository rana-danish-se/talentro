"use client";
import React, { useEffect } from "react";
import { useNetwork } from "@/lib/Network";
import { Loader2, User, MessageSquare, Briefcase, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const ConnectionsPage = () => {
  const { connections, loading, fetchConnections, error } = useNetwork();

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] dark:text-gray-200">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchConnections}
          className="mt-4 text-blue-600 hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 text-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        My Connections
      </h1>

      {connections.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-full inline-block mb-4">
            <User size={48} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2 dark:text-white">
            No connections yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Grow your network by connecting with people in your industry.
          </p>
          <Link
            href="/dashboard/network"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Find People
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection) => {
            const { user } = connection;
            return (
              <div
                key={connection._id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition duration-200"
              >
                <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-600">
                  <Image
                    src={user.profilePicture || "/assets/default-avatar.jpg"}
                    alt={user.fullName}
                    fill
                    className="object-cover"
                  />
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                  {user.fullName}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 h-10 line-clamp-2">
                  {user.headline || "No headline"}
                </p>

                <div className="w-full flex flex-col gap-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
                  {user.industry && (
                    <div className="flex items-center justify-center gap-2">
                      <Briefcase size={14} />
                      <span>{user.industry}</span>
                    </div>
                  )}
                  <div className="text-xs">
                    Connected{" "}
                    {formatDistanceToNow(new Date(connection.connectedAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 w-full pt-4 mt-auto flex justify-center gap-3">
                  <Link
                    href={`/dashboard/profile/${user.username}`}
                    className="flex-1 py-2 px-4 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition"
                  >
                    View Profile
                  </Link>
                  <Link
                    href={`/dashboard/messaging?recipient=${user._id}`} // Assuming messaging page handles this param or just links to page
                    className="flex-1 py-2 px-4 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-sm font-medium transition flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={16} /> Message
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConnectionsPage;
