"use client"
import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PostContext = createContext();

export const usePost = () => {
  return useContext(PostContext);
};

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Base URL for API calls - assuming proxy or env setup, otherwise hardcode for now based on server.js
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Create a new post
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
          `${API_URL}/posts/create`,
          postData,
          config
        );

        if (response.data.success) {
          setPosts((prevPosts) => [response.data.data, ...prevPosts]);
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

  // Get user posts
  const getUserPosts = useCallback(
    async (userId) => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/posts/user/${userId}`, {
          withCredentials: true,
        });

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

  // React to a post (Like/Unlike)
  const likePost = useCallback(
    async (postId, type = "like") => {
      try {
        const response = await axios.post(
          `${API_URL}/posts/${postId}/react`,
          { type },
          { withCredentials: true }
        );

        if (response.data.success) {
          // Update local state to reflect change immediately
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post._id === postId
                ? {
                    ...post,
                    likesCount: response.data.data.likesCount,
                    reactionsCount: response.data.data.reactionsCount,
                    // You might need to track 'isLiked' or similar if the backend returned it,
                    // but for now we just update counts.
                    // Ideally backend should return if current user liked it.
                  }
                : post
            )
          );
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
    async (postId, content) => {
      try {
        const response = await axios.post(
          `${API_URL}/posts/${postId}/comment`,
          { content },
          { withCredentials: true }
        );

        if (response.data.success) {
          // Update comment count locally
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post._id === postId
                ? { ...post, commentsCount: post.commentsCount + 1 }
                : post
            )
          );
          toast.success("Comment added!");
          return response.data;
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

  // Delete a post
  const deletePost = useCallback(
    async (postId) => {
      try {
        const response = await axios.delete(`${API_URL}/posts/${postId}`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setPosts((prevPosts) =>
            prevPosts.filter((post) => post._id !== postId)
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

  const value = {
    posts,
    loading,
    error,
    createPost,
    getUserPosts,
    likePost,
    addComment,
    deletePost,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export default PostContext;
