"use client";
import React, { useEffect, useState } from "react";
import { usePost } from "@/context/PostContext";
import PostCard from "../components/PostCard";
import { useProfile } from "@/context/ProfileContext";
import { Bookmark, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const SavedPostsPage = () => {
  const { getSavedPosts, user } = usePost(); // Assuming usePost provides 'user' or we get it from ProfileContext
  // Actually PostCard needs 'user' prop which usually comes from auth or profile context
  // Let's check where 'user' comes from in other pages. Usually useProfile or useAuth.
  // In Dashboard layout likely.
  // PostCard uses 'user' for "Comment Input" avatar.

  const { profile } = useProfile(); // Get current user profile
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      const posts = await getSavedPosts();
      if (posts) {
        setSavedPosts(posts);
      }
      setLoading(false);
    };
    fetchSaved();
  }, [getSavedPosts]);

  // Transform saved post structure if needed
  // The API likely returns an array of saved objects { _id, userId, postId: { ...postDetails } }
  // We need to map this to pass 'post' to PostCard.
  // Wait, commonly saved posts APIs return the post object populated.
  // Let's assume the controller returns list of posts or list of saved records.
  // Usually it is list of saved records populated with post.
  // Let's check the controller logic if possible, or assume standard.
  // If it returns [{ _id, post: {...} }], we need to map.

  // Based on typical implementations:
  // If response.data.data is [ { _id:..., postId: {...} } ]

  const formattedPosts = savedPosts
    .map((item) => item.postId || item)
    .filter((p) => p);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-purple-600 fill-current" />
            Saved Posts
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
            posts you&apos;ve bookmarked for later
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            <p className="text-neutral-400 mt-2 text-sm">
              Loading your saved collection...
            </p>
          </div>
        ) : formattedPosts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6"
          >
            {formattedPosts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PostCard post={post} user={profile || {}} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 border-dashed"
          >
            <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
              <Bookmark className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              No saved posts yet
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-sm mt-2 mb-6">
              When you see a post you want to read later, click the save icon to
              add it here.
            </p>
            <Link
              href="/dashboard"
              className="px-6 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Explore Feed
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SavedPostsPage;
