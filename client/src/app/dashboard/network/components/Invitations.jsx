"use client";
import React, { useState, useEffect } from "react";
import { Check, X, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useNetwork } from "../../../../lib/Network";
import Link from "next/link";

const InvitationCardContent = ({ invitation, onAccept, onDecline }) => {
  const getTimeSince = (date) => {
    const days = Math.floor(
      (new Date() - new Date(date)) / (1000 * 60 * 60 * 24)
    );
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <div className="flex gap-3">
      {/* Profile Picture */}

      <Link
        href={`/dashboard/profile/${invitation.sender.slug}`}
        className="relative flex-shrink-0"
      >
        <Image
          width={64}
          height={64}
          src={invitation.sender.profilePicture || "/assets/default-avatar.jpg"}
          alt={invitation.sender.fullName}
          className="w-16 h-16 rounded-full object-cover"
        />
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <Link
            href={`/dashboard/profile/${invitation.sender.slug}`}
            className="flex-1 min-w-0"
          >
            <h3 className="font-semibold text-neutral-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer truncate">
              {invitation.sender.fullName}
            </h3>
            {invitation.sender.headline && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-1">
                {invitation.sender.headline}
              </p>
            )}
            {invitation.mutualConnections > 0 && (
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                {invitation.mutualConnections} mutual connection
                {invitation.mutualConnections > 1 ? "s" : ""}
              </p>
            )}
          </Link>
        </div>

        {/* Time */}
        <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-3">
          {getTimeSince(invitation.createdAt)}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onDecline(invitation._id)}
            className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-full font-semibold hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all"
          >
            <X className="w-5 h-5" />
            <span>Ignore</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onAccept(invitation._id)}
            className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition-all shadow-sm"
          >
            <Check className="w-5 h-5" />
            <span>Accept</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

const Invitations = () => {
  const {
    invitations,
    fetchInvitations,
    acceptInvitation,
    declineInvitation,
    loading,
  } = useNetwork();
  const [displayLimit, setDisplayLimit] = useState(10);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const handleAccept = async (invitationId) => {
    await acceptInvitation(invitationId);
  };

  const handleDecline = async (invitationId) => {
    await declineInvitation(invitationId);
  };

  const handleLoadMore = () => {
    setDisplayLimit((prev) => prev + 10);
  };

  const visibleInvitations = invitations?.slice(0, displayLimit);

  if (loading && invitations.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-6 text-center">
        <p className="text-neutral-500">Loading invitations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Invitations
          </h1>
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-semibold rounded-full">
            {invitations.length}
          </span>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Manage your connection requests
        </p>
      </div>

      {/* Invitations List */}
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
          <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
            <AnimatePresence mode="popLayout">
              {visibleInvitations.length > 0 ? (
                visibleInvitations.map((invitation) => (
                  <motion.div
                    key={invitation._id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="p-4"
                  >
                    <InvitationCardContent
                      invitation={invitation}
                      onAccept={handleAccept}
                      onDecline={handleDecline}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-12 text-center"
                >
                  <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                    No pending invitations
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    You&apos;re all caught up! Check back later for new
                    connection requests.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Load More Button */}
      {invitations.length > displayLimit && (
        <div className="mt-4 text-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
          >
            Load more invitations
          </button>
        </div>
      )}
    </div>
  );
};

export default Invitations;
