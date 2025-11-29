"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import apiClient from "@/api/apiClient";

const PostContext = createContext();

export const usePost = () => {
  return useContext(PostContext);
};

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]); // User's own posts
  const [feedPosts, setFeedPosts] = useState([]); // Feed posts
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Base URL for API calls - assuming proxy or env setup, otherwise hardcode for now based on server.js
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch Feed
  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/feed");
      if (response.data.success) {
        console.log("Feed Posts:", response.data.data);
        setFeedPosts(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching feed:", err);
      setError(err.response?.data?.message || "Error fetching feed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const createPost = useCallback(
    async (postData) => {
      setLoading(true);
      try {
        // Check if postData is FormData (for file uploads) or JSON
        const isFormData = postData instanceof FormData;

        const config = {
          headers: {
            "Content-Type": isFormData
              ? "multipart/form-data"
              : "application/json",
          },
          withCredentials: true,
        };

        const response = await axios.post(
          `${API_URL}/api/posts/create`,
          postData,
          config
        );

        if (response.data.success) {
          const newPost = response.data.data;
          setPosts((prevPosts) => [newPost, ...prevPosts]);
          setFeedPosts((prevFeed) => [newPost, ...prevFeed]);
          toast.success("Post created successfully!");
          return response.data;
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error creating post";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  const getUserPosts = useCallback(
    async (userId) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/api/posts/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setPosts(response.data.data);
          return response.data;
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error fetching posts";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  const likePost = useCallback(
    async (postId, type = "like") => {
      try {
        const response = await axios.post(
          `${API_URL}/api/posts/${postId}/react`,
          { type },
          { withCredentials: true }
        );

        if (response.data.success) {
          const updatePostsList = (list) =>
            list.map((post) =>
              post._id === postId
                ? {
                    ...post,
                    likesCount: response.data.data.likesCount,
                    reactionsCount: response.data.data.reactionsCount,
                  }
                : post
            );

          setPosts((prev) => updatePostsList(prev));
          setFeedPosts((prev) => updatePostsList(prev));

          return response.data;
        }
      } catch (err) {
        console.error("Error reacting to post:", err);
        toast.error("Failed to react to post");
      }
    },
    [API_URL]
  );

  // Add a comment
  const addComment = useCallback(
    async (postId, content, parentCommentId = null) => {
      try {
        const response = await axios.post(
          `${API_URL}/api/posts/${postId}/comment`,
          { content, parentCommentId },
          { withCredentials: true }
        );

        if (response.data.success) {
          // Helper to update comment count
          const updateCommentsCount = (list) =>
            list.map((post) =>
              post._id === postId
                ? { ...post, commentsCount: post.commentsCount + 1 }
                : post
            );

          setPosts((prev) => updateCommentsCount(prev));
          setFeedPosts((prev) => updateCommentsCount(prev));

          toast.success("Comment added!");
          return response.data.data;
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error adding comment";
        toast.error(errorMessage);
        throw err;
      }
    },
    [API_URL]
  );

  const getComments = useCallback(
    async (postId, page = 1, parentCommentId = null) => {
      try {
        const params = { page, limit: 10 };
        if (parentCommentId) params.parentCommentId = parentCommentId;

        const response = await axios.get(
          `${API_URL}/api/posts/${postId}/comments`,
          {
            params,
            withCredentials: true,
          }
        );

        if (response.data.success) {
          return response.data;
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    },
    [API_URL]
  );

  const likeComment = useCallback(
    async (commentId) => {
      try {
        const response = await axios.post(
          `${API_URL}/api/posts/comments/${commentId}/like`,
          {},
          { withCredentials: true }
        );
        return response.data;
      } catch (err) {
        console.error("Error liking comment:", err);
        toast.error("Failed to like comment");
        throw err;
      }
    },
    [API_URL]
  );

  // Delete a post
  const deletePost = useCallback(
    async (postId) => {
      try {
        const response = await axios.delete(`${API_URL}/api/posts/${postId}`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setPosts((prevPosts) =>
            prevPosts.filter((post) => post._id !== postId)
          );
          setFeedPosts((prevFeed) =>
            prevFeed.filter((post) => post._id !== postId)
          );
          toast.success("Post deleted successfully");
          return response.data;
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error deleting post";
        toast.error(errorMessage);
        throw err;
      }
    },
    [API_URL]
  );

  // Toggle Save Post
  const toggleSavePost = useCallback(
    async (postId) => {
      try {
        const response = await axios.post(
          `${API_URL}/api/saved-posts/${postId}`,
          {},
          { withCredentials: true }
        );

        if (response.data.success) {
          toast.success(response.data.message);
          return response.data;
        }
      } catch (err) {
        console.error("Error toggling save post:", err);
        toast.error(
          err.response?.data?.message || "Error updating saved status"
        );
        throw err;
      }
    },
    [API_URL]
  );

  // Check if post is saved
  const checkIfSaved = useCallback(
    async (postId) => {
      try {
        const response = await axios.get(
          `${API_URL}/api/saved-posts/${postId}/check`,
          { withCredentials: true }
        );
        return response.data;
      } catch (err) {
        console.error("Error checking saved status:", err);
        return { isSaved: false };
      }
    },
    [API_URL]
  );

  const value = {
    posts,
    feedPosts,
    loading,
    error,
    createPost,
    getUserPosts,
    likePost,
    addComment,
    getComments,
    likeComment,
    deletePost,
    fetchFeed,
    toggleSavePost,
    checkIfSaved,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export default PostContext;
