"use client";
import React, { useState, useEffect } from "react";
import { UserPlus, X, Users, Briefcase, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useNetwork } from "../../../../lib/Network";
import Link from "next/link";

const SuggestionCard = ({ suggestion, onConnect, onDismiss }) => {
  const getReasonText = () => {
    if (suggestion.reason === "mutual") {
      return `${suggestion.mutualConnections} mutual connection${
        suggestion.mutualConnections > 1 ? "s" : ""
      }`;
    } else if (suggestion.reason === "company") {
      return `Works at ${suggestion.company}`;
    } else if (suggestion.reason === "school") {
      return `Studied at ${suggestion.school}`;
    } else if (suggestion.reason === "industry") {
      return `${suggestion.industry} professional`;
    }
    return "Suggested for you";
  };

  return (
    <div className="relative w-[200px] flex flex-col items-center p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:shadow-md transition-all duration-300 group">
      {/* Dismiss Button */}
      <button
        onClick={() => onDismiss(suggestion._id)}
        className="absolute top-3 right-3 p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors opacity-0 group-hover:opacity-100"
        title="Dismiss"
      >
        <X className="w-4 cursor-pointer h-4" />
      </button>

      {/* Profile Picture */}
      <Link
        href={`/dashboard/profile/${suggestion.slug}`}
        className="mb-4 relative"
      >
        <div className="p-1 rounded-full border-2 border-dashed border-purple-300 dark:border-purple-700">
          <Image
            width={80}
            height={80}
            src={suggestion.profilePicture || "/assets/default-avatar.jpg"}
            alt={suggestion.fullName}
            className="w-20 h-20 rounded-full object-cover"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="w-full text-center mb-4">
        <Link
          href={`/dashboard/profile/${suggestion.slug}`}
          className="block mb-1"
        >
          <h3 className="font-bold  text-lg text-neutral-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors line-clamp-1">
            {suggestion.fullName}
          </h3>
        </Link>
        {suggestion.headline && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 h-10 mb-3">
            {suggestion.headline}
          </p>
        )}

        {/* Reason */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 py-1.5 px-3 rounded-full inline-flex mx-auto">
          {suggestion.reason === "mutual" && <Users className="w-3.5 h-3.5" />}
          {suggestion.reason === "company" && (
            <Building2 className="w-3.5 h-3.5" />
          )}
          {suggestion.reason === "school" && (
            <Briefcase className="w-3.5 h-3.5" />
          )}
          <span className="font-medium">{getReasonText()}</span>
        </div>
      </div>

      {/* Connect Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onConnect(suggestion._id)}
        className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-neutral-900 border-2 border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 rounded-xl font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all text-sm"
      >
        <UserPlus className="w-4 h-4" />
        <span>Connect</span>
      </motion.button>
    </div>
  );
};

const Suggestions = () => {
  const { suggestions, fetchSuggestions, sendInvitation, loading } =
    useNetwork();
  const [dismissedIds, setDismissedIds] = useState([]);
  const [displayLimit, setDisplayLimit] = useState(10);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handleConnect = async (suggestionId) => {
    await sendInvitation(suggestionId);
    setDismissedIds((prev) => [...prev, suggestionId]);
  };

  const handleDismiss = (suggestionId) => {
    setDismissedIds((prev) => [...prev, suggestionId]);
  };

  const handleLoadMore = () => {
    setDisplayLimit((prev) => prev + 10);
  };

  const filteredSuggestions = suggestions?.filter(
    (s) => !dismissedIds.includes(s._id)
  );

  const visibleSuggestions = filteredSuggestions?.slice(0, displayLimit);

  if (loading && suggestions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-neutral-500">Finding people you may know...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
            People you may know
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-bold rounded-full">
              {filteredSuggestions?.length || 0}
            </span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Expand your professional network with these suggestions
          </p>
        </div>
      </div>

      {/* Suggestions Grid */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="popLayout">
          {visibleSuggestions?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
              {visibleSuggestions.map((suggestion) => (
                <motion.div
                  key={suggestion._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <SuggestionCard
                    suggestion={suggestion}
                    onConnect={handleConnect}
                    onDismiss={handleDismiss}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700"
            >
              <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                No suggestions available
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-center max-w-md">
                We don&apos;t have any new suggestions for you right now. Try
                updating your profile or connecting with more people.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Load More Button */}
      {filteredSuggestions?.length > displayLimit && (
        <div className="mt-8 text-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2.5 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors border border-purple-200 dark:border-purple-800"
          >
            Load more suggestions
          </button>
        </div>
      )}
    </div>
  );
};

export default Suggestions;
